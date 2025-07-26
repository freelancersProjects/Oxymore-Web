# 🚀 Oxymore Tunnel System

Système de tunnel pour partager facilement vos applications Oxymore Site et App en développement.

## 📋 Prérequis

1. **Node.js** (version 16 ou supérieure)
2. **Compte ngrok** (gratuit) - [https://ngrok.com](https://ngrok.com)
3. **Token ngrok** - Récupérez votre authtoken sur le dashboard ngrok

## 🛠️ Installation

1. **Installer les dépendances :**
```bash
cd tunnel
npm run install-deps
```

2. **Configurer ngrok :**
```bash
# Remplacez YOUR_AUTH_TOKEN par votre vrai token
export NGROK_AUTH_TOKEN="YOUR_AUTH_TOKEN"
```

## 🚀 Utilisation

### Démarrage rapide
```bash
cd tunnel
npm start
```

### Interface web
1. Ouvrez votre navigateur sur `http://localhost:3001`
2. Sélectionnez votre cible :
   - **🌐 Oxymore Site** (port 5173)
   - **📱 Oxymore App** (port 5174)
3. Le tunnel se crée automatiquement

### Commandes disponibles

| Commande | Description |
|----------|-------------|
| `npm start` | Démarre le serveur tunnel |
| `npm run dev` | Démarre en mode développement avec auto-reload |
| `npm run tunnel` | Démarre directement le tunnel |

## 🎯 Fonctionnalités

### ✅ Sélection de cible
- Interface web intuitive
- Choix entre Site et App
- Indicateur de statut en temps réel

### ✅ Gestion du tunnel
- Démarrage/arrêt automatique
- URL de tunnel sécurisée
- Copie d'URL en un clic

### ✅ Actions rapides
- **📋 Copier l'URL** : Copie l'URL du tunnel
- **🔗 Ouvrir le tunnel** : Ouvre le tunnel dans un nouvel onglet
- **🏠 Ouvrir local** : Ouvre l'app locale
- **🛑 Arrêter le tunnel** : Arrête le tunnel actuel

## 🔧 Configuration

### Ports par défaut
- **Site** : `5173`
- **App** : `5174`
- **Tunnel Server** : `3001`

### Personnalisation
Modifiez `index.js` pour changer les ports :

```javascript
const config = {
  site: {
    port: 5173,  // ← Changez ici
    name: 'Oxymore Site',
    path: '../apps/oxymore-site'
  },
  app: {
    port: 5174,  // ← Changez ici
    name: 'Oxymore App',
    path: '../apps/oxymore-app'
  }
};
```

## 🎨 Interface

- **Design moderne** avec thème Oxymore
- **Responsive** pour mobile et desktop
- **Animations fluides** et feedback visuel
- **Notifications** en temps réel

## 🔒 Sécurité

- Tunnel HTTPS sécurisé via ngrok
- Authentification ngrok requise
- Pas d'exposition de ports locaux

## 🐛 Dépannage

### Erreur "ngrok not found"
```bash
npm install -g @ngrok/ngrok
```

### Erreur "authtoken required"
```bash
export NGROK_AUTH_TOKEN="your_token_here"
```

### Port déjà utilisé
Changez le port dans `index.js` ou arrêtez le processus qui utilise le port.

## 📱 Utilisation mobile

L'interface est entièrement responsive et fonctionne sur mobile pour :
- Voir le statut du tunnel
- Copier l'URL
- Arrêter le tunnel

## 🎯 Workflow recommandé

1. **Démarrez vos apps** (Site et/ou App)
2. **Lancez le tunnel** : `npm start`
3. **Sélectionnez votre cible** dans l'interface
4. **Partagez l'URL** avec votre équipe
5. **Arrêtez le tunnel** quand vous avez fini

---

**Développé avec ❤️ pour Oxymore** 