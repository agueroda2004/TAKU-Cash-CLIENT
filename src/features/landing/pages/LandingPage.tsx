import { useState } from "react";
import { useAuth } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { request } from "../../../lib/api";
import { getPaddle } from "../../../lib/paddle";
import {
  Wallet,
  CheckCircle,
  Menu,
  X,
  ArrowRight,
  Mail,
  LogOut,
} from "lucide-react";
import { IMAGES } from "../../../constants/data";
import {
  BRAND,
  NAV_LINKS,
  NAV_BUTTONS,
  HERO,
  FEATURES_SECTION,
  FEATURES,
  METRICS,
  SCREENSHOTS_SECTION,
  PRICING_SECTION,
  PLANS,
  CONTACT_SECTION,
  FINAL_CTA,
  FOOTER_LINKS,
  FOOTER_COPYRIGHT,
} from "../data/landingData";

const WHATSAPP_LINK = CONTACT_SECTION.whatsappLink;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.24-1.37a9.87 9.87 0 0 0 4.8 1.22h.01c5.45 0 9.89-4.44 9.89-9.9a9.9 9.9 0 0 0-9.9-9.9Zm0 18.13a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.1.81.83-3.03-.2-.31a8.2 8.2 0 0 1-1.26-4.4c0-4.54 3.7-8.23 8.24-8.23 4.53 0 8.22 3.69 8.22 8.23 0 4.54-3.69 8.23-8.23 8.23Zm4.5-6.16c-.25-.12-1.46-.72-1.68-.81-.22-.08-.39-.12-.55.13-.17.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.12-1.04-.38-1.99-1.23-.73-.66-1.23-1.47-1.37-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.55-1.34-.76-1.84-.2-.48-.4-.42-.55-.42h-.47c-.16 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.6.19 1.14.16 1.57.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <a href="#" className="flex items-center gap-2">
          <Wallet className="h-7 w-7 text-duo-green" />
          <span className="text-xl font-extrabold tracking-tight text-duo-green">
            {BRAND}
          </span>
        </a>

        <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-zinc-600 transition hover:text-duo-green"
            >
              {l.label}
            </a>
          ))}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-zinc-600 md:hidden"
          aria-label={NAV_BUTTONS.menuAriaLabel}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-zinc-200 bg-white md:hidden">
          <div className="space-y-1 px-4 py-4">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  const { data, isLoading } = useQuery({
    queryKey: ["user-count"],
    queryFn: () => request<{ count: number }>("/public/user-count"),
    refetchInterval: 30_000,
  });
  const { isSignedIn, isLoaded, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-duo-green-light/40 via-white to-white" />
      <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
            {HERO.titleBefore}{" "}
            <span className="text-duo-green">{HERO.titleHighlight}</span>{" "}
            {HERO.titleAfter}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-zinc-600 lg:text-xl">
            {HERO.subtitle}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <span className="flex items-center gap-2 rounded-full bg-duo-green-light px-5 py-2 text-sm font-semibold text-duo-green">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-duo-green opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-duo-green" />
            </span>
            {isLoading
              ? HERO.loadingText
              : `${data?.count ?? 0} ${HERO.userCountSuffix}`}
          </span>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {isLoaded && isSignedIn ? (
            <>
              <button
                onClick={() => navigate("/app")}
                className="rounded-xl bg-duo-green px-7 py-3 text-base font-bold text-white shadow-md transition hover:bg-duo-green-hover"
              >
                {NAV_BUTTONS.dashboard}
              </button>
              <button
                onClick={() => signOut()}
                aria-label={NAV_BUTTONS.signOut}
                className="flex items-center gap-2 rounded-xl border-2 border-zinc-300 px-7 py-3 text-base font-bold text-zinc-700 transition hover:border-duo-red hover:bg-red-50 hover:text-duo-red"
              >
                <LogOut className="h-5 w-5" aria-hidden="true" />
                {NAV_BUTTONS.signOut}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="rounded-xl border-2 border-zinc-300 px-7 py-3 text-base font-bold text-zinc-700 transition hover:border-duo-green hover:text-duo-green"
              >
                {NAV_BUTTONS.signIn}
              </button>
              <button
                onClick={() => navigate("/register")}
                className="rounded-xl bg-duo-green px-7 py-3 text-base font-bold text-white shadow-md transition hover:bg-duo-green-hover"
              >
                {NAV_BUTTONS.signUp}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-zinc-900 sm:text-4xl">
            {FEATURES_SECTION.titleBefore}{" "}
            <span className="text-duo-green">
              {FEATURES_SECTION.titleHighlight}
            </span>
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            {FEATURES_SECTION.subtitle}
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-zinc-200 p-6 transition hover:border-duo-green/30 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-duo-green-light text-duo-green">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-zinc-900">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Metrics() {
  return (
    <section className="bg-duo-green py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((m) => (
            <div key={m.label} className="text-center">
              <p className="text-4xl font-extrabold text-white">{m.value}</p>
              <p className="mt-2 text-sm font-medium text-white/80">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Screenshots() {
  return (
    <section className="bg-zinc-50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-zinc-900 sm:text-4xl">
            {SCREENSHOTS_SECTION.titleBefore}{" "}
            <span className="text-duo-green">
              {SCREENSHOTS_SECTION.titleHighlight}
            </span>
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            {SCREENSHOTS_SECTION.subtitle}
          </p>
        </div>

        <div className="mt-16 mx-auto max-w-4xl space-y-12">
          <div>
            <img
              src={IMAGES[0].value}
              alt={IMAGES[0].label}
              className="w-full object-contain"
            />
            <p className="mt-3 text-center text-sm text-zinc-500">
              {SCREENSHOTS_SECTION.desktopCaption}
            </p>
          </div>
          <div className="mx-auto max-w-xs">
            <img
              src={IMAGES[1].value}
              alt={IMAGES[1].label}
              className="w-full object-contain"
            />
            <p className="mt-4 text-center text-sm text-zinc-500">
              {SCREENSHOTS_SECTION.mobileCaption}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded, getToken } = useAuth();

  async function handleSelect(planType: string) {
    console.log("[Pricing] handleSelect planType:", planType);
    if (!planType || !["mensual", "semestral", "anual"].includes(planType)) {
      console.error("[Pricing] Invalid planType:", planType);
      return;
    }
    if (!isLoaded) return;
    if (!isSignedIn) {
      navigate(`/register?plan=${planType}`);
      return;
    }
    try {
      const token = await getToken();
      const { checkoutId } = await request<{ checkoutId: string }>(
        "/subscriptions/checkout",
        {
          method: "POST",
          body: {
            plan: planType,
            successUrl: `${window.location.origin}/app/welcome`,
          },
          token: token ?? undefined,
        },
      );
      const paddle = await getPaddle();
      paddle?.Checkout.open({ transactionId: checkoutId });
    } catch (err) {
      console.error("[Pricing] checkout error:", err);
    }
  }

  return (
    <section id="plans" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-zinc-900 sm:text-4xl">
            {PRICING_SECTION.titleBefore}{" "}
            <span className="text-duo-green">
              {PRICING_SECTION.titleHighlight}
            </span>{" "}
            {PRICING_SECTION.titleAfter}
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            {PRICING_SECTION.subtitle}
          </p>
        </div>

        <div className="mt-16 mx-auto grid max-w-5xl gap-8 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border-2 transition ${
                plan.highlighted
                  ? "border-duo-green shadow-xl scale-105 py-10 px-8"
                  : "border-zinc-200 shadow-sm hover:shadow-md p-8"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-duo-green px-4 py-1 text-xs font-bold uppercase tracking-wide text-white whitespace-nowrap">
                  {plan.badge}
                </span>
              )}

              <h3 className="text-lg font-bold text-zinc-900">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-zinc-900">
                  {plan.price}
                </span>
                <span className="text-sm text-zinc-500">{plan.period}</span>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-zinc-700">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-duo-green" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelect(plan.planType)}
                className={`mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition ${
                  plan.highlighted
                    ? "bg-duo-green text-white shadow-md hover:bg-duo-green-hover"
                    : "border-2 border-zinc-300 text-zinc-700 hover:border-duo-green hover:text-duo-green"
                }`}
              >
                {PRICING_SECTION.button}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="bg-zinc-50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-zinc-900 sm:text-4xl">
            <span className="text-duo-green">{CONTACT_SECTION.title}</span>
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            {CONTACT_SECTION.subtitle}
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href={`mailto:${CONTACT_SECTION.email}`}
            className="flex items-center gap-2 rounded-xl bg-duo-green px-7 py-3 text-base font-bold text-white shadow-md transition hover:bg-duo-green-hover"
          >
            <Mail className="h-5 w-5" aria-hidden="true" />
            {CONTACT_SECTION.emailButton}
          </a>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl bg-green-600 px-7 py-3 text-base font-bold text-white shadow-md transition hover:bg-green-700"
          >
            <WhatsAppIcon className="h-5 w-5" />
            {CONTACT_SECTION.whatsappButton}
          </a>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="bg-duo-green py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          {FINAL_CTA.title}
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-white/90">
          {FINAL_CTA.subtitle}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {isLoaded && isSignedIn ? (
            <button
              onClick={() => navigate("/app")}
              className="rounded-xl bg-white px-8 py-3 text-base font-bold text-duo-green shadow-md transition hover:bg-duo-green-light"
            >
              {FINAL_CTA.dashboardButton}
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/register")}
                className="rounded-xl bg-white px-8 py-3 text-base font-bold text-duo-green shadow-md transition hover:bg-duo-green-light"
              >
                {FINAL_CTA.primaryButton}
              </button>
              <button
                onClick={() => navigate("/login")}
                className="rounded-xl border-2 border-white/70 px-8 py-3 text-base font-bold text-white transition hover:bg-white/10"
              >
                {FINAL_CTA.secondaryButton}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-zinc-900 py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-duo-green" />
            <span className="text-lg font-extrabold tracking-tight text-white">
              {BRAND}
            </span>
          </div>

          <div className="flex gap-6 text-sm text-zinc-400">
            {FOOTER_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="transition hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-800 pt-8 text-center text-sm text-zinc-500">
          &copy; {year} {BRAND}. {FOOTER_COPYRIGHT}
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <Metrics />
      <Screenshots />
      <Pricing />
      <Contact />
      <FinalCta />
      <Footer />
    </div>
  );
}
