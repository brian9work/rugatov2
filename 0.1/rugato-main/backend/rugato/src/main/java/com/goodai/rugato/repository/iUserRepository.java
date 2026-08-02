package com.goodai.rugato.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.goodai.rugato.model.UserModel;

@Repository
public interface iUserRepository extends JpaRepository<UserModel, Long> {

    // UserModel findByName(String name);
    Optional<UserModel> findByName(String name);
    
    @Query("SELECT u FROM UserModel u WHERE u.is_active = :status")
    List<UserModel> findByStatus(@Param("status") Integer status);

    @Query("SELECT u FROM UserModel u WHERE LOWER(u.type) = LOWER(:type) and u.is_active = :active")
    List<UserModel> findByTypeActive(@Param("type") String type, @Param("active") Integer active);
} 