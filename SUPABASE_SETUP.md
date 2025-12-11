# Configuration Supabase pour Pneus Express

## 📋 Prérequis

1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet Supabase

## 🗄️ Structure de la base de données

Vous devez créer deux tables dans votre projet Supabase :

### Table `tires`

```sql
CREATE TABLE tires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  width INT4 NOT NULL,
  ratio INT4 NOT NULL,
  diameter INT4 NOT NULL,
  price NUMERIC NOT NULL,
  stock INT4 NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE tires ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (ajustez selon vos besoins)
CREATE POLICY "Enable all access for tires" ON tires
  FOR ALL USING (true);
```

### Table `appointments`

```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  car_brand TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (ajustez selon vos besoins)
CREATE POLICY "Enable all access for appointments" ON appointments
  FOR ALL USING (true);
```

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (ajustez selon vos besoins)
CREATE POLICY "Enable all access for appointments" ON appointments
FOR ALL USING (true);

````

## ⚙️ Configuration des variables d'environnement

1. Copiez le fichier `.env.example` vers `.env` :

   ```bash
   copy .env.example .env
````

2. Dans votre projet Supabase, allez dans **Settings** > **API**

3. Copiez les valeurs suivantes dans votre fichier `.env` :
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

Exemple de fichier `.env` :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon-publique
```

## 🚀 Lancement de l'application

Une fois la configuration terminée, lancez l'application :

```bash
npm run dev
```

## 📝 Notes importantes

- Le fichier `.env` ne doit **jamais** être commité dans Git (déjà ajouté au `.gitignore`)
- Les clés Supabase dans `.env` utilisent le préfixe `VITE_` pour être accessibles dans Vite
- Les policies RLS (Row Level Security) sont configurées pour permettre tous les accès - ajustez-les selon vos besoins de sécurité
- La fonction `reset()` est désactivée avec Supabase - gérez vos données via le dashboard Supabase

## 🔒 Sécurité

Pour un environnement de production, vous devriez :

1. Configurer des policies RLS plus strictes
2. Ajouter l'authentification utilisateur
3. Valider les données côté serveur avec Supabase Functions
