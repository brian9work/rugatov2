package com.goodai.rugato.repository;

import com.goodai.rugato.model.ExtrasModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface iExtrasRepository extends JpaRepository<ExtrasModel, Integer> {
    List<ExtrasModel> findByMenuId (Integer menu_id);
}
