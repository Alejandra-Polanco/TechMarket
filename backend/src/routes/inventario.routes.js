import { Router } from 'express'

import {
  getInventario,
  getResumenInventario,
  actualizarStock
} from '../controllers/inventario.controller.js'

const router = Router()

router.get('/', getInventario)
router.get('/resumen', getResumenInventario)
router.patch('/:id/stock', actualizarStock)

export default router