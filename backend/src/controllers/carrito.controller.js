import prisma from '../utils/prisma.js'

// Convierte los registros de Prisma al formato que espera el frontend
function formatearCarrito(items) {
  const itemsFormateados = items.map((item) => {
    const precioUnitario = Number(item.producto.precio_venta)
    const subtotal = precioUnitario * item.cantidad

    return {
      id: item.id,
      producto_id: item.producto_id,
      cantidad: item.cantidad,
      precio_unitario: precioUnitario,
      subtotal,
      producto: {
        id: item.producto.id,
        nombre: item.producto.nombre,
        descripcion: item.producto.descripcion,
        marca: item.producto.marca,
        precio_venta: Number(item.producto.precio_venta),
        precio_anterior: item.producto.precio_anterior
          ? Number(item.producto.precio_anterior)
          : null,
        stock: item.producto.stock,
        imagen: item.producto.imagen,
        badge: item.producto.badge,
      },
    }
  })

  const subtotal = itemsFormateados.reduce(
    (total, item) => total + item.subtotal,
    0
  )

  const total_items = itemsFormateados.reduce(
    (total, item) => total + item.cantidad,
    0
  )

  return {
    items: itemsFormateados,
    subtotal,
    total_items,
  }
}


// Obtener carrito
export async function getCarrito(req, res) {
  try {
    const { session_id } = req.query

    if (!session_id) {
      return res.status(400).json({
        message: 'session_id es requerido',
      })
    }

    const items = await prisma.carritoItem.findMany({
      where: {
        session_id,
      },
      include: {
        producto: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return res.json({
      data: formatearCarrito(items),
    })
  } catch (error) {
    console.error('Error al obtener carrito:', error)

    return res.status(500).json({
      message: 'Error al obtener el carrito',
    })
  }
}


// Agregar o actualizar producto
export async function addCarritoItem(req, res) {
  try {
    const {
      session_id,
      producto_id,
      cantidad,
    } = req.body

    if (!session_id || !producto_id) {
      return res.status(400).json({
        message: 'session_id y producto_id son requeridos',
      })
    }

    const cantidadNumero = Number(cantidad)
    const productoIdNumero = Number(producto_id)

    if (!Number.isInteger(cantidadNumero) || cantidadNumero <= 0) {
      return res.status(400).json({
        message: 'La cantidad debe ser mayor que 0',
      })
    }

    const producto = await prisma.producto.findUnique({
      where: {
        id: productoIdNumero,
      },
    })

    if (!producto || !producto.activo) {
      return res.status(404).json({
        message: 'Producto no encontrado',
      })
    }

    if (cantidadNumero > producto.stock) {
      return res.status(400).json({
        message: `Stock insuficiente. Disponible: ${producto.stock}`,
      })
    }

    await prisma.carritoItem.upsert({
      where: {
        session_id_producto_id: {
          session_id,
          producto_id: productoIdNumero,
        },
      },

      update: {
        cantidad: cantidadNumero,
      },

      create: {
        session_id,
        producto_id: productoIdNumero,
        cantidad: cantidadNumero,
      },
    })

    const items = await prisma.carritoItem.findMany({
      where: {
        session_id,
      },
      include: {
        producto: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return res.status(200).json({
      data: formatearCarrito(items),
    })
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error)

    return res.status(500).json({
      message: 'Error al agregar el producto al carrito',
    })
  }
}


// Cambiar cantidad
export async function updateCarritoItem(req, res) {
  try {
    const producto_id = Number(req.params.producto_id)
    const { session_id, cantidad } = req.body
    const cantidadNumero = Number(cantidad)

    if (!session_id) {
      return res.status(400).json({
        message: 'session_id es requerido',
      })
    }

    if (!Number.isInteger(cantidadNumero) || cantidadNumero <= 0) {
      return res.status(400).json({
        message: 'La cantidad debe ser mayor que 0',
      })
    }

    const producto = await prisma.producto.findUnique({
      where: {
        id: producto_id,
      },
    })

    if (!producto || !producto.activo) {
      return res.status(404).json({
        message: 'Producto no encontrado',
      })
    }

    if (cantidadNumero > producto.stock) {
      return res.status(400).json({
        message: `Stock insuficiente. Disponible: ${producto.stock}`,
      })
    }

    const item = await prisma.carritoItem.findUnique({
      where: {
        session_id_producto_id: {
          session_id,
          producto_id,
        },
      },
    })

    if (!item) {
      return res.status(404).json({
        message: 'El producto no está en el carrito',
      })
    }

    await prisma.carritoItem.update({
      where: {
        session_id_producto_id: {
          session_id,
          producto_id,
        },
      },

      data: {
        cantidad: cantidadNumero,
      },
    })

    const items = await prisma.carritoItem.findMany({
      where: {
        session_id,
      },
      include: {
        producto: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return res.json({
      data: formatearCarrito(items),
    })
  } catch (error) {
    console.error('Error al actualizar carrito:', error)

    return res.status(500).json({
      message: 'Error al actualizar el carrito',
    })
  }
}


// Eliminar un producto
export async function removeCarritoItem(req, res) {
  try {
    const producto_id = Number(req.params.producto_id)
    const { session_id } = req.query

    if (!session_id) {
      return res.status(400).json({
        message: 'session_id es requerido',
      })
    }

    await prisma.carritoItem.deleteMany({
      where: {
        session_id,
        producto_id,
      },
    })

    const items = await prisma.carritoItem.findMany({
      where: {
        session_id,
      },
      include: {
        producto: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return res.json({
      data: formatearCarrito(items),
    })
  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error)

    return res.status(500).json({
      message: 'Error al eliminar el producto del carrito',
    })
  }
}


// Vaciar carrito
export async function clearCarrito(req, res) {
  try {
    const { session_id } = req.query

    if (!session_id) {
      return res.status(400).json({
        message: 'session_id es requerido',
      })
    }

    await prisma.carritoItem.deleteMany({
      where: {
        session_id,
      },
    })

    return res.json({
      data: {
        items: [],
        subtotal: 0,
        total_items: 0,
      },
    })
  } catch (error) {
    console.error('Error al vaciar carrito:', error)

    return res.status(500).json({
      message: 'Error al vaciar el carrito',
    })
  }
}

export async function checkoutCarrito(req, res) {
  try {
    const {
      session_id,
      direccion_entrega,
      observaciones,
    } = req.body

    // El usuario viene del token JWT
    const usuarioId = Number(req.usuario?.id)
    if (!usuarioId) {
      return res.status(401).json({
        message: 'Debes iniciar sesión para realizar el pedido',
      })
    }

    if (!session_id) {
      return res.status(400).json({
        message: 'session_id es requerido',
      })
    }

    if (!direccion_entrega?.trim()) {
      return res.status(400).json({
        message: 'La dirección de entrega es requerida',
      })
    }

    // Comprobar que el usuario existe
    const usuario = await prisma.usuario.findUnique({
      where: {
        id: usuarioId,
      },
    })

    if (!usuario || !usuario.activo) {
      return res.status(404).json({
        message: 'Usuario no encontrado o inactivo',
      })
    }

    // Obtener carrito con los productos reales de PostgreSQL
    const carrito = await prisma.carritoItem.findMany({
      where: {
        session_id,
      },
      include: {
        producto: true,
      },
    })

    if (carrito.length === 0) {
      return res.status(400).json({
        message: 'El carrito está vacío',
      })
    }

    // Validar todos los productos antes de crear el pedido
    for (const item of carrito) {
      if (!item.producto || !item.producto.activo) {
        return res.status(400).json({
          message: `El producto #${item.producto_id} ya no está disponible`,
        })
      }

      if (item.cantidad > item.producto.stock) {
        return res.status(400).json({
          message: `Stock insuficiente para ${item.producto.nombre}. Disponible: ${item.producto.stock}`,
        })
      }
    }

    // Calcular total usando los precios REALES de la base de datos
    const total = carrito.reduce((acumulado, item) => {
      return (
        acumulado +
        Number(item.producto.precio_venta) * item.cantidad
      )
    }, 0)

    // Transacción:
    // pedido + detalles + descuento de stock + vaciar carrito
    const pedido = await prisma.$transaction(async (tx) => {
      const nuevoPedido = await tx.pedido.create({
        data: {
          usuario_id: usuarioId,
          direccion_entrega: direccion_entrega.trim(),
          observaciones: observaciones?.trim() || null,
          total,
          estado: 'PENDIENTE_CONFIRMACION',

          detalle_pedido: {
            create: carrito.map((item) => {
              const precio = Number(item.producto.precio_venta)

              return {
                producto_id: item.producto_id,
                cantidad: item.cantidad,
                precio_unitario: precio,
                subtotal: precio * item.cantidad,
              }
            }),
          },
        },

        include: {
          detalle_pedido: {
            include: {
              producto: true,
            },
          },
        },
      })

      // Descontar existencias
      for (const item of carrito) {
        await tx.producto.update({
          where: {
            id: item.producto_id,
          },

          data: {
            stock: {
              decrement: item.cantidad,
            },
          },
        })
      }

      // Vaciar carrito después de crear correctamente el pedido
      await tx.carritoItem.deleteMany({
        where: {
          session_id,
        },
      })

      return nuevoPedido
    })

    // Adaptamos detalle_pedido al formato que espera ClientePedidos.jsx
    const pedidoFormateado = {
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

        productos: {
          id: detalle.producto.id,
          nombre: detalle.producto.nombre,
          imagen: detalle.producto.imagen,
          marca: detalle.producto.marca,
        },
      })),
    }

    return res.status(201).json({
      message: 'Pedido creado correctamente',
      data: pedidoFormateado,
    })
  } catch (error) {
    console.error('Error al realizar checkout:', error)

    return res.status(500).json({
      message: 'Error al crear el pedido',
    })
  }
}