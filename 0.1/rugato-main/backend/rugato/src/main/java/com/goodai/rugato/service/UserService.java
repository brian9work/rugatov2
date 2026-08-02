package com.goodai.rugato.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.autoconfigure.security.SecurityProperties.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

import com.goodai.rugato.dto.UserDTO;
import com.goodai.rugato.model.UserModel;
import com.goodai.rugato.repository.iUserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService {
    @Autowired
    private iUserRepository repository;

    public List<UserModel> getAllUsersActive() {
        return repository.findByStatus(1);
    }

    public List<UserModel> getAllUsersInactive() {
        return repository.findByStatus(0);
    }

    public List<UserModel> getAllUsers() {
        return repository.findAll();
    }

    public List<UserModel> getUsersByTypeActive(String type, Integer active) {
        if (active == null) {
            active = 1;
        }

        return repository.findByTypeActive(type, active);
    }

    public UserModel getUserById(Long id) {
        return findUserOrThrow(id);
    }

    public UserModel getUsersByName(String name) {
        return repository.findByName(name)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No se encontró usuario con name: " + name));
    }

    @Transactional
    public UserDTO createUser(UserDTO user) {
        if (user.getId() != null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No se debe enviar id al crear un usuario");
        }
        if (user.getIs_active() == null) {
            user.setIs_active(1);
        }
        if (user.getType() == null) {
            user.setType("1");
        }
        Map<String, Object> fields = Map.of(
                "nombre", user.getName(),
                "apellido", user.getLastname(),
                "contraseña", user.getPassword(),
                "teléfono", user.getPhone(),
                "usuario", user.getUser());

        fields.forEach((fieldName, value) -> {
            if (value == null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "NO deje el campo vacio de " + fieldName);
            }
        });

        UserModel entity = mapToEntity(user);
        UserModel savedEntity = repository.save(entity);
        return mapToDTO(savedEntity);
    }

    @Transactional
    public UserDTO updateUser(Long id, UserDTO user) {
        UserModel existingUser = findUserOrThrow(id);
        updateFields(existingUser, user);
        UserModel savedUser = repository.save(existingUser);
        return mapToDTO(savedUser);
    }

    @Transactional
    public UserModel deleteUser(Long id) {
        UserModel existingUser = findUserOrThrow(id);
        repository.deleteById(id);
        return existingUser;
    }

    @Transactional
    public UserModel updateStatus(Long id, Integer active) {
        UserModel user = findUserOrThrow(id);
        user.setIs_active(active);
        return repository.save(user);
    }

    private UserModel findUserOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    private void updateFields(UserModel existing, UserDTO update) {
        if (update.getName() != null)
            existing.setName(update.getName());
        if (update.getLastname() != null)
            existing.setLastname(update.getLastname());
        if (update.getPhone() != null)
            existing.setPhone(update.getPhone());
        if (update.getIs_active() != null)
            existing.setIs_active(update.getIs_active());
        if (update.getPassword() != null)
            existing.setPassword(update.getPassword());
        if (update.getType() != null)
            existing.setType(update.getType());
        // if (update.getUser() != null) existing.setUser(update.getUser());
    }

    public UserDTO mapToDTO(UserModel user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setLastname(user.getLastname());
        dto.setPhone(user.getPhone());
        dto.setPassword(user.getPassword());
        dto.setType(user.getType());
        dto.setIs_active(user.getIs_active());
        dto.setCreated_at(user.getCreated_at());
        dto.setUser(user.getUser());
        // dto.setLast_updated(user.getLast_updated());
        return dto;
    }

    private UserModel mapToEntity(UserDTO dto) {
        UserModel user = new UserModel();
        user.setId(dto.getId());
        user.setName(dto.getName());
        user.setLastname(dto.getLastname());
        user.setPhone(dto.getPhone());
        user.setPassword(dto.getPassword());
        user.setType(dto.getType());
        user.setIs_active(dto.getIs_active());
        user.setCreated_at(dto.getCreated_at());
        user.setUser(dto.getUser());
        // user.setLast_updated(dto.getLast_updated());
        return user;
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    public class UserNotFoundException extends RuntimeException {
        public UserNotFoundException(Long id) {
            super("No se encontró el usuario con id: " + id);
        }
    }

}
