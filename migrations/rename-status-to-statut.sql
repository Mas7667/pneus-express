-- Migration: Renommer la colonne 'status' en 'statut'
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- Option 1: Si la colonne s'appelle 'status', la renommer en 'statut'
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'appointments' AND column_name = 'status'
  ) THEN
    ALTER TABLE appointments RENAME COLUMN status TO statut;
    RAISE NOTICE 'Colonne "status" renommée en "statut"';
  END IF;
END $$;

-- Option 2: Si la colonne 'statut' n'existe pas encore, la créer
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS statut TEXT DEFAULT 'En attente';

-- Mettre à jour les rendez-vous existants qui n'ont pas de statut
UPDATE appointments 
SET statut = 'En attente' 
WHERE statut IS NULL;

-- Vérifier les résultats
SELECT 
  id, 
  client_name, 
  appointment_date, 
  appointment_time, 
  statut,
  created_at
FROM appointments 
ORDER BY appointment_date, appointment_time;

-- Vérifier que la colonne existe bien
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'appointments' AND column_name = 'statut';
