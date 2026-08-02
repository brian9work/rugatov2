package com.goodai.rugato.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "builds")
public class BuildsModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer id;
    // private Integer menu_id;
    //private Integer ingredient_id;
    private Integer quantity_md;
    private Integer quantity_gr;
    private String name;
    private String ingredients_list;
    private String maximo;
    @CreationTimestamp
    private LocalDateTime created_at;
    @CreationTimestamp
    private LocalDateTime last_updated;

    @ManyToOne
    @JoinColumn(name = "menu_id")
    @JsonManagedReference

    private MenuModel menu;

    @ManyToMany
    @JoinTable(name = "build_ingredients",
            joinColumns = @JoinColumn(name = "build_id"), inverseJoinColumns = @JoinColumn(name = "ingredient_id"))
    private List<IngredientsModel> ingredients;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }


//    public Integer getIngredient_id() {
//        return ingredient_id;
//    }
//
//    public void setIngredient_id(Integer ingredient_id) {
//        this.ingredient_id = ingredient_id;
//    }

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public MenuModel getMenu() {
        return menu;
    }

    public void setMenu(MenuModel menu) {
        this.menu = menu;
    }

    public List<IngredientsModel> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<IngredientsModel> ingredients) {
        this.ingredients = ingredients;
    }

    public String getIngredients_list() {
        return ingredients_list;
    }

    public void setIngredients_list(String ingredients_list) {
        this.ingredients_list = ingredients_list;
    }

    public String getMaximo() {
        return maximo;
    }

    public void setMaximo(String maximo) {
        this.maximo = maximo;
    }
}