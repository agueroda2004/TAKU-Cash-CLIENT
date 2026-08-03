import { z } from "zod";
import {
  DATE_RANGE_ERROR,
  baseFilterFields,
  dateRangeCheck,
} from "../../../shared/schemas/filters.schema";

export const dashboardFiltersSchema = z
  .object({
    ...baseFilterFields,
    reportCurrency: z.enum(["CRC", "USD"]),
    exchangeRate: z
      .number()
      .positive("El tipo de cambio debe ser mayor a 0")
      .nullable(),
  })
  .refine(dateRangeCheck, {
    message: DATE_RANGE_ERROR,
    path: ["dateTo"],
  });
