export interface MenuItems {
  icon: React.ElementType;
  url?: string;
  label: string;
  isActive: boolean;
}
export type EstatusType = "pendiente" | "preparando" | "listo" | "entregado" | "cancelado"