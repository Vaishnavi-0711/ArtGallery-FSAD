package com.gallery.service;

import com.gallery.dto.ExhibitionDto;
import com.gallery.entity.*;
import com.gallery.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExhibitionService {

    @Autowired private ExhibitionRepository exhibitionRepo;
    @Autowired private ArtworkRepository artworkRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private ArtworkService artworkService;

    public ExhibitionDto.Response create(ExhibitionDto.Request req, String curatorEmail) {
        User curator = userRepo.findByEmail(curatorEmail).orElseThrow();
        Exhibition ex = new Exhibition();
        ex.setCurator(curator);
        ex.setTitle(req.getTitle());
        ex.setDescription(req.getDescription());
        ex.setTheme(req.getTheme());
        return toResponse(exhibitionRepo.save(ex));
    }

    public ExhibitionDto.Response update(Long id, ExhibitionDto.Request req, String curatorEmail) {
        Exhibition ex = exhibitionRepo.findById(id).orElseThrow();
        if (!ex.getCurator().getEmail().equals(curatorEmail)) throw new RuntimeException("Unauthorized");
        ex.setTitle(req.getTitle());
        ex.setDescription(req.getDescription());
        ex.setTheme(req.getTheme());
        return toResponse(exhibitionRepo.save(ex));
    }

    public void delete(Long id, String curatorEmail) {
        Exhibition ex = exhibitionRepo.findById(id).orElseThrow();
        if (!ex.getCurator().getEmail().equals(curatorEmail)) throw new RuntimeException("Unauthorized");
        exhibitionRepo.delete(ex);
    }

    public ExhibitionDto.Response addArtwork(Long exhibitionId, Long artworkId, String curatorEmail) {
        Exhibition ex = exhibitionRepo.findById(exhibitionId).orElseThrow();
        if (!ex.getCurator().getEmail().equals(curatorEmail)) throw new RuntimeException("Unauthorized");
        Artwork artwork = artworkRepo.findById(artworkId).orElseThrow();
        ExhibitionArtwork ea = new ExhibitionArtwork();
        ea.setExhibition(ex);
        ea.setArtwork(artwork);
        ea.setDisplayOrder(ex.getArtworks().size());
        ex.getArtworks().add(ea);
        return toResponse(exhibitionRepo.save(ex));
    }

    public ExhibitionDto.Response removeArtwork(Long exhibitionId, Long artworkId, String curatorEmail) {
        Exhibition ex = exhibitionRepo.findById(exhibitionId).orElseThrow();
        if (!ex.getCurator().getEmail().equals(curatorEmail)) throw new RuntimeException("Unauthorized");
        ex.getArtworks().removeIf(ea -> ea.getArtwork().getId().equals(artworkId));
        return toResponse(exhibitionRepo.save(ex));
    }

    public List<ExhibitionDto.Response> getMyCurations(String email) {
        User curator = userRepo.findByEmail(email).orElseThrow();
        return exhibitionRepo.findByCuratorId(curator.getId()).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<ExhibitionDto.Response> getAll() {
        return exhibitionRepo.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ExhibitionDto.Response getById(Long id) {
        return toResponse(exhibitionRepo.findById(id).orElseThrow());
    }

    private ExhibitionDto.Response toResponse(Exhibition ex) {
        ExhibitionDto.Response r = new ExhibitionDto.Response();
        r.setId(ex.getId());
        r.setTitle(ex.getTitle());
        r.setDescription(ex.getDescription());
        r.setTheme(ex.getTheme());
        r.setCuratorName(ex.getCurator().getName());
        r.setCreatedAt(ex.getCreatedAt());
        r.setArtworks(ex.getArtworks().stream()
                .map(ea -> artworkService.toResponse(ea.getArtwork()))
                .collect(Collectors.toList()));
        return r;
    }
}
