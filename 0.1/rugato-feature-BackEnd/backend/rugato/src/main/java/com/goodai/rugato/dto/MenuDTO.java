package com.goodai.rugato.dto;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class MenuDTO {
    private Integer id;
    private Integer category_id;
    private String name;
    private String price;
    private String price_ch;
    private String price_med;
    private String price_gde;
    private String description;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Integer is_active;

    private List<IngredientsDTO> ingredients;
    private List<ExtrasDTO> extras;
    private List<BuildsDTO> builds;

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
//
//    public LocalDateTime getCreated_at() {
//        return created_at;
//    }
//
//    public void setCreated_at(LocalDateTime created_at) {
//        this.created_at = created_at;
//    }
//
//    public LocalDateTime getLast_updated() {
//        return last_updated;
//    }
//
//    public void setLast_updated(LocalDateTime last_updated) {
//        this.last_updated = last_updated;
//    }


    public List<IngredientsDTO> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<IngredientsDTO> ingredients) {
        this.ingredients = ingredients;
    }

    public List<ExtrasDTO> getExtras() {
        return extras;
    }

    public void setExtras(List<ExtrasDTO> extras) {
        this.extras = extras;
    }

    public List<BuildsDTO> getBuilds() {
        return builds;
    }

    public void setBuilds(List<BuildsDTO> builds) {
        this.builds = builds;
    }
}
