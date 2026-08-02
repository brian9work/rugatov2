package com.goodai.rugato.repository;

import com.goodai.rugato.model.MenuModel;
import com.goodai.rugato.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface iMenuRepository extends JpaRepository<MenuModel, Integer> {
    @Query("""
       SELECT u FROM MenuModel u
       WHERE (:category IS NULL OR u.category_id = :category)
       """)
    List<MenuModel> getByCategory(@Param("category") Integer category);

    MenuModel getById(Integer id);

    @Query("SELECT u FROM MenuModel u WHERE u.is_active = :status")
    List<MenuModel> findByStatusMenu(@Param("status") Integer status);
    @Query("""
       SELECT u FROM MenuModel u
       WHERE (:category IS NULL OR u.category_id = :category) AND (u.is_active = :status)
       """)
    List<MenuModel> getByCategoryActive(@Param("category") Integer category, @Param("status") Integer status);

}
