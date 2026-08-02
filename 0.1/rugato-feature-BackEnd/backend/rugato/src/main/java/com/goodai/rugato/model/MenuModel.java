package com.goodai.rugato.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "menu")
public class MenuModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer category_id;
    private String name;
    private String price;
    private String price_ch;
    private String price_med;
    private String price_gde;
    private String description;
    private Integer is_active;

    @CreationTimestamp
    private LocalDateTime created_at;
    @CreationTimestamp
    private LocalDateTime last_updated;


    @OneToMany(mappedBy = "menu", fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<ExtrasModel> extras;

    @OneToMany(mappedBy = "menu", fetch = FetchType.LAZY)
    @JsonManagedReference
    private  List<BuildsModel> buidls;

    public LocalDateTime getLast_updated() {
        return last_updated;
    }

    public void setLast_updated(LocalDateTime last_updated) {
        this.last_updated = last_updated;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getCategory_id() {
        return category_id;
    }

    public void setCategory_id(Integer category_id) {
        this.category_id = category_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getPrice_ch() {
        return price_ch;
    }

    public void setPrice_ch(String price_ch) {
        this.price_ch = price_ch;
    }

    public String getPrice_med() {
        return price_med;
    }

    public void setPrice_med(String price_med) {
        this.price_med = price_med;
    }

    public String getPrice_gde() {
        return price_gde;
    }

    public void setPrice_gde(String price_gde) {
        this.price_gde = price_gde;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getIs_active() {
        return is_active;
    }

    public void setIs_active(Integer is_active) {
        this.is_active = is_active;
    }

    public LocalDateTime getCreated_at() {
        return created_at;
    }

    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }

    public LocalDateTime getLast_update() {
        return last_updated;
    }

    public void setLast_update(LocalDateTime last_updated) {
        this.last_updated = last_updated;
    }

    public List<ExtrasModel> getExtras() {
        return extras;
    }

    public void setExtras(List<ExtrasModel> extras) {
        this.extras = extras;
    }

    public List<BuildsModel> getBuidls() {
        return buidls;
    }

    public void setBuidls(List<BuildsModel> buidls) {
        this.buidls = buidls;
    }
}
