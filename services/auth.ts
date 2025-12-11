import { supabase } from './supabase';

export const checkIsAdmin = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('check_user_role', { user_id: userId });
    
    if (error) {
      console.error('Erreur vérification admin:', error);
      // Fallback: vérifier depuis user metadata
      const { data: { user } } = await supabase.auth.getUser();
      return user?.user_metadata?.role === 'admin';
    }
    
    return data === true;
  } catch (err) {
    console.error('Erreur check admin:', err);
    // Fallback sur les métadonnées de l'utilisateur
    const { data: { user } } = await supabase.auth.getUser();
    return user?.user_metadata?.role === 'admin';
  }
};

export const getUserRole = async (userId: string): Promise<'admin' | 'client'> => {
  const isAdmin = await checkIsAdmin(userId);
  return isAdmin ? 'admin' : 'client';
};
