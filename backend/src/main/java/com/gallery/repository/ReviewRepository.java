package com.gallery.repository;

import com.gallery.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByArtworkId(Long artworkId);
    Optional<Review> findByUserIdAndArtworkId(Long userId, Long artworkId);
}
