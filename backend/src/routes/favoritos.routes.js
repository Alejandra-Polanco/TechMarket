import { Router } from 'express'

import {
  getFavoritos,
  addFavorito,
  removeFavorito
} from '../controllers/favoritos.controller.js'

import {
  verificarToken
} from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/', verificarToken, getFavoritos)

router.post('/:producto_id', verificarToken, addFavorito)

router.delete('/:producto_id', verificarToken, removeFavorito)

export default router