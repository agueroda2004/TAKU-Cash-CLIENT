import { z } from "zod";
import { CATEGORY_ICONS } from "./components/constants";
import { COLORS } from "../../constants/data";

const validColors: Set<string> = new Set(COLORS.map((c) => c.value));
const validIcons: Set<string> = new Set(CATEGORY_ICONS.map((i) => i.value));

export const categoryFiltersSchema = z.object({
  name: z.string().max(100, "El nombre no puede tener más de 100 caracteres"),
  type: z.enum(["EXPENSE", "INCOME"], "Tipo inválido").nullable(),
});

export const createCategorySchema = z.object({
  name: z
    .string()
    .nonempty("El nombre es obligatorio")
    .max(100, "El nombre no puede tener más de 100 caracteres"),
  type: z.enum(["EXPENSE", "INCOME"], "Tipo inválido"),
  color: z
    .string()
    .nonempty("Selecciona un color")
    .refine((val) => validColors.has(val), "Color inválido"),
  icon: z
    .string()
    .nonempty("Selecciona un icono")
    .refine((val) => validIcons.has(val), "Icono inválido"),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .nonempty("El nombre es obligatorio")
    .max(100, "El nombre no puede tener más de 100 caracteres"),
  color: z
    .string()
    .nonempty("Selecciona un color")
    .refine((val) => validColors.has(val), "Color inválido"),
  icon: z
    .string()
    .nonempty("Selecciona un icono")
    .refine((val) => validIcons.has(val), "Icono inválido"),
  isActive: z.boolean().optional(),
});