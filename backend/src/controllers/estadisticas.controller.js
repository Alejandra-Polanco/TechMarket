import prisma from '../utils/prisma.js'

// GET /api/estadisticas
export async function getEstadisticas(req, res) {
  try {
    const [
      totalProductos,
      totalCategorias,
      totalClientes,
      totalPedidos,
      productos,
      pedidos
    ] = await Promise.all([
      prisma.producto.count({
        where: { activo: true }
      }),

      prisma.categoria.count({
        where: { activo: true }
      }),

      prisma.usuario.count({
        where: {
          activo: true,
          rol: 'CLIENTE'
        }
      }),

      prisma.pedido.count(),

      prisma.producto.findMany({
        where: { activo: true },
        select: {
          stock: true
        }
      }),

      prisma.pedido.findMany({
        select: {
          total: true,
          estado: true
        }
      })
    ])

    const unidadesInventario = productos.reduce(
      (total, producto) => total + producto.stock,
      0
    )

    const productosSinStock = productos.filter(
      producto => producto.stock <= 0
    ).length

    const productosStockBajo = productos.filter(
      producto => producto.stock > 0 && producto.stock <= 5
    ).length

    const ventasTotales = pedidos
      .filter(pedido => pedido.estado !== 'CANCELADO')
      .reduce(
        (total, pedido) => total + Number(pedido.total),
        0
      )

    const pedidosPorEstado = pedidos.reduce(
      (resultado, pedido) => {
        resultado[pedido.estado] =
          (resultado[pedido.estado] || 0) + 1

        return resultado
      },
      {}
    )

    return res.json({
      data: {
        productos: totalProductos,
        categorias: totalCategorias,
        clientes: totalClientes,
        pedidos: totalPedidos,
        inventario: {
          unidades: unidadesInventario,
          sinStock: productosSinStock,
          stockBajo: productosStockBajo
        },
        ventasTotales: Number(ventasTotales.toFixed(2)),
        pedidosPorEstado
      }
    })
  } catch (error) {
    console.error('Error al obtener estadísticas:', error)

    return res.status(500).json({
      message: 'Error al obtener las estadísticas'
    })
  }
}