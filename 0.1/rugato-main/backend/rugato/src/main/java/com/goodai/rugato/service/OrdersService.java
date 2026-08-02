package com.goodai.rugato.service;

import com.goodai.rugato.dto.OrderResponseDTO;
import com.goodai.rugato.dto.OrdersDTO;
import com.goodai.rugato.model.OrdersModel;
import com.goodai.rugato.repository.iOrdersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

import com.goodai.rugato.model.CatStatusModel;
import com.goodai.rugato.repository.iCatStatusRepository;
import jakarta.persistence.EntityNotFoundException;

@Service
public class OrdersService {
    @Autowired
    private iOrdersRepository ordersRepository;

    @Autowired
    private iCatStatusRepository catStatusRepository;

    public OrdersModel createOrder(OrdersDTO orderDetails) {
        OrdersModel newOrder = new OrdersModel();

        CatStatusModel pendingStatus = catStatusRepository.findById(1)
                .orElseThrow(() -> new EntityNotFoundException("Estatus 'Pendiente' no encontrado con ID 1"));

        newOrder.setUser_id(orderDetails.getUser_id());
        newOrder.setMenu_id(orderDetails.getMenu_id());
        newOrder.setTotal(orderDetails.getTotal());
        newOrder.setNotes(orderDetails.getNotes());
        newOrder.setDetails(orderDetails.getDetails());
        newOrder.setStatus_id(pendingStatus.getId());

        return ordersRepository.save(newOrder);
    }

    public List<OrderResponseDTO> getTodaysOrders() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        List<Integer> statusIds = Arrays.asList(1, 2, 3);

        return ordersRepository.findTodaysOrdersWithDetails(startOfDay, endOfDay, statusIds);
    }

    public List<OrderResponseDTO> getTodaysOrdersByUser(Integer userId) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        List<Integer> statusIds = Arrays.asList(1, 2, 3);

        return ordersRepository.findTodaysOrdersByUserWithDetails(userId, startOfDay, endOfDay, statusIds);
    }


    public Page<OrdersModel> getOrderHistory(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return ordersRepository.findOrderHistory(startDate, endDate, pageable);
    }
}