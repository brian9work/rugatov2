import { ExpenseBack, Revenue } from "./Types"

export interface CreateOrder {
    orderId: number,
    total: string,
    notes: string,
    details: string,
    userName: string,
    dishName: string,
    categoryName: string,
    statusName: string,
    createdAt: string,
    service: string,
    price: string,
    price_ch: string,
    price_med: string,
    price_gde: string,
    menuId: number,
    coustumer: number,
}
export interface UserResponse {
    id: number | 0,
    name: string | "",
    lastname: string | "",
    phone: string | "",
    user: string | "",
    password: string | "",
    type: string | "",
    is_active: number | 0,
    created_at: string | ""
}
export interface UserPost {
    name: string | "",
    lastname: string | "",
    phone: string | "",
    user: string | "",
    password: string | "",
    type: string | "",
    is_active: number | 0,
}

export interface LoginResponse {
    id: number | "",
    name: string | "",
    username: string | "",
    type: string | "",
}
export interface LoginRequest {
    username: string | "",
    password: string | ""
}

export interface SalesReport {
    orderId: number,
    user: string,
    service: string,
    payment: string,
    total: number,
    createdAt: string,
}
export interface FinancesResponse {
    revenues: Revenue[]
    expenses: ExpenseBack[]
} 


export interface FinancesRequest{
    quantity: string,
    reason: string,
    categoryName: string,
    userId: number
}
export interface FinancesExpensesRevenueResponse {
    id: number
    user_id: number,
    category_name?: string | "",
    quantity: number,
    reason: string,
    createdAt: string,
    last_updated: string
}