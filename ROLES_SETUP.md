# ✅ Système d'authentification avec rôles implémenté !

## 🎯 Fonctionnalités ajoutées

### 1. **Authentification par rôle (Client / Admin)**

- ✅ Les utilisateurs s'inscrivent avec un rôle (`client` par défaut, `admin` possible)
- ✅ Le rôle est stocké dans `user_metadata.role` de Supabase Auth
- ✅ Vérification automatique du rôle à la connexion

### 2. **Interface Client**

Quand un **client** se connecte :

- ✅ Voit "Catalogue de Pneus" au lieu d'"Inventaire"
- ✅ Chaque TireCard affiche un bouton "Réserver" orange
- ✅ Cliquer sur "Réserver" redirige vers `/booking` avec les infos du pneu pré-remplies
- ✅ Ne voit PAS les boutons "Modifier" et "Supprimer"
- ✅ Ne peut PAS ajouter de pneus
- ✅ Navbar simplifiée : "Catalogue" + "Mes Réservations"

### 3. **Interface Admin**

Quand un **admin** se connecte :

- ✅ Voit "Inventaire" (vue complète)
- ✅ Peut ajouter, modifier, supprimer des pneus
- ✅ Accès à "Admin Rendez-vous" (réservé aux admins)
- ✅ Navbar complète : "Inventaire" + "Réserver" + "Admin Rendez-vous" + "À Propos"

### 4. **Protection des routes**

- ✅ `/admin-appointments` est protégé par `AdminRoute`
- ✅ Seuls les admins peuvent y accéder
- ✅ Message "Accès refusé" pour les non-admins

### 5. **Bouton "Réserver" dans TireCard**

- ✅ Passe automatiquement le nom du pneu au formulaire de réservation
- ✅ Format : `{brand} {model} - {width}/{ratio} R{diameter}`
- ✅ Le champ "Marque de voiture" est pré-rempli dans Booking
- ✅ Désactivé si stock = 0

## 📝 Configuration Supabase

### Créer un compte Admin

Pour créer un admin, lors de l'inscription, vous devez modifier le code temporairement :

```typescript
// Dans Register.tsx, changez la ligne 50 :
const { error } = await signUp(email, password, fullName, "admin"); // Au lieu de role par défaut
```

OU utilisez la console Supabase SQL :

```sql
-- Mettre à jour un utilisateur existant pour le rendre admin
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'admin@example.com';
```

### Fonction SQL (optionnelle)

Pour vérifier le rôle via SQL (si vous voulez utiliser `auth.ts`) :

```sql
-- Déjà créé dans migrations/create-check-user-role-function.sql
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
```

## 🧪 Test du système

### Test Client :

1. Inscrivez-vous normalement sur `/register`
2. Connectez-vous sur `/login`
3. Vous devriez voir :

   - Titre "Catalogue de Pneus"
   - Bouton "Réserver" sur chaque pneu
   - Pas de boutons d'administration

4. Cliquez sur "Réserver" → Le formulaire se remplit automatiquement

### Test Admin :

1. Créez un compte admin (voir ci-dessus)
2. Connectez-vous
3. Vous devriez voir :
   - Titre "Inventaire"
   - Bouton "Ajouter un pneu"
   - Boutons "Modifier" et "Supprimer" sur les pneus
   - Accès à "Admin Rendez-vous"

## 🔧 Fichiers modifiés/créés

### Créés :

- `contexts/AuthContext.tsx` - Gestion de l'authentification
- `pages/Login.tsx` - Page de connexion
- `pages/Register.tsx` - Page d'inscription
- `components/ProtectedRoute.tsx` - Protection des routes + AdminRoute
- `services/auth.ts` - Utilitaires d'authentification
- `migrations/create-check-user-role-function.sql` - Fonction SQL

### Modifiés :

- `App.tsx` - Ajout AuthProvider et routes Login/Register
- `components/Navbar.tsx` - Interface différente client/admin
- `components/TireCard.tsx` - Bouton "Réserver" pour clients
- `pages/Inventory.tsx` - Interface adaptée au rôle
- `pages/Booking.tsx` - Pré-remplissage du formulaire

## 🚀 Prochaines étapes

1. **Testez** l'authentification
2. **Créez un compte admin** via SQL Supabase
3. **Vérifiez** que les interfaces sont différentes
4. **Testez** le bouton "Réserver"

## ❗ Important

- Par défaut, tous les nouveaux comptes sont des **clients**
- Pour créer un admin, utilisez la console SQL Supabase
- Le rôle est stocké dans `auth.users.raw_user_meta_data->>'role'`

Tout est prêt à être testé ! 🎉
