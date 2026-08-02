package com.goodai.rugato.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "orders")

public class OrdersModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer status_id;
    private Integer user_id;
    private Integer menu_id;
    private String total;
    private String notes;
    private String details;
    private String service;
    private String user;
    private String payment;
    private String coustumer;

    @CreationTimestamp
    private LocalDateTime created_at;

    @CreationTimestamp
    private LocalDateTime last_updated;
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Integer getStatus_id() {
        return status_id;
    }
    public void setStatus_id(Integer status_id) {
        this.status_id = status_id;
    }
    public Integer getUser_id() {
        return user_id;
    }
    public void setUser_id(Integer user_id) {
        this.user_id = user_id;
    }
    public Integer getMenu_id() {
        return menu_id;
    }
    public void setMenu_id(Integer menu_id) {
        this.menu_id = menu_id;
    }
    public String getTotal() {
        return total;
    }
    public void setTotal(String total) {
        this.total = total;
    }
    public String getNotes() {
        return notes;
    }
    public void setNotes(String notes) {
        this.notes = notes;
    }
    public String getDetails() {
        return details;
    }
    public void setDetails(String details) {
        this.details = details;
    }
    public LocalDateTime getCreated_at() {
        return created_at;
    }
    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }
    public LocalDateTime getLast_updated() {
        return last_updated;
    }
    public void setLast_updated(LocalDateTime last_updated) {
        this.last_updated = last_updated;
    }
    public String getService() {return service;}
    public void setService(String service) {this.service = service;}
    public String getUser() {return user;}
    public void setUser(String user) {this.user = user;}
    public String getPayment() {return payment;}
    public void setPayment(String payment) {this.payment = payment;}

    public String getCoustumer() {
        return coustumer;
    }

    public void setCoustumer(String coustumer) {
        this.coustumer = coustumer;
    }
}
