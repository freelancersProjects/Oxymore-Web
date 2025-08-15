# 🎮 Oxymore - Plateforme eSport Complète

Oxymore est une plateforme eSport moderne et complète qui comprend une application principale, un site web, un panel d'administration et une API backend robuste. Le projet utilise une architecture monorepo avec des workspaces npm pour une gestion optimale des dépendances.

## 📋 Table des matières

- [🏗️ Architecture du projet](#️-architecture-du-projet)
- [🚀 Installation et configuration](#-installation-et-configuration)
- [🐳 Docker (Recommandé)](#-docker-recommandé)
- [📦 Applications](#-applications)
- [🔧 Commandes disponibles](#-commandes-disponibles)
- [🏛️ Packages partagés](#️-packages-partagés)
- [🔌 API et Backend](#-api-et-backend)
- [🎨 UI Components](#-ui-components)

## 🏗️ Architecture du projet

```
Oxymore-WebDigit/
├── apps/                    # Applications principales
│   ├── oxymore-admin/      # Panel d'administration
│   ├── oxymore-app/        # Application principale
│   └── oxymore-site/       # Site web public
├── back/                   # API Backend (Node.js/Express)
├── packages/               # Packages partagés
│   ├── oxm-ui/            # Composants UI réutilisables
│   └── types/             # Types TypeScript partagés
└── docker-compose.yml     # Configuration Docker
```

## 🚀 Installation et configuration

### Prérequis

- **Node.js** 18+
- **npm** 9+
- **MySQL** 8.0+
- **Docker** (optionnel, mais recommandé)

### Installation

```bash
# Cloner le repository
git clone <repository-url>
cd Oxymore-WebDigit

# Installer toutes les dépendances
npm install

# ⚠️ IMPORTANT : Construire le package UI partagé
npm run build
```

### Configuration de l'environnement

1. **Backend** : Créer un fichier `.env` dans le dossier `back/`
2. **Applications** : Configurer les variables d'environnement selon les besoins

## 🐳 Docker (Recommandé)

### 🚀 Démarrage rapide avec Docker

La façon la plus simple de lancer tout l'environnement Oxymore :

```bash
# Construire et démarrer tous les services
docker-compose up --build

# Ou en arrière-plan
docker-compose up --build -d
```

### Services Docker disponibles

| Service | Port | Description |
|---------|------|-------------|
| `admin` | 8080 | Panel d'administration |
| `app` | 8081 | Application principale |
| `site` | 8082 | Site web public |
| `backend` | 3000 | API Backend |
| `mysql` | 3306 | Base de données MySQL |
| `redis` | 6379 | Cache Redis |
| `redis-commander` | 8083 | Interface Redis (debug) |

### Commandes Docker utiles

```bash
# Démarrer tous les services
docker-compose up --build

# Démarrer en arrière-plan
docker-compose up -d

# Arrêter les services
docker-compose down

# Voir les logs
docker-compose logs -f

# Voir les logs d'un service spécifique
docker-compose logs -f backend

# Redémarrer un service
docker-compose restart backend

# Reconstruire un service
docker-compose up --build backend
```

### Avantages de Docker

- ✅ **Installation simple** : Pas besoin d'installer MySQL, Redis, Node.js localement
- ✅ **Environnement isolé** : Chaque service dans son propre container
- ✅ **Configuration automatique** : Base de données et Redis configurés automatiquement
- ✅ **Reproductibilité** : Même environnement sur tous les postes
- ✅ **Pas de conflits de ports** : Chaque service sur son port dédié

### Variables d'environnement Docker

Les services sont configurés avec les variables suivantes :

```env
# Backend
NODE_ENV=production
DB_HOST=mysql
DB_PORT=3306
DB_NAME=oxymore
DB_USER=oxymore
DB_PASSWORD=oxymore123
REDIS_HOST=redis
REDIS_PORT=6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Frontend apps
VITE_API_URL=http://localhost:3000
```

## 📦 Applications

### 🎯 Oxymore App (`apps/oxymore-app/`)
**Application principale pour les utilisateurs**

- **Technologies** : React 19, Vite, TypeScript, Tailwind CSS
- **Fonctionnalités** :
  - Interface utilisateur moderne
  - Gestion des tournois
  - Système d'authentification
  - Intégration avec l'API
- **Port** : 5173 (dev) / 8081 (Docker)

### 🌐 Oxymore Site (`apps/oxymore-site/`)
**Site web public et marketing**

- **Technologies** : React 19, Vite, TypeScript, SASS
- **Fonctionnalités** :
  - Landing page
  - Documentation API
  - Pages marketing
  - Support multilingue
- **Port** : 5174 (dev) / 8082 (Docker)

### ⚙️ Oxymore Admin (`apps/oxymore-admin/`)
**Panel d'administration complet**

- **Technologies** : React 18, Vite, TypeScript, Tailwind CSS, Framer Motion
- **Fonctionnalités** :
  - Gestion des utilisateurs
  - Administration des tournois
  - Analytics et statistiques
  - Gestion des badges et équipes
  - Interface responsive avec sidebar
- **Port** : 5175 (dev) / 8080 (Docker)

### 🔧 Backend API (`back/`)
**API REST + WebSocket**

- **Technologies** : Node.js, Express, TypeScript, MySQL, Socket.io
- **Fonctionnalités** :
  - API REST complète
  - Authentification JWT
  - WebSocket pour temps réel
  - Documentation Swagger
  - Gestion des fichiers
- **Port** : 3000 (dev/Docker)

## 🔧 Commandes disponibles

### 🏠 Commandes racine (depuis la racine du projet)

Toutes les commandes peuvent être exécutées depuis la racine du projet grâce aux workspaces npm :

#### 🚀 Commandes de développement

| Commande | Description | Port |
|----------|-------------|------|
| `npm run dev:site` | Démarre le site web en mode développement | 5174 |
| `npm run dev:app` | Démarre l'application principale en mode développement | 5173 |
| `npm run dev:admin` | Démarre le panel d'administration en mode développement | 5175 |
| `npm run dev:back` | Démarre l'API backend en mode développement | 3000 |

#### 🏗️ Commandes de build

| Commande | Description |
|----------|-------------|
| `npm run build` | **Construit le package UI partagé** (OBLIGATOIRE) |
| `npm run build:site` | Construit le site web pour la production |
| `npm run build:app` | Construit l'application principale pour la production |
| `npm run build:admin` | Construit le panel d'administration pour la production |

#### 🔍 Commandes de linting

| Commande | Description |
|----------|-------------|
| `npm run lint:site` | Vérifie le code du site web |
| `npm run lint:app` | Vérifie le code de l'application principale |
| `npm run lint:admin` | Vérifie le code du panel d'administration |
| `npm run lint:back` | Vérifie le code du backend |

### 🎯 Commandes spécifiques par application

#### Oxymore App
```bash
cd apps/oxymore-app
npm run dev          # Démarre en mode développement
npm run build        # Construit pour la production
npm run preview      # Prévisualise la build
npm run lint         # Vérifie le code
```

#### Oxymore Site
```bash
cd apps/oxymore-site
npm run dev          # Démarre en mode développement
npm run build        # Construit pour la production
npm run preview      # Prévisualise la build
npm run lint         # Vérifie le code
```

#### Oxymore Admin
```bash
cd apps/oxymore-admin
npm run dev          # Démarre en mode développement
npm run build        # Construit pour la production
npm run preview      # Prévisualise la build
npm run lint         # Vérifie le code
```

#### Backend API
```bash
cd back
npm run dev          # Démarre en mode développement
npm run dev:ws       # Démarre avec WebSocket
npm run build        # Compile TypeScript
npm run start        # Démarre en production
```

## 🏛️ Packages partagés

### 🎨 Oxymore UI (`packages/oxm-ui/`)
**Bibliothèque de composants UI réutilisables**

- **Technologies** : React, TypeScript, SASS, Vite
- **Composants** : Boutons, modales, inputs, tooltips, etc.
- **Playground** : Interface de test des composants
- **Build** : Génération automatique des types TypeScript

```bash
cd packages/oxm-ui
npm run dev          # Démarre le playground
npm run build        # Construit la bibliothèque
npm run types        # Génère les types TypeScript
npm run preview      # Prévisualise le playground
```

### 📝 Types (`packages/types/`)
**Types TypeScript partagés**

- Définitions de types communes
- Interfaces API
- Types de données métier

## 🔌 API et Backend

### Endpoints principaux

- **Base URL** : `http://localhost:3000`
- **Documentation** : `http://localhost:3000/api-docs` (Swagger)
- **WebSocket** : `ws://localhost:3000`

### Fonctionnalités API

- ✅ Authentification JWT
- ✅ Gestion des utilisateurs
- ✅ Tournois et équipes
- ✅ Système de badges
- ✅ Upload de fichiers
- ✅ WebSocket temps réel
- ✅ Documentation Swagger

## 🎨 UI Components

### Composants disponibles

| Composant | Description | Utilisation |
|-----------|-------------|-------------|
| `OXM.Button` | Boutons avec variantes | Actions principales/secondaires |
| `OXM.Modal` | Modales responsives | Dialogs et confirmations |
| `OXM.Input` | Champs de saisie | Formulaires |
| `OXM.Tooltip` | Infobulles intelligentes | Aide contextuelle |
| `OXM.Dropdown` | Menus déroulants | Navigation et sélection |
| `OXM.Toast` | Notifications | Feedback utilisateur |

### Utilisation dans les applications

```typescript
import { OXM } from '@oxymore/ui';

// Dans vos composants React
<OXM.Button variant="primary">Cliquer ici</OXM.Button>
<OXM.Modal isOpen={isOpen} onClose={onClose}>
  Contenu de la modal
</OXM.Modal>
```

## ⚠️ Points importants

### 1. Build du package UI
**AVANT de démarrer les applications, vous DEVEZ construire le package UI :**

```bash
npm run build
```

Sans cette étape, les applications `oxymore-app` et `oxymore-site` ne pourront pas importer les composants UI.

### 2. Ordre de démarrage recommandé

#### Avec Docker (Recommandé)
```bash
docker-compose up --build
```

#### En développement local
1. **Backend** : `npm run dev:back`
2. **Package UI** : `npm run build` (si pas déjà fait)
3. **Applications** : `npm run dev:admin`, `npm run dev:app`, `npm run dev:site`

### 3. Ports fixes

- **Backend** : Toujours port 3000
- **Admin** : 5175 (dev) / 8080 (Docker)
- **App** : 5173 (dev) / 8081 (Docker)
- **Site** : 5174 (dev) / 8082 (Docker)

### 4. Dépendances partagées

- Les applications utilisent le package `@oxymore/ui` pour les composants
- Les types sont partagés via `@oxymore/types`
- Le backend fournit l'API pour toutes les applications

## 🚀 Démarrage rapide

### Option 1 : Docker (Recommandé)
```bash
# 1. Cloner le repository
git clone <repository-url>
cd Oxymore-WebDigit

# 2. Lancer tout l'environnement
docker-compose up --build

# 3. Accéder aux applications
# Admin Panel: http://localhost:8080
# Main App: http://localhost:8081
# Marketing Site: http://localhost:8082
# Backend API: http://localhost:3000
```

### Option 2 : Développement local
```bash
# 1. Installation
npm install

# 2. Build du package UI (OBLIGATOIRE)
npm run build

# 3. Démarrer le backend
npm run dev:back

# 4. Démarrer les applications (dans des terminaux séparés)
npm run dev:admin
npm run dev:app
npm run dev:site
```

## 📞 Support

Pour toute question ou problème :
- **Avec Docker** : Vérifiez les logs avec `docker-compose logs -f`
- **En local** : Vérifiez que le package UI est bien construit
- Consultez les logs du backend
- Vérifiez la configuration des variables d'environnement

---

**Oxymore** - Plateforme eSport moderne et complète 🎮
