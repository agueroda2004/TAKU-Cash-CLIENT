import { z } from "zod";
import { ACCOUNT_TYPES, ACCOUNT_STATUSES, ICONS } from "./components/constants";
import { CURRENCIES, COLORS } from "../../constants/data";
import type { AccountStatus } from "./components/constants";

const validTypes: Set<string> = new Set(ACCOUNT_TYPES.map((t) => t.value));
const validCurrencies: Set<string> = new Set(CURRENCIES.map((c) => c.value));
const validColors: Set<string> = new Set(COLORS.map((c) => c.value));
const validIcons: Set<string> = new Set(ICONS.map((i) => i.value));
const validStatuses: [AccountStatus, ...AccountStatus[]] = [
  ACCOUNT_STATUSES[0].value,
  ...ACCOUNT_STATUSES.slice(1).map((s) => s.value),
] as [AccountStatus, ...AccountStatus[]];

export type AccountDraft = {
  name: string;
  type: string | null;
  currency: string | null;
  status: AccountStatus;
};

export const accountDraftSchema = z.object({
  name: z.string().max(100, "El nombre no puede tener más de 100 caracteres"),
  type: z
    .string()
    .refine((val) => validTypes.has(val), "Tipo de cuenta inválido")
    .nullable(),
  currency: z
    .string()
    .refine((val) => validCurrencies.has(val), "Moneda inválida")
    .nullable(),
  status: z.enum(validStatuses, "Estado inválido"),
});

export const accountFiltersSchema = z.object({
  name: z.string().optional(),
  type: z
    .string()
    .refine((val) => !val || validTypes.has(val), "Tipo de cuenta inválido")
    .optional(),
  currency: z
    .string()
    .refine((val) => !val || validCurrencies.has(val), "Moneda inválida")
    .optional(),
  isActive: z.boolean().optional(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});

export function createTransferSchema(params: {
  fromAccountId: string;
  fromBalance: number;
  currenciesDiffer: boolean;
}) {
  return z
    .object({
      toAccountId: z
        .string()
        .min(1, "Selecciona una cuenta de destino")
        .refine(
          (val) => val !== params.fromAccountId,
          "No puedes transferir a la misma cuenta",
        ),
      amount: z.coerce
        .number()
        .positive("El monto debe ser mayor a 0")
        .max(1_000_000_000_000, "El monto no puede superar 1 billón")
        .refine((val) => val <= params.fromBalance, "Saldo insuficiente"),
      exchangeRate: z.coerce
        .number()
        .positive("El tipo de cambio debe ser mayor a 0")
        .max(1_000_000, "El tipo de cambio no puede superar 1 millón")
        .optional(),
      description: z
        .string()
        .max(200, "La descripción no puede tener más de 200 caracteres")
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (params.currenciesDiffer && !data.exchangeRate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "El tipo de cambio es requerido para transferencias entre monedas diferentes",
          path: ["exchangeRate"],
        });
      }
    });
}

export const updateAccountSchema = z.object({
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
  isActive: z.boolean(),
});

export const createAccountSchema = z.object({
  name: z
    .string()
    .nonempty("El nombre es obligatorio")
    .max(100, "El nombre no puede tener más de 100 caracteres"),
  type: z
    .string()
    .nonempty("Selecciona un tipo de cuenta")
    .refine((val) => validTypes.has(val), "Tipo de cuenta inválido"),
  currency: z
    .string()
    .nonempty("Selecciona una moneda")
    .refine((val) => validCurrencies.has(val), "Moneda inválida"),
  color: z
    .string()
    .nonempty("Selecciona un color")
    .refine((val) => validColors.has(val), "Color inválido"),
  icon: z
    .string()
    .nonempty("Selecciona un icono")
    .refine((val) => validIcons.has(val), "Icono inválido"),
  balance: z.coerce
    .number()
    .min(0, "El saldo no puede ser negativo")
    .max(1_000_000_000_000, "El saldo no puede superar 1 billón")
    .optional(),
});
