# 📋 Guide - Gestion des Statuts de Rendez-vous

## ✨ Nouvelle fonctionnalité ajoutée

La gestion des rendez-vous inclut maintenant un système de statuts pour suivre l'état de chaque réservation.

## 🎯 Les 3 statuts disponibles

| Statut         | Badge    | Description                                 |
| -------------- | -------- | ------------------------------------------- |
| **En attente** | 🟡 Jaune | Rendez-vous confirmé, en attente du service |
| **Terminé**    | 🟢 Vert  | Service complété avec succès                |
| **Annulé**     | 🔴 Rouge | Rendez-vous annulé                          |

## 📊 Dans la page "Gestion des Rendez-vous"

### Colonne Statut

- Affiche un badge coloré selon l'état du rendez-vous
- Mise à jour en temps réel

### Bouton "Terminé"

- **Visible uniquement** pour les rendez-vous "En attente"
- Permet de marquer un rendez-vous comme complété
- Demande une confirmation avant la mise à jour
- Badge passe de jaune (En attente) à vert (Terminé)

### Actions disponibles

1. **Terminé** - Marque le service comme complété
2. **Modifier** - Édite les détails du rendez-vous
3. **Annuler** - Supprime le rendez-vous

## 🗄️ Base de données

### Migration nécessaire

Si votre table `appointments` existe déjà dans Supabase, exécutez ce script SQL :

```sql
-- Ajouter la colonne status
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'En attente';

-- Mettre à jour les rendez-vous existants
UPDATE appointments
SET status = 'En attente'
WHERE status IS NULL;
```

📁 **Fichier de migration** : `migrations/add-status-column.sql`

### Structure mise à jour

```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  car_brand TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT DEFAULT 'En attente',  -- ← Nouveau champ
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🚀 Utilisation

### 1. Créer un nouveau rendez-vous

- Le statut sera automatiquement "En attente"
- Badge jaune affiché

### 2. Compléter un rendez-vous

1. Allez dans **Gestion des Rendez-vous**
2. Trouvez le rendez-vous "En attente"
3. Cliquez sur **Terminé**
4. Confirmez l'action
5. Le badge devient vert (Terminé)

### 3. Filtrage (futur)

Les statuts permettront d'ajouter des filtres :

- Voir uniquement les rendez-vous en attente
- Historique des rendez-vous terminés
- Liste des annulations

## 💡 Avantages

✅ **Traçabilité** - Historique complet de tous les rendez-vous
✅ **Organisation** - Distinction claire entre actifs et terminés
✅ **Rapports** - Statistiques sur les services complétés
✅ **Workflow** - Flux de travail clair pour les employés

## 🎨 Interface

Le bouton "Terminé" :

- **Couleur** : Vert
- **Position** : Première action dans la ligne
- **Condition** : Visible uniquement si statut = "En attente"
- **Action** : Modale de confirmation personnalisée

Badge de statut :

- **En attente** : Fond jaune clair, texte jaune foncé
- **Terminé** : Fond vert clair, texte vert foncé
- **Annulé** : Fond rouge clair, texte rouge foncé

## 📝 Code TypeScript

```typescript
export enum AppointmentStatus {
  PENDING = "En attente",
  COMPLETED = "Terminé",
  CANCELLED = "Annulé",
}

interface Appointment {
  // ... autres champs
  status: AppointmentStatus;
}
```

## ✅ Tests

1. **Créer un rendez-vous** → Vérifier que le statut = "En attente"
2. **Cliquer sur Terminé** → Vérifier la modale de confirmation
3. **Confirmer** → Vérifier que le badge devient vert
4. **Recharger la page** → Vérifier que le statut persiste

Tout est prêt ! 🎉
