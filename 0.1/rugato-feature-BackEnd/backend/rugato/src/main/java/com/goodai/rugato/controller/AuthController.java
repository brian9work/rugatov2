package com.goodai.rugato.controller;

import com.goodai.rugato.dto.auth.AuthRequestDTO;
import com.goodai.rugato.dto.auth.AuthResponseDTO;
import com.goodai.rugato.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @CrossOrigin(origins = "*")
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> addOrder(@RequestBody AuthRequestDTO authRequestDTO) {
        return authService.login(authRequestDTO);
    }
}
