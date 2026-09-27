import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import SearchBar from '../ui/SearchBar'

function Header() {
  const {
    cartTotal,
    wishlist,
    setCartOpen,
    setWishlistOpen,
    setAuthOpen
  } = useCart()

  const { user } = useAuth()
  const navigate = useNavigate()

  // Manejar el botón de cuenta
  const handleCuenta = () => {
    // Si no hay sesión iniciada, abrir el modal de login
    if (!user) {
      setAuthOpen(true)
      return
    }

    // Si ya hay sesión, regresar al panel correspondiente
    const rol = user._rol?.toLowerCase()

    if (rol === 'admin') {
      navigate('/admin')
    } else if (rol === 'operador') {
      navigate('/operador')
    } else {
      navigate('/cliente')
    }
  }

  return (
    <header className="header">
      <div className="container">

        {/* Logo */}
        <div className="header__brand">
          <div className="header__logo">
            Tech <span>Market</span>
          </div>

          <div className="header__company">
            TechStore Corporation
          </div>
        </div>

        {/* Buscador */}
        <SearchBar />

        {/* Iconos */}
        <div className="header__icons">

          {/* Favoritos */}
          <button
            className="header__icon-btn"
            aria-label="Favoritos"
            title="Favoritos"
            onClick={() => setWishlistOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>

            {wishlist.length > 0 && (
              <span
                className="cart-badge"
                style={{ background: '#e91e63' }}
              >
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Carrito */}
          <button
            className="header__icon-btn"
            aria-label="Carrito"
            title="Carrito"
            onClick={() => setCartOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>

            {cartTotal > 0 && (
              <span className="cart-badge">
                {cartTotal}
              </span>
            )}
          </button>

          {/* Cuenta */}
          <button
            className="header__icon-btn"
            aria-label={user ? 'Ir a mi cuenta' : 'Iniciar sesión'}
            title={user ? 'Mi cuenta' : 'Iniciar sesión'}
            onClick={handleCuenta}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>

            {/* Indicador de sesión activa */}
            {user && (
              <span
                style={{
                  position: 'absolute',
                  width: '8px',
                  height: '8px',
                  background: '#22c55e',
                  borderRadius: '50%',
                  right: '2px',
                  top: '2px',
                  border: '2px solid white'
                }}
              />
            )}
          </button>

        </div>
      </div>
    </header>
  )
}

export default Header