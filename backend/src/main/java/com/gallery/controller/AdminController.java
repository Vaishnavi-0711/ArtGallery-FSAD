package com.gallery.controller;

import com.gallery.dto.ArtworkDto;
import com.gallery.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired private UserService userService;
    @Autowired private ArtworkService artworkService;
    @Autowired private AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/approve-user/{id}")
    public ResponseEntity<?> approveUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.approveUser(id));
    }

    @DeleteMapping("/block-user/{id}")
    public ResponseEntity<?> blockUser(@PathVariable Long id) {
        userService.blockUser(id);
        return ResponseEntity.ok(Map.of("message", "User blocked"));
    }

    @PutMapping("/assign-role/{id}")
    public ResponseEntity<?> assignRole(@PathVariable Long id, @RequestParam String role) {
        return ResponseEntity.ok(userService.assignRole(id, role));
    }

    @GetMapping("/artworks")
    public ResponseEntity<?> getAllArtworks(@RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(artworkService.getAllForAdmin(page));
    }

    @PutMapping("/approve-artwork/{id}")
    public ResponseEntity<?> approveArtwork(@PathVariable Long id) {
        return ResponseEntity.ok(artworkService.approveArtwork(id));
    }

    @PutMapping("/reject-artwork/{id}")
    public ResponseEntity<?> rejectArtwork(@PathVariable Long id) {
        return ResponseEntity.ok(artworkService.rejectArtwork(id));
    }

    @PostMapping("/artworks")
    public ResponseEntity<?> createArtwork(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam BigDecimal price,
            @RequestParam Long categoryId,
            @RequestParam(required = false) String culturalHistory,
            @RequestParam Long artistId,
            @RequestParam(required = false) MultipartFile image) {
        try {
            ArtworkDto.Request req = new ArtworkDto.Request();
            req.setTitle(title); req.setDescription(description);
            req.setPrice(price); req.setCategoryId(categoryId);
            req.setCulturalHistory(culturalHistory);
            return ResponseEntity.ok(artworkService.createByAdmin(req, image, artistId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/artworks/{id}")
    public ResponseEntity<?> deleteArtwork(@PathVariable Long id) {
        artworkService.deleteByAdmin(id);
        return ResponseEntity.ok(Map.of("message", "Deleted"));
    }

    @GetMapping("/reports")
    public ResponseEntity<?> getReports() {
        return ResponseEntity.ok(adminService.getReports());
    }
}
