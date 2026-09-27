import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../utils/prisma.js'

// ======================================================
// GENERAR TOKEN JWT
// ======================================================
function generarToken(usuario) {
  return jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol.toLowerCase()
    },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  )
}

// ======================================================
// DATOS DEL USUARIO QUE SE DEVUELVEN AL FRONTEND
// ======================================================
function usuarioRespuesta(usuario) {
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    telefono: usuario.telefono,
    direccion: usuario.direccion,
    email: usuario.email,
    rol: usuario.rol.toLowerCase()
  }
}

// ======================================================
// CREAR CUENTA DE CLIENTE
// ======================================================
export async function registerCliente(req, res) {
  try {
    const {
      nombre,
      telefono,
      direccion,
      email,
      password
    } = req.body

    if (!nombre || !email || !password) {
      return res.status(400).json({
        message: 'Nombre, correo y contraseña son obligatorios'
      })
    }

    // Comprobar si el correo ya está registrado
    const existente = await prisma.usuario.findUnique({
      where: {
        email
      }
    })

    if (existente) {
      return res.status(409).json({
        message: 'Ya existe una cuenta con este correo'
      })
    }

    // Encriptar contraseña
    const passwordHash = await bcrypt.hash(password, 10)

    // Crear usuario cliente
    const usuario = await prisma.usuario.create({
      data: {
        nombre: nombre.trim(),
        telefono: telefono?.trim() || null,
        direccion: direccion?.trim() || null,
        email: email.trim(),
        password: passwordHash,
        rol: 'CLIENTE'
      }
    })

    // Crear token
    const token = generarToken(usuario)

    const user = usuarioRespuesta(usuario)

    return res.status(201).json({
      message: 'Cuenta creada correctamente',
      token,

      // Se mantienen ambos para compatibilidad
      // con el frontend existente
      user,
      usuario: user
    })

  } catch (error) {
    console.error('Error al registrar cliente:', error)

    return res.status(500).json({
      message: 'Error interno del servidor'
    })
  }
}

// ======================================================
// INICIAR SESIÓN
// ======================================================
export async function login(req, res) {
  try {
    const {
      email,
      password
    } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: 'Correo y contraseña son obligatorios'
      })
    }

    // Buscar usuario por correo
    const usuario = await prisma.usuario.findUnique({
      where: {
        email
      }
    })

    if (!usuario) {
      return res.status(401).json({
        message: 'Correo o contraseña incorrectos'
      })
    }

    // Comprobar que la cuenta esté activa
    if (!usuario.activo) {
      return res.status(403).json({
        message: 'La cuenta está desactivada'
      })
    }

    // Comparar contraseña
    const passwordCorrecta = await bcrypt.compare(
      password,
      usuario.password
    )

    if (!passwordCorrecta) {
      return res.status(401).json({
        message: 'Correo o contraseña incorrectos'
      })
    }

    // Generar token JWT
    const token = generarToken(usuario)

    const user = usuarioRespuesta(usuario)

    return res.json({
      message: 'Inicio de sesión correcto',
      token,
      user,
      usuario: user
    })

  } catch (error) {
    console.error('Error al iniciar sesión:', error)

    return res.status(500).json({
      message: 'Error interno del servidor'
    })
  }
}

// ======================================================
// OBTENER USUARIO AUTENTICADO
// GET /api/auth/me
// ======================================================
export async function me(req, res) {
  try {
    const usuarioId = Number(req.usuario?.id)

    if (!usuarioId) {
      return res.status(401).json({
        message: 'Usuario no autenticado'
      })
    }

    const usuario = await prisma.usuario.findUnique({
      where: {
        id: usuarioId
      }
    })

    if (!usuario) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      })
    }

    return res.json({
      ...usuarioRespuesta(usuario)
    })

  } catch (error) {
    console.error('Error al obtener perfil:', error)

    return res.status(500).json({
      message: 'Error interno del servidor'
    })
  }
}

// ======================================================
// ACTUALIZAR PERFIL DEL USUARIO AUTENTICADO
// PUT /api/auth/perfil
// ======================================================
export async function updatePerfil(req, res) {
  try {
    const usuarioId = Number(req.usuario?.id)

    if (!usuarioId) {
      return res.status(401).json({
        message: 'Usuario no autenticado'
      })
    }

    const {
      nombre,
      telefono,
      direccion,
      password_actual,
      password
    } = req.body

    const usuario = await prisma.usuario.findUnique({
      where: {
        id: usuarioId
      }
    })

    if (!usuario) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      })
    }

    const datosActualizar = {}

    // Actualizar nombre
    if (nombre !== undefined) {
      const nombreLimpio = nombre.trim()

      if (!nombreLimpio) {
        return res.status(400).json({
          message: 'El nombre no puede estar vacío'
        })
      }

      datosActualizar.nombre = nombreLimpio
    }

    // Actualizar teléfono
    if (telefono !== undefined) {
      datosActualizar.telefono =
        telefono.trim() || null
    }

    // Actualizar dirección
    if (direccion !== undefined) {
      datosActualizar.direccion =
        direccion.trim() || null
    }

    // Cambiar contraseña solamente si se envió una nueva
    if (password) {
      if (!password_actual) {
        return res.status(400).json({
          message: 'Debes escribir tu contraseña actual'
        })
      }

      const passwordCorrecta = await bcrypt.compare(
        password_actual,
        usuario.password
      )

      if (!passwordCorrecta) {
        return res.status(400).json({
          message: 'La contraseña actual es incorrecta'
        })
      }

      if (password.length < 6) {
        return res.status(400).json({
          message: 'La nueva contraseña debe tener al menos 6 caracteres'
        })
      }

      datosActualizar.password =
        await bcrypt.hash(password, 10)
    }

    // Guardar cambios en PostgreSQL
    const usuarioActualizado =
      await prisma.usuario.update({
        where: {
          id: usuarioId
        },
        data: datosActualizar
      })

    return res.json({
      message: 'Perfil actualizado correctamente',
      user: usuarioRespuesta(usuarioActualizado)
    })

  } catch (error) {
    console.error('Error al actualizar perfil:', error)

    return res.status(500).json({
      message: 'Error interno del servidor'
    })
  }
}