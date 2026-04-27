package com.gallery.controller;

import com.gallery.dto.ArtworkDto;
import com.gallery.service.ArtworkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@RestController
public class ArtworkController {

    @Autowired private ArtworkService artworkService;

    // Public endpoints
    @GetMapping("/api/artworks")
    public Page<ArtworkDto.Response> search(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "newest") String sort) {
        return artworkService.search(title, categoryId, minPrice, maxPrice, page, sort);
    }

    @GetMapping("/api/artworks/{id}")
    public ArtworkDto.Response getById(@PathVariable Long id) {
        return artworkService.getById(id);
    }

    // Artist endpoints
    @PostMapping("/api/artist/artworks")
    public ResponseEntity<?> create(
            @RequestPart("data") ArtworkDto.Request req,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(artworkService.create(req, image, user.getUsername()));
    }

    @GetMapping("/api/artist/artworks")
    public ResponseEntity<?> getMyArtworks(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(artworkService.getByArtist(user.getUsername()));
    }

    @PutMapping("/api/artist/artworks/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestPart("data") ArtworkDto.Request req,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(artworkService.update(id, req, image, user.getUsername()));
    }

    @DeleteMapping("/api/artist/artworks/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, @AuthenticationPrincipal UserDetails user) {
        artworkService.delete(id, user.getUsername());
        return ResponseEntity.ok().build();
    }
}
