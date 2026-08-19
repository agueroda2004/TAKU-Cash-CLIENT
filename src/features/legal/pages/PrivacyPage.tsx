import { Link } from "react-router-dom";
import { ArrowLeft, Wallet } from "lucide-react";

const sections = [
  {
    title: "1. Responsable del tratamiento",
    content: (
      <p>
        El responsable de TAKU-Cash es Daniel Gerardo Aguero Aguero, persona
        física ubicada en Puriscal, San José, Costa Rica. Para consultas sobre
        privacidad puedes escribir a{" "}
        <a href="mailto:takucash2026@gmail.com">takucash2026@gmail.com</a>.
      </p>
    ),
  },
  {
    title: "2. Datos que recopilamos",
    content: (
      <>
        <p>Podemos tratar las siguientes categorías de información:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Nombre, correo electrónico e identificadores de cuenta.</li>
          <li>Estado, rol, fechas de creación y actividad de la cuenta.</li>
          <li>Datos de suscripción, como identificadores de Paddle, plan, estado y fechas.</li>
          <li>
            Datos financieros que el usuario registra manualmente: cuentas,
            saldos, monedas, ingresos, gastos, transferencias, categorías,
            descripciones y fechas.
          </li>
          <li>
            Datos técnicos necesarios para autenticación, seguridad,
            diagnóstico de errores y analítica del sitio.
          </li>
        </ul>
        <p>
          TAKU-Cash no solicita ni almacena números completos de tarjetas,
          credenciales bancarias ni conexiones automáticas con bancos.
        </p>
      </>
    ),
  },
  {
    title: "3. Cómo obtenemos los datos",
    content: (
      <p>
        Recibimos información directamente del usuario cuando crea su cuenta o
        registra sus finanzas. Clerk puede proporcionar datos de autenticación
        y perfil, incluyendo información de Google cuando se utiliza OAuth.
        Paddle puede proporcionar información relacionada con pagos y
        suscripciones. También podemos recibir datos técnicos de los servicios
        de alojamiento, monitoreo y analítica.
      </p>
    ),
  },
  {
    title: "4. Para qué utilizamos la información",
    content: (
      <ul className="list-disc space-y-1 pl-5">
        <li>Crear, autenticar y administrar la cuenta.</li>
        <li>Guardar y mostrar los registros financieros del usuario.</li>
        <li>Calcular saldos, reportes, conversiones y tendencias.</li>
        <li>Gestionar pruebas, pagos y suscripciones.</li>
        <li>Proteger el servicio, prevenir abusos y resolver incidentes.</li>
        <li>Detectar y corregir errores técnicos.</li>
        <li>Medir las visitas y las rutas utilizadas en el sitio.</li>
        <li>Atender solicitudes de soporte y cumplir obligaciones legales.</li>
      </ul>
    ),
  },
  {
    title: "5. Analítica y tecnologías similares",
    content: (
      <p>
        Utilizamos Vercel Analytics únicamente para conocer cuántas personas
        visitan el sitio y qué rutas utilizan, con el objetivo de entender y
        mejorar su funcionamiento. No utilizamos esta analítica para publicidad
        personalizada ni vendemos información personal. Clerk, Paddle y otros
        proveedores pueden utilizar sus propias cookies o tecnologías similares
        para prestar sus servicios; sus prácticas se rigen también por sus
        respectivos avisos de privacidad.
      </p>
    ),
  },
  {
    title: "6. Proveedores y transferencias",
    content: (
      <p>
        Para operar TAKU-Cash utilizamos Clerk para autenticación, Google para
        OAuth cuando el usuario lo elige, Paddle para pagos, Sentry para
        monitoreo de errores, Vercel para el cliente web, Railway para el
        servidor y TiDB para la base de datos. Estos proveedores pueden tratar
        información desde otros países conforme a sus propias políticas,
        contratos y medidas de seguridad. No afirmamos que todos los datos se
        almacenen exclusivamente en Costa Rica.
      </p>
    ),
  },
  {
    title: "7. Seguridad",
    content: (
      <p>
        Aplicamos controles de autenticación, autorización y protección de
        infraestructura acordes con el funcionamiento del servicio. Clerk
        gestiona la autenticación de credenciales y TAKU-Cash no guarda las
        contraseñas en su base de datos. Ningún sistema conectado a Internet
        puede garantizar seguridad absoluta.
      </p>
    ),
  },
  {
    title: "8. Conservación y eliminación",
    content: (
      <>
        <p>
          Cuando una cuenta se desactiva, conservamos los datos asociados por un
          máximo de 24 meses desde la fecha de desactivación para permitir
          soporte, reactivación, seguridad y gestión de obligaciones pendientes.
          Transcurrido ese plazo, los datos serán eliminados o anonimizados,
          salvo las excepciones indicadas a continuación.
        </p>
        <p>
          El usuario puede solicitar la eliminación anticipada escribiendo a{" "}
          <a href="mailto:takucash2026@gmail.com">takucash2026@gmail.com</a>{" "}
          desde el correo asociado a la cuenta. Soporte verificará la identidad
          y procesará manualmente la solicitud. Eliminaremos los datos bajo
          nuestro control y solicitaremos la eliminación a Clerk y Paddle cuando
          corresponda. Paddle u otros proveedores pueden conservar determinados
          registros por obligaciones legales, fiscales, antifraude, seguridad o
          disputas pendientes.
        </p>
      </>
    ),
  },
  {
    title: "9. Derechos y solicitudes",
    content: (
      <>
        <p>
          El usuario puede solicitar información sobre los datos tratados,
          acceso, corrección, eliminación o aclaraciones sobre su tratamiento,
          sujeto a las excepciones legales aplicables. Las solicitudes deben
          enviarse a <a href="mailto:takucash2026@gmail.com">takucash2026@gmail.com</a>
          e incluir suficiente información para verificar la identidad. También
          puede presentar una reclamación ante la autoridad competente de Costa
          Rica cuando considere que sus derechos han sido vulnerados.
        </p>
        <p>
          Procuraremos confirmar la recepción y atender las solicitudes de
          privacidad en un plazo estimado de 5 días hábiles, sujeto a la
          verificación de identidad, la complejidad de la solicitud y los
          plazos establecidos por la legislación aplicable.
        </p>
        <p>
          El tratamiento de datos personales se realiza tomando en
          consideración los principios de la Ley de Protección de la Persona
          frente al Tratamiento de sus Datos Personales (Ley 8968) y demás
          normativa costarricense aplicable.
        </p>
      </>
    ),
  },
  {
    title: "10. Menores de edad",
    content: (
      <p>
        TAKU-Cash está disponible para personas de 13 años o más con fines de
        aprendizaje y organización financiera. Las personas menores de edad
        deben contar con la autorización y supervisión de su padre, madre o
        representante legal cuando la legislación aplicable lo requiera. No
        solicitamos deliberadamente más información de la necesaria para
        prestar el servicio.
      </p>
    ),
  },
  {
    title: "11. Comunicaciones",
    content: (
      <p>
        Utilizaremos el correo asociado a la cuenta para autenticación,
        recuperación de acceso, soporte, pagos, seguridad y asuntos legales.
        No enviaremos publicidad ni venderemos las direcciones de correo para
        fines de marketing.
      </p>
    ),
  },
  {
    title: "12. Cambios a este aviso",
    content: (
      <p>
        Podemos actualizar este Aviso de Privacidad para reflejar cambios en el
        servicio, proveedores u obligaciones legales. La versión vigente se
        publicará en esta página e indicará su fecha de actualización.
      </p>
    ),
  },
];

export default function PrivacyPage() {
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
              Aviso de Privacidad
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
