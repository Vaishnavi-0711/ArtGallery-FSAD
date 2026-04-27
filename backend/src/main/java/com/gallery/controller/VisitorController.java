package com.gallery.controller;

import com.gallery.dto.ReviewDto;
import com.gallery.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class VisitorController {

    @Autowired private CartService cartService;
    @Autowired private WishlistService wishlistService;
    @Autowired private OrderService orderService;
    @Autowired private ReviewService reviewService;

    // Cart
    @PostMapping("/cart/{artworkId}")
    public ResponseEntity<?> addToCart(@PathVariable Long artworkId, @AuthenticationPrincipal UserDetails user) {
        cartService.add(artworkId, user.getUsername());
        return ResponseEntity.ok(Map.of("message", "Added to cart"));
    }

    @DeleteMapping("/cart/{artworkId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long artworkId, @AuthenticationPrincipal UserDetails user) {
        cartService.remove(artworkId, user.getUsername());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/cart")
    public ResponseEntity<?> getCart(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(cartService.getMyCart(user.getUsername()));
    }

    // Wishlist
    @PostMapping("/wishlist/{artworkId}")
    public ResponseEntity<?> addToWishlist(@PathVariable Long artworkId, @AuthenticationPrincipal UserDetails user) {
        wishlistService.add(artworkId, user.getUsername());
        return ResponseEntity.ok(Map.of("message", "Added to wishlist"));
    }

    @DeleteMapping("/wishlist/{artworkId}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable Long artworkId, @AuthenticationPrincipal UserDetails user) {
        wishlistService.remove(artworkId, user.getUsername());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/wishlist")
    public ResponseEntity<?> getWishlist(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(wishlistService.getMyWishlist(user.getUsername()));
    }

    // Orders
    @PostMapping("/orders/checkout")
    public ResponseEntity<?> checkout(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(orderService.checkout(user.getUsername()));
    }

    @GetMapping("/orders")
    public ResponseEntity<?> getOrders(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(orderService.getMyOrders(user.getUsername()));
    }

    // Reviews
    @PostMapping("/reviews")
    public ResponseEntity<?> addReview(@RequestBody ReviewDto.Request req, @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(reviewService.addReview(req, user.getUsername()));
    }

    @GetMapping("/reviews/{artworkId}")
    public ResponseEntity<?> getReviews(@PathVariable Long artworkId) {
        return ResponseEntity.ok(reviewService.getByArtwork(artworkId));
    }
}
