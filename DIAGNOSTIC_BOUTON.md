# 🔍 Guide de Diagnostic - Bouton Terminé

## Problème : Le bouton "Terminé" ne change rien

### ✅ Vérifications à faire

#### 1. Vérifier la colonne dans Supabase

Connectez-vous à Supabase et exécutez :

```sql
-- Vérifier que la colonne 'statut' existe
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'appointments' AND column_name = 'statut';

-- Si la colonne n'existe pas, la créer :
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS statut TEXT DEFAULT 'En attente';
```

#### 2. Vérifier les données existantes

```sql
-- Voir tous les rendez-vous et leurs statuts
SELECT id, client_name, appointment_date, statut
FROM appointments;

-- Si certains ont NULL, les corriger :
UPDATE appointments
SET statut = 'En attente'
WHERE statut IS NULL;
```

#### 3. Tester manuellement dans Supabase

```sql
-- Essayer de mettre à jour un rendez-vous
UPDATE appointments
SET statut = 'Terminé'
WHERE id = 'votre-id-ici';

-- Vérifier que ça a fonctionné
SELECT * FROM appointments WHERE id = 'votre-id-ici';
```

#### 4. Vérifier les permissions (RLS)

```sql
-- Voir les policies
SELECT * FROM pg_policies WHERE tablename = 'appointments';

-- Si nécessaire, créer une policy permissive :
CREATE POLICY "Enable all for appointments" ON appointments
  FOR ALL USING (true) WITH CHECK (true);
```

### 📊 Dans la console du navigateur (F12)

Vous devriez voir ces logs :

```
📅 Rendez-vous chargés: [{client: "...", date: "...", statut: "En attente"}]
```

Quand vous cliquez sur "Terminé" :

```
🔄 Mise à jour du statut: abc123 vers Terminé
🔄 Mise à jour Supabase: {id: "abc123", updates: {statut: "Terminé"}, dbUpdates: {statut: "Terminé"}}
✅ Rendez-vous mis à jour: {id: "abc123", ..., statut: "Terminé"}
📅 Rendez-vous chargés: [{..., statut: "Terminé"}]
```

### ❌ Erreurs possibles

**Erreur : "column 'statut' does not exist"**
→ La colonne n'a pas été créée dans Supabase
→ Exécutez le script de migration

**Erreur : "new row violates row-level security policy"**
→ Les policies RLS bloquent la mise à jour
→ Ajustez les policies ou désactivez RLS temporairement

**Pas d'erreur mais rien ne change**
→ Vérifiez que la colonne s'appelle bien "statut" et pas "status"
→ Vérifiez les logs dans la console

### 🔧 Solution rapide

Si rien ne fonctionne, dans Supabase :

```sql
-- Supprimer la colonne si elle existe (attention aux données !)
ALTER TABLE appointments DROP COLUMN IF EXISTS status;
ALTER TABLE appointments DROP COLUMN IF EXISTS statut;

-- Recréer proprement
ALTER TABLE appointments ADD COLUMN statut TEXT DEFAULT 'En attente';

-- Mettre à jour tous les rendez-vous existants
UPDATE appointments SET statut = 'En attente';
```

### 🎯 Test final

1. Rechargez l'application (Ctrl+R)
2. Ouvrez la console (F12)
3. Allez dans "Gestion des Rendez-vous"
4. Cherchez un rendez-vous avec badge "En attente" (jaune)
5. Cliquez sur le bouton vert "✓ Terminé"
6. Confirmez
7. Le badge devrait devenir vert "Terminé"
8. Le bouton "Terminé" devrait disparaître

Si ça ne fonctionne toujours pas, copiez-collez les logs de la console ici !
