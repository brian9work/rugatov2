package com.goodai.rugato.repository;

import com.goodai.rugato.model.CashBoxModel;
import com.goodai.rugato.model.ExpenseModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface iCashBoxRepository extends JpaRepository<CashBoxModel, Integer> {
    @Query("SELECT cb FROM CashBoxModel cb " +
            "WHERE cb.transaction_date = " +
            "(SELECT MAX(cb.transaction_date) " +
                "FROM CashBoxModel cb2 " +
                "WHERE FUNCTION('DATE', cb2.transaction_date) = FUNCTION('DATE', cb.transaction_date)) " +
            "ORDER BY cb.transaction_date DESC")
    List<CashBoxModel> getByDateLocalTime(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT cb FROM CashBoxModel cb WHERE cb.transaction_date BETWEEN :startDate AND :endDate ")
    List<CashBoxModel> getByDate(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}