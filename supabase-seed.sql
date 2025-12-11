-- Migration: Données initiales pour Pneus Express
-- Exécutez ce script dans l'éditeur SQL de Supabase pour ajouter des données de test

-- Insertion de pneus de test
INSERT INTO tires (brand, model, width, ratio, diameter, price, stock, type, description, image_url) VALUES
('Michelin', 'X-Ice Snow', 205, 55, 16, 189.99, 12, 'Hiver', 'Pneu d''hiver haut de gamme offrant une traction exceptionnelle.', NULL),
('Bridgestone', 'Potenza Sport', 245, 40, 19, 320.50, 4, 'Performance', 'Pneu haute performance pour une conduite sportive.', NULL),
('Continental', 'TrueContact Tour', 195, 65, 15, 145.00, 20, '4 Saisons', 'Durabilité longue durée et économie de carburant.', NULL),
('Goodyear', 'Eagle F1', 225, 45, 17, 275.00, 8, 'Performance', 'Performance sportive exceptionnelle en conditions sèches et humides.', NULL),
('Pirelli', 'Winter Sottozero', 235, 50, 18, 295.00, 6, 'Hiver', 'Sécurité et contrôle optimal sur neige et glace.', NULL);

-- Insertion de rendez-vous de test avec différents statuts
INSERT INTO appointments (client_name, client_email, car_brand, appointment_date, appointment_time, statut) VALUES
('Jean Dupont', 'jean@example.com', 'Toyota Corolla', CURRENT_DATE + INTERVAL '1 day', '10:00', 'En attente'),
('Marie Martin', 'marie@example.com', 'Honda Civic', CURRENT_DATE + INTERVAL '2 days', '14:00', 'En attente'),
('Pierre Durand', 'pierre@example.com', 'Ford Focus', CURRENT_DATE - INTERVAL '1 day', '09:00', 'Terminé');

-- Vérification des données insérées
SELECT * FROM tires ORDER BY created_at DESC;
SELECT * FROM appointments ORDER BY appointment_date, appointment_time;
