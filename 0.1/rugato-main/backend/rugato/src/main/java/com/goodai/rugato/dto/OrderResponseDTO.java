package com.goodai.rugato.dto;

public interface OrderResponseDTO {
    Long getOrderId();
    String getTotal();
    String getNotes();
    String getUserName();
    String getStatusName();
    String getDishName();
    String getCategoryName();
}
