package com.goodai.rugato.repository;

import com.goodai.rugato.dto.OrderResponseDTO;
import com.goodai.rugato.dto.OrderResponseReportDTO;
import com.goodai.rugato.model.OrdersModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface iOrdersRepository extends JpaRepository<OrdersModel, Long> {

    @Query("SELECT o FROM OrdersModel o WHERE o.created_at BETWEEN :start AND :end AND o.status_id IN :statusIds")
    List<OrdersModel> findTodaysOrders(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end, @Param("statusIds") List<Integer> statusIds);

    @Query("SELECT o FROM OrdersModel o WHERE o.user_id = :userId AND o.created_at BETWEEN :start AND :end AND o.status_id IN :statusIds")
    List<OrdersModel> findTodaysOrdersByUser(@Param("userId") Integer userId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end, @Param("statusIds") List<Integer> statusIds);


    @Query(value = "SELECT " +
            "o.id AS orderId, o.total AS total, o.notes AS notes, o.created_at, o.details, o.service, o.user, o.payment, " +
            "u.name AS userName, s.name AS statusName, m.name AS dishName, c.name AS categoryName " +
            "FROM orders o " +
            "JOIN user u ON o.user_id = u.id " +
            "JOIN cat_status s ON o.status_id = s.id " +
            "JOIN menu m ON o.menu_id = m.id " +
            "JOIN cat_category c ON m.category_id = c.id " +
            "WHERE " +
            "(:startDate IS NULL OR o.created_at >= :startDate) AND " +
            "(:endDate IS NULL OR o.created_at <= :endDate)",
            countQuery = "SELECT count(o.id) " +
                    "FROM orders o " +
                    "WHERE " +
                    "(:startDate IS NULL OR o.created_at >= :startDate) AND " +
                    "(:endDate IS NULL OR o.created_at <= :endDate)",
            nativeQuery = true)
    Page<OrderResponseDTO> findOrderHistory(
                                             @Param("startDate") LocalDate startDate,
                                             @Param("endDate") LocalDate endDate,
                                             Pageable pageable
    );


    @Query(value = "SELECT " +
            "o.id AS orderId, o.total, o.menu_id AS menuId, o.created_at, o.service, o.user, o.payment, m.name AS platillo " +
            "FROM orders o " +
            "JOIN menu m ON o.menu_id = m.id " +
            "WHERE " +
            "(:startDate IS NULL OR o.created_at >= :startDate) AND " +
            "(:endDate IS NULL OR o.created_at <= :endDate) AND " +
            "o.status_id = 5 ",
            nativeQuery = true)
    Page<OrderResponseReportDTO> getReportToday(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable
    );

    @Query(value = "SELECT " +
            "o.id AS orderId, o.total AS total, o.notes AS notes, o.created_at, o.details, o.service, o.user, o.payment, " +
            "u.name AS userName, s.name AS statusName, m.name AS dishName, c.name AS categoryName," +
            "m.id AS menuId,  m.price, m.price_ch, m.price_med, m.price_gde, o.coustumer " +
            "FROM orders o " +
            "JOIN user u ON o.user_id = u.id " +
            "JOIN cat_status s ON o.status_id = s.id " +
            "JOIN menu m ON o.menu_id = m.id " +
            "JOIN cat_category c ON m.category_id = c.id " +
            "WHERE o.created_at BETWEEN :start AND :end AND o.status_id IN :statusIds",
            nativeQuery = true)
    List<OrderResponseDTO> findTodaysOrdersWithDetails(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end, @Param("statusIds") List<Integer> statusIds);


    @Query(value = "SELECT " +
            "o.id AS orderId, o.total AS total, o.notes AS notes, o.created_at, o.details, o.service, o.user, o.payment, " +
            "u.name AS userName, s.name AS statusName, m.name AS dishName, c.name AS categoryName " +
            "FROM orders o " +
            "JOIN user u ON o.user_id = u.id " +
            "JOIN cat_status s ON o.status_id = s.id " +
            "JOIN menu m ON o.menu_id = m.id " +
            "JOIN cat_category c ON m.category_id = c.id ",
            nativeQuery = true)
    List<OrderResponseDTO> findAllOrdersWithDetails(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end, @Param("statusIds") List<Integer> statusIds);



    @Query(value = "SELECT " +
            "o.id AS orderId, o.total AS total, o.notes AS notes,o.created_at, o.details, o.service, o.user, o.payment, " +
            "u.name AS userName, s.name AS statusName, m.name AS dishName, c.name AS categoryName " +
            "FROM orders o " +
            "JOIN user u ON o.user_id = u.id " +
            "JOIN cat_status s ON o.status_id = s.id " +
            "JOIN menu m ON o.menu_id = m.id " +
            "JOIN cat_category c ON m.category_id = c.id " +
            "WHERE o.user_id = :userId AND o.created_at BETWEEN :start AND :end AND o.status_id IN :statusIds",
            nativeQuery = true)
    List<OrderResponseDTO> findTodaysOrdersByUserWithDetails(@Param("userId") Integer userId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end, @Param("statusIds") List<Integer> statusIds);
}
