package com.goodai.rugato.repository;

import com.goodai.rugato.model.FinancialExpenseModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface iFinancialExpenseRepository extends JpaRepository<FinancialExpenseModel, Integer> {
    List<FinancialExpenseModel> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<FinancialExpenseModel> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
}