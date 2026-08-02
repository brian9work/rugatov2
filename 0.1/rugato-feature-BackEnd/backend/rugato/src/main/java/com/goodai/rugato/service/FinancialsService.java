package com.goodai.rugato.service;

import com.goodai.rugato.dto.CashBoxRequestDTO;
import com.goodai.rugato.dto.ExpenseRequestDTO;
import com.goodai.rugato.dto.RevenueRequestDTO;
import com.goodai.rugato.model.*;
import com.goodai.rugato.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FinancialsService {

    private final iFinancialExpenseRepository financialExpenseRepository;
    private final iRevenueRepository revenueRepository;
    private final iCashBoxRepository cashBoxRepository;
    private final iCatExpenseRepository catExpenseRepository;
    private final iUserRepository userRepository;

    @Autowired
    public FinancialsService(iFinancialExpenseRepository financialExpenseRepository, iRevenueRepository revenueRepository, iCashBoxRepository cashBoxRepository, iCatExpenseRepository catExpenseRepository, iUserRepository userRepository) {
        this.financialExpenseRepository = financialExpenseRepository;
        this.revenueRepository = revenueRepository;
        this.cashBoxRepository = cashBoxRepository;
        this.catExpenseRepository = catExpenseRepository;
        this.userRepository = userRepository;
    }

    private void validateUserExists(Integer userId) {
        if (userId == null) throw new IllegalArgumentException("El ID de usuario no puede ser nulo.");
        if (!userRepository.existsById(userId.longValue())) { // Conversión a Long solo para esta llamada
            throw new EntityNotFoundException("Usuario no encontrado con ID: " + userId);
        }
    }

    @Transactional
    public FinancialExpenseModel addExpense(ExpenseRequestDTO dto) {
        validateUserExists(dto.getUserId());
        FinancialExpenseModel expense = new FinancialExpenseModel();
        expense.setUser_id(dto.getUserId());
        expense.setCategory_name(dto.getCategoryName());
        expense.setQuantity(dto.getQuantity());
        expense.setReason(dto.getReason());
        return financialExpenseRepository.save(expense);
    }

    @Transactional
    public RevenuesModel addRevenue(RevenueRequestDTO dto) {
        validateUserExists(dto.getUserId());
        RevenuesModel revenue = new RevenuesModel();
        revenue.setUser_id(dto.getUserId());
        revenue.setQuantity(dto.getQuantity());
        revenue.setReason(dto.getReason());
        return revenueRepository.save(revenue);
    }

    @Transactional
    public CashBoxModel addMoneyToCashBox(CashBoxRequestDTO dto) {
        CashBoxModel cashBoxMovement = new CashBoxModel();
        cashBoxMovement.setAmount(dto.getAmount());
        cashBoxMovement.setReason(dto.getReason());
        cashBoxMovement.setTransaction_date(LocalDateTime.now());
        return cashBoxRepository.save(cashBoxMovement);
    }

    public String getMoneyFromCashBox(){
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        List<CashBoxModel> cashBoxList = cashBoxRepository.getByDate(startOfDay, endOfDay);

        try {
            return cashBoxList.get(cashBoxList.size() - 1).getAmount() + "";
        } catch (IndexOutOfBoundsException e) {
            return "";
        }
    }

    public List<CashBoxModel> getMoneyFromCashBoxBetweentwoDates(
            LocalDate startOfDay, LocalDate endOfDay, Pageable pageable
    ){
        LocalDateTime start = startOfDay.atStartOfDay();
        LocalDateTime end = endOfDay.atTime(LocalTime.MAX);

        List<CashBoxModel> cashBoxList = cashBoxRepository.getByDateLocalTime(start, end);

        return cashBoxList;
    }

    public Map<String, Object> getTodaysFinancials() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        var expenses = financialExpenseRepository.findByCreatedAtBetween(startOfDay, endOfDay);
        var revenues = revenueRepository.findByCreatedAtBetween(startOfDay, endOfDay);
        Map<String, Object> todayReport = new HashMap<>();
        todayReport.put("expenses", expenses);
        todayReport.put("revenues", revenues);
        return todayReport;
    }

    public List<FinancialExpenseModel> getExpenseHistory(LocalDate startDate, LocalDate endDate, Pageable pageable) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(LocalTime.MAX);
        return financialExpenseRepository.findByCreatedAtBetween(start, end, pageable);
    }

    public List<RevenuesModel> getRevenueHistory(LocalDate startDate, LocalDate endDate, Pageable pageable) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(LocalTime.MAX);
        return revenueRepository.findByCreatedAtBetween(start, end, pageable);
    }
}