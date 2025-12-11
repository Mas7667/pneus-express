-- Vérifier si l'utilisateur c0a76e6a-d16f-47bf-a560-f89ccd72691b est admin

-- 1. Voir les informations de l'utilisateur
SELECT 
  id,
  email,
  raw_app_meta_data,
  raw_app_meta_data->>'role' as role,
  created_at
FROM auth.users
WHERE id = 'c0a76e6a-d16f-47bf-a560-f89ccd72691b';

-- 2. Si l'utilisateur n'est PAS admin, le rendre admin :
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
WHERE id = 'c0a76e6a-d16f-47bf-a560-f89ccd72691b';

-- 3. Vérifier que ça a fonctionné
SELECT 
  id,
  email,
  raw_app_meta_data->>'role' as role
FROM auth.users
WHERE id = 'c0a76e6a-d16f-47bf-a560-f89ccd72691b';
