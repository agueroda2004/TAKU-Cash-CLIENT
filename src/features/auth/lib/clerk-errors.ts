type ClerkErrorLike = {
  code: string;
  message: string;
  longMessage?: string;
};

const CLERK_ERROR_MESSAGES_ES: Record<string, string> = {
  "form_identifier_exists":
    "Este correo electrónico ya está registrado. Intenta iniciar sesión.",
  "form_identifier_not_found":
    "No encontramos una cuenta con ese correo.",
  "form_identifier_already_used":
    "Este correo ya está vinculado a otra cuenta.",

  "form_password_incorrect": "La contraseña es incorrecta.",
  "form_password_validation_failed":
    "La contraseña no cumple los requisitos de seguridad.",
  "form_password_pwned":
    "Esta contraseña ha sido filtrada en violaciones de datos conocidas. Elige otra.",
  "form_password_compromised":
    "Esta contraseña es demasiado común. Elige una más segura.",
  "form_password_not_strong_enough":
    "La contraseña no es lo suficientemente fuerte.",
  "form_password_too_short": "La contraseña es demasiado corta.",
  "form_password_too_long": "La contraseña es demasiado larga.",
  "form_password_missing": "Ingresa una contraseña.",
  "form_password_length_too_short": "La contraseña es demasiado corta.",
  "form_password_size_in_bytes_exceeded": "La contraseña es demasiado larga.",
  "form_password_compromised__sign_in":
    "Esta contraseña es demasiado común. Elige una más segura.",
  "form_password_untrusted__sign_in":
    "Esta contraseña no cumple los requisitos de seguridad.",
  "form_new_password_matches_current":
    "La nueva contraseña debe ser diferente a la actual.",
  "form_password_or_identifier_incorrect":
    "La contraseña o el correo son incorrectos.",

  "form_param_format_invalid":
    "El formato del correo electrónico no es válido.",
  "form_email_address_invalid": "El correo electrónico no es válido.",
  "form_email_address_exists":
    "Este correo electrónico ya está registrado.",
  "form_email_address_not_found":
    "No encontramos una cuenta con ese correo.",
  "form_email_address_blocked":
    "No se permiten correos de este proveedor.",

  "form_code_incorrect": "El código ingresado es incorrecto.",
  "form_code_expired": "El código ha expirado. Solicita uno nuevo.",
  "form_code_invalid": "El código no es válido.",
  "form_code_missing": "Ingresa el código que enviamos a tu correo.",
  "verification_failed":
    "Has realizado demasiados intentos fallidos. Inténtalo de nuevo con el mismo código u otro método.",

  "form_param_nil": "Completa todos los campos obligatorios.",
  "form_param_missing": "Faltan campos obligatorios.",

  "too_many_requests":
    "Has realizado demasiados intentos. Por favor espera 5 minutos e inténtalo de nuevo.",
  "too_many_attempts":
    "Demasiados intentos. Espera unos minutos e inténtalo de nuevo.",
  "session_exists": "Ya tienes una sesión activa.",

  "network_error":
    "Error de red. Verifica tu conexión e inténtalo de nuevo.",
  "internal_error": "Error inesperado. Inténtalo de nuevo en unos momentos.",
};

export function translateClerkError(code: string, fallback: string): string {
  return CLERK_ERROR_MESSAGES_ES[code] ?? fallback;
}

export function translateClerkErrors(errors: ClerkErrorLike[]): string[] {
  return errors
    .filter(
      (e): e is ClerkErrorLike =>
        e != null &&
        typeof e === "object" &&
        typeof e.code === "string",
    )
    .map((e) => translateClerkError(e.code, e.longMessage ?? e.message));
}

export type ClerkErrorInfo = {
  code: string;
  message: string;
};

type RawClerkError = {
  code?: unknown;
  message?: unknown;
  longMessage?: unknown;
  long_message?: unknown;
};

export function parseClerkApiError(raw: unknown): ClerkErrorInfo | null {
  if (raw == null) return null;
  let first: unknown = raw;
  if (Array.isArray(raw)) {
    first = raw[0] ?? null;
  } else if (typeof raw === "object") {
    const nested = (raw as { errors?: unknown }).errors;
    if (Array.isArray(nested) && nested.length > 0) first = nested[0];
  }
  if (first == null || typeof first !== "object") return null;
  const e = first as RawClerkError;
  const code = e.code;
  if (typeof code !== "string") return null;

  const longMessage =
    typeof e.longMessage === "string"
      ? e.longMessage
      : typeof e.long_message === "string"
        ? e.long_message
        : "";
  const message = typeof e.message === "string" ? e.message : "";
  const rawMessage = longMessage || message;

  const resolvedMessage =
    CLERK_ERROR_MESSAGES_ES[code] || rawMessage || "Error inesperado";

  return {
    code,
    message: resolvedMessage,
  };
}

export function inspectClerkError(err: unknown): ClerkErrorInfo | null {
  if (err == null || typeof err !== "object") return null;
  const e = err as { errors?: unknown };
  if (!Array.isArray(e.errors) || e.errors.length === 0) return null;
  return parseClerkApiError(e.errors[0]);
}
