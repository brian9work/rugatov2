package com.goodai.rugato.controller;

import java.util.List;

import com.goodai.rugato.model.CatCategoryModel;
import com.goodai.rugato.repository.iCatCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/test")
public class TestTableController {
    @Autowired
    private iCatCategoryRepository repo;

    // Metodos de la API RESTW
    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }

    // Metodo GET
    @GetMapping("/all")
    public List<CatCategoryModel> getAll() {
        return repo.findAll();
    } 

}
