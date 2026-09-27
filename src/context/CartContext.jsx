import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react'

import {
  getCarritoAPI,
  addCarritoItem,
  updateCarritoItem,
  removeCarritoItem,
  clearCarritoAPI,
  getFavoritos,
  addFavorito,
  removeFavorito
} from '../services/api'

import { useAuth } from './AuthContext'

const CartContext = createContext()

function getOrCreateSessionId() {
  let sid = localStorage.getItem('cart_session_id')

  if (!sid) {
    sid = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`
    localStorage.setItem('cart_session_id', sid)
  }

  return sid
}

export function CartProvider({ children }) {
  const { user } = useAuth()

  const cliente_id = user?.cliente_id ?? null

  const [sessionId] = useState(getOrCreateSessionId)

  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    total_items: 0
  })

  // Favoritos obtenidos desde PostgreSQL
  const [wishlist, setWishlist] = useState([])
  const [wishlistLoading, setWishlistLoading] = useState(false)

  const [cartOpen, setCartOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)

  const [authOpen, setAuthOpen] = useState(false)

  const [toasts, setToasts] = useState([])

  const [cartLoading, setCartLoading] = useState(false)

  // ─────────────────────────────────────────────────────────────────────────────
  // TOASTS
  // ─────────────────────────────────────────────────────────────────────────────

  function showToast(message) {
    const id = Date.now()

    setToasts(prev => [
      ...prev,
      {
        id,
        message
      }
    ])
  }

  function removeToast(id) {
    setToasts(prev =>
      prev.filter(t => t.id !== id)
    )
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SINCRONIZAR CARRITO
  // ─────────────────────────────────────────────────────────────────────────────

  const syncCart = useCallback(async () => {
    try {
      const { data } = await getCarritoAPI(
        sessionId,
        cliente_id || undefined
      )

      if (data?.data) {
        setCart(data.data)
      }
    } catch {
      // Si el carrito está vacío o no hay conexión,
      // simplemente mantenemos el estado actual.
    }
  }, [sessionId, cliente_id])

  useEffect(() => {
    syncCart()
  }, [syncCart])

  // ─────────────────────────────────────────────────────────────────────────────
  // CARRITO
  // ─────────────────────────────────────────────────────────────────────────────

  async function addToCart(product, qty = 1) {
    setCartLoading(true)

    try {
      const currentItem = cart.items?.find(
        i => i.producto_id === product.id
      )

      const newQty =
        (currentItem?.cantidad || 0) + qty

      const { data } = await addCarritoItem(
        sessionId,
        product.id,
        newQty,
        cliente_id
      )

      if (data?.data) {
        setCart(data.data)
      }

      showToast(
        `${product.nombre || product.name || 'Producto'} agregado al carrito`
      )
    } catch (err) {
      showToast(
        err.response?.data?.message ||
        'Error al agregar al carrito'
      )
    } finally {
      setCartLoading(false)
    }
  }

  async function removeFromCart(producto_id) {
    setCartLoading(true)

    try {
      const { data } = await removeCarritoItem(
        sessionId,
        producto_id
      )

      if (data?.data) {
        setCart(data.data)
      }
    } catch {
      // Ignorar temporalmente
    } finally {
      setCartLoading(false)
    }
  }

  async function changeQty(producto_id, newQty) {
    if (newQty <= 0) {
      await removeFromCart(producto_id)
      return
    }

    setCartLoading(true)

    try {
      const { data } = await updateCarritoItem(
        sessionId,
        producto_id,
        newQty
      )

      if (data?.data) {
        setCart(data.data)
      }
    } catch (err) {
      showToast(
        err.response?.data?.message ||
        'Error al actualizar cantidad'
      )
    } finally {
      setCartLoading(false)
    }
  }

  async function clearCart() {
    setCartLoading(true)

    try {
      await clearCarritoAPI(sessionId)

      setCart({
        items: [],
        subtotal: 0,
        total_items: 0
      })
    } catch {
      // Ignorar temporalmente
    } finally {
      setCartLoading(false)
    }
  }

  const cartTotal =
    cart.total_items ?? 0

  const cartSubtotal =
    cart.subtotal ?? 0

  // ─────────────────────────────────────────────────────────────────────────────
  // FAVORITOS
  // ─────────────────────────────────────────────────────────────────────────────

  const syncWishlist = useCallback(async () => {
    // Favoritos pertenece a usuarios autenticados.
    if (!user?.id) {
      setWishlist([])
      return
    }

    setWishlistLoading(true)

    try {
      const { data } = await getFavoritos()

      if (Array.isArray(data?.data)) {
        setWishlist(data.data)
      } else {
        setWishlist([])
      }
    } catch (err) {
      console.error(
        'Error al cargar favoritos:',
        err
      )

      setWishlist([])
    } finally {
      setWishlistLoading(false)
    }
  }, [user?.id])

  // Cargar favoritos cuando el usuario inicia sesión.
  useEffect(() => {
    syncWishlist()
  }, [syncWishlist])

  async function toggleWishlist(product) {
    if (!user?.id) {
      showToast(
        'Debes iniciar sesión para agregar productos a favoritos'
      )

      setAuthOpen(true)
      return
    }

    const exists = wishlist.some(
      item => item.id === product.id
    )

    setWishlistLoading(true)

    try {
      if (exists) {
        await removeFavorito(product.id)

        setWishlist(prev =>
          prev.filter(
            item => item.id !== product.id
          )
        )

        showToast(
          `${product.nombre || product.name || 'Producto'} eliminado de favoritos`
        )
      } else {
        await addFavorito(product.id)

        // Volvemos a consultar el backend para obtener
        // exactamente el producto almacenado.
        await syncWishlist()

        showToast(
          `${product.nombre || product.name || 'Producto'} agregado a favoritos`
        )
      }
    } catch (err) {
      showToast(
        err.response?.data?.message ||
        'Error al actualizar favoritos'
      )
    } finally {
      setWishlistLoading(false)
    }
  }

  function isInWishlist(id) {
    return wishlist.some(
      item => item.id === id
    )
  }

  const wishlistTotal = wishlist.length

  // ─────────────────────────────────────────────────────────────────────────────
  // BÚSQUEDA
  // ─────────────────────────────────────────────────────────────────────────────

  function handleSearch(query, products) {
    setSearchQuery(query)

    if (!query.trim()) {
      setSearchResults([])
      setSearchOpen(false)
      return
    }

    const q = query.toLowerCase()

    const results = products.filter(p =>
      (p.nombre || '')
        .toLowerCase()
        .includes(q) ||

      (p.marca || '')
        .toLowerCase()
        .includes(q) ||

      (p.categorias?.nombre || '')
        .toLowerCase()
        .includes(q)
    )

    setSearchResults(results)
    setSearchOpen(true)
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PROVIDER
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <CartContext.Provider
      value={{
        sessionId,
        cliente_id,

        // Carrito
        cart,
        addToCart,
        removeFromCart,
        changeQty,
        clearCart,
        cartLoading,
        syncCart,
        cartTotal,
        cartSubtotal,

        // Favoritos
        wishlist,
        toggleWishlist,
        isInWishlist,
        syncWishlist,
        wishlistLoading,
        wishlistTotal,

        // Sidebars
        cartOpen,
        setCartOpen,
        wishlistOpen,
        setWishlistOpen,

        // Búsqueda
        searchQuery,
        searchResults,
        searchOpen,
        setSearchOpen,
        handleSearch,

        // Autenticación
        authOpen,
        setAuthOpen,

        // Toasts
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}