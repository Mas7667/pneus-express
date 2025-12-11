-- Migration: Ajout de la colonne statut dans la table appointments
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- Ajouter la colonne statut avec une valeur par défaut
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS statut TEXT DEFAULT 'En attente';

-- Mettre à jour les rendez-vous existants qui n'ont pas de statut
UPDATE appointments 
SET statut = 'En attente' 
WHERE statut IS NULL;

-- Vérifier les résultats
SELECT id, client_name, appointment_date, appointment_time, statut 
FROM appointments 
ORDER BY appointment_date, appointment_time;
