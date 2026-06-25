#!/usr/bin/env bash
# =============================================================================
# Met à jour le site sur le VPS après une modification du code.
# Usage : bash deploy/update.sh
# =============================================================================
set -euo pipefail

cd "$(dirname "$0")/.."

echo "→ Récupération du code..."
git pull

echo "→ Installation des dépendances..."
npm install --omit=dev=false

echo "→ Build de production..."
npm run build

echo "→ Redémarrage de l'application..."
pm2 restart shift-academie

echo "✅ Mise à jour terminée."
