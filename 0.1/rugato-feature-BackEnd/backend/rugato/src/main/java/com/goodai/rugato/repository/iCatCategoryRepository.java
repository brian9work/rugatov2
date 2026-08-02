package com.goodai.rugato.repository;

import com.goodai.rugato.model.CatCategoryModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface iCatCategoryRepository extends JpaRepository<CatCategoryModel, Integer> {
}
