import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Insertando datos de prueba de TechMarket...')

  const categorias = [
    {
      nombre: 'Computadoras',
      descripcion: 'Laptops y computadoras para trabajo, estudio y entretenimiento'
    },
    {
      nombre: 'Celulares',
      descripcion: 'Smartphones y dispositivos móviles'
    },
    {
      nombre: 'Accesorios',
      descripcion: 'Accesorios y periféricos tecnológicos'
    },
    {
      nombre: 'Audio',
      descripcion: 'Audífonos, bocinas y dispositivos de audio'
    },
    {
      nombre: 'Gaming',
      descripcion: 'Productos y accesorios para videojuegos'
    }
  ]

  for (const categoria of categorias) {
    await prisma.categoria.upsert({
      where: {
        nombre: categoria.nombre
      },
      update: {},
      create: categoria
    })
  }

  const computadoras = await prisma.categoria.findUnique({
    where: { nombre: 'Computadoras' }
  })

  const celulares = await prisma.categoria.findUnique({
    where: { nombre: 'Celulares' }
  })

  const accesorios = await prisma.categoria.findUnique({
    where: { nombre: 'Accesorios' }
  })

  const audio = await prisma.categoria.findUnique({
    where: { nombre: 'Audio' }
  })

  const gaming = await prisma.categoria.findUnique({
    where: { nombre: 'Gaming' }
  })

  const productos = [
    {
      nombre: 'Laptop Lenovo IdeaPad',
      descripcion: 'Laptop para estudio y trabajo con 16 GB de RAM y almacenamiento SSD de 512 GB.',
      marca: 'Lenovo',
      precio_venta: 699.99,
      precio_anterior: 749.99,
      stock: 10,
      badge: 'Oferta',
      categoria_id: computadoras.id
    },
    {
      nombre: 'Samsung Galaxy A55',
      descripcion: 'Smartphone con pantalla AMOLED, cámara de alta resolución y amplio almacenamiento.',
      marca: 'Samsung',
      precio_venta: 399.99,
      precio_anterior: 429.99,
      stock: 15,
      badge: 'Popular',
      categoria_id: celulares.id
    },
    {
      nombre: 'Mouse Logitech G203',
      descripcion: 'Mouse gaming con sensor de alta precisión e iluminación RGB.',
      marca: 'Logitech',
      precio_venta: 29.99,
      stock: 25,
      categoria_id: accesorios.id
    },
    {
      nombre: 'Audífonos JBL Tune',
      descripcion: 'Audífonos inalámbricos Bluetooth con sonido JBL y batería de larga duración.',
      marca: 'JBL',
      precio_venta: 59.99,
      precio_anterior: 69.99,
      stock: 20,
      badge: 'Oferta',
      categoria_id: audio.id
    },
    {
      nombre: 'Teclado Redragon Kumara',
      descripcion: 'Teclado mecánico compacto para gaming con iluminación RGB.',
      marca: 'Redragon',
      precio_venta: 49.99,
      stock: 18,
      badge: 'Gaming',
      categoria_id: gaming.id
    }
  ]

  const existentes = await prisma.producto.count()

  if (existentes === 0) {
    await prisma.producto.createMany({
      data: productos
    })

    console.log('5 productos agregados.')
  } else {
    console.log('Ya existen productos. No se insertaron duplicados.')
  }

  console.log('Categorías y productos listos.')
}

main()
  .catch((error) => {
    console.error('Error al insertar datos:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
  