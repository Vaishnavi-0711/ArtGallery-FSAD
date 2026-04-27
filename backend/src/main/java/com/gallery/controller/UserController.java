package com.gallery.controller;

import com.gallery.dto.UserDto;
import com.gallery.service.ExhibitionService;
import com.gallery.service.UserService;
import com.gallery.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired private UserService userService;
    @Autowired private ExhibitionService exhibitionService;
    @Autowired private CategoryRepository categoryRepo;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(userService.getProfile(user.getUsername()));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UserDto.UpdateRequest req,
                                           @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(userService.updateProfile(user.getUsername(), req));
    }

    @GetMapping("/exhibitions")
    public ResponseEntity<?> getAllExhibitions() {
        return ResponseEntity.ok(exhibitionService.getAll());
    }

    @GetMapping("/exhibitions/{id}")
    public ResponseEntity<?> getExhibition(@PathVariable Long id) {
        return ResponseEntity.ok(exhibitionService.getById(id));
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        return ResponseEntity.ok(categoryRepo.findAll());
    }
}
