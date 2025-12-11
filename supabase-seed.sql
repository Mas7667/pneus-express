-- Migration: Données initiales pour Pneus Express
-- Exécutez ce script dans l'éditeur SQL de Supabase pour ajouter des données de test

-- Insertion de pneus de test
INSERT INTO tires (brand, model, width, ratio, diameter, price, stock, type, description, image_url) VALUES
('Michelin', 'X-Ice Snow', 205, 55, 16, 189.99, 12, 'Hiver', 'Pneu d''hiver haut de gamme offrant une traction exceptionnelle.', NULL),
('Bridgestone', 'Potenza Sport', 245, 40, 19, 320.50, 4, 'Performance', 'Pneu haute performance pour une conduite sportive.', NULL),
('Continental', 'TrueContact Tour', 195, 65, 15, 145.00, 20, '4 Saisons', 'Durabilité longue durée et économie de carburant.', NULL),
('Goodyear', 'Eagle F1', 225, 45, 17, 275.00, 8, 'Performance', 'Performance sportive exceptionnelle en conditions sèches et humides.', NULL),
('Pirelli', 'Winter Sottozero', 235, 50, 18, 295.00, 6, 'Hiver', 'Sécurité et contrôle optimal sur neige et glace.', NULL);

-- Insertion d'un rendez-vous de test (ajustez la date selon vos besoins)
INSERT INTO appointments (client_name, client_email, car_brand, appointment_date, appointment_time) VALUES
('Jean Dupont', 'jean@example.com', 'Toyota Corolla', CURRENT_DATE + INTERVAL '1 day', '10:00');

-- Vérification des données insérées
SELECT * FROM tires ORDER BY created_at DESC;
SELECT * FROM appointments ORDER BY appointment_date, appointment_time;
