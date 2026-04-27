USE virtual_art_gallery;

-- Artists
INSERT INTO users (name, email, password, role, status, bio) VALUES
('Leonardo Rossi',    'leonardo@gallery.com', '$2a$10$/XpBNy47aUmxeag/xOOM0OZbsWWRTSt9A4de1i1lqeF0z90xpZ51C', 'ARTIST',  'ACTIVE', 'Italian painter inspired by the Renaissance.'),
('Aiko Tanaka',       'aiko@gallery.com',     '$2a$10$/XpBNy47aUmxeag/xOOM0OZbsWWRTSt9A4de1i1lqeF0z90xpZ51C', 'ARTIST',  'ACTIVE', 'Japanese digital artist blending tradition and technology.'),
('Sofia Mendes',      'sofia@gallery.com',    '$2a$10$/XpBNy47aUmxeag/xOOM0OZbsWWRTSt9A4de1i1lqeF0z90xpZ51C', 'ARTIST',  'ACTIVE', 'Brazilian sculptor working with recycled materials.'),
('James Okafor',      'james@gallery.com',    '$2a$10$/XpBNy47aUmxeag/xOOM0OZbsWWRTSt9A4de1i1lqeF0z90xpZ51C', 'ARTIST',  'ACTIVE', 'Nigerian photographer capturing urban life.'),
('Elena Volkova',     'elena@gallery.com',    '$2a$10$/XpBNy47aUmxeag/xOOM0OZbsWWRTSt9A4de1i1lqeF0z90xpZ51C', 'ARTIST',  'ACTIVE', 'Russian abstract painter exploring emotions through color.'),
('Curator Maya',      'maya@gallery.com',     '$2a$10$/XpBNy47aUmxeag/xOOM0OZbsWWRTSt9A4de1i1lqeF0z90xpZ51C', 'CURATOR', 'ACTIVE', 'Passionate curator with 10 years of gallery experience.');

-- Artworks (artist_id references: Leonardo=5, Aiko=6, Sofia=7, James=8, Elena=9)
-- category: 1=Painting, 2=Sculpture, 3=Digital Art, 4=Photography, 5=Drawing
SET @leo  = (SELECT id FROM users WHERE email='leonardo@gallery.com');
SET @aiko = (SELECT id FROM users WHERE email='aiko@gallery.com');
SET @sofia= (SELECT id FROM users WHERE email='sofia@gallery.com');
SET @james= (SELECT id FROM users WHERE email='james@gallery.com');
SET @elena= (SELECT id FROM users WHERE email='elena@gallery.com');
SET @maya = (SELECT id FROM users WHERE email='maya@gallery.com');

INSERT INTO artworks (artist_id, title, description, price, category_id, status, cultural_history) VALUES
(@leo,   'Sunset Over Florence',       'A warm oil painting capturing the golden hour over the Arno river.',                          45000.00, 1, 'APPROVED', 'Inspired by 15th century Florentine landscape painting traditions.'),
(@leo,   'The Olive Grove',            'Soft brushstrokes depict an ancient olive grove in Tuscany.',                                 38000.00, 1, 'APPROVED', 'Rooted in the pastoral painting style of the Italian countryside.'),
(@leo,   'Portrait of Silence',        'A contemplative portrait exploring solitude and inner peace.',                                52000.00, 5, 'APPROVED', 'Influenced by Renaissance portraiture and chiaroscuro technique.'),
(@aiko,  'Neon Sakura',                'Digital artwork merging cherry blossoms with cyberpunk neon aesthetics.',                     22000.00, 3, 'APPROVED', 'Bridges traditional Hanami culture with modern digital expression.'),
(@aiko,  'Digital Torii',              'A glowing torii gate rendered in vivid digital brushstrokes.',                                18500.00, 3, 'APPROVED', 'Inspired by Shinto shrine architecture and Japanese minimalism.'),
(@aiko,  'Pixel Koi',                  'Koi fish reimagined as pixel art swimming through a digital stream.',                         15000.00, 3, 'APPROVED', 'Draws from the Japanese symbolism of koi representing perseverance.'),
(@sofia, 'Urban Rebirth',              'A sculpture crafted from reclaimed city metal, symbolising renewal.',                         75000.00, 2, 'APPROVED', 'Reflects the Brazilian favela art movement and upcycling culture.'),
(@sofia, 'Roots',                      'Twisted bronze sculpture representing ancestral connections to the earth.',                    68000.00, 2, 'APPROVED', 'Inspired by Afro-Brazilian spiritual traditions and Candomblé.'),
(@james, 'Lagos at Dawn',              'Black and white photograph of Lagos streets awakening at sunrise.',                           12000.00, 4, 'APPROVED', 'Documents the vibrant street culture of West African urban life.'),
(@james, 'Market Women',               'Vivid colour photograph of traders at a Nigerian open-air market.',                           14500.00, 4, 'APPROVED', 'Celebrates the economic and social role of women in Nigerian markets.'),
(@james, 'Steel & Sky',                'Long-exposure shot of Lagos skyline reflecting on the lagoon.',                               16000.00, 4, 'APPROVED', 'Captures the rapid modernisation of African metropolitan cities.'),
(@elena, 'Crimson Storm',              'Abstract painting with sweeping crimson and black strokes evoking turbulence.',                41000.00, 1, 'APPROVED', 'Influenced by Russian Constructivism and Abstract Expressionism.'),
(@elena, 'Frozen Lake',                'Cool blues and whites create a serene yet haunting winter landscape.',                        36000.00, 1, 'APPROVED', 'Inspired by the vast Siberian tundra and its spiritual silence.'),
(@elena, 'Echoes of Gold',             'Gold leaf and acrylic combine in a luminous abstract composition.',                           58000.00, 1, 'APPROVED', 'Draws from Byzantine icon painting and Orthodox art traditions.'),
(@leo,   'Venetian Canal Sketch',      'Detailed pencil drawing of a quiet canal in Venice at dusk.',                                 9500.00,  5, 'APPROVED', 'Continues the grand tradition of Italian architectural drawing.');

-- Curator exhibitions
SET @maya_id = (SELECT id FROM users WHERE email='maya@gallery.com');

INSERT INTO exhibitions (curator_id, title, description, theme) VALUES
(@maya_id, 'Colours of the World',      'A vibrant journey through paintings and digital art from artists across five continents, celebrating cultural diversity through colour.', 'Global Art'),
(@maya_id, 'Lens & Light',              'An immersive photography exhibition exploring urban landscapes, human stories, and the interplay of natural and artificial light.',        'Photography'),
(@maya_id, 'Form & Matter',             'Sculptures and mixed-media works that challenge our perception of material, space, and the boundary between art and environment.',        'Sculpture'),
(@maya_id, 'Digital Frontiers',         'Cutting-edge digital artworks that push the boundaries of technology and creativity, from pixel art to AI-assisted compositions.',       'Digital Art');

-- Link artworks to exhibitions
SET @ex1 = (SELECT id FROM exhibitions WHERE title='Colours of the World');
SET @ex2 = (SELECT id FROM exhibitions WHERE title='Lens & Light');
SET @ex3 = (SELECT id FROM exhibitions WHERE title='Form & Matter');
SET @ex4 = (SELECT id FROM exhibitions WHERE title='Digital Frontiers');

INSERT INTO exhibition_artworks (exhibition_id, artwork_id, display_order) VALUES
(@ex1, (SELECT id FROM artworks WHERE title='Sunset Over Florence'),   1),
(@ex1, (SELECT id FROM artworks WHERE title='The Olive Grove'),        2),
(@ex1, (SELECT id FROM artworks WHERE title='Crimson Storm'),          3),
(@ex1, (SELECT id FROM artworks WHERE title='Frozen Lake'),            4),
(@ex1, (SELECT id FROM artworks WHERE title='Echoes of Gold'),         5),
(@ex2, (SELECT id FROM artworks WHERE title='Lagos at Dawn'),          1),
(@ex2, (SELECT id FROM artworks WHERE title='Market Women'),           2),
(@ex2, (SELECT id FROM artworks WHERE title='Steel & Sky'),            3),
(@ex3, (SELECT id FROM artworks WHERE title='Urban Rebirth'),          1),
(@ex3, (SELECT id FROM artworks WHERE title='Roots'),                  2),
(@ex4, (SELECT id FROM artworks WHERE title='Neon Sakura'),            1),
(@ex4, (SELECT id FROM artworks WHERE title='Digital Torii'),          2),
(@ex4, (SELECT id FROM artworks WHERE title='Pixel Koi'),              3);
