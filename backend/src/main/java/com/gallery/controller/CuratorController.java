package com.gallery.controller;

import com.gallery.dto.ExhibitionDto;
import com.gallery.service.ExhibitionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/curator/exhibitions")
public class CuratorController {

    @Autowired private ExhibitionService exhibitionService;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ExhibitionDto.Request req, @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(exhibitionService.create(req, user.getUsername()));
    }

    @GetMapping
    public ResponseEntity<?> getMine(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(exhibitionService.getMyCurations(user.getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody ExhibitionDto.Request req,
                                    @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(exhibitionService.update(id, req, user.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, @AuthenticationPrincipal UserDetails user) {
        exhibitionService.delete(id, user.getUsername());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/artworks/{artworkId}")
    public ResponseEntity<?> addArtwork(@PathVariable Long id, @PathVariable Long artworkId,
                                        @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(exhibitionService.addArtwork(id, artworkId, user.getUsername()));
    }

    @DeleteMapping("/{id}/artworks/{artworkId}")
    public ResponseEntity<?> removeArtwork(@PathVariable Long id, @PathVariable Long artworkId,
                                           @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(exhibitionService.removeArtwork(id, artworkId, user.getUsername()));
    }
}
