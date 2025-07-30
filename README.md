# Oxymore Monorepo

Bienvenue dans le monorepo **Oxymore**.

Ce dépôt contient :
- `apps/oxymore-app` → Application principale (client Electron ou web)
- `apps/oxymore-site` → Site vitrine / domaine principal
- `back/` → Backend API avec WebSocket et Redis
- `packages/oxm-ui` → Bibliothèque de composants UI partagée (OXM)

---

## 📦 **Installation**

> **⚠️ IMPORTANT**
> Tu dois toujours installer les dépendances **depuis la racine** du projet pour que tout fonctionne correctement.

```bash
# Depuis la racine :
npm install
```

## 🚀 **Démarrage rapide**

### Option 1: Script automatique (recommandé)
```bash
./start-dev.sh
```

### Option 2: Manuel
```bash
# Démarrer Redis et l'interface
./start-redis.sh

# Dans un autre terminal, démarrer le backend
npm run dev:back

# Dans un autre terminal, démarrer l'app
npm run dev:app
```

### 📖 **Documentation API**
```bash
# Ouvrir les documentations API
./open-api-docs.sh
```

## 📋 **Services disponibles**

- **Backend API**: http://localhost:3000
- **Documentation API publique**: http://localhost:3000/api-docs
- **Documentation API admin**: http://localhost:3000/admin/api-docs
- **Interface Redis**: http://localhost:8081
- **Application**: http://localhost:5173
- **Site vitrine**: http://localhost:5174

## 🔧 **Configuration Redis**

Voir le fichier `REDIS_SETUP.md` pour la configuration détaillée de Redis.
