# Oxymore Desktop

Application desktop Electron pour Oxymore.

## Développement

```bash
# Depuis la racine du monorepo
npm run dev:desktop

# Ou depuis le dossier desktop
cd desktop
npm run electron:dev
```

## Build

```bash
cd desktop
npm run build
```

## Structure

- `electron/` - Code Electron (main process)
  - `main.ts` - Processus principal Electron
  - `preload.ts` - Script de préchargement
- `src/` - Code React (renderer process)
  - `App.tsx` - Composant principal
  - `main.tsx` - Point d'entrée React
- `splash.html` - Écran de démarrage avec loader


