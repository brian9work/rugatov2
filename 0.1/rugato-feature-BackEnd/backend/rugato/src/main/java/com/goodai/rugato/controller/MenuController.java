package com.goodai.rugato.controller;

import com.goodai.rugato.dto.BuildsDTO;
import com.goodai.rugato.dto.ExtrasDTO;
import com.goodai.rugato.dto.IngredientsDTO;
import com.goodai.rugato.dto.MenuDTO;
import com.goodai.rugato.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.awt.*;
import java.util.List;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/menu")
public class MenuController {
    @Autowired
    MenuService service;

    // --------------------------- get Components --------------------------
    @CrossOrigin(origins = "*")
    @GetMapping("/get/all")
    public List<MenuDTO> getMenuWithBuidls(){
        return service.getMenuWithBuilds();
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/get/{id}")
    public MenuDTO getMenuById(@PathVariable Integer id){
        return service.getMenuById(id);
    }

    @CrossOrigin(origins = "*")

    @GetMapping("/get/active")
    public List<MenuDTO> getMenuWithBuildsActives(){
        return service.getAllMenuActive();
    }
    @CrossOrigin(origins = "*")
    @GetMapping("/get/menu")
    public List<MenuDTO> getOnlyMenu(){
        return service.getOnlyMenu();
    }
    @CrossOrigin(origins = "*")
    @GetMapping("/get/menu/active")
    public List<MenuDTO> getOnlyMenuActive(){
        return service.getOnlyMenuActive();
    }
    @CrossOrigin(origins = "*")
    @GetMapping("/get/category")
    public List<MenuDTO> getAllByCategory(@RequestParam(required = false) Integer category, @RequestParam(required = false) String name){
        return service.getAllMenuByCategory(category);
    }
    @GetMapping("/get/category/active")
    public List<MenuDTO> getAllByCategoryActive(@RequestParam (required = false) Integer category, @RequestParam(required = false) String name){
        return service.getAllMenuByCategoryActive(category);
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/get/test")
    public MenuDTO getMenu(@RequestParam(required = false) Integer id){
        return service.getMenuTest(id);
    }
        // --------------------- Add component --------------------
    @CrossOrigin(origins = "*")
    @PostMapping("/add/menu")
    public MenuDTO addMenu(@RequestBody MenuDTO menu){
        return service.addMenu(menu);
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/add/ingredients")
    public IngredientsDTO addIngredients(@RequestBody IngredientsDTO ingredient){return service.addIngredients(ingredient);}

    @CrossOrigin(origins = "*")
    @PostMapping("/add/extras")
    public ExtrasDTO addExtras(@RequestBody ExtrasDTO extras){return  service.addExtras(extras);}

    @CrossOrigin(origins = "*")
    @PostMapping("/add/builds")
    public BuildsDTO addBuilds(@RequestBody BuildsDTO builds){return service.addBuilds(builds);}

    // -------------------- update Components -------------------------
    @CrossOrigin(origins = "*")
    @PutMapping("/update/menu/{id}")
    public MenuDTO updateMenu(@PathVariable int id,@RequestBody MenuDTO menu){
        return service.updateMenu(id, menu);
    }
    @CrossOrigin(origins = "*")
    @PutMapping("/update/build/{id}")
    public BuildsDTO updateBuidls(@PathVariable int id, @RequestBody BuildsDTO build){
        return service.updateBuidls(id,build);
    }
    @CrossOrigin(origins = "*")
    @PutMapping("/update/ingredients/{id}")
    public IngredientsDTO updateIngredients(@PathVariable int id, @RequestBody IngredientsDTO ingredient){
        return service.updateIngredients(id,ingredient);
    }

    @CrossOrigin(origins = "*")
    @PutMapping("/update/extras/{id}")
    public ExtrasDTO updateExtras(@PathVariable int id, @RequestBody ExtrasDTO extra){
        return service.updateExtras(id, extra);
    }

    // ---------------------- Desactive Components ----------------------

    @CrossOrigin(origins = "*")
    @PutMapping("/deactivate/menu/{id}")
    public ResponseEntity<String> deactivateMenu(@PathVariable int id){
        service.StatusMenu(id,0);
        String message = "El Menu "+ id + "se desactivo";
        return  ResponseEntity.ok(message);
    }
//    @PutMapping("/desaactive/build/{id}")
//    public ResponseEntity<String> deactivateBuild(@PathVariable int id){
//        service.StatusBuild(id,0);
//        String message = "El Menu "+ id + "se desactivo";
//        return  ResponseEntity.ok(message);
//    }

    @CrossOrigin(origins = "*")
    @PutMapping("/deactivate/extra/{id}")
    public ResponseEntity<String> deactivateExtras(@PathVariable int id){
        service.StatusExtras(id,0);
        String message = "El Extra "+ id + "se desactivo";
        return  ResponseEntity.ok(message);
    }
    @CrossOrigin(origins = "*")
    @PutMapping("/deactivate/ingredient/{id}")
    public ResponseEntity<String> deactivateIngredient(@PathVariable int id){
        service.StatusIngredient(id,0);
        String message = "El Ingrediente "+ id + " se desactivo";
        return  ResponseEntity.ok(message);
    }

    // -------------------------- Delete Component ---------------------

    @CrossOrigin(origins = "*")
    @DeleteMapping("/delete/menu/{id}")
    public ResponseEntity<String> deleleteMenu(@PathVariable int id){
        service.deleteMenu(id);
        String message = "El Menu " + id + " se elimino";
        return ResponseEntity.ok(message);
    }
    @CrossOrigin(origins = "*")
    @DeleteMapping("/delete/build/{id}")
    public ResponseEntity<String> deleleteBuild(@PathVariable int id){
        service.deleteBuild(id);
        String message = "El Build " + id + " se elimino";
        return ResponseEntity.ok(message);
    }

    @CrossOrigin(origins = "*")
    @DeleteMapping("/delete/extra/{id}")
    public ResponseEntity<String> deleleteExtra(@PathVariable int id){
        service.deleteExtras(id);
        String message = "El Extra " + id + " se elimino";
        return ResponseEntity.ok(message);
    }

    @CrossOrigin(origins = "*")
    @DeleteMapping("/delete/ingredient/{id}")
    public ResponseEntity<String> deleleteIngredient(@PathVariable int id){
        service.deleteIngredient(id);
        String message = "El Ingrediente " + id + " se elimino";
        return ResponseEntity.ok(message);
    }
}
