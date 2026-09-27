import { useState, useEffect } from 'react'

const slides = [
  {
    bg: '#FF6B35',
    title: 'Tecnología para todos',
    subtitle: 'Encuentra productos tecnológicos al mejor precio',
    cta: 'Ver productos',
    img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=900&q=80'
  },
  {
    bg: '#1a1a2e',
    title: 'Encuentra las mejores marcas',
    subtitle: 'Equipos y accesorios para estudiar, trabajar y disfrutar',
    cta: 'Explorar',
    img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&q=80'
  },
  {
    bg: '#1565C0',
    title: 'Todo lo que necesitas en tecnología',
    subtitle: 'Descubre nuestros productos y encuentra el equipo ideal para ti',
    cta: 'Comprar ahora',
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&q=80'
  }
]

function Hero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const prev = () => {
    setCurrent(prev =>
      (prev - 1 + slides.length) % slides.length
    )
  }

  const next = () => {
    setCurrent(prev =>
      (prev + 1) % slides.length
    )
  }

  return (
    <section className="hero">

      {slides.map((slide, i) => (
        <div
          key={i}
          className={`hero__slide ${i === current ? 'active' : ''}`}
          style={{ background: slide.bg }}
        >
          <div
            className="container"
            style={{
              position: 'relative',
              zIndex: 2,
              width: '100%',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <div className="hero__content">
              <h2>{slide.title}</h2>
              <p>{slide.subtitle}</p>

              <a href="#productos" className="hero__cta">
                {slide.cta}
              </a>
            </div>
          </div>

          <img
            className="hero__img"
            src={slide.img}
            alt={slide.title}
          />

          <div
            className="hero__img-overlay"
            style={{ color: slide.bg }}
          />
        </div>
      ))}

      <button
        className="hero__nav-btn hero__nav-btn--prev"
        onClick={prev}
        aria-label="Anterior"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        className="hero__nav-btn hero__nav-btn--next"
        onClick={next}
        aria-label="Siguiente"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <div className="hero__dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero__dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Ir a promoción ${i + 1}`}
          />
        ))}
      </div>

    </section>
  )
}

export default Hero