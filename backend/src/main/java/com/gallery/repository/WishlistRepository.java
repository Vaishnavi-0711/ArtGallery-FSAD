package com.gallery.repository;

import com.gallery.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUserId(Long userId);
    Optional<Wishlist> findByUserIdAndArtworkId(Long userId, Long artworkId);
    void deleteByUserIdAndArtworkId(Long userId, Long artworkId);
}
