import { useState } from 'react'

const INFO = {
  nosotros: {
    titulo: 'Sobre nosotros',
    contenido: (
      <>
        <p>
          <strong>TechMarket</strong> es una tienda en línea especializada en
          productos tecnológicos, accesorios y equipos para diferentes
          necesidades.
        </p>
        <p>
          Nuestro objetivo es ofrecer una experiencia de compra sencilla,
          rápida y segura, permitiendo a nuestros clientes explorar productos,
          comparar opciones, administrar su carrito y realizar pedidos desde
          una sola plataforma.
        </p>
      </>
    )
  },

  terminos: {
    titulo: 'Términos y condiciones',
    contenido: (
      <>
        <p>
          Al utilizar TechMarket, el usuario acepta hacer un uso responsable
          de la plataforma y proporcionar información correcta al momento de
          registrarse o realizar un pedido.
        </p>
        <p>
          Los precios, disponibilidad y existencias de los productos pueden
          cambiar según el inventario disponible. TechMarket se reserva el
          derecho de actualizar la información de sus productos y servicios.
        </p>
      </>
    )
  },

  privacidad: {
    titulo: 'Política de privacidad',
    contenido: (
      <>
        <p>
          TechMarket utiliza los datos proporcionados por los usuarios
          únicamente para gestionar cuentas, pedidos, entregas y mejorar la
          experiencia dentro de la plataforma.
        </p>
        <p>
          La información personal no será utilizada para fines distintos a los
          relacionados con el funcionamiento del servicio.
        </p>
      </>
    )
  },

  devoluciones: {
    titulo: 'Política de devoluciones',
    contenido: (
      <>
        <p>
          Los clientes podrán solicitar la revisión de una devolución cuando
          un producto presente inconvenientes, daños o no corresponda con el
          producto solicitado.
        </p>
        <p>
          Para realizar una solicitud será necesario conservar el producto y
          presentar la información correspondiente al pedido. Cada solicitud
          estará sujeta a revisión.
        </p>
      </>
    )
  },

  preguntas: {
    titulo: 'Preguntas frecuentes',
    contenido: (
      <>
        <div className="info-question">
          <strong>¿Cómo puedo realizar una compra?</strong>
          <p>
            Selecciona un producto, agrégalo al carrito y continúa con el
            proceso para realizar tu pedido.
          </p>
        </div>

        <div className="info-question">
          <strong>¿Necesito una cuenta?</strong>
          <p>
            Algunas funciones de TechMarket requieren iniciar sesión para
            identificar al cliente y administrar sus pedidos.
          </p>
        </div>

        <div className="info-question">
          <strong>¿Cómo puedo consultar mis pedidos?</strong>
          <p>
            Puedes ingresar a la sección Mis pedidos dentro de tu cuenta para
            consultar los pedidos realizados y su estado.
          </p>
        </div>

        <div className="info-question">
          <strong>¿Qué pasa si un producto no tiene existencias?</strong>
          <p>
            Si el producto no tiene stock disponible, no podrá agregarse al
            carrito hasta que existan nuevas unidades.
          </p>
        </div>
      </>
    )
  }
}

function Footer() {
  const [infoActiva, setInfoActiva] = useState(null)

  const abrirInfo = (tipo) => {
    setInfoActiva(INFO[tipo])
  }

  const cerrarInfo = () => {
    setInfoActiva(null)
  }

  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">

            <div>
              <div className="footer__logo">
                Tech <span>Market</span>
              </div>

              <p>Productos Tecnológicos</p>

              <div className="footer__socials">
                <a href="#" className="footer__social" aria-label="Facebook">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </a>

                <a href="#" className="footer__social" aria-label="Instagram">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>

                <a href="#" className="footer__social" aria-label="Twitter">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.6610.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* INFORMACIÓN */}
            <div className="footer__col">
              <h4>Información</h4>

              <ul>
                <li>
                  <button
                    type="button"
                    className="footer-info-link"
                    onClick={() => abrirInfo('nosotros')}
                  >
                    Sobre nosotros
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    className="footer-info-link"
                    onClick={() => abrirInfo('terminos')}
                  >
                    Términos y condiciones
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    className="footer-info-link"
                    onClick={() => abrirInfo('privacidad')}
                  >
                    Política de privacidad
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    className="footer-info-link"
                    onClick={() => abrirInfo('devoluciones')}
                  >
                    Política de devoluciones
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    className="footer-info-link"
                    onClick={() => abrirInfo('preguntas')}
                  >
                    Preguntas frecuentes
                  </button>
                </li>
              </ul>
            </div>

            {/* SERVICIO AL CLIENTE - SIN CAMBIOS */}
            <div className="footer__col">
              <h4>Servicio al cliente</h4>

              <ul>
                <li><a href="#">Rastrear pedido</a></li>
                <li><a href="#">Envíos y entregas</a></li>
                <li><a href="#">Métodos de pago</a></li>
                <li><a href="#">Garantías</a></li>
                <li><a href="#">Contacto</a></li>
              </ul>
            </div>

            {/* CONTACTO - SIN CAMBIOS */}
            <div className="footer__col">
              <h4>Contacto</h4>

              <ul className="footer__contact">
                <li>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <circle cx="12" cy="11" r="3" />
                  </svg>

                  Av. Principal, Santa Ana, El Salvador
                </li>

                <li>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>

                  +503 2222-3333
                </li>

                <li>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>

                  info@techmarket.com
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="container" style={{ padding: 0 }}>
              <p>© 2026 TechMarket. Todos los derechos reservados.</p>

              <div className="footer__payments">
                <span>Métodos de pago:</span>
                <div className="payment-badge">VISA</div>
                <div className="payment-badge">MC</div>
                <div className="payment-badge">AMEX</div>
                <div className="payment-badge">PayPal</div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* MODAL DE INFORMACIÓN */}
      {infoActiva && (
        <div
          className="info-modal-overlay"
          onClick={cerrarInfo}
        >
          <div
            className="info-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="info-modal__close"
              onClick={cerrarInfo}
              aria-label="Cerrar"
            >
              ×
            </button>

            <div className="info-modal__icon">
              i
            </div>

            <h2>{infoActiva.titulo}</h2>

            <div className="info-modal__content">
              {infoActiva.contenido}
            </div>

            <button
              type="button"
              className="info-modal__button"
              onClick={cerrarInfo}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Footer