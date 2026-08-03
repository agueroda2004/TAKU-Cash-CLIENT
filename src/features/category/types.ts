export type CategoryType = "INCOME" | "EXPENSE";

export type CategoryDropdownItem = {
  id: string;
  name: string;
  type: CategoryType;
  color: string;
  icon: string;
  subcategories: { id: string; name: string }[];
};

export type Subcategory = {
  id: string;
  categoryId: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  userId: string;
  name: string;
  type: CategoryType;
  color: string;
  icon: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  subcategories: Subcategory[];
};

export type CategoryFilters = {
  name?: string;
  type?: CategoryType;
  isActive?: boolean;
  page: number;
  pageSize: number;
};

export type CategoryListResult = {
  items: Category[];
  totalItems: number;
  hasNext: boolean;
  hasLast: boolean;
};

export type CreateCategoryInput = {
  name: string;
  type: CategoryType;
  color: string;
  icon: string;
  subcategories?: { name: string }[];
};

export type UpdateCategorySubcategoryChanges = {
  create?: { name: string }[];
  update?: { id: string; name: string; isActive?: boolean }[];
  delete?: string[];
};

export type UpdateCategoryInput = {
  name?: string;
  color?: string;
  icon?: string;
  isActive?: boolean;
  subcategories?: UpdateCategorySubcategoryChanges;
};
