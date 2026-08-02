package com.goodai.rugato.service;

import com.goodai.rugato.dto.DeliveryInfoDTO;
import com.goodai.rugato.dto.OrderResponseDTO;
import com.goodai.rugato.dto.OrderResponseReportDTO;
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
import java.util.Optional;

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
        newOrder.setService(orderDetails.getService());
        newOrder.setStatus_id(pendingStatus.getId());
        newOrder.setCoustumer(orderDetails.getCoustumer());

        return ordersRepository.save(newOrder);
    }

    public List<OrderResponseDTO> getTodaysOrders() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        List<Integer> statusIds = Arrays.asList(1, 2, 3, 4);

        return ordersRepository.findTodaysOrdersWithDetails(startOfDay, endOfDay, statusIds);
    }

    public List<OrderResponseDTO> getAllOrders() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        List<Integer> statusIds = Arrays.asList(1, 2, 3, 4);

        return ordersRepository.findAllOrdersWithDetails(startOfDay, endOfDay, statusIds);
    }

    public String updateDelivery(Long orderId, DeliveryInfoDTO deliveryInfo){
        Optional<OrdersModel> orderToUpdate = ordersRepository.findById(orderId);

        if(orderToUpdate.isEmpty()){
            return "Error al actualizar la orden con ID: " + orderId;
        }

        OrdersModel order = orderToUpdate.get();

        order.setUser(deliveryInfo.getUser());
        order.setPayment(deliveryInfo.getPayment());

        ordersRepository.save(order);
        return "1";
    }

    public List<OrderResponseDTO> getTodaysOrdersByUser(Integer userId) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        List<Integer> statusIds = Arrays.asList(1, 2, 3, 4);

        return ordersRepository.findTodaysOrdersByUserWithDetails(userId, startOfDay, endOfDay, statusIds);
    }

    public Page<OrderResponseDTO> getOrderHistory(LocalDate startDate, LocalDate endDate, Pageable pageable) {
        return ordersRepository.findOrderHistory(startDate, endDate, pageable);
    }

    public Page<OrderResponseReportDTO> getReportToday(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        System.out.println(startDate);
        System.out.println(endDate);
        return ordersRepository.getReportToday(startDate, endDate, pageable);
    }

    private OrdersModel updateOrderStatus(Long orderId, Integer newStatusId) {
        OrdersModel orderToUpdate = ordersRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("No se encontró la orden con ID: " + orderId));
        orderToUpdate.setStatus_id(newStatusId);
        return ordersRepository.save(orderToUpdate);
    }
    public OrdersModel setStatusToInPreparation(Long orderId) {
        // 'en preparacion' es el ID 2
        return updateOrderStatus(orderId, 2);
    }

    public OrdersModel setStatusToCanceled(Long orderId) {
        // 'cancelado' es el ID 3
        return updateOrderStatus(orderId, 3);
    }

    public OrdersModel setStatusToCompleted(Long orderId) {
        // 'completado' es el ID 4
        return updateOrderStatus(orderId, 4);
    }

    public OrdersModel setStatusToDelivered(Long orderId) {
        // 'entregado' es el ID 5
        return updateOrderStatus(orderId, 5);
    }
    public OrdersModel setStatusToRevert(Long orderId) {
        // 'entregado' es el ID 5
        return updateOrderStatus(orderId, 1);
    }
}