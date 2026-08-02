package com.goodai.rugato.repository;

import com.goodai.rugato.model.ExpenseModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface iExpenseRepository extends JpaRepository<ExpenseModel, Long> {

    @Query("SELECT e FROM ExpenseModel e WHERE e.created_at BETWEEN :startDate AND :endDate")
    List<ExpenseModel> findByDateBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT e FROM ExpenseModel e WHERE e.created_at BETWEEN :startDate AND :endDate")
    Page<ExpenseModel> findByDateBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate, Pageable pageable);
}