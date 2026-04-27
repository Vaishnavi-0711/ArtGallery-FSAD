package com.gallery.service;

import com.gallery.dto.ReviewDto;
import com.gallery.entity.*;
import com.gallery.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired private ReviewRepository reviewRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private ArtworkRepository artworkRepo;

    public ReviewDto.Response addReview(ReviewDto.Request req, String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        Artwork artwork = artworkRepo.findById(req.getArtworkId()).orElseThrow();
        Review review = reviewRepo.findByUserIdAndArtworkId(user.getId(), artwork.getId())
                .orElse(new Review());
        review.setUser(user);
        review.setArtwork(artwork);
        review.setRating(req.getRating());
        review.setComment(req.getComment());
        return toResponse(reviewRepo.save(review));
    }

    public List<ReviewDto.Response> getByArtwork(Long artworkId) {
        return reviewRepo.findByArtworkId(artworkId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    private ReviewDto.Response toResponse(Review r) {
        ReviewDto.Response res = new ReviewDto.Response();
        res.setId(r.getId());
        res.setUserName(r.getUser().getName());
        res.setRating(r.getRating());
        res.setComment(r.getComment());
        res.setCreatedAt(r.getCreatedAt());
        return res;
    }
}
