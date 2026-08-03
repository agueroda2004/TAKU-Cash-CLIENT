import { z } from "zod";

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
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(128, "La contraseña no puede tener más de 128 caracteres"),
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
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(128, "La contraseña no puede tener más de 128 caracteres"),
});
