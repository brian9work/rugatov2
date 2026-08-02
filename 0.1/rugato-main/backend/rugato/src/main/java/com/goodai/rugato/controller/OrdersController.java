package com.goodai.rugato.controller;

import com.goodai.rugato.dto.OrderResponseDTO;
import com.goodai.rugato.dto.OrdersDTO;
import com.goodai.rugato.model.OrdersModel;
import com.goodai.rugato.service.OrdersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/orders")
public class OrdersController {

    @GetMapping("/ping/pong")
    public String ping() {
        return "pong";
    }

    @Autowired
    private OrdersService ordersService;

    @PostMapping("/add")
    public ResponseEntity<OrdersModel> addOrder(@RequestBody OrdersDTO orderDetails) {
        OrdersModel createdOrder = ordersService.createOrder(orderDetails);
        return ResponseEntity.ok(createdOrder);
    }

    @GetMapping("/today")
    public ResponseEntity<List<OrderResponseDTO>> getTodaysOrders() {
        return ResponseEntity.ok(ordersService.getTodaysOrders());
    }

    @GetMapping("/today/user/{userId}")
    public ResponseEntity<List<OrderResponseDTO>> getTodaysOrdersByUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(ordersService.getTodaysOrdersByUser(userId));
    }

    @GetMapping("/history")
    public ResponseEntity<Page<OrdersModel>> getOrderHistory(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            Pageable pageable) {
        return ResponseEntity.ok(ordersService.getOrderHistory(startDate, endDate, pageable));
    }
}