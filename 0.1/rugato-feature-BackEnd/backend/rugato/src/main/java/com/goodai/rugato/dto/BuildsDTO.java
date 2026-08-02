package com.goodai.rugato.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class BuildsDTO {
    private Integer id;
    private String name;
    private List<Integer> ingredientIds;   // para guardar
    private List<String> ingredientNames;  // para mostrar
    private Integer quantity_md;
    private Integer quantity_gr;
    private String ingredientsList;
    private String maximo;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Integer menu_id;


    //private Integer price;

//    public BuildsDTO(Integer id, String name, List<Integer> ingredientIds) {
//        this.name = name;
//        this.id = id;
//        this.ingredientIds = ingredientIds;
//    }

    public BuildsDTO() {

    }


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public Integer getQuantity_md() {
        return quantity_md;
    }

    public void setQuantity_md(Integer quantity_md) {
        this.quantity_md = quantity_md;
    }

    public Integer getQuantity_gr() {
        return quantity_gr;
    }

    public void setQuantity_gr(Integer quantity_gr) {
        this.quantity_gr = quantity_gr;
    }

    public Integer getMenu_id() {
        return menu_id;
    }

    public void setMenu_id(Integer menu_id) {
        this.menu_id = menu_id;
    }

    public List<Integer> getIngredientIds() {
        return ingredientIds;
    }

    public void setIngredientIds(List<Integer> ingredientIds) {
        this.ingredientIds = ingredientIds;
    }

    public List<String> getIngredientNames() {
        return ingredientNames;
    }

    public void setIngredientNames(List<String> ingredientNames) {
        this.ingredientNames = ingredientNames;
    }

    public String getIngredientsList() {
        return ingredientsList;
    }

    public void setIngredientsList(String ingredientsList) {
        this.ingredientsList = ingredientsList;
    }

    public String getMaximo() {
        return maximo;
    }

    public void setMaximo(String maximo) {
        this.maximo = maximo;
    }
}
