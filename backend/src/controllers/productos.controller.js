import prisma from '../utils/prisma.js'

// GET /api/productos
export async function getProductos(req, res) {
  try {
    const {
  buscar = '',
  categoria_id,
  marca,
  page = 1,
  limit = 12
} = req.query

    const pagina = Math.max(parseInt(page) || 1, 1)
    const limite = Math.max(parseInt(limit) || 12, 1)
    const skip = (pagina - 1) * limite

    const where = {
      activo: true
    }

    // Buscar por nombre, marca o descripción
    if (buscar.trim()) {
      where.OR = [
        {
          nombre: {
            contains: buscar.trim(),
            mode: 'insensitive'
          }
        },
        {
          marca: {
            contains: buscar.trim(),
            mode: 'insensitive'
          }
        },
        {
          descripcion: {
            contains: buscar.trim(),
            mode: 'insensitive'
          }
        }
      ]
    }

    // Filtrar por categoría
    if (categoria_id) {
      const categoriaId = Number(categoria_id)

      if (!Number.isNaN(categoriaId)) {
        where.categoria_id = categoriaId
      }
    }
    // Filtrar por marca
if (marca?.trim()) {
  where.marca = {
    equals: marca.trim(),
    mode: 'insensitive'
  }
}

    const [productos, total] = await Promise.all([
      prisma.producto.findMany({
        where,
        include: {
          categoria: true
        },
        orderBy: {
          id: 'desc'
        },
        skip,
        take: limite
      }),

      prisma.producto.count({
        where
      })
    ])

    // Adaptamos "categoria" a "categorias"
    // porque así lo espera actualmente tu frontend.
    const data = productos.map(producto => ({
      ...producto,
      categorias: producto.categoria,
      precio_venta: Number(producto.precio_venta),
      precio_anterior: producto.precio_anterior
        ? Number(producto.precio_anterior)
        : null
    }))

    return res.json({
      data,
      total,
      page: pagina,
      limit: limite,
      totalPages: Math.ceil(total / limite)
    })
  } catch (error) {
    console.error('Error al obtener productos:', error)

    return res.status(500).json({
      message: 'Error al obtener los productos'
    })
  }
}


// GET /api/productos/:id
export async function getProductoById(req, res) {
  try {
    const id = Number(req.params.id)

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: 'ID de producto inválido'
      })
    }

    const producto = await prisma.producto.findFirst({
      where: {
        id,
        activo: true
      },
      include: {
        categoria: true
      }
    })

    if (!producto) {
      return res.status(404).json({
        message: 'Producto no encontrado'
      })
    }

    const data = {
      ...producto,
      categorias: producto.categoria,
      precio_venta: Number(producto.precio_venta),
      precio_anterior: producto.precio_anterior
        ? Number(producto.precio_anterior)
        : null
    }

    return res.json({
      data
    })
  } catch (error) {
    console.error('Error al obtener producto:', error)

    return res.status(500).json({
      message: 'Error al obtener el producto'
    })
  }
}

export async function getMarcas(req, res) {
  try {
    const productos = await prisma.producto.findMany({
      where: {
        activo: true,
        marca: {
          not: null
        }
      },
      select: {
        marca: true
      },
      orderBy: {
        marca: 'asc'
      }
    })

    const marcas = [
      ...new Set(
        productos
          .map(producto => producto.marca?.trim())
          .filter(Boolean)
      )
    ]

    return res.json({
      data: marcas
    })
  } catch (error) {
    console.error('Error al obtener marcas:', error)

    return res.status(500).json({
      message: 'Error al obtener las marcas'
    })
  }
}