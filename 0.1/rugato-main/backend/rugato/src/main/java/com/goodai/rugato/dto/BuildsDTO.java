package com.goodai.rugato.dto;

import java.util.List;

public class BuildsDTO {
    private Integer id;
    private String name;
    private List<String> ingredients;
    //private Integer price;

    public BuildsDTO(Integer id, String name, List<String> ingredients) {
        this.name = name;
        this.id = id;
        this.ingredients = ingredients;
    }

//    private Integer maximo;


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

    public List<String> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<String> ingredients) {
        this.ingredients = ingredients;
    }

//    public Integer getPrice() {
//        return price;
//    }
//
//    public void setPrice(Integer price) {
//        this.price = price;
//    }

}
