package com.goodai.rugato.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class IngredientsDTO {
    private Integer id;
    private String name;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Integer menu_id;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Integer category_id;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Integer is_active;



    public IngredientsDTO(Integer id, String name) {
        this.id = id;
        this.name = name;

    }

    public IngredientsDTO() {


    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getMenu_id() {
        return menu_id;
    }

    public void setMenu_id(Integer menu_id) {
        this.menu_id = menu_id;
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

    public Integer getIs_active() {
        return is_active;
    }

    public void setIs_active(Integer is_active) {
        this.is_active = is_active;
    }
}
