import prisma from '../utils/prisma.js'

// OBTENER FAVORITOS DEL USUARIO
// GET /api/favoritos
export async function getFavoritos(req, res) {
  try {
    const usuarioId = Number(req.usuario?.id)

    if (!usuarioId) {
      return res.status(401).json({
        message: 'Usuario no autenticado'
      })
    }

    const favoritos = await prisma.favorito.findMany({
      where: {
        usuario_id: usuarioId
      },

      include: {
        producto: {
          include: {
            categoria: true
          }
        }
      },

      orderBy: {
        created_at: 'desc'
      }
    })

    const productos = favoritos.map((favorito) => ({
      id: favorito.producto.id,
      nombre: favorito.producto.nombre,
      descripcion: favorito.producto.descripcion,
      marca: favorito.producto.marca,
      precio_venta: Number(favorito.producto.precio_venta),
      precio_anterior: favorito.producto.precio_anterior
        ? Number(favorito.producto.precio_anterior)
        : null,
      stock: favorito.producto.stock,
      imagen: favorito.producto.imagen,
      badge: favorito.producto.badge,
      activo: favorito.producto.activo,
      categoria_id: favorito.producto.categoria_id,

      categorias: favorito.producto.categoria
        ? {
            id: favorito.producto.categoria.id,
            nombre: favorito.producto.categoria.nombre
          }
        : null
    }))

    return res.json({
      data: productos
    })
  } catch (error) {
    console.error('Error al obtener favoritos:', error)

    return res.status(500).json({
      message: 'Error al obtener los favoritos'
    })
  }
}


// AGREGAR PRODUCTO A FAVORITOS
// POST /api/favoritos/:producto_id
export async function addFavorito(req, res) {
  try {
    const usuarioId = Number(req.usuario?.id)
    const productoId = Number(req.params.producto_id)

    if (!usuarioId) {
      return res.status(401).json({
        message: 'Usuario no autenticado'
      })
    }

    if (!productoId) {
      return res.status(400).json({
        message: 'Producto inválido'
      })
    }

    const producto = await prisma.producto.findUnique({
      where: {
        id: productoId
      }
    })

    if (!producto || !producto.activo) {
      return res.status(404).json({
        message: 'Producto no encontrado'
      })
    }

    const existente = await prisma.favorito.findUnique({
      where: {
        usuario_id_producto_id: {
          usuario_id: usuarioId,
          producto_id: productoId
        }
      }
    })

    if (existente) {
      return res.status(200).json({
        message: 'El producto ya está en favoritos'
      })
    }

    await prisma.favorito.create({
      data: {
        usuario_id: usuarioId,
        producto_id: productoId
      }
    })

    return res.status(201).json({
      message: 'Producto agregado a favoritos'
    })
  } catch (error) {
    console.error('Error al agregar favorito:', error)

    return res.status(500).json({
      message: 'Error al agregar el producto a favoritos'
    })
  }
}


// ELIMINAR PRODUCTO DE FAVORITOS
// DELETE /api/favoritos/:producto_id
export async function removeFavorito(req, res) {
  try {
    const usuarioId = Number(req.usuario?.id)
    const productoId = Number(req.params.producto_id)

    if (!usuarioId) {
      return res.status(401).json({
        message: 'Usuario no autenticado'
      })
    }

    if (!productoId) {
      return res.status(400).json({
        message: 'Producto inválido'
      })
    }

    await prisma.favorito.deleteMany({
      where: {
        usuario_id: usuarioId,
        producto_id: productoId
      }
    })

    return res.json({
      message: 'Producto eliminado de favoritos'
    })
  } catch (error) {
    console.error('Error al eliminar favorito:', error)

    return res.status(500).json({
      message: 'Error al eliminar el producto de favoritos'
    })
  }
}