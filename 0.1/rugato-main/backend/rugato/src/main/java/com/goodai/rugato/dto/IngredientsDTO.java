package com.goodai.rugato.dto;

public class IngredientsDTO {
    private Integer id;
//    private Integer menu_id;
//    private Integer category_id;
    private String name;


    public IngredientsDTO(Integer id, String name) {
        this.id = id;
        this.name = name;

    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

//    public Integer getMenu_id() {
//        return menu_id;
//    }
//
//    public void setMenu_id(Integer menu_id) {
//        this.menu_id = menu_id;
//    }
//
//    public Integer getCategory_id() {
//        return category_id;
//    }
//
//    public void setCategory_id(Integer category_id) {
//        this.category_id = category_id;
//    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
