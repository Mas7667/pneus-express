-- Script de vérification des données pour le débogage des filtres

-- Vérifier les types de pneus dans la base de données
SELECT DISTINCT type, COUNT(*) as count 
FROM tires 
GROUP BY type 
ORDER BY type;

-- Voir tous les pneus avec leurs informations
SELECT 
  id,
  brand,
  model,
  CONCAT(width, '/', ratio, 'R', diameter) as dimension,
  type,
  stock,
  price
FROM tires
ORDER BY created_at DESC;

-- Vérifier s'il y a des valeurs NULL qui pourraient causer des problèmes
SELECT 
  COUNT(*) as total,
  COUNT(brand) as has_brand,
  COUNT(model) as has_model,
  COUNT(type) as has_type,
  COUNT(description) as has_description
FROM tires;
