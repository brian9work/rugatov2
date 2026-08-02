package com.goodai.rugato.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.goodai.rugato.dto.UserDTO;
import com.goodai.rugato.service.UserService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired UserService service;

    @CrossOrigin(origins = "*")
    @GetMapping("/get/all")
    public List<UserDTO> getAll(@RequestParam(required = false, defaultValue = "1")Integer active){
        if (active == 2){
            return service.getAllUsers().stream().map(user -> service.mapToDTO(user)).toList();
        } else if (active == 1){
            return service.getAllUsersActive().stream().map(user -> service.mapToDTO(user)).toList();
        } else {
            return service.getAllUsersInactive().stream().map(user -> service.mapToDTO(user)).toList();
        }
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/get/type/{type}")
    public List<UserDTO> getByType(@PathVariable String type, @RequestParam(required = false) Integer active){
        
        return service.getUsersByTypeActive(type,active).stream().map(user -> service.mapToDTO(user)).toList();
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/get/{id}")
    public UserDTO getById(@PathVariable Long id){
        return service.mapToDTO(service.getUserById(id));
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/add")
    public UserDTO addUser(@RequestBody UserDTO user){
        return service.createUser(user);
    }

    @CrossOrigin(origins = "*")
    @PutMapping("/update/{id}")
    public UserDTO updateUser(@PathVariable Long id, @RequestBody UserDTO user){
        return service.updateUser(id, user);

    }

    @CrossOrigin(origins = "*")
    @PutMapping("/desactivate/{id}")
    public ResponseEntity<String> desactivateUser(@PathVariable Long id){
        service.updateStatus(id, 0);
        String message = "el Usuario con id: " + id + " se desactivo correctamente";
        return ResponseEntity.ok(message);
    }

    @CrossOrigin(origins = "*")
    @PutMapping("/activate/{id}")
    public ResponseEntity<String> activateUser(@PathVariable Long id){
        service.updateStatus(id, 1);
        String message = "el Usuario con id: " + id + " se desactivo correctamente";
        return ResponseEntity.ok(message);
    }

    @CrossOrigin(origins = "*")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id){
        service.mapToDTO(service.deleteUser(id));
        String message = "el Usuario con id: " + id + " se elimino correctamente";
        return ResponseEntity.ok(message);
    }
}

