import prisma from '../utils/prisma.js'

// GET /api/categorias
export async function getCategorias(req, res) {
  try {
    const categorias = await prisma.categoria.findMany({
      where: {
        activo: true
      },
      orderBy: {
        nombre: 'asc'
      }
    })

    return res.json({
      data: categorias
    })
  } catch (error) {
    console.error('Error al obtener categorías:', error)

    return res.status(500).json({
      message: 'Error al obtener las categorías'
    })
  }
}


// GET /api/categorias/:id
export async function getCategoriaById(req, res) {
  try {
    const id = Number(req.params.id)

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: 'ID de categoría inválido'
      })
    }

    const categoria = await prisma.categoria.findFirst({
      where: {
        id,
        activo: true
      }
    })

    if (!categoria) {
      return res.status(404).json({
        message: 'Categoría no encontrada'
      })
    }

    return res.json({
      data: categoria
    })
  } catch (error) {
    console.error('Error al obtener categoría:', error)

    return res.status(500).json({
      message: 'Error al obtener la categoría'
    })
  }
}