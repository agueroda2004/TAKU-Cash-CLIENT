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
  menuAriaLabel: "Abrir menú",
} as const;

export const HERO = {
  titleBefore: "Toma el control de",
  titleHighlight: "tus finanzas",
  titleAfter: "hoy",
  subtitle:
    "Organiza tus ingresos y gastos, visualiza reportes claros y alcanza tus metas de ahorro. Todo en un solo lugar, simple y seguro.",
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
    title: "Aumenta tus ahorros",
    desc: "Visualiza tu progreso y mantén el enfoque en tus metas.",
  },
  {
    icon: PiggyBank,
    title: "Control total de cuentas",
    desc: "Administra múltiples cuentas en CRC y USD en un solo lugar.",
  },
  {
    icon: Target,
    title: "Metas inteligentes",
    desc: "Establece metas de ahorro y dale seguimiento a tu progreso.",
  },
  {
    icon: BarChart3,
    title: "Reportes claros",
    desc: "Gráficos interactivos que muestran exactamente a dónde va tu dinero.",
  },
  {
    icon: ShieldCheck,
    title: "Tus datos seguros",
    desc: "Autenticación con Clerk y cifrado de extremo a extremo.",
  },
] as const;

export const METRICS = [
  { label: "Reducción de gastos hormiga", value: "35%" },
  { label: "Aumento en ahorro mensual", value: "+42%" },
  { label: "Usuarios que cumplen sus metas", value: "78%" },
  { label: "Cuentas activas por usuario", value: "3.2" },
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
      "Exportación de datos",
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
      "Metas de ahorro avanzadas",
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
  location: "San José, Costa Rica",
  formNamePlaceholder: "Tu nombre",
  formEmailPlaceholder: "tu@correo.com",
  formMessagePlaceholder: "Escribe tu mensaje…",
  formNameLabel: "Nombre",
  formEmailLabel: "Correo",
  formMessageLabel: "Mensaje",
  buttonSend: "Enviar mensaje",
  buttonSent: "¡Mensaje enviado!",
} as const;

export const REVIEWS_SECTION = {
  titleBefore: "Lo que dicen",
  titleHighlight: "nuestros usuarios",
  subtitle:
    "Personas como tú ya están transformando sus finanzas con TAKU-Cash.",
} as const;

export const REVIEWS = [
  {
    name: "María Fernández",
    email: "mariaf@ejemplo.com",
    rating: 5,
    message:
      "Desde que uso TAKU-Cash logré ahorrar más del 30% de mi salario mensual. La interfaz es súper intuitiva y los reportes me ayudaron a identificar gastos que ni sabía que tenía.",
  },
  {
    name: "Carlos Mendoza",
    email: "carlos.m@ejemplo.com",
    rating: 5,
    message:
      "Finalmente una app que entiende las finanzas en Costa Rica. Poder llevar cuentas en CRC y USD sin complicaciones me cambió la vida. La recomiendo a todos mis colegas.",
  },
  {
    name: "Andrea Rojas",
    email: "andrea.r@ejemplo.com",
    rating: 4,
    message:
      "Me encanta la claridad de los gráficos y lo fácil que es categorizar gastos. Lo único que extraño es poder exportar a Excel, pero sé que ya viene en camino.",
  },
] as const;

export const SUCCESS_STORY = {
  name: "Roberto Solís",
  title: "Emprendedor y usuario de TAKU-Cash",
  quote:
    "Antes vivía al día, sin saber a dónde se iba mi dinero. Con TAKU-Cash descubrí que gastaba casi el 40% de mis ingresos en cosas innecesarias. En solo 3 meses reduje mis deudas, armé un fondo de emergencia y por primera vez en años pude invertir en mi negocio. No es solo una app, es un antes y después en mi vida financiera.",
  highlight: "40% de gastos innecesarios identificados",
  result1: "Reduje mis deudas en 6 meses",
  result2: "Ahorro equivalente a 3 meses de gastos",
} as const;

export const FOOTER_LINKS = [
  { label: "Funciones", href: "#features" },
  { label: "Planes", href: "#plans" },
  { label: "Contacto", href: "#contact" },
  { label: "Términos", href: "#" },
  { label: "Privacidad", href: "#" },
] as const;

export const FOOTER_COPYRIGHT = "Todos los derechos reservados.";
