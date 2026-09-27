import { Router } from 'express'

import {
  login,
  registerCliente,
  me,
  updatePerfil
} from '../controllers/auth.controller.js'

import {
  verificarToken
} from '../middlewares/auth.middleware.js'

const router = Router()

// Registrar nueva cuenta de cliente
router.post('/register-cliente', registerCliente)

// Iniciar sesión
router.post('/login', login)

// Obtener perfil del usuario autenticado
router.get('/me', verificarToken, me)

// Actualizar perfil del usuario autenticado
router.put('/perfil', verificarToken, updatePerfil)

export default router