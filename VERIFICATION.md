# 🚀 Guide de Vérification - Connexion Supabase

## ✅ Étapes de vérification

### 1. Vérifier que les tables existent dans Supabase

1. Connectez-vous à [supabase.com](https://supabase.com)
2. Ouvrez votre projet : `vxgevfoypgiqdcydzdgl`
3. Allez dans **Table Editor**
4. Vérifiez que ces 2 tables existent :
   - ✓ `tires`
   - ✓ `appointments`

Si elles n'existent pas, exécutez les scripts SQL dans `SUPABASE_SETUP.md` via l'éditeur SQL.

### 2. Ajouter des données de test (optionnel)

Dans l'éditeur SQL de Supabase, exécutez le fichier `supabase-seed.sql` pour ajouter :

- 5 pneus de test
- 1 rendez-vous de test

### 3. Tester la connexion depuis l'application

L'application est déjà lancée sur **http://localhost:5174/**

**Test de lecture (GET)** :

1. Ouvrez la page **Inventaire**
2. Vous devriez voir les pneus de votre base de données Supabase
3. Ouvrez la console du navigateur (F12) - aucune erreur ne devrait apparaître

**Test de création (POST)** :

1. Dans **Inventaire**, cliquez sur "Ajouter un pneu"
2. Remplissez le formulaire
3. Cliquez sur "Ajouter"
4. Le pneu devrait apparaître dans la liste ET dans Supabase

**Test de réservation** :

1. Ouvrez la page **Réserver**
2. Sélectionnez une date future (pas weekend)
3. Cliquez sur un créneau disponible
4. Remplissez le formulaire de réservation
5. Confirmez
6. Vérifiez dans **Gestion RDV** que le rendez-vous apparaît

### 4. Vérifier dans Supabase

Retournez dans Supabase → **Table Editor** :

- Vérifiez que le nouveau pneu apparaît dans la table `tires`
- Vérifiez que le rendez-vous apparaît dans la table `appointments`

## 🐛 Problèmes courants

### Erreur : "Missing Supabase environment variables"

- Vérifiez que le fichier `.env` existe
- Vérifiez que les variables commencent par `VITE_`
- Redémarrez le serveur de développement

### Erreur : "relation 'tires' does not exist"

- Les tables n'ont pas été créées dans Supabase
- Exécutez les scripts SQL de `SUPABASE_SETUP.md`

### Erreur : "Failed to fetch" ou erreurs CORS

- Vérifiez que l'URL Supabase est correcte dans `.env`
- Vérifiez les policies RLS dans Supabase

### Les données ne s'affichent pas

- Ouvrez la console du navigateur (F12) pour voir les erreurs
- Vérifiez que les policies RLS permettent l'accès (voir `SUPABASE_SETUP.md`)

## 📊 Structure de données attendue

### Table `tires`

```
id (uuid) | brand (text) | model (text) | width (int4) | ratio (int4) |
diameter (int4) | price (numeric) | stock (int4) | type (text) |
description (text) | image_url (text) | created_at (timestamptz)
```

### Table `appointments`

```
id (uuid) | client_name (text) | client_email (text) | car_brand (text) |
appointment_date (date) | appointment_time (time) | created_at (timestamptz)
```

## 🎉 Tout fonctionne ?

Si vous pouvez :

- ✅ Voir les pneus dans l'inventaire
- ✅ Ajouter un nouveau pneu
- ✅ Modifier un pneu
- ✅ Supprimer un pneu
- ✅ Créer un rendez-vous
- ✅ Voir les rendez-vous dans la page admin

**Alors Supabase est correctement connecté ! 🚀**

---

**Note** : Les données sont maintenant stockées dans Supabase et non plus dans localStorage.
Elles persistent entre les sessions et sont partagées entre les utilisateurs.
