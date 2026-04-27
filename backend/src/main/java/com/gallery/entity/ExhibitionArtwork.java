package com.gallery.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "exhibition_artworks")
@Data
public class ExhibitionArtwork {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exhibition_id", nullable = false)
    private Exhibition exhibition;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "artwork_id", nullable = false)
    private Artwork artwork;

    private Integer displayOrder = 0;
}
