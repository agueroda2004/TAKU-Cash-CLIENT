import { z } from "zod";
import {
  DATE_RANGE_ERROR,
  baseFilterFields,
  dateRangeCheck,
} from "../../shared/schemas/filters.schema";

export const createTransactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"], "Tipo inválido"),
  accountId: z.string().nonempty("Selecciona una cuenta"),
  categoryId: z.string().nonempty("Selecciona una categoría"),
  subcategoryId: z.string().optional(),
  amount: z.coerce
    .number()
    .positive("El monto debe ser mayor a 0")
    .max(1_000_000_000_000, "El monto no puede superar 1 billón"),
  description: z
    .string()
    .max(200, "La descripción no puede tener más de 200 caracteres")
    .optional(),
  date: z.string().nonempty("Selecciona una fecha"),
});

export const updateTransactionSchema = z.object({
  description: z
    .string()
    .max(200, "La descripción no puede tener más de 200 caracteres")
    .optional(),
});

export const transactionFiltersSchema = z
  .object({
    ...baseFilterFields,
    type: z.enum(["INCOME", "EXPENSE"]).nullable().optional(),
  })
  .refine(dateRangeCheck, {
    message: DATE_RANGE_ERROR,
    path: ["dateTo"],
  });
