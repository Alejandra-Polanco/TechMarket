import { Router } from 'express'
import { getTipoCambio } from '../controllers/externa.controller.js'

const router = Router()

router.get('/tipo-cambio', getTipoCambio)

export default router