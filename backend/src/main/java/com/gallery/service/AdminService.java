package com.gallery.service;

import com.gallery.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AdminService {

    @Autowired private UserRepository userRepo;
    @Autowired private ArtworkRepository artworkRepo;
    @Autowired private OrderRepository orderRepo;

    public Map<String, Object> getReports() {
        Map<String, Object> report = new HashMap<>();
        report.put("totalUsers", userRepo.count());
        report.put("totalArtworks", artworkRepo.count());
        report.put("totalOrders", orderRepo.count());
        report.put("pendingArtworks", artworkRepo.countByStatus(com.gallery.entity.Artwork.Status.PENDING));
        report.put("approvedArtworks", artworkRepo.countByStatus(com.gallery.entity.Artwork.Status.APPROVED));
        report.put("totalArtists", userRepo.countByRole(com.gallery.entity.User.Role.ARTIST));
        report.put("totalVisitors", userRepo.countByRole(com.gallery.entity.User.Role.VISITOR));
        return report;
    }
}
