package com.goodai.rugato.controller;

import com.goodai.rugato.dto.CashBoxRequestDTO;
import com.goodai.rugato.dto.ExpenseRequestDTO;
import com.goodai.rugato.dto.RevenueRequestDTO;
import com.goodai.rugato.model.CashBoxModel;
import com.goodai.rugato.model.FinancialExpenseModel;
import com.goodai.rugato.model.RevenuesModel;
import com.goodai.rugato.service.FinancialsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/financials")
public class FinancialsController {

    private final FinancialsService financialsService;

    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }

    @Autowired
    public FinancialsController(FinancialsService financialsService) {
        this.financialsService = financialsService;
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/expense")
    public ResponseEntity<FinancialExpenseModel> addExpense(@RequestBody ExpenseRequestDTO dto) {
        return ResponseEntity.ok(financialsService.addExpense(dto));
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/revenue")
    public ResponseEntity<RevenuesModel> addRevenue(@RequestBody RevenueRequestDTO dto) {
        return ResponseEntity.ok(financialsService.addRevenue(dto));
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/cashbox")
    public ResponseEntity<CashBoxModel> addMoneyToCashBox(@RequestBody CashBoxRequestDTO dto) {
        return ResponseEntity.ok(financialsService.addMoneyToCashBox(dto));
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/cashbox")
    public ResponseEntity<String> getMoneyFromCashBox() {
        return ResponseEntity.ok(financialsService.getMoneyFromCashBox());
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/today")
    public ResponseEntity<Map<String, Object>> getTodaysFinancials() {
        return ResponseEntity.ok(financialsService.getTodaysFinancials());
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/history/cashbox")
    public ResponseEntity<List<CashBoxModel>> getMoneyFromCashBoxBetweentwoDates(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Pageable pageable) {
        return ResponseEntity.ok(financialsService.getMoneyFromCashBoxBetweentwoDates(startDate, endDate, pageable));
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/history/expenses")
    public ResponseEntity<List<FinancialExpenseModel>> getExpenseHistory(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Pageable pageable) {
        return ResponseEntity.ok(financialsService.getExpenseHistory(startDate, endDate, pageable));
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/history/revenues")
    public ResponseEntity<List<RevenuesModel>> getRevenueHistory(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Pageable pageable) {
        return ResponseEntity.ok(financialsService.getRevenueHistory(startDate, endDate, pageable));
    }
}