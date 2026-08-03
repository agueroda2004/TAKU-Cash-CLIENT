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
  Send,
  Mail,
  MapPin,
  Star,
  Quote,
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
  REVIEWS_SECTION,
  REVIEWS,
  SUCCESS_STORY,
  CONTACT_SECTION,
  FOOTER_LINKS,
  FOOTER_COPYRIGHT,
} from "../data/landingData";

function Navbar() {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();
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

        <div className="hidden items-center gap-8 md:flex">
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

        <div className="hidden items-center gap-3 md:flex">
          {isLoaded && isSignedIn ? (
            <button
              onClick={() => navigate("/app")}
              className="rounded-xl bg-duo-green px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-duo-green-hover"
            >
              {NAV_BUTTONS.dashboard}
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="rounded-xl px-5 py-2.5 text-sm font-bold text-zinc-700 transition hover:bg-zinc-100"
              >
                {NAV_BUTTONS.signIn}
              </button>
              <button
                onClick={() => navigate("/register")}
                className="rounded-xl bg-duo-green px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-duo-green-hover"
              >
                {NAV_BUTTONS.signUp}
              </button>
            </>
          )}
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
          <div className="border-t border-zinc-100 px-4 py-4">
            {isLoaded && isSignedIn ? (
              <button
                onClick={() => navigate("/app")}
                className="flex w-full items-center justify-center rounded-xl bg-duo-green px-5 py-2.5 text-sm font-bold text-white"
              >
                {NAV_BUTTONS.dashboard}
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate("/login")}
                  className="rounded-xl px-5 py-2.5 text-sm font-bold text-zinc-700 transition hover:bg-zinc-100"
                >
                  {NAV_BUTTONS.signIn}
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="rounded-xl bg-duo-green px-5 py-2.5 text-sm font-bold text-white"
                >
                  {NAV_BUTTONS.signUp}
                </button>
              </div>
            )}
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
          <button
            onClick={() => {
              const el = document.getElementById("features");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="rounded-xl bg-duo-green px-7 py-3 text-base font-bold text-white shadow-md transition hover:bg-duo-green-hover"
          >
            {HERO.primaryButton}
          </button>
          <button
            onClick={() => {
              const el = document.getElementById("plans");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="rounded-xl border-2 border-zinc-300 px-7 py-3 text-base font-bold text-zinc-700 transition hover:border-duo-green hover:text-duo-green"
          >
            {HERO.secondaryButton}
          </button>
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

function Reviews() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-zinc-900 sm:text-4xl">
            {REVIEWS_SECTION.titleBefore}{" "}
            <span className="text-duo-green">
              {REVIEWS_SECTION.titleHighlight}
            </span>
          </h2>
          <p className="mt-4 text-lg text-zinc-600">
            {REVIEWS_SECTION.subtitle}
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <div
              key={r.email}
              className="rounded-2xl border border-zinc-200 p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-duo-green text-sm font-bold text-white">
                  {r.email[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900">{r.name}</p>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < r.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-zinc-200 text-zinc-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                &ldquo;{r.message}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SuccessStory() {
  return (
    <section className="bg-duo-green py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-white/10 p-8 text-center text-white lg:p-12">
            <Quote className="mx-auto h-10 w-10 text-white/60" />
            <p className="mt-6 text-xl leading-relaxed font-medium lg:text-2xl">
              &ldquo;{SUCCESS_STORY.quote}&rdquo;
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
              <span className="rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold">
                {SUCCESS_STORY.highlight}
              </span>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-8">
              <div>
                <p className="text-2xl font-extrabold">{SUCCESS_STORY.result1}</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold">{SUCCESS_STORY.result2}</p>
              </div>
            </div>
            <div className="mt-8 border-t border-white/20 pt-6">
              <p className="text-sm font-semibold text-white/80">
                &mdash; {SUCCESS_STORY.name}, {SUCCESS_STORY.title}
              </p>
            </div>
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
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const message = data.get("message") as string;
    const mailto = `mailto:${CONTACT_SECTION.email}?subject=Contacto desde web - ${encodeURIComponent(name)}&body=${encodeURIComponent(`Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`)}`;
    window.open(mailto);
    form.reset();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  }

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

        <div className="mx-auto mt-12 grid max-w-4xl gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-duo-green-light text-duo-green">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-zinc-900">
                  {CONTACT_SECTION.emailLabel}
                </p>
                <a
                  href={`mailto:${CONTACT_SECTION.email}`}
                  className="text-sm text-zinc-600 transition hover:text-duo-green"
                >
                  {CONTACT_SECTION.email}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-duo-green-light text-duo-green">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-zinc-900">
                  {CONTACT_SECTION.locationLabel}
                </p>
                <p className="text-sm text-zinc-600">
                  {CONTACT_SECTION.location}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                {CONTACT_SECTION.formNameLabel}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder={CONTACT_SECTION.formNamePlaceholder}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-duo-green focus:ring-2 focus:ring-duo-green/20"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                {CONTACT_SECTION.formEmailLabel}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder={CONTACT_SECTION.formEmailPlaceholder}
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-duo-green focus:ring-2 focus:ring-duo-green/20"
              />
            </div>
            <div>
              <label htmlFor="message" className="sr-only">
                {CONTACT_SECTION.formMessageLabel}
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                placeholder={CONTACT_SECTION.formMessagePlaceholder}
                className="w-full resize-none rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-duo-green focus:ring-2 focus:ring-duo-green/20"
              />
            </div>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-duo-green px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-duo-green-hover"
            >
              {sent ? CONTACT_SECTION.buttonSent : CONTACT_SECTION.buttonSend}
              <Send className="h-4 w-4" />
            </button>
          </form>
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
      <Reviews />
      <SuccessStory />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  );
}
