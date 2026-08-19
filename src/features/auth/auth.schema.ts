import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .max(128, "La contraseña no puede tener más de 128 caracteres")
  .regex(/[a-z]/, "Debe incluir al menos una letra minúscula")
  .regex(/[A-Z]/, "Debe incluir al menos una letra mayúscula")
  .regex(/[0-9]/, "Debe incluir al menos un número")
  .regex(/[^A-Za-z0-9]/, "Debe incluir al menos un símbolo");

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty("El nombre es obligatorio")
    .max(50, "El nombre no puede tener más de 50 caracteres"),
  email: z
    .string()
    .email("Correo electrónico inválido")
    .max(254, "El correo no puede tener más de 254 caracteres"),
  password: passwordSchema,
  termsAccepted: z.literal(true, {
    error: "Debes aceptar los Términos de Servicio",
  }),
  privacyAccepted: z.literal(true, {
    error: "Debes leer el Aviso de Privacidad",
  }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Correo electrónico inválido")
    .max(254, "El correo no puede tener más de 254 caracteres"),
  password: z
    .string()
    .nonempty("La contraseña es obligatoria")
    .max(128, "La contraseña no puede tener más de 128 caracteres"),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Correo electrónico inválido")
    .max(254, "El correo no puede tener más de 254 caracteres"),
});

export const resetPasswordSchema = z.object({
  code: z
    .string()
    .length(6, "El código debe tener 6 dígitos"),
  password: passwordSchema,
});
