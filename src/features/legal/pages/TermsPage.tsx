import { Link } from "react-router-dom";
import { ArrowLeft, Wallet } from "lucide-react";

const sections = [
  {
    title: "1. Responsable y aceptación",
    content: (
      <>
        <p>
          TAKU-Cash es operado por Daniel Gerardo Aguero Aguero, persona
          física ubicada en Puriscal, San José, Costa Rica. Para consultas,
          puedes escribir a <a href="mailto:takucash2026@gmail.com">takucash2026@gmail.com</a>.
        </p>
        <p>
          Al crear una cuenta, acceder o utilizar TAKU-Cash, aceptas estos
          Términos de Servicio. Si no estás de acuerdo, no debes utilizar el
          servicio.
        </p>
      </>
    ),
  },
  {
    title: "2. Descripción del servicio",
    content: (
      <>
        <p>
          TAKU-Cash es una herramienta digital para organizar finanzas
          personales. Permite registrar manualmente cuentas, ingresos, gastos,
          transferencias y categorías, y consultar reportes sobre esos datos.
        </p>
        <p>
          TAKU-Cash no es un banco, entidad financiera, medio de pago ni
          servicio de asesoría financiera, contable, tributaria o de inversión.
          No conecta cuentas bancarias, no custodia dinero y no ejecuta pagos o
          transferencias financieras por cuenta del usuario.
        </p>
      </>
    ),
  },
  {
    title: "3. Registro y uso de la cuenta",
    content: (
      <>
        <p>
          Debes proporcionar información verdadera y mantener segura tu cuenta
          y tus credenciales. La autenticación puede gestionarse mediante
          Clerk, incluyendo inicio de sesión con Google y recuperación de
          contraseña.
        </p>
        <p>
          Las personas menores de edad pueden utilizar TAKU-Cash con fines de
          aprendizaje y organización. Cuando la ley lo requiera, el uso debe
          contar con la autorización y supervisión de su padre, madre o
          representante legal.
        </p>
      </>
    ),
  },
  {
    title: "4. Información financiera y responsabilidad del usuario",
    content: (
      <>
        <p>
          El usuario es responsable de la exactitud, legalidad y actualización
          de la información que registra. No debes introducir datos de terceros
          sin autorización, información obtenida ilícitamente ni contenido que
          infrinja derechos de otras personas.
        </p>
        <p>
          Los saldos, reportes, cálculos y conversiones de moneda son
          herramientas de referencia y pueden contener errores. Debes verificar
          la información antes de tomar decisiones financieras.
        </p>
      </>
    ),
  },
  {
    title: "5. Planes, prueba y pagos",
    content: (
      <>
        <p>
          TAKU-Cash ofrece una prueba gratuita de siete días. Para las pruebas
          gestionadas por Paddle puede requerirse un método de pago. Las
          pruebas activadas mediante pagos manuales por WhatsApp o Simpe Móvil
          pueden ser habilitadas manualmente por administración sin método de
          pago.
        </p>
        <p>
          Los planes, precios, periodos y funcionalidades disponibles se
          muestran antes de contratar. Paddle procesa los pagos realizados a
          través de su plataforma y sus condiciones también pueden aplicar a
          esas transacciones. Los pagos manuales se confirman individualmente
          por TAKU-Cash.
        </p>
        <p>
          Las cuentas pagadas mediante WhatsApp o SINPE Móvil se activarán en
          un plazo máximo de 24 horas hábiles después de que TAKU-Cash verifique
          el comprobante de pago. El plazo puede extenderse si el comprobante
          es ilegible, incompleto o requiere información adicional.
        </p>
        <p>
          Los pagos procesados mediante Paddle se cobran en dólares
          estadounidenses (USD). Los pagos realizados mediante SINPE Móvil se
          solicitan en colones costarricenses (CRC). El monto en CRC puede
          variar según el tipo de cambio aplicable al momento del pago. Las
          comisiones bancarias o diferencias cambiarias serán responsabilidad
          del usuario, salvo que la legislación aplicable disponga lo
          contrario.
        </p>
      </>
    ),
  },
  {
    title: "6. Cancelación, reembolsos y acceso",
    content: (
      <>
        <p>
          El usuario puede solicitar la cancelación de su suscripción. La
          cancelación normalmente surtirá efecto al finalizar el periodo que ya
          fue pagado, salvo que la ley o el proveedor de pago indiquen otra
          cosa. Un pago manual no se renueva automáticamente.
        </p>
        <p>
          Política provisional de reembolsos: no se ofrecen reembolsos
          proporcionales por tiempo no utilizado. Se pueden evaluar cargos
          duplicados, cobros no autorizados, errores verificables de facturación
          o fallas técnicas prolongadas atribuibles al servicio. Las solicitudes
          deben enviarse a <a href="mailto:takucash2026@gmail.com">takucash2026@gmail.com</a>
          con los datos de la cuenta y el comprobante de pago. Esta política no
          limita derechos irrenunciables establecidos por la legislación
          costarricense y queda pendiente de revisión legal.
        </p>
        <p>
          Al cancelar o finalizar una suscripción, la cuenta puede pasar a
          estado inactivo. Los datos se conservan para permitir una eventual
          reactivación solicitada mediante soporte, por un máximo de 24 meses
          desde la desactivación. La eliminación, acceso o corrección de datos
          se regirá además por el Aviso de Privacidad.
        </p>
        <p>
          El usuario puede solicitar la eliminación permanente de su cuenta y
          de sus datos financieros escribiendo a
          <a href="mailto:takucash2026@gmail.com">takucash2026@gmail.com</a>
          desde el correo asociado a la cuenta. La solicitud será procesada
          manualmente por soporte después de verificar la identidad del
          solicitante. Algunos datos podrán conservarse cuando exista una
          obligación legal, una disputa pendiente o una necesidad legítima de
          seguridad y prevención de fraude.
        </p>
      </>
    ),
  },
  {
    title: "7. Uso prohibido",
    content: (
      <p>
        Está prohibido utilizar el servicio para actividades ilegales, fraude,
        suplantación, acceso no autorizado, interferencia con el servicio,
        extracción automatizada abusiva, distribución de malware o violación de
        derechos de terceros. Podemos suspender o limitar el acceso cuando sea
        necesario para proteger el servicio, a los usuarios o cumplir la ley.
      </p>
    ),
  },
  {
    title: "8. Servicios de terceros",
    content: (
      <p>
        TAKU-Cash utiliza proveedores externos, incluyendo Clerk para
        autenticación, Paddle para pagos y suscripciones, Sentry para
        monitoreo de errores y proveedores de alojamiento y base de datos. El
        uso de sus servicios puede estar sujeto a sus propios términos y
        políticas. WhatsApp y el correo electrónico son canales externos para
        determinadas comunicaciones o pagos manuales.
      </p>
    ),
  },
  {
    title: "9. Propiedad intelectual",
    content: (
      <p>
        La aplicación, su código, marca, diseño, textos y componentes son
        propiedad de Daniel Gerardo Aguero Aguero o se utilizan con autorización.
        Estos términos no transfieren derechos de propiedad intelectual al
        usuario. El usuario conserva sus derechos sobre la información que
        registra, sin perjuicio de las licencias técnicas necesarias para
        prestar el servicio.
      </p>
    ),
  },
  {
    title: "10. Disponibilidad y responsabilidad",
    content: (
      <p>
        Procuramos mantener TAKU-Cash disponible, pero pueden ocurrir
        interrupciones por mantenimiento, fallas técnicas, proveedores externos
        o causas fuera de nuestro control. En la medida permitida por la ley,
        TAKU-Cash no garantiza disponibilidad ininterrumpida ni responde por
        decisiones financieras tomadas únicamente con base en sus reportes.
      </p>
    ),
  },
  {
    title: "11. Cambios y ley aplicable",
    content: (
      <p>
        Podemos actualizar estos términos para reflejar cambios en el servicio,
        la operación o la legislación. Publicaremos la versión vigente en esta
        página. Estos términos se interpretan conforme a las leyes de Costa
        Rica, sin perjuicio de los derechos que correspondan al consumidor.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-duo-green transition hover:text-duo-green-hover"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver a TAKU-Cash
        </Link>

        <article className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200">
          <header className="border-b border-zinc-200 px-6 py-10 sm:px-12">
            <div className="flex items-center gap-2 text-duo-green">
              <Wallet className="h-6 w-6" aria-hidden="true" />
              <span className="font-extrabold">TAKU-Cash</span>
            </div>
            <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
              Términos de Servicio
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-zinc-600">
              Última actualización: 19 de agosto de 2026. Este documento es un
              borrador operativo para el MVP y debe ser revisado por un abogado
              antes de su publicación definitiva.
            </p>
          </header>

          <div className="space-y-8 px-6 py-10 text-sm leading-7 text-zinc-700 sm:px-12">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-lg font-bold leading-7 text-zinc-900">
                  {section.title}
                </h2>
                <div className="mt-2 space-y-3">{section.content}</div>
              </section>
            ))}
          </div>
        </article>
      </div>
    </main>
  );
}
