# Configuration Redis pour Oxymore

## 🚀 Démarrage rapide

### Option 1: Script automatique
```bash
./start-redis.sh
```

### Option 2: Manuel
```bash
# Démarrer Redis
brew services start redis

# Vérifier que Redis fonctionne
redis-cli ping

# Démarrer l'interface web (optionnel)
npm run redis:ui --prefix back
```

## 📋 Interface web

L'interface Redis Commander est disponible sur: **http://localhost:8081**

Cette interface vous permet de :
- Voir toutes les clés Redis
- Modifier les valeurs
- Supprimer des clés
- Monitorer les connexions
- Exécuter des commandes Redis

## 🔧 Commandes Redis utiles

```bash
# Connexion à Redis
redis-cli

# Voir toutes les clés
KEYS *

# Voir une valeur
GET nom_de_la_cle

# Définir une valeur
SET nom_de_la_cle "valeur"

# Supprimer une clé
DEL nom_de_la_cle

# Voir les informations du serveur
INFO

# Monitorer les commandes en temps réel
MONITOR
```

## 🛑 Arrêt

```bash
# Arrêter Redis
brew services stop redis

# Arrêter l'interface (Ctrl+C si lancée manuellement)
```

## 📁 Configuration

Redis est configuré par défaut sur :
- **Host**: localhost
- **Port**: 6379
- **Interface web**: http://localhost:8081

## 🔍 Dépannage

### Redis ne démarre pas
```bash
# Vérifier les logs
brew services list | grep redis
tail -f /usr/local/var/log/redis.log
```

### Interface web inaccessible
```bash
# Vérifier que le port 8081 est libre
lsof -i :8081

# Redémarrer l'interface
npm run redis:ui --prefix back
```

### Connexion refusée
```bash
# Redémarrer Redis
brew services restart redis

# Vérifier la connexion
redis-cli ping
``` 