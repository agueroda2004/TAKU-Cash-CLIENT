import {
  TrendingDown,
  TrendingUp,
  PiggyBank,
  Target,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

export const BRAND = "TAKU-Cash";

export const NAV_LINKS = [
  { label: "Funciones", href: "#features" },
  { label: "Planes", href: "#plans" },
  { label: "Contacto", href: "#contact" },
] as const;

export const NAV_BUTTONS = {
  dashboard: "Ir al Dashboard",
  signIn: "Iniciar sesión",
  signUp: "Registrarse",
  signOut: "Cerrar sesión",
  menuAriaLabel: "Abrir menú",
} as const;

export const HERO = {
  titleBefore: "Toma el control de",
  titleHighlight: "tus finanzas",
  titleAfter: "hoy",
  subtitle:
    "Organiza tus ingresos y gastos, visualiza reportes claros y entiende mejor tus finanzas. Todo en un solo lugar, simple y seguro.",
  loadingText: "Cargando…",
  userCountSuffix: "usuarios activos",
  primaryButton: "Ver funcionalidades",
  secondaryButton: "Ver planes",
} as const;

export const FEATURES_SECTION = {
  titleBefore: "Todo lo que necesitas para",
  titleHighlight: "administrar tu dinero",
  subtitle:
    "Desde el control de gastos hasta reportes avanzados, TAKU-Cash te da las herramientas para tomar mejores decisiones financieras.",
} as const;

export const FEATURES = [
  {
    icon: TrendingDown,
    title: "Reduce gastos innecesarios",
    desc: "Identifica patrones de gasto y recorta lo que no suma.",
  },
  {
    icon: TrendingUp,
    title: "Entiende tus hábitos",
    desc: "Visualiza tus movimientos y detecta cómo distribuyes tu dinero.",
  },
  {
    icon: PiggyBank,
    title: "Control total de cuentas",
    desc: "Administra múltiples cuentas en CRC y USD en un solo lugar.",
  },
  {
    icon: Target,
    title: "Categorías personalizables",
    desc: "Organiza tus movimientos con categorías y subcategorías propias.",
  },
  {
    icon: BarChart3,
    title: "Reportes claros",
    desc: "Gráficos interactivos que muestran exactamente a dónde va tu dinero.",
  },
  {
    icon: ShieldCheck,
    title: "Cuenta protegida",
    desc: "Autenticación segura mediante Clerk para proteger el acceso a tu cuenta.",
  },
] as const;

export const METRICS = [
  { label: "Monedas disponibles", value: "2" },
  { label: "Tipos de cuenta", value: "4" },
  { label: "Tipos de movimiento", value: "2" },
  { label: "Días de prueba", value: "7" },
] as const;

export const SCREENSHOTS_SECTION = {
  titleBefore: "Así se ve",
  titleHighlight: "TAKU-Cash",
  subtitle:
    "Una interfaz limpia que funciona igual de bien en tu computadora que en tu celular.",
  desktopCaption: "Vista de escritorio con reportes y gráficos interactivos",
  mobileCaption: "Diseño responsive para llevar tus finanzas en el bolsillo",
} as const;

export const PRICING_SECTION = {
  titleBefore: "Planes",
  titleHighlight: "simples",
  titleAfter: "para ti",
  subtitle:
    "Elige el plan que mejor se adapte a tus necesidades. Sin sorpresas, cancela cuando quieras.",
  button: "Comenzar ahora",
} as const;

export type Plan = {
  name: string;
  price: string;
  period: string;
  planType: "mensual" | "semestral" | "anual";
  features: string[];
  highlighted: boolean;
  badge?: string;
};

export const PLANS: readonly Plan[] = [
  {
    name: "Mensual",
    price: "$6",
    period: "/mes",
    planType: "mensual",
    features: [
      "Todas las funcionalidades",
      "Hasta 5 cuentas",
      "Reportes ilimitados",
      "Soporte por correo",
    ],
    highlighted: false,
  },
  {
    name: "Semestral",
    price: "$32",
    period: "/6 meses",
    planType: "semestral",
    features: [
      "Todas las funcionalidades",
      "Hasta 10 cuentas",
      "Reportes ilimitados",
      "Soporte prioritario",
    ],
    highlighted: true,
  },
  {
    name: "Anual",
    price: "$60",
    period: "/año",
    planType: "anual",
    features: [
      "Todo lo del plan semestral",
      "Soporte premium",
    ],
    highlighted: false,
    badge: "2 meses gratis",
  },
];

export const CONTACT_SECTION = {
  title: "Contáctanos",
  subtitle:
    "¿Preguntas, sugerencias o quieres saber más? Escríbenos y te responderemos a la brevedad.",
  emailLabel: "Correo",
  email: "soporte@takucash.com",
  locationLabel: "Ubicación",
  location: "Puriscal, San José, Costa Rica",
  formNamePlaceholder: "Tu nombre",
  formEmailPlaceholder: "tu@correo.com",
  formMessagePlaceholder: "Escribe tu mensaje…",
  formNameLabel: "Nombre",
  formEmailLabel: "Correo",
  formMessageLabel: "Mensaje",
  buttonSend: "Enviar mensaje",
  buttonSent: "¡Mensaje enviado!",
} as const;

export const FOOTER_LINKS = [
  { label: "Funciones", href: "#features" },
  { label: "Planes", href: "#plans" },
  { label: "Contacto", href: "#contact" },
  { label: "Términos", href: "/terms" },
  { label: "Privacidad", href: "/privacy" },
] as const;

export const FOOTER_COPYRIGHT = "Todos los derechos reservados.";
