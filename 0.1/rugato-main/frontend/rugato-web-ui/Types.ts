export interface MenuItems {
  icon: React.ElementType;
  url?: string;
  label: string;
  isActive: boolean;
}
export type EstatusType = "pendiente" | "preparando" | "listo" | "entregado" | "cancelado"

export interface User {
  id: number | 0,
  name: string | "",
  lastname: string | "",
  phone: string | "",
  user: string | "",
  acronym: string | "",
  type: string | "user",
  is_active: number | 1,
  created_at: string | ""
}

export interface Carrito {
  id: number | 0,
  userId: number | 0,
  productId: number | 0,
  categoryName: string | "",
  name?: string | "",
  statusId: number | 1,
  total: number | 0,
  details: string | "",
  notes: string | "",
  service: string | "",
  coustumer: number | 0,
}

export interface ProductExtras {
  id: number,
  name: string,
  price: number
}

export interface ProductServerBuild {
  id: number,
  ingredientsList: string,
  name: string,
  maximo: number
}


export interface ProductIngredients {
  id: number,
  name: string,
}

export interface ProductServer {
  id: number,
  category_id: number,
  name: string,
  price: string,
  price_ch: string,
  price_med: string,
  price_gde: string,
  description: string,
  ingredients: ProductIngredients[],
  extras: ProductExtras[],
  builds: ProductServerBuild[],
}

export interface ProductBuilds {
  ingredients: string,
  name: string,
  price: number,
  maximo: number,
}


export interface Product {
  id: number | 0,
  name: string | '',
  category: string | '0',
  price: number | 0,
  price_ch: number | 0,
  price_med: number | 0,
  price_gde: number | 0,
  description: string | ' --- ',
  status?: "0" | "1"
  ingredients: ProductIngredients[],
  extras: ProductExtras[],
  builds: ProductBuilds[],
}
export const mapBuild = (data: ProductServerBuild): ProductBuilds => ({
  ingredients: data.ingredientsList,
  name: data.name,
  price: 0,
  maximo: data.maximo,
})

export const mapProduct = (data: ProductServer): Product => ({
  id: data.id,
  category: data.category_id.toString(),
  name: data.name,
  price: Number(data.price),
  price_ch: Number(data.price_ch),
  price_med: Number(data.price_med),
  price_gde: Number(data.price_gde),
  description: data.description,
  status: "1",
  ingredients: data.ingredients,
  extras: data.extras,
  builds: data.builds.map(mapBuild),
})

export interface NewOrder {
  name: string,
  userId: number | 0,
  productId: number | 0,
  categoryName: string | '0',
  quantity: number;
  notes: string;
  details: string;
  size: 'Pieza' | 'Pequeño' | 'Mediano' | 'Grande';
  service: string; // 1 para local, 2 para llevar
  total: number;
  extras: string[];
  extraprice: number;
  table: number;
}
export interface OrderDetails {
  ingredients: string,
  extras: string,
  build: string,
}

export interface Expense {
  id: number,
  type: "gasto" | "ingreso",
  amount: number,
  reason: string,
  date: string, // Formato YYYY-MM-DD
}

export interface Revenue {
  id?: number | 0,
  user_id: number,
  quantity: string,
  reason: string,
  createdAt?: string, // Formato YYYY-MM-DD
  last_updated?: string, // Formato YYYY-MM-DD
}

export interface ExpenseBack {
  id: number,
  user_id: number,
  category_name: string,
  quantity: string,
  reason: string,
  createdAt: string, // Formato YYYY-MM-DD
  last_updated: string, // Formato YYYY-MM-DD
}