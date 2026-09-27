import { Router } from 'express'

import {
  getCategorias,
  getCategoriaById
} from '../controllers/categorias.controller.js'

const router = Router()

router.get('/', getCategorias)
router.get('/:id', getCategoriaById)

export default router