package com.gallery.service;

import com.gallery.dto.OrderDto;
import com.gallery.entity.*;
import com.gallery.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired private OrderRepository orderRepo;
    @Autowired private CartRepository cartRepo;
    @Autowired private UserRepository userRepo;

    @Transactional
    public OrderDto.Response checkout(String userEmail) {
        User user = userRepo.findByEmail(userEmail).orElseThrow();
        List<Cart> cartItems = cartRepo.findByUserId(user.getId());
        if (cartItems.isEmpty()) throw new RuntimeException("Cart is empty");

        Order order = new Order();
        order.setUser(user);

        BigDecimal total = BigDecimal.ZERO;
        for (Cart item : cartItems) {
            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setArtwork(item.getArtwork());
            oi.setPrice(item.getArtwork().getPrice());
            order.getItems().add(oi);
            total = total.add(item.getArtwork().getPrice());
        }
        order.setTotalPrice(total);
        order.setStatus(Order.Status.COMPLETED);
        orderRepo.save(order);
        cartRepo.deleteByUserId(user.getId());
        return toResponse(order);
    }

    public List<OrderDto.Response> getMyOrders(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        return orderRepo.findByUserId(user.getId()).stream().map(this::toResponse).collect(Collectors.toList());
    }

    private OrderDto.Response toResponse(Order o) {
        OrderDto.Response r = new OrderDto.Response();
        r.setId(o.getId());
        r.setTotalPrice(o.getTotalPrice());
        r.setStatus(o.getStatus().name());
        r.setCreatedAt(o.getCreatedAt());
        r.setItems(o.getItems().stream().map(i -> {
            OrderDto.ItemResponse ir = new OrderDto.ItemResponse();
            ir.setArtworkId(i.getArtwork().getId());
            ir.setArtworkTitle(i.getArtwork().getTitle());
            ir.setImageUrl(i.getArtwork().getImageUrl());
            ir.setPrice(i.getPrice());
            return ir;
        }).collect(Collectors.toList()));
        return r;
    }
}
