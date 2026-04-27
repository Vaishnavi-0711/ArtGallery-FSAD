package com.gallery.repository;

import com.gallery.entity.Exhibition;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExhibitionRepository extends JpaRepository<Exhibition, Long> {
    List<Exhibition> findByCuratorId(Long curatorId);
}
