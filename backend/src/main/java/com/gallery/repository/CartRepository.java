package com.gallery.repository;

import com.gallery.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUserId(Long userId);
    Optional<Cart> findByUserIdAndArtworkId(Long userId, Long artworkId);
    void deleteByUserId(Long userId);
    void deleteByUserIdAndArtworkId(Long userId, Long artworkId);
}
