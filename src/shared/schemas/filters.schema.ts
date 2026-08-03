import { z } from "zod";

export const DATE_RANGE_ERROR =
  "La fecha desde no puede ser mayor a la fecha hasta";

export const baseFilterFields = {
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  accountId: z.string().nullable().optional(),
  categoryId: z.string().nullable().optional(),
  subcategoryId: z.string().nullable().optional(),
};

export function dateRangeCheck(data: {
  dateFrom?: string | null;
  dateTo?: string | null;
}): boolean {
  if (data.dateFrom && data.dateTo) {
    return data.dateFrom <= data.dateTo;
  }
  return true;
}
