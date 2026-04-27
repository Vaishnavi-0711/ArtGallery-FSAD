package com.gallery.service;

import com.gallery.dto.ArtworkDto;
import com.gallery.entity.*;
import com.gallery.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired private CartRepository cartRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private ArtworkRepository artworkRepo;
    @Autowired private ArtworkService artworkService;

    public void add(Long artworkId, String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        if (cartRepo.findByUserIdAndArtworkId(user.getId(), artworkId).isPresent()) return;
        Artwork artwork = artworkRepo.findById(artworkId).orElseThrow();
        Cart cart = new Cart();
        cart.setUser(user);
        cart.setArtwork(artwork);
        cartRepo.save(cart);
    }

    @Transactional
    public void remove(Long artworkId, String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        cartRepo.deleteByUserIdAndArtworkId(user.getId(), artworkId);
    }

    public List<ArtworkDto.Response> getMyCart(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        return cartRepo.findByUserId(user.getId()).stream()
                .map(c -> artworkService.toResponse(c.getArtwork()))
                .collect(Collectors.toList());
    }
}
