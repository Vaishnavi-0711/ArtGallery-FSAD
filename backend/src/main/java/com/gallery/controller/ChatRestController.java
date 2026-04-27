package com.gallery.controller;

import com.gallery.entity.User;
import com.gallery.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
public class ChatRestController {

    @Autowired
    private UserRepository userRepo;

    @GetMapping("/users")
    public ResponseEntity<?> getChatUsers(@RequestParam String role) {
        List<User> users;
        if (role.equals("VISITOR")) {
            users = userRepo.findByRoleAndStatus(User.Role.ARTIST, User.Status.ACTIVE);
        } else if (role.equals("ARTIST")) {
            List<User> visitors = userRepo.findByRoleAndStatus(User.Role.VISITOR, User.Status.ACTIVE);
            List<User> admins   = userRepo.findByRoleAndStatus(User.Role.ADMIN,   User.Status.ACTIVE);
            users = new java.util.ArrayList<>();
            users.addAll(visitors);
            users.addAll(admins);
        } else {
            users = userRepo.findByRoleAndStatus(User.Role.ARTIST, User.Status.ACTIVE);
        }
        return ResponseEntity.ok(users.stream().map(u -> Map.of(
            "id", u.getId(), "name", u.getName(), "role", u.getRole().name(), "email", u.getEmail()
        )).collect(Collectors.toList()));
    }
}
