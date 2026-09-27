import { Router } from 'express'

import {
  getCarrito,
  addCarritoItem,
  updateCarritoItem,
  removeCarritoItem,
  clearCarrito,
  checkoutCarrito,
} from '../controllers/carrito.controller.js'

import { verificarToken } from '../middlewares/middleware.js'

const router = Router()

// Obtener carrito
router.get('/', getCarrito)

// Agregar producto
router.post('/items', addCarritoItem)

// Actualizar cantidad
router.put('/items/:producto_id', updateCarritoItem)

// Eliminar producto
router.delete('/items/:producto_id', removeCarritoItem)

// Vaciar carrito
router.delete('/', clearCarrito)

// Finalizar compra.
// Esta ruta requiere que el usuario haya iniciado sesión.
router.post('/checkout', verificarToken, checkoutCarrito)

export default router