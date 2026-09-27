import { useCompare } from '../../context/CompareContext'
import { useCart } from '../../context/CartContext'
import * as Icons from '../admin/shared/Icons'

export default function ClienteComparar() {
  const {
    compareProducts,
    compareTotal,
    removeFromCompare,
    clearCompare,
  } = useCompare()

  const {
    addToCart,
    cartLoading,
  } = useCart()

  // ─────────────────────────────────────────────
  // SIN PRODUCTOS
  // ─────────────────────────────────────────────

  if (compareTotal === 0) {
    return (
      <div
        style={{
          background: '#fff',
          borderRadius: '14px',
          padding: '4rem 2rem',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <div
          style={{
            width: '70px',
            height: '70px',
            margin: '0 auto 1.25rem',
            borderRadius: '50%',
            background: '#fff7ed',
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
          }}
        >
          ⚖
        </div>

        <h2
          style={{
            margin: '0 0 0.5rem',
            fontSize: '1.2rem',
            color: '#111827',
          }}
        >
          No tienes productos para comparar
        </h2>

        <p
          style={{
            margin: 0,
            color: '#6b7280',
            fontSize: '0.875rem',
          }}
        >
          Ve a Tienda y selecciona entre 2 y 3 productos
          utilizando el botón Comparar.
        </p>
      </div>
    )
  }

  // ─────────────────────────────────────────────
  // COMPARACIÓN
  // ─────────────────────────────────────────────

  return (
    <div>
      {/* ENCABEZADO */}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              color: '#111827',
              fontSize: '1.25rem',
            }}
          >
            Comparación de productos
          </h2>

          <p
            style={{
              margin: '0.3rem 0 0',
              color: '#6b7280',
              fontSize: '0.85rem',
            }}
          >
            Tienes {compareTotal} producto
            {compareTotal !== 1 ? 's' : ''} seleccionado
            {compareTotal !== 1 ? 's' : ''}.
          </p>
        </div>

        <button
          type="button"
          onClick={clearCompare}
          style={{
            padding: '0.6rem 0.9rem',
            borderRadius: '8px',
            border: '1px solid #fecaca',
            background: '#fff',
            color: '#dc2626',
            fontWeight: 600,
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Icons.X size={14} />
          Limpiar comparación
        </button>
      </div>

      {compareTotal === 1 && (
        <div
          style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            color: '#92400e',
            padding: '0.8rem 1rem',
            borderRadius: '10px',
            marginBottom: '1.25rem',
            fontSize: '0.83rem',
          }}
        >
          Selecciona al menos otro producto en la Tienda para
          realizar una comparación.
        </div>
      )}

      {/* TABLA */}

      <div
        style={{
          overflowX: 'auto',
          background: '#fff',
          borderRadius: '14px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: compareTotal > 2 ? '850px' : '650px',
          }}
        >
          <tbody>

            {/* PRODUCTOS */}

            <tr>
              <th style={labelCell}>
                Producto
              </th>

              {compareProducts.map((product) => (
                <td
                  key={product.id}
                  style={productCell}
                >
                  <div
                    style={{
                      position: 'relative',
                      padding: '0.5rem',
                    }}
                  >
                    <button
                      type="button"
                      title="Quitar de comparación"
                      onClick={() =>
                        removeFromCompare(product.id)
                      }
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        border: '1px solid #e5e7eb',
                        background: '#fff',
                        color: '#6b7280',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icons.X size={13} />
                    </button>

                    <div
                      style={{
                        height: '160px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0.75rem',
                      }}
                    >
                      {product.imagen ? (
                        <img
                          src={product.imagen}
                          alt={product.nombre}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '150px',
                            objectFit: 'contain',
                          }}
                        />
                      ) : (
                        <Icons.Package
                          size={55}
                          color="#d1d5db"
                        />
                      )}
                    </div>

                    <strong
                      style={{
                        display: 'block',
                        color: '#111827',
                        fontSize: '0.9rem',
                        lineHeight: 1.4,
                      }}
                    >
                      {product.nombre}
                    </strong>
                  </div>
                </td>
              ))}
            </tr>

            {/* MARCA */}

            <CompareRow
              label="Marca"
              products={compareProducts}
              render={(product) =>
                product.marca || 'No especificada'
              }
            />

            {/* CATEGORÍA */}

            <CompareRow
              label="Categoría"
              products={compareProducts}
              render={(product) =>
                product.categorias?.nombre ||
                product.categoria?.nombre ||
                'No especificada'
              }
            />

            {/* PRECIO */}

            <CompareRow
              label="Precio"
              products={compareProducts}
              render={(product) => (
                <span
                  style={{
                    color: 'var(--accent)',
                    fontWeight: 700,
                    fontSize: '1rem',
                  }}
                >
                  $
                  {Number(
                    product.precio_venta || 0
                  ).toFixed(2)}
                </span>
              )}
            />

            {/* PRECIO ANTERIOR */}

            <CompareRow
              label="Precio anterior"
              products={compareProducts}
              render={(product) =>
                product.precio_anterior ? (
                  <span
                    style={{
                      textDecoration: 'line-through',
                      color: '#9ca3af',
                    }}
                  >
                    $
                    {Number(
                      product.precio_anterior
                    ).toFixed(2)}
                  </span>
                ) : (
                  '—'
                )
              }
            />

            {/* STOCK */}

            <CompareRow
              label="Stock"
              products={compareProducts}
              render={(product) => {
                const stock = Number(product.stock || 0)

                return (
                  <span
                    style={{
                      fontWeight: 600,
                      color:
                        stock > 0
                          ? '#16a34a'
                          : '#dc2626',
                    }}
                  >
                    {stock > 0
                      ? `${stock} disponible${
                          stock !== 1 ? 's' : ''
                        }`
                      : 'Sin stock'}
                  </span>
                )
              }}
            />

            {/* DESCRIPCIÓN */}

            <CompareRow
              label="Descripción"
              products={compareProducts}
              render={(product) =>
                product.descripcion ||
                'Sin descripción disponible.'
              }
            />

            {/* ACCIÓN */}

            <tr>
              <th style={labelCell}>
                Acción
              </th>

              {compareProducts.map((product) => {
                const sinStock =
                  Number(product.stock || 0) <= 0

                return (
                  <td
                    key={product.id}
                    style={valueCell}
                  >
                    <button
                      type="button"
                      disabled={
                        sinStock || cartLoading
                      }
                      onClick={() =>
                        addToCart(product)
                      }
                      style={{
                        width: '100%',
                        padding: '0.65rem',
                        border: 'none',
                        borderRadius: '8px',

                        background: sinStock
                          ? '#f3f4f6'
                          : 'var(--accent)',

                        color: sinStock
                          ? '#9ca3af'
                          : '#fff',

                        fontWeight: 600,
                        fontSize: '0.8rem',

                        cursor: sinStock
                          ? 'not-allowed'
                          : 'pointer',

                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <Icons.ShoppingCart size={14} />

                      {sinStock
                        ? 'Sin stock'
                        : 'Agregar al carrito'}
                    </button>
                  </td>
                )
              })}
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// FILA REUTILIZABLE
// ─────────────────────────────────────────────

function CompareRow({
  label,
  products,
  render,
}) {
  return (
    <tr>
      <th style={labelCell}>
        {label}
      </th>

      {products.map((product) => (
        <td
          key={product.id}
          style={valueCell}
        >
          {render(product)}
        </td>
      ))}
    </tr>
  )
}

// ─────────────────────────────────────────────
// ESTILOS
// ─────────────────────────────────────────────

const labelCell = {
  width: '150px',
  padding: '1rem',
  textAlign: 'left',
  verticalAlign: 'middle',
  background: '#f8fafc',
  color: '#374151',
  fontSize: '0.8rem',
  fontWeight: 700,
  borderBottom: '1px solid #e5e7eb',
}

const valueCell = {
  padding: '1rem',
  textAlign: 'center',
  verticalAlign: 'middle',
  color: '#4b5563',
  fontSize: '0.82rem',
  lineHeight: 1.5,
  borderBottom: '1px solid #e5e7eb',
  minWidth: '200px',
}

const productCell = {
  ...valueCell,
  verticalAlign: 'top',
}