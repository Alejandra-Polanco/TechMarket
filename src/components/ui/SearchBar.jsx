import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProductos } from '../../services/api'

function SearchBar() {
  const navigate = useNavigate()
  const wrapperRef = useRef(null)

  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Cerrar resultados al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Buscar productos en PostgreSQL mediante la API
  useEffect(() => {
    const texto = query.trim()

    if (!texto) {
      setResults([])
      setOpen(false)
      setLoading(false)
      setError('')
      return
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true)
        setError('')

        const response = await getProductos({
          buscar: texto,
          page: 1,
          limit: 6
        })

        const productos = Array.isArray(response.data?.data)
          ? response.data.data
          : []

        setResults(productos)
        setOpen(true)
      } catch (err) {
        console.error('Error al buscar productos:', err)
        setResults([])
        setError('No se pudo realizar la búsqueda')
        setOpen(true)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  function handleChange(event) {
    const value = event.target.value
    setQuery(value)

    if (!value.trim()) {
      setResults([])
      setOpen(false)
    }
  }

  function handleProductClick(producto) {
    setOpen(false)
    setQuery('')
    navigate(`/cliente/producto/${producto.id}`)
  }

  return (
    <div
      className="header__search"
      ref={wrapperRef}
      style={{ position: 'relative' }}
    >
      {/* Icono de búsqueda */}
      <svg
        className="search-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35"
        />
      </svg>

      <input
        type="text"
        placeholder="Buscar productos, marcas, tecnología..."
        autoComplete="off"
        value={query}
        onChange={handleChange}
        onFocus={() => {
          if (query.trim()) {
            setOpen(true)
          }
        }}
      />

      {/* Resultados */}
      {open && (
        <div className="search-dropdown open">

          <div className="search-dropdown__section">

            <div className="search-dropdown__label">
              Productos encontrados
            </div>

            {/* Cargando */}
            {loading && (
              <p
                style={{
                  padding: '0.75rem',
                  fontSize: '0.875rem',
                  color: 'var(--subtle)'
                }}
              >
                Buscando productos...
              </p>
            )}

            {/* Error */}
            {!loading && error && (
              <p
                style={{
                  padding: '0.75rem',
                  fontSize: '0.875rem',
                  color: '#dc2626'
                }}
              >
                {error}
              </p>
            )}

            {/* Sin resultados */}
            {!loading &&
              !error &&
              results.length === 0 && (
                <p
                  style={{
                    padding: '0.75rem',
                    fontSize: '0.875rem',
                    color: 'var(--subtle)'
                  }}
                >
                  No se encontraron productos
                </p>
              )}

            {/* Productos */}
            {!loading &&
              !error &&
              results.map(producto => (
                <button
                  key={producto.id}
                  type="button"
                  className="search-dropdown__item"
                  onClick={() =>
                    handleProductClick(producto)
                  }
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      width: '100%'
                    }}
                  >
                    {/* Imagen */}
                    {producto.imagen ? (
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        style={{
                          width: '48px',
                          height: '48px',
                          objectFit: 'contain',
                          borderRadius: '6px',
                          background: '#f5f5f5',
                          flexShrink: 0
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '6px',
                          background: '#f3f4f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        📦
                      </div>
                    )}

                    {/* Información */}
                    <div
                      style={{
                        flex: 1,
                        textAlign: 'left',
                        minWidth: 0
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          color: '#111827'
                        }}
                      >
                        {producto.nombre}
                      </div>

                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          marginTop: '2px'
                        }}
                      >
                        {producto.marca || 'TechMarket'}
                      </div>
                    </div>

                    {/* Precio */}
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        color: 'var(--accent)',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      $
                      {Number(
                        producto.precio_venta || 0
                      ).toFixed(2)}
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar