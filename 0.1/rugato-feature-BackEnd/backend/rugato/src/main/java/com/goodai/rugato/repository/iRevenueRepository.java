package com.goodai.rugato.repository;

import com.goodai.rugato.model.RevenuesModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface iRevenueRepository extends JpaRepository<RevenuesModel, Integer> {
    List<RevenuesModel> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<RevenuesModel> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
}