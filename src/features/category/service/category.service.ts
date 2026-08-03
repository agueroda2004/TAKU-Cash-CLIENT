import { request } from "../../../lib/api";
import type {
  Category,
  CategoryDropdownItem,
  CategoryFilters,
  CategoryListResult,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../types";

function buildQuery(filters: CategoryFilters): string {
  const params = new URLSearchParams();
  if (filters.name) params.set("name", filters.name);
  if (filters.type) params.set("type", filters.type);
  if (filters.isActive !== undefined) params.set("isActive", String(filters.isActive));
  params.set("page", String(filters.page));
  params.set("pageSize", String(filters.pageSize));
  return params.toString();
}

export const categoryService = {
  list: (token: string, filters?: CategoryFilters) =>
    request<CategoryListResult>(
      `/categories${filters ? `?${buildQuery(filters)}` : ""}`,
      { token },
    ),

  create: (token: string, data: CreateCategoryInput) =>
    request<Category>("/categories", { method: "POST", body: data, token }),

  update: (token: string, id: string, data: UpdateCategoryInput) =>
    request<Category>(`/categories/${id}`, {
      method: "PATCH",
      body: data,
      token,
    }),

  delete: (token: string, id: string) =>
    request(`/categories/${id}`, { method: "DELETE", token }),

  deactivate: (token: string, id: string) =>
    request(`/categories/${id}/deactivate`, { method: "PATCH", token }),

  getDropdown: (token: string) =>
    request<CategoryDropdownItem[]>("/categories/dropdown", { token }),
};
