# 🔐 Guide d'authentification Supabase

## Configuration nécessaire dans Supabase

### 1. Activer l'authentification Email

Dans votre dashboard Supabase (https://supabase.com/dashboard) :

1. Allez dans **Authentication > Providers**
2. Vérifiez que **Email** est activé
3. Configurez les paramètres :
   - ✅ **Enable Email provider**
   - ✅ **Confirm email** (optionnel - désactivez pour les tests)

### 2. Configuration des URL de redirection

Dans **Authentication > URL Configuration** :

- **Site URL** : `http://localhost:5174` (pour développement)
- **Redirect URLs** : Ajoutez `http://localhost:5174`

### 3. Politiques RLS pour la table auth.users

La table `auth.users` est automatiquement gérée par Supabase. Pas besoin de créer de politiques.

### 4. (Optionnel) Créer une table de profils

Si vous voulez stocker des infos supplémentaires :

```sql
-- Créer la table profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Fonction pour créer automatiquement un profil à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger sur auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Utilisation dans l'application

### Pages créées

1. **`/login`** - Page de connexion
2. **`/register`** - Page d'inscription
3. **`/admin-appointments`** - Protégée, nécessite connexion

### Composants créés

- **`AuthContext`** - Contexte React pour gérer l'état d'authentification
- **`ProtectedRoute`** - Composant pour protéger les routes
- **`Login`** - Formulaire de connexion
- **`Register`** - Formulaire d'inscription

### Utiliser l'authentification dans vos pages

```tsx
import { useAuth } from "../contexts/AuthContext";

function MaPage() {
  const { user, signOut } = useAuth();

  if (!user) {
    return <p>Vous devez être connecté</p>;
  }

  return (
    <div>
      <p>Bienvenue {user.email}</p>
      <button onClick={signOut}>Déconnexion</button>
    </div>
  );
}
```

## Test de l'authentification

1. Lancez l'application : `npm run dev`
2. Allez sur `/register` et créez un compte
3. Vérifiez votre email (si la confirmation est activée)
4. Connectez-vous sur `/login`
5. Vous serez redirigé automatiquement

## Problèmes courants

### "Email not confirmed"

→ Désactivez la confirmation d'email dans Supabase pour les tests
→ Ou vérifiez votre boîte mail

### "Invalid login credentials"

→ Vérifiez que l'email et le mot de passe sont corrects
→ Vérifiez que le compte existe dans Supabase Dashboard

### Redirection infinie

→ Vérifiez que les URL de redirection sont bien configurées dans Supabase

## Sécurité

⚠️ **Important** :

- Les mots de passe doivent faire au moins 6 caractères
- Les clés Supabase dans `.env` ne doivent JAMAIS être commitées sur GitHub
- Utilisez les Row Level Security (RLS) policies pour protéger vos données
