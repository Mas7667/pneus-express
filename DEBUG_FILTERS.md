# 🔍 Guide de Débogage des Filtres

## Problème résolu

Les filtres ont été améliorés avec les corrections suivantes :

### 1. **Filtre de recherche amélioré**

Recherche maintenant dans :

- ✅ Marque (brand)
- ✅ Modèle (model)
- ✅ Description
- ✅ Dimension complète (ex: 205/55R16)
- ✅ Largeur seule (ex: 205)
- ✅ Ratio seul (ex: 55)
- ✅ Diamètre seul (ex: 16)

### 2. **Filtre par type corrigé**

- Comparaison stricte avec les valeurs de la base de données
- Valeurs supportées : "Été", "Hiver", "4 Saisons", "Performance"

### 3. **Nouvelles fonctionnalités**

- 📊 Compteur de résultats affiché
- 🔄 Bouton "Réinitialiser les filtres"
- 🐛 Logs de debug dans la console du navigateur

## Comment tester

### Test 1: Recherche textuelle

1. Ouvrez la page Inventaire
2. Tapez "Michelin" dans la barre de recherche
   - ✅ Devrait montrer tous les pneus Michelin
3. Tapez "205"
   - ✅ Devrait montrer tous les pneus avec largeur 205

### Test 2: Filtre par type

1. Sélectionnez "Hiver" dans le menu déroulant
   - ✅ Devrait montrer uniquement les pneus d'hiver
2. Sélectionnez "Performance"
   - ✅ Devrait montrer uniquement les pneus Performance

### Test 3: Combinaison des filtres

1. Tapez "Continental" ET sélectionnez "4 Saisons"
   - ✅ Devrait montrer uniquement les pneus Continental 4 Saisons

### Test 4: Réinitialisation

1. Appliquez des filtres
2. Cliquez sur "Réinitialiser les filtres"
   - ✅ Devrait afficher tous les pneus

## Débogage dans la console

Ouvrez la console du navigateur (F12) pour voir les informations de debug :

```
🔍 Filtres actifs: { searchTerm: 'michelin', filterType: '' }
📊 Résultats: 1 / 5
```

Si vous voyez :

```
🏷️ Types disponibles dans les données: ["Hiver", "Performance", "4 Saisons"]
```

Cela vous montre les valeurs exactes des types dans votre base de données.

## Problèmes possibles

### Les types ne fonctionnent pas ?

**Vérifiez dans Supabase** :

1. Allez dans Table Editor → tires
2. Vérifiez la colonne `type`
3. Les valeurs doivent être EXACTEMENT :
   - "Été"
   - "Hiver"
   - "4 Saisons"
   - "Performance"

Si les valeurs sont différentes (ex: "été" en minuscule, "Ete" sans accent), le filtre ne fonctionnera pas.

**Solution** : Exécutez ce script SQL dans Supabase pour corriger :

```sql
-- Corriger les types de pneus
UPDATE tires SET type = 'Été' WHERE LOWER(type) LIKE '%t%' OR type = 'SUMMER';
UPDATE tires SET type = 'Hiver' WHERE LOWER(type) LIKE 'hiver%' OR type = 'WINTER';
UPDATE tires SET type = '4 Saisons' WHERE LOWER(type) LIKE '%saison%' OR type = 'ALL_SEASON';
UPDATE tires SET type = 'Performance' WHERE LOWER(type) LIKE 'performance%';
```

### La recherche ne trouve rien ?

Vérifiez que :

1. Les données existent dans la base (voir dans Supabase)
2. Les champs ne sont pas NULL
3. La casse ne pose pas problème (le filtre est insensible à la casse)

## Commandes utiles

**Voir les types dans la base** :

```sql
SELECT DISTINCT type FROM tires;
```

**Compter les pneus par type** :

```sql
SELECT type, COUNT(*) FROM tires GROUP BY type;
```

## Améliorations appliquées

1. ✅ Recherche plus flexible (dimension, parties de dimension)
2. ✅ Comparaison de type stricte
3. ✅ Gestion des valeurs NULL/undefined
4. ✅ Interface utilisateur améliorée avec compteur
5. ✅ Bouton de réinitialisation rapide
6. ✅ Logs de debug pour faciliter le diagnostic
