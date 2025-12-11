-- Script de vérification des statuts dans la base de données
-- Exécutez ce script dans l'éditeur SQL de Supabase pour diagnostiquer

-- 1. Vérifier la structure de la table
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'appointments'
ORDER BY ordinal_position;

-- 2. Voir tous les rendez-vous avec leurs statuts
SELECT 
  id,
  client_name,
  appointment_date,
  appointment_time,
  statut,
  created_at
FROM appointments
ORDER BY appointment_date DESC, appointment_time;

-- 3. Compter les rendez-vous par statut
SELECT 
  statut,
  COUNT(*) as nombre
FROM appointments
GROUP BY statut;

-- 4. Vérifier les valeurs NULL
SELECT 
  COUNT(*) as total_appointments,
  COUNT(statut) as avec_statut,
  COUNT(*) - COUNT(statut) as sans_statut
FROM appointments;

-- 5. Si des rendez-vous n'ont pas de statut, les mettre à jour
-- Décommentez cette ligne pour corriger :
-- UPDATE appointments SET statut = 'En attente' WHERE statut IS NULL;

-- 6. Vérifier que la colonne existe bien
SELECT EXISTS (
  SELECT 1 
  FROM information_schema.columns 
  WHERE table_name = 'appointments' 
  AND column_name = 'statut'
) as colonne_statut_existe;
