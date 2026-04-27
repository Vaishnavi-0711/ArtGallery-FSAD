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
public class WishlistService {

    @Autowired private WishlistRepository wishlistRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private ArtworkRepository artworkRepo;
    @Autowired private ArtworkService artworkService;

    public void add(Long artworkId, String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        if (wishlistRepo.findByUserIdAndArtworkId(user.getId(), artworkId).isPresent()) return;
        Artwork artwork = artworkRepo.findById(artworkId).orElseThrow();
        Wishlist w = new Wishlist();
        w.setUser(user);
        w.setArtwork(artwork);
        wishlistRepo.save(w);
    }

    @Transactional
    public void remove(Long artworkId, String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        wishlistRepo.deleteByUserIdAndArtworkId(user.getId(), artworkId);
    }

    public List<ArtworkDto.Response> getMyWishlist(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        return wishlistRepo.findByUserId(user.getId()).stream()
                .map(w -> artworkService.toResponse(w.getArtwork()))
                .collect(Collectors.toList());
    }
}
