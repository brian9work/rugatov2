package com.goodai.rugato.controller;

import com.goodai.rugato.dto.MenuDTO;
import com.goodai.rugato.model.MenuModel;
import com.goodai.rugato.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/menu")
public class MenuController {

    @Autowired
    MenuService service;

    @GetMapping("/ping/pong")
    public String test (){
        return "Pong";
    }

    @GetMapping("/get/all")
    public List<MenuDTO> getAllMenu(){
      return service.getAllMenu();
    }

    @GetMapping("/get/category")
    public List<MenuDTO> getAllByCategory(@RequestParam(required = false) Integer category, @RequestParam(required = false) String name){
        return service.getAllMenuByCategory(category);
    }

    @GetMapping("/get/test")
    public MenuDTO getMenu(@RequestParam(required = false) Integer id){
        return service.getMenuTest(id);
    }
}
