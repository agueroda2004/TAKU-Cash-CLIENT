import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty("El nombre es obligatorio")
    .max(100, "El nombre no puede tener más de 100 caracteres"),
  email: z
    .string()
    .email("Correo electrónico inválido")
    .max(254, "El correo no puede tener más de 254 caracteres"),
});

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .nonempty("La contraseña actual es obligatoria")
      .max(128, "La contraseña no puede tener más de 128 caracteres"),
    newPassword: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(128, "La contraseña no puede tener más de 128 caracteres"),
    confirmPassword: z
      .string()
      .nonempty("Confirma la nueva contraseña")
      .max(128, "La contraseña no puede tener más de 128 caracteres"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "La nueva contraseña debe ser diferente a la actual",
    path: ["newPassword"],
  });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;