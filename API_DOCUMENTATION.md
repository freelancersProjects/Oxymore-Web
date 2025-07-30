# Documentation API Oxymore

## 📋 **Vue d'ensemble**

L'API Oxymore est divisée en deux parties distinctes pour une meilleure organisation et sécurité :

### 🔓 **API Publique** (`/api-docs`)
- **URL**: http://localhost:3000/api-docs
- **Accès**: Public
- **Contenu**: Routes accessibles à tous les utilisateurs
- **Exemples**:
  - Authentification (login/register)
  - Gestion des utilisateurs
  - Notifications
  - Badges
  - Teams
  - Tournaments
  - etc.

### 🔒 **API Admin** (`/admin/api-docs`)
- **URL**: http://localhost:3000/admin/api-docs
- **Accès**: Administrateurs uniquement
- **Contenu**: Routes réservées aux administrateurs
- **Exemples**:
  - Gestion des rôles utilisateurs
  - Modération
  - Configuration système
  - etc.

## 🛡️ **Sécurité**

### API Publique
- Routes accessibles sans authentification ou avec token utilisateur
- Fonctionnalités de base de l'application

### API Admin
- **Middleware de protection**: `isAdmin`
- **Authentification requise**: Token JWT avec rôle admin
- **Routes protégées**: `/api/admin/*`

## 🔧 **Utilisation**

### Pour les développeurs
```bash
# Documentation API publique
open http://localhost:3000/api-docs

# Documentation API admin
open http://localhost:3000/admin/api-docs
```

### Pour les tests
```bash
# Test API publique
curl http://localhost:3000/api/auth/login

# Test API admin (nécessite token admin)
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
     http://localhost:3000/api/admin/roles
```

## 📝 **Ajouter de nouvelles routes**

### Route publique
1. Créer le fichier dans `back/src/routes/`
2. Ajouter la documentation Swagger dans le fichier
3. Enregistrer dans `registerRoutes.ts`

### Route admin
1. Créer le fichier dans `back/src/routes/admin/`
2. Ajouter la documentation Swagger avec le tag `Admin - *`
3. Enregistrer dans `registerRoutes.ts` avec le middleware `isAdmin`

## 🏷️ **Tags Swagger**

### API Publique
- `Auth` - Authentification
- `Users` - Gestion des utilisateurs
- `Badges` - Badges et récompenses
- `Teams` - Équipes
- `Tournaments` - Tournois
- etc.

### API Admin
- `Admin - Roles` - Gestion des rôles
- `Admin - Moderation` - Modération (à venir)
- `Admin - System` - Configuration système (à venir)
- etc. 