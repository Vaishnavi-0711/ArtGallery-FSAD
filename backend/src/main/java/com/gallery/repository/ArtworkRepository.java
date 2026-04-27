package com.gallery.repository;

import com.gallery.entity.Artwork;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ArtworkRepository extends JpaRepository<Artwork, Long> {

    List<Artwork> findByArtistId(Long artistId);

    Page<Artwork> findByStatus(Artwork.Status status, Pageable pageable);

    @Query("SELECT a FROM Artwork a WHERE a.status = 'APPROVED' AND " +
           "(:title IS NULL OR LOWER(a.title) LIKE LOWER(CONCAT('%',:title,'%'))) AND " +
           "(:categoryId IS NULL OR a.category.id = :categoryId) AND " +
           "(:minPrice IS NULL OR a.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR a.price <= :maxPrice)")
    Page<Artwork> searchArtworks(@Param("title") String title,
                                  @Param("categoryId") Long categoryId,
                                  @Param("minPrice") BigDecimal minPrice,
                                  @Param("maxPrice") BigDecimal maxPrice,
                                  Pageable pageable);

    long countByStatus(Artwork.Status status);
}
