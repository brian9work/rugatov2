package com.goodai.rugato.repository;

import com.goodai.rugato.model.CatExpenseModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface iCatExpenseRepository extends JpaRepository<CatExpenseModel, Integer> {
    Optional<CatExpenseModel> findByName(String name);
}