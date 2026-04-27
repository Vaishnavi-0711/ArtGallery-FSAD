package com.gallery.service;

import com.gallery.dto.UserDto;
import com.gallery.entity.User;
import com.gallery.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired private UserRepository userRepo;

    public UserDto.Response getProfile(String email) {
        return toResponse(userRepo.findByEmail(email).orElseThrow());
    }

    public UserDto.Response updateProfile(String email, UserDto.UpdateRequest req) {
        User user = userRepo.findByEmail(email).orElseThrow();
        if (req.getName() != null) user.setName(req.getName());
        if (req.getBio() != null) user.setBio(req.getBio());
        return toResponse(userRepo.save(user));
    }

    public List<UserDto.Response> getAllUsers() {
        return userRepo.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public UserDto.Response approveUser(Long id) {
        User user = userRepo.findById(id).orElseThrow();
        user.setStatus(User.Status.ACTIVE);
        return toResponse(userRepo.save(user));
    }

    public void blockUser(Long id) {
        User user = userRepo.findById(id).orElseThrow();
        user.setStatus(User.Status.BLOCKED);
        userRepo.save(user);
    }

    public UserDto.Response assignRole(Long id, String role) {
        User user = userRepo.findById(id).orElseThrow();
        user.setRole(User.Role.valueOf(role.toUpperCase()));
        return toResponse(userRepo.save(user));
    }

    public UserDto.Response toResponse(User u) {
        UserDto.Response r = new UserDto.Response();
        r.setId(u.getId());
        r.setName(u.getName());
        r.setEmail(u.getEmail());
        r.setRole(u.getRole().name());
        r.setStatus(u.getStatus().name());
        r.setBio(u.getBio());
        r.setProfileImage(u.getProfileImage());
        r.setCreatedAt(u.getCreatedAt());
        return r;
    }
}
