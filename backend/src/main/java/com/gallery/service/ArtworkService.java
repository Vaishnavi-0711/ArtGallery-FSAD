package com.gallery.service;

import com.gallery.dto.ArtworkDto;
import com.gallery.entity.*;
import com.gallery.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ArtworkService {

    @Autowired private ArtworkRepository artworkRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private CategoryRepository categoryRepo;
    @Autowired private ReviewRepository reviewRepo;
    @Autowired private FileStorageService fileStorage;

    public ArtworkDto.Response createByAdmin(ArtworkDto.Request req, MultipartFile image, Long artistId) {
        User artist = userRepo.findById(artistId).orElseThrow();
        Artwork artwork = new Artwork();
        artwork.setArtist(artist);
        artwork.setStatus(Artwork.Status.APPROVED);
        mapRequest(req, artwork);
        if (image != null && !image.isEmpty()) artwork.setImageUrl(fileStorage.store(image));
        return toResponse(artworkRepo.save(artwork));
    }

    public void deleteByAdmin(Long id) {
        artworkRepo.deleteById(id);
    }

    public ArtworkDto.Response create(ArtworkDto.Request req, MultipartFile image, String artistEmail) {
        User artist = userRepo.findByEmail(artistEmail).orElseThrow();
        Artwork artwork = new Artwork();
        artwork.setArtist(artist);
        mapRequest(req, artwork);
        if (image != null && !image.isEmpty()) artwork.setImageUrl(fileStorage.store(image));
        return toResponse(artworkRepo.save(artwork));
    }

    public ArtworkDto.Response update(Long id, ArtworkDto.Request req, MultipartFile image, String artistEmail) {
        Artwork artwork = artworkRepo.findById(id).orElseThrow();
        if (!artwork.getArtist().getEmail().equals(artistEmail))
            throw new RuntimeException("Unauthorized");
        mapRequest(req, artwork);
        if (image != null && !image.isEmpty()) artwork.setImageUrl(fileStorage.store(image));
        return toResponse(artworkRepo.save(artwork));
    }

    public void delete(Long id, String artistEmail) {
        Artwork artwork = artworkRepo.findById(id).orElseThrow();
        if (!artwork.getArtist().getEmail().equals(artistEmail))
            throw new RuntimeException("Unauthorized");
        artworkRepo.delete(artwork);
    }

    public List<ArtworkDto.Response> getByArtist(String email) {
        User artist = userRepo.findByEmail(email).orElseThrow();
        return artworkRepo.findByArtistId(artist.getId()).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public Page<ArtworkDto.Response> search(String title, Long categoryId, BigDecimal minPrice, BigDecimal maxPrice, int page, String sort) {
        Sort s = sort.equals("price_asc") ? Sort.by("price").ascending() :
                 sort.equals("price_desc") ? Sort.by("price").descending() :
                 Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(page, 12, s);
        return artworkRepo.searchArtworks(title, categoryId, minPrice, maxPrice, pageable).map(this::toResponse);
    }

    public ArtworkDto.Response getById(Long id) {
        return toResponse(artworkRepo.findById(id).orElseThrow());
    }

    public ArtworkDto.Response approveArtwork(Long id) {
        Artwork artwork = artworkRepo.findById(id).orElseThrow();
        artwork.setStatus(Artwork.Status.APPROVED);
        return toResponse(artworkRepo.save(artwork));
    }

    public ArtworkDto.Response rejectArtwork(Long id) {
        Artwork artwork = artworkRepo.findById(id).orElseThrow();
        artwork.setStatus(Artwork.Status.REJECTED);
        return toResponse(artworkRepo.save(artwork));
    }

    public Page<ArtworkDto.Response> getAllForAdmin(int page) {
        return artworkRepo.findAll(PageRequest.of(page, 20, Sort.by("createdAt").descending())).map(this::toResponse);
    }

    private void mapRequest(ArtworkDto.Request req, Artwork artwork) {
        if (req.getTitle() != null) artwork.setTitle(req.getTitle());
        if (req.getDescription() != null) artwork.setDescription(req.getDescription());
        if (req.getPrice() != null) artwork.setPrice(req.getPrice());
        if (req.getCulturalHistory() != null) artwork.setCulturalHistory(req.getCulturalHistory());
        if (req.getCategoryId() != null)
            categoryRepo.findById(req.getCategoryId()).ifPresent(artwork::setCategory);
    }

    public ArtworkDto.Response toResponse(Artwork a) {
        ArtworkDto.Response r = new ArtworkDto.Response();
        r.setId(a.getId());
        r.setTitle(a.getTitle());
        r.setDescription(a.getDescription());
        r.setPrice(a.getPrice());
        r.setImageUrl(a.getImageUrl());
        r.setStatus(a.getStatus().name());
        r.setCulturalHistory(a.getCulturalHistory());
        r.setArtistName(a.getArtist().getName());
        r.setArtistId(a.getArtist().getId());
        r.setCreatedAt(a.getCreatedAt());
        if (a.getCategory() != null) {
            r.setCategoryName(a.getCategory().getName());
            r.setCategoryId(a.getCategory().getId());
        }
        List<Review> reviews = reviewRepo.findByArtworkId(a.getId());
        if (!reviews.isEmpty())
            r.setAvgRating(reviews.stream().mapToInt(Review::getRating).average().orElse(0));
        return r;
    }
}
