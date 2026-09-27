import { Router } from 'express'

import {
  getMisPedidos
} from '../controllers/pedidos.controller.js'

import {
  verificarToken
} from '../middlewares/middleware.js'

const router = Router()

// Pedidos del usuario que inició sesión
router.get('/mis-pedidos', verificarToken, getMisPedidos)

export default router