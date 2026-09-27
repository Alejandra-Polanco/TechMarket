import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProducto } from '../../services/api'
import { useCart } from '../../context/CartContext'
import ToastContainer from '../../components/ui/ToastContainer'
import * as Icons from '../../components/admin/shared/Icons'

export default function DetalleProducto() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { addToCart, cartLoading } = useCart()

  const [producto, setProducto] = useState(null)
  const [cantidad, setCantidad] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)

    getProducto(id)
      .then((response) => {
        // Soporta respuestas tipo { data: { data: producto } }
        // y también { data: producto }
        const productoRecibido = response.data?.data || response.data
        setProducto(productoRecibido)
      })
      .catch(() => {
        setError('No se pudo cargar la información del producto.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  async function handleAgregar() {
    if (!producto || producto.stock === 0) return

    setAdding(true)

    try {
      await addToCart(producto, cantidad)
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#f0f2f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-body, sans-serif)',
        }}
      >
        <div
          style={{
            background: '#fff',
            padding: '2rem 3rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            textAlign: 'center',
          }}
        >
          <p style={{ color: '#6b7280', margin: 0 }}>
            Cargando producto...
          </p>
        </div>
      </div>
    )
  }

  if (error || !producto) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#f0f2f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'var(--font-body, sans-serif)',
        }}
      >
        <div
          style={{
            maxWidth: '500px',
            width: '100%',
            background: '#fff',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            textAlign: 'center',
          }}
        >
          <Icons.AlertTriangle
            size={42}
            color="#dc2626"
            style={{ marginBottom: '1rem' }}
          />

          <h2 style={{ marginTop: 0 }}>
            No se pudo cargar el producto
          </h2>

          <p style={{ color: '#6b7280' }}>
            {error || 'Producto no encontrado.'}
          </p>

          <button
            onClick={() => navigate('/cliente')}
            style={buttonPrimary}
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    )
  }

  const sinStock = Number(producto.stock) <= 0

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f0f2f5',
        padding: '2rem',
        fontFamily: 'var(--font-body, sans-serif)',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        {/* Botón regresar */}
        <button
          onClick={() => navigate('/cliente')}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--accent)',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            marginBottom: '1rem',
            padding: 0,
          }}
        >
          <Icons.ChevronLeft size={17} />
          Volver al catálogo
        </button>

        {/* Contenedor principal */}
        <div
          style={{
            background: '#fff',
            borderRadius: '14px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns:
              'minmax(300px, 1fr) minmax(320px, 1fr)',
          }}
        >
          {/* Imagen */}
          <div
            style={{
              minHeight: '450px',
              background: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
            }}
          >
            {producto.imagen ? (
              <img
                src={producto.imagen}
                alt={producto.nombre}
                style={{
                  width: '100%',
                  maxWidth: '450px',
                  maxHeight: '450px',
                  objectFit: 'contain',
                }}
              />
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  color: '#9ca3af',
                }}
              >
                <Icons.Package
                  size={90}
                  color="#d1d5db"
                />
                <p>Imagen no disponible</p>
              </div>
            )}
          </div>

          {/* Información */}
          <div
            style={{
              padding: '2.25rem',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {producto.categorias?.nombre && (
              <span
                style={{
                  color: 'var(--accent)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '0.5rem',
                }}
              >
                {producto.categorias.nombre}
              </span>
            )}

            <h1
              style={{
                margin: '0 0 0.5rem',
                fontSize: '1.8rem',
                color: '#111827',
                lineHeight: 1.25,
              }}
            >
              {producto.nombre}
            </h1>

            {producto.marca && (
              <p
                style={{
                  color: '#6b7280',
                  margin: '0 0 1.25rem',
                  fontSize: '0.9rem',
                }}
              >
                Marca: <strong>{producto.marca}</strong>
              </p>
            )}

            {/* Precio */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.75rem',
                marginBottom: '1rem',
              }}
            >
              <span
                style={{
                  color: 'var(--accent)',
                  fontSize: '1.8rem',
                  fontWeight: 700,
                }}
              >
                $
                {parseFloat(
                  producto.precio_venta || 0
                ).toFixed(2)}
              </span>

              {producto.precio_anterior && (
                <span
                  style={{
                    color: '#9ca3af',
                    textDecoration: 'line-through',
                    fontSize: '1rem',
                  }}
                >
                  $
                  {parseFloat(
                    producto.precio_anterior
                  ).toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock */}
            <div style={{ marginBottom: '1.5rem' }}>
              {sinStock ? (
                <span
                  style={{
                    background: '#fef2f2',
                    color: '#dc2626',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  Sin existencias
                </span>
              ) : (
                <span
                  style={{
                    background: '#ecfdf5',
                    color: '#059669',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  Disponible · {producto.stock} en existencia
                </span>
              )}
            </div>

            {/* Descripción */}
            {producto.descripcion && (
              <div
                style={{
                  borderTop: '1px solid #e5e7eb',
                  paddingTop: '1.25rem',
                  marginBottom: '1.5rem',
                }}
              >
                <h3
                  style={{
                    fontSize: '0.95rem',
                    margin: '0 0 0.5rem',
                    color: '#374151',
                  }}
                >
                  Descripción
                </h3>

                <p
                  style={{
                    margin: 0,
                    color: '#6b7280',
                    lineHeight: 1.7,
                    fontSize: '0.875rem',
                  }}
                >
                  {producto.descripcion}
                </p>
              </div>
            )}

            {/* Cantidad */}
            {!sinStock && (
              <div
                style={{
                  borderTop: '1px solid #e5e7eb',
                  paddingTop: '1.25rem',
                  marginTop: 'auto',
                }}
              >
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    color: '#374151',
                    margin: '0 0 0.5rem',
                  }}
                >
                  Cantidad
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem',
                  }}
                >
                  <button
                    onClick={() =>
                      setCantidad((actual) =>
                        Math.max(1, actual - 1)
                      )
                    }
                    style={quantityButton}
                  >
                    −
                  </button>

                  <span
                    style={{
                      minWidth: '40px',
                      textAlign: 'center',
                      fontWeight: 700,
                    }}
                  >
                    {cantidad}
                  </span>

                  <button
                    onClick={() =>
                      setCantidad((actual) =>
                        Math.min(
                          Number(producto.stock),
                          actual + 1
                        )
                      )
                    }
                    style={quantityButton}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Agregar al carrito */}
            <button
              onClick={handleAgregar}
              disabled={
                sinStock ||
                adding ||
                cartLoading
              }
              style={{
                width: '100%',
                padding: '0.9rem',
                border: 'none',
                borderRadius: '9px',
                background:
                  sinStock ||
                  adding ||
                  cartLoading
                    ? '#e5e7eb'
                    : 'var(--accent)',
                color:
                  sinStock ||
                  adding ||
                  cartLoading
                    ? '#9ca3af'
                    : '#fff',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor:
                  sinStock ||
                  adding ||
                  cartLoading
                    ? 'not-allowed'
                    : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              {adding ? (
                'Agregando...'
              ) : sinStock ? (
                'Producto sin stock'
              ) : (
                <>
                  <Icons.ShoppingCart size={17} />
                  Agregar al carrito
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mensaje cuando se agrega el producto */}
      <ToastContainer />
    </div>
  )
}

const quantityButton = {
  width: '36px',
  height: '36px',
  border: '1.5px solid #e5e7eb',
  borderRadius: '7px',
  background: '#fff',
  cursor: 'pointer',
  fontWeight: 700,
  fontSize: '1.1rem',
}

const buttonPrimary = {
  marginTop: '0.75rem',
  padding: '0.7rem 1.25rem',
  border: 'none',
  borderRadius: '8px',
  background: 'var(--accent)',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 700,
}