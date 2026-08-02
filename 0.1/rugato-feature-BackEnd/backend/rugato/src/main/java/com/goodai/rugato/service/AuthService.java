package com.goodai.rugato.service;


import com.goodai.rugato.dto.auth.AuthRequestDTO;
import com.goodai.rugato.dto.auth.AuthResponseDTO;
import com.goodai.rugato.model.UserModel;
import com.goodai.rugato.repository.iUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private iUserRepository userRepository;

    public ResponseEntity<AuthResponseDTO> login(AuthRequestDTO authRequestDTO) {
        Optional<UserModel> user = userRepository.findByUser(authRequestDTO.getUsername());

        if(user.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        UserModel userModel = user.get();

        if(!authRequestDTO.getPassword().equals(userModel.getPassword())) {
            return ResponseEntity.badRequest().build();
        }
        if(userModel.getIs_active() == 0){
            return ResponseEntity.badRequest().build();
        }


        AuthResponseDTO authResponse = new AuthResponseDTO();
        authResponse.setId(userModel.getId());
        authResponse.setUsername(userModel.getUser());
        authResponse.setName(userModel.getName() + " " + userModel.getLastname());
        authResponse.setType(userModel.getType());

        return ResponseEntity.ok(authResponse);
    }
}
