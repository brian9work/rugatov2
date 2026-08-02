package com.goodai.rugato.repository;

import com.goodai.rugato.model.IngredientsModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface iIngredientsRepository extends JpaRepository<IngredientsModel, Integer> {
    List<IngredientsModel> findByMenuId (Integer menu_id);
    //List<IngredientsModel> findByMenuName (Integer menu_id);
}
