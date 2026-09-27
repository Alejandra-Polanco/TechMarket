import { Router } from 'express'

import {
  getProductos,
  getProductoById,
  getMarcas
} from '../controllers/productos.controller.js'

const router = Router()

router.get('/', getProductos)

// IMPORTANTE:
// /marcas debe ir ANTES de /:id
router.get('/marcas', getMarcas)

router.get('/:id', getProductoById)

export default router