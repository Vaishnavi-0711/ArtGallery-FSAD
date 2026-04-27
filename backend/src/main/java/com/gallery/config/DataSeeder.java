package com.gallery.config;

import com.gallery.entity.*;
import com.gallery.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner seedData(
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            ArtworkRepository artworkRepository,
            ExhibitionRepository exhibitionRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // 1. Seed Admin
            if (!userRepository.existsByEmail("admin@gallery.com")) {
                User admin = new User();
                admin.setName("Admin User");
                admin.setEmail("admin@gallery.com");
                admin.setPassword(passwordEncoder.encode("Admin123"));
                admin.setRole(User.Role.ADMIN);
                admin.setStatus(User.Status.ACTIVE);
                userRepository.save(admin);
            }

            // 2. Seed Categories
            String[] catNames = {"Oil Painting", "Sculpture", "Digital Art", "Watercolor", "Abstract", "Photography", "Sketch"};
            List<Category> categories = new ArrayList<>();
            for (String name : catNames) {
                Category cat = categoryRepository.findAll().stream()
                        .filter(c -> c.getName().equals(name))
                        .findFirst()
                        .orElseGet(() -> {
                            Category newCat = new Category();
                            newCat.setName(name);
                            return categoryRepository.save(newCat);
                        });
                categories.add(cat);
            }

            // 3. Seed Artist
            User artist = userRepository.findByEmail("artist@gallery.com").orElseGet(() -> {
                User u = new User();
                u.setName("Master Artist");
                u.setEmail("artist@gallery.com");
                u.setPassword(passwordEncoder.encode("Admin123"));
                u.setRole(User.Role.ARTIST);
                u.setStatus(User.Status.ACTIVE);
                u.setBio("A world-renowned painter specializing in vibrant landscapes and abstract forms.");
                return userRepository.save(u);
            });

            // 4. Seed Curator
            User curator = userRepository.findByEmail("curator@gallery.com").orElseGet(() -> {
                User u = new User();
                u.setName("Elite Curator");
                u.setEmail("curator@gallery.com");
                u.setPassword(passwordEncoder.encode("Admin123"));
                u.setRole(User.Role.CURATOR);
                u.setStatus(User.Status.ACTIVE);
                u.setBio("Passionate about discovering new talents and organizing thematic art events.");
                return userRepository.save(u);
            });

            // 5. Seed Artworks (25 total)
            if (artworkRepository.count() < 25) {
                Random rand = new Random();
                String[] adjectives = {"Mystic", "Serene", "Golden", "Urban", "Vibrant", "Eternal", "Fading", "Wild", "Digital", "Ancient"};
                String[] nouns = {"Sunset", "Dreams", "Pulse", "Echo", "Vision", "Nature", "Canvas", "Flow", "Shadow", "Light"};

                for (int i = 1; i <= 25; i++) {
                    Artwork artwork = new Artwork();
                    artwork.setTitle(adjectives[rand.nextInt(adjectives.length)] + " " + nouns[rand.nextInt(nouns.length)] + " #" + i);
                    artwork.setDescription("A beautiful masterpiece created with passion and technique. This artwork explores themes of " + nouns[rand.nextInt(nouns.length)].toLowerCase() + " and human emotion.");
                    artwork.setPrice(new BigDecimal(5000 + rand.nextInt(45000)));
                    artwork.setArtist(artist);
                    artwork.setCategory(categories.get(rand.nextInt(categories.size())));
                    artwork.setImageUrl("/uploads/art" + i + ".jpg");
                    artwork.setStatus(Artwork.Status.APPROVED);
                    artwork.setCulturalHistory("This style originated in the late 19th century and has evolved significantly over the decades, influenced by various global art movements.");
                    artworkRepository.save(artwork);
                }
            }

            // 6. Seed Exhibitions
            if (exhibitionRepository.count() == 0) {
                List<Artwork> allArtworks = artworkRepository.findAll();
                
                // Exhibition 1
                Exhibition ex1 = new Exhibition();
                ex1.setTitle("Modern Horizons 2024");
                ex1.setDescription("A collection exploring the intersection of traditional mediums and modern perspectives.");
                ex1.setTheme("Contemporary");
                ex1.setCurator(curator);
                
                for (int i = 0; i < 5; i++) {
                    ExhibitionArtwork ea = new ExhibitionArtwork();
                    ea.setExhibition(ex1);
                    ea.setArtwork(allArtworks.get(i));
                    ea.setDisplayOrder(i);
                    ex1.getArtworks().add(ea);
                }
                exhibitionRepository.save(ex1);

                // Exhibition 2
                Exhibition ex2 = new Exhibition();
                ex2.setTitle("Nature's Whisper");
                ex2.setDescription("Immerse yourself in the tranquility of nature through these selected watercolor and oil paintings.");
                ex2.setTheme("Nature");
                ex2.setCurator(curator);
                
                for (int i = 5; i < 10; i++) {
                    ExhibitionArtwork ea = new ExhibitionArtwork();
                    ea.setExhibition(ex2);
                    ea.setArtwork(allArtworks.get(i));
                    ea.setDisplayOrder(i - 5);
                    ex2.getArtworks().add(ea);
                }
                exhibitionRepository.save(ex2);
            }
        };
    }
}
