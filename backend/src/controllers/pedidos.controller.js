import prisma from '../utils/prisma.js'

// ─────────────────────────────────────────────
// TIEMPO DE CONFIRMACIÓN AUTOMÁTICA
// ─────────────────────────────────────────────
// Para pruebas utilizamos 2 minutos.
const MINUTOS_CONFIRMACION_AUTOMATICA = 2

// ─────────────────────────────────────────────
// CONFIRMAR AUTOMÁTICAMENTE PEDIDOS VENCIDOS
// ─────────────────────────────────────────────
async function confirmarPedidosAutomaticamente(usuarioId) {
  const fechaLimite = new Date(
    Date.now() - MINUTOS_CONFIRMACION_AUTOMATICA * 60 * 1000
  )

  const resultado = await prisma.pedido.updateMany({
    where: {
      usuario_id: usuarioId,
      estado: 'PENDIENTE_CONFIRMACION',
      created_at: {
        lte: fechaLimite
      }
    },

    data: {
      estado: 'CONFIRMADO'
    }
  })

  return resultado.count
}


// ─────────────────────────────────────────────
// OBTENER LOS PEDIDOS DEL USUARIO AUTENTICADO
// GET /api/pedidos/mis-pedidos
// ─────────────────────────────────────────────
export async function getMisPedidos(req, res) {
  try {
    const usuarioId = Number(req.usuario?.id)

    if (!usuarioId) {
      return res.status(401).json({
        message: 'Usuario no autenticado'
      })
    }

    // Antes de devolver los pedidos revisamos si alguno
    // lleva 2 minutos pendiente de confirmación.
    await confirmarPedidosAutomaticamente(usuarioId)

    const pedidos = await prisma.pedido.findMany({
      where: {
        usuario_id: usuarioId
      },

      include: {
        detalle_pedido: {
          include: {
            producto: true
          }
        }
      },

      orderBy: {
        created_at: 'desc'
      }
    })

    const pedidosFormateados = pedidos.map((pedido) => ({
      id: pedido.id,
      usuario_id: pedido.usuario_id,
      direccion_entrega: pedido.direccion_entrega,
      observaciones: pedido.observaciones,
      total: Number(pedido.total),
      estado: pedido.estado,
      created_at: pedido.created_at,
      updated_at: pedido.updated_at,

      detalle_pedido: pedido.detalle_pedido.map((detalle) => ({
        id: detalle.id,
        pedido_id: detalle.pedido_id,
        producto_id: detalle.producto_id,
        cantidad: detalle.cantidad,
        precio_unitario: Number(detalle.precio_unitario),
        subtotal: Number(detalle.subtotal),

        // Se llama "productos" porque así lo espera
        // actualmente ClientePedidos.jsx
        productos: {
          id: detalle.producto.id,
          nombre: detalle.producto.nombre,
          imagen: detalle.producto.imagen,
          marca: detalle.producto.marca
        }
      }))
    }))

    return res.json({
      data: pedidosFormateados
    })

  } catch (error) {
    console.error('Error al obtener mis pedidos:', error)

    return res.status(500).json({
      message: 'Error al obtener los pedidos'
    })
  }
}