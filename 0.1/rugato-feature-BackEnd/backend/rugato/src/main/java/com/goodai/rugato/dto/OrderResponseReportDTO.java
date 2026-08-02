package com.goodai.rugato.dto;

public interface OrderResponseReportDTO {
    Long getOrderId();
    String getTotal();
    String getMenuId();
    String getService();
    String getUser();
    String getCreatedAt();
    String getPayment();
    String getPlatillo();
}
