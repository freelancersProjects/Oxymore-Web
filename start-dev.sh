#!/bin/bash

echo "🚀 Démarrage de l'environnement de développement Oxymore..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier si Redis est démarré
print_status "Vérification de Redis..."
if redis-cli ping > /dev/null 2>&1; then
    print_success "Redis est déjà démarré"
else
    print_status "Démarrage de Redis..."
    brew services start redis
    sleep 2
    if redis-cli ping > /dev/null 2>&1; then
        print_success "Redis démarré avec succès"
    else
        print_error "Impossible de démarrer Redis"
        exit 1
    fi
fi

# Démarrer l'interface Redis en arrière-plan
print_status "Démarrage de l'interface Redis..."
redis-commander --redis-host localhost --redis-port 6379 --port 8081 > /dev/null 2>&1 &
REDIS_UI_PID=$!
sleep 2

# Vérifier que l'interface Redis fonctionne
if curl -s http://localhost:8081 > /dev/null 2>&1; then
    print_success "Interface Redis disponible sur http://localhost:8081"
else
    print_warning "Interface Redis non accessible"
fi

# Démarrer le backend
print_status "Démarrage du backend..."
cd back && npm run dev > /dev/null 2>&1 &
BACKEND_PID=$!
cd ..
sleep 3

# Vérifier que le backend fonctionne
if curl -s http://localhost:3000/api-docs > /dev/null 2>&1; then
    print_success "Backend démarré sur http://localhost:3000"
    print_success "Documentation API: http://localhost:3000/api-docs"
else
    print_warning "Backend non accessible"
fi

echo ""
print_success "Environnement de développement démarré !"
echo ""
echo "📋 Services disponibles:"
echo "  • Backend API: http://localhost:3000"
echo "  • Documentation API: http://localhost:3000/api-docs"
echo "  • Interface Redis: http://localhost:8081"
echo "  • Redis CLI: redis-cli"
echo ""
echo "🛑 Pour arrêter: Ctrl+C"

# Fonction de nettoyage
cleanup() {
    echo ""
    print_status "Arrêt des services..."
    kill $REDIS_UI_PID 2>/dev/null
    kill $BACKEND_PID 2>/dev/null
    print_success "Services arrêtés"
    exit 0
}

# Capturer Ctrl+C
trap cleanup SIGINT

# Attendre indéfiniment
while true; do
    sleep 1
done 