import {
  createContext,
  useContext,
  useState
} from 'react'

const CompareContext = createContext()

const MAX_COMPARE = 3

export function CompareProvider({ children }) {
  const [compareProducts, setCompareProducts] = useState([])

  function addToCompare(product) {
    if (!product?.id) {
      return {
        ok: false,
        message: 'Producto inválido'
      }
    }

    const alreadyExists = compareProducts.some(
      item => item.id === product.id
    )

    if (alreadyExists) {
      return {
        ok: false,
        message: 'Este producto ya está seleccionado para comparar'
      }
    }

    if (compareProducts.length >= MAX_COMPARE) {
      return {
        ok: false,
        message: 'Solo puedes comparar hasta 3 productos'
      }
    }

    setCompareProducts(prev => [
      ...prev,
      product
    ])

    return {
      ok: true,
      message: `${product.nombre || 'Producto'} agregado a comparar`
    }
  }

  function removeFromCompare(productId) {
    setCompareProducts(prev =>
      prev.filter(
        item => item.id !== productId
      )
    )
  }

  function toggleCompare(product) {
    const exists = compareProducts.some(
      item => item.id === product.id
    )

    if (exists) {
      removeFromCompare(product.id)

      return {
        ok: true,
        action: 'removed',
        message: `${product.nombre || 'Producto'} eliminado de la comparación`
      }
    }

    const result = addToCompare(product)

    return {
      ...result,
      action: result.ok ? 'added' : 'error'
    }
  }

  function isInCompare(productId) {
    return compareProducts.some(
      item => item.id === productId
    )
  }

  function clearCompare() {
    setCompareProducts([])
  }

  const compareTotal = compareProducts.length

  const canCompare = compareTotal >= 2

  return (
    <CompareContext.Provider
      value={{
        compareProducts,
        compareTotal,
        canCompare,
        maxCompare: MAX_COMPARE,

        addToCompare,
        removeFromCompare,
        toggleCompare,
        isInCompare,
        clearCompare
      }}
    >
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  return useContext(CompareContext)
}