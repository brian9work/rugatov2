package com.goodai.rugato.controller;

import com.goodai.rugato.dto.DeliveryInfoDTO;
import com.goodai.rugato.dto.OrderResponseDTO;
import com.goodai.rugato.dto.OrderResponseReportDTO;
import com.goodai.rugato.dto.OrdersDTO;
import com.goodai.rugato.model.OrdersModel;
import com.goodai.rugato.service.OrdersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/orders")
public class OrdersController {
    @Autowired
    private OrdersService ordersService;

    @CrossOrigin(origins = "*")
    @PostMapping("/add")
    public ResponseEntity<OrdersModel> addOrder(@RequestBody OrdersDTO orderDetails) {
        OrdersModel createdOrder = ordersService.createOrder(orderDetails);
        return ResponseEntity.ok(createdOrder);
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/today")
    public ResponseEntity<List<OrderResponseDTO>> getTodaysOrders() {
        return ResponseEntity.ok(ordersService.getTodaysOrders());
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/today/user/{userId}")
    public ResponseEntity<List<OrderResponseDTO>> getTodaysOrdersByUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(ordersService.getTodaysOrdersByUser(userId));
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/history")
    public ResponseEntity<Page<OrderResponseDTO>> getOrderHistory(
           @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDate startDate,
           @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDate endDate,
           Pageable pageable) {
        return ResponseEntity.ok(ordersService.getOrderHistory(startDate, endDate, pageable));
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/report")
    public ResponseEntity<Page<OrderResponseReportDTO>> getReportToday(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            Pageable pageable) {
        return ResponseEntity.ok(ordersService.getReportToday(startDate, endDate, pageable));
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/allOrders")
    public ResponseEntity<List<OrderResponseDTO>> getAllOrders(
    ) {
        return ResponseEntity.ok(ordersService.getAllOrders());
    }

    @CrossOrigin(origins = "*")
    @PutMapping("/status/in-preparation/{id}")//en preparacion 2
    public ResponseEntity<OrdersModel> setToInPreparation(@PathVariable("id") Long orderId) {
        OrdersModel updatedOrder = ordersService.setStatusToInPreparation(orderId);
        return ResponseEntity.ok(updatedOrder);
    }

    @CrossOrigin(origins = "*")
    @PutMapping("/status/canceled/{id}")//cancelado 5
    public ResponseEntity<OrdersModel> setToCanceled(@PathVariable("id") Long orderId) {
        OrdersModel updatedOrder = ordersService.setStatusToCanceled(orderId);
        return ResponseEntity.ok(updatedOrder);
    }

    @CrossOrigin(origins = "*")
    @PutMapping("/status/completed/{id}")//completado 3
    public ResponseEntity<OrdersModel> setToCompleted(@PathVariable("id") Long orderId) {
        OrdersModel updatedOrder = ordersService.setStatusToCompleted(orderId);
        return ResponseEntity.ok(updatedOrder);
    }

    @CrossOrigin(origins = "*")
    @PutMapping("/status/delivered/{id}")//entregado 5
    public ResponseEntity<OrdersModel> setToDelivered(
            @PathVariable("id") Long orderId,
            @RequestBody DeliveryInfoDTO deliveryInfo
    ) {
        ordersService.updateDelivery(orderId, deliveryInfo);
        OrdersModel updatedOrder = ordersService.setStatusToDelivered(orderId);
        return ResponseEntity.ok(updatedOrder);
    }

    @CrossOrigin(origins = "*")
    @PutMapping("/status/revert/{id}")//entregado 5
    public ResponseEntity<OrdersModel> setToRevert(@PathVariable("id") Long orderId) {
        OrdersModel updatedOrder = ordersService.setStatusToRevert(orderId);
        return ResponseEntity.ok(updatedOrder);
    }
}