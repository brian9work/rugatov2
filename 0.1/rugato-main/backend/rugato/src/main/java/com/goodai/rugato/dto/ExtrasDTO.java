package com.goodai.rugato.dto;

public class ExtrasDTO {
    private Integer id;
    private String name;
    private String price;

    public ExtrasDTO(Integer id, String name, String price) {
        this.id = id;
        this.name = name;
        this.price = price;
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


}
