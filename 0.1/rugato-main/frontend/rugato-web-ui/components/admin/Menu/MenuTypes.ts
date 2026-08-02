export interface MenuProps {
   category_id: number,
   name: string,
   price: number,
   price_ch: number,
   price_med: number,
   price_gde: number,
   description: string,
}
export interface IngredientsPropsRequest {
   name: string,
   category_id: number,
   menu_id: number
}
export interface IngredientsPropsResponse {
   id: number,
   name: string,
}
export interface ExtrasPropsRequest {
   menu_id: number,
   name: string,
   price: number
}
export interface ExtrasPropsResponse {
   id: number,
   name: string,
   price: number,
}
export interface BuildsPropsRequest {
   menu_id: number,
   name: string,
   ingredientsList: string,
   maximo: string
}
export interface BuildsPropsResponse {
   id: number,
   name: string,
   ingredientsList: string,
   maximo: string,
}