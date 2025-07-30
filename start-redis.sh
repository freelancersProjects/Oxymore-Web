#!/bin/bash

echo "🚀 Démarrage de Redis et de l'interface..."

# Vérifier si Redis est installé
if ! command -v redis-server &> /dev/null; then
    echo "❌ Redis n'est pas installé. Installation..."
    brew install redis
fi

# Démarrer Redis s'il n'est pas déjà en cours
if ! brew services list | grep redis | grep started > /dev/null; then
    echo "📦 Démarrage de Redis..."
    brew services start redis
    sleep 2
fi

# Vérifier que Redis fonctionne
if redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis est démarré et fonctionne"
else
    echo "❌ Erreur: Redis ne répond pas"
    exit 1
fi

# Vérifier si redis-commander est installé
if ! command -v redis-commander &> /dev/null; then
    echo "📦 Installation de Redis Commander..."
    npm install -g redis-commander
fi

echo "🌐 Démarrage de l'interface Redis Commander..."
echo "Interface disponible sur: http://localhost:8081"
echo "Redis CLI: redis-cli"
echo ""
echo "Pour arrêter: Ctrl+C"

# Démarrer Redis Commander
redis-commander --redis-host localhost --redis-port 6379 --port 8081 