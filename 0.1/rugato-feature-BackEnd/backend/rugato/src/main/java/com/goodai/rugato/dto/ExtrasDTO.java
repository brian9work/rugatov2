package com.goodai.rugato.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class ExtrasDTO {
    private Integer id;
    private String name;
    private String price;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Integer is_active;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Integer menu_id;

    public ExtrasDTO(Integer id, String name, String price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    public ExtrasDTO() {

    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getIs_active(){ return is_active;}

    public void setIs_active(Integer is_active) {this.is_active = is_active;}

    public Integer getMenu_id() {
        return menu_id;
    }

    public void setMenu_id(Integer menu_id) {
        this.menu_id = menu_id;
    }
}
