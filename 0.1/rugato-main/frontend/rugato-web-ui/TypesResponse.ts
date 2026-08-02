import { CreateOrder, SalesReport } from "./TypesBackend";

export interface OrdersTodayResponse {
   orderList: CreateOrder[];
}

export interface SalesReportResponse {
   content: SalesReport[];
   totalPages: number;
   totalElements: number;
   pageable: {
      pageNumber: number;
      pageSize: number;
   };
}