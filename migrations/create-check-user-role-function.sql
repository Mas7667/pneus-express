-- Fonction pour vérifier si un utilisateur est admin
-- À exécuter dans l'éditeur SQL de Supabase

CREATE OR REPLACE FUNCTION check_user_role(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT raw_user_meta_data->>'role' INTO user_role
  FROM auth.users
  WHERE id = user_id;
  
  RETURN COALESCE(user_role = 'admin', FALSE);
END;
$$;

-- Donner les permissions nécessaires
GRANT EXECUTE ON FUNCTION check_user_role(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION check_user_role(UUID) TO anon;
