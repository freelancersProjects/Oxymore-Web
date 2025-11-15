import { app, BrowserWindow, screen, ipcMain } from 'electron';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Chemin vers l'icône de l'application
const getIconPath = () => {
  // En développement, __dirname pointe vers dist-electron
  // En production, il pointe aussi vers dist-electron
  const iconDir = process.env.VITE_DEV_SERVER_URL 
    ? join(process.cwd(), 'build') 
    : join(__dirname, '../build');
  
  // Utiliser le logo violet (PNG) pour tous les systèmes
  // Electron peut utiliser PNG même sur Windows
  const iconPath = join(iconDir, 'icon.png');
  
  // Si le fichier .ico existe sur Windows, l'utiliser en priorité
  if (process.platform === 'win32') {
    const icoPath = join(iconDir, 'icon.ico');
    try {
      const fs = require('fs');
      if (fs.existsSync(icoPath)) {
        return icoPath;
      }
    } catch (e) {
      // Ignorer l'erreur et utiliser PNG
    }
    return iconPath;
  } else if (process.platform === 'darwin') {
    return join(iconDir, 'icon.icns');
  } else {
    return iconPath;
  }
};

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (process.platform === 'win32') {
  try {
    require('electron-squirrel-startup');
  } catch (e) {
    // electron-squirrel-startup not available
  }
}

let splashWindow: BrowserWindow | null = null;
let mainWindow: BrowserWindow | null = null;

const createSplashWindow = () => {
  splashWindow = new BrowserWindow({
    width: 350,
    height: 500,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    show: false, // Ne pas afficher immédiatement
    icon: getIconPath(),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, 'preload.js'),
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    splashWindow.loadURL(`${process.env.VITE_DEV_SERVER_URL}/splash.html`);
  } else {
    splashWindow.loadFile(join(__dirname, '../dist/splash.html'));
  }

  splashWindow.setMenuBarVisibility(false);

  splashWindow.once('ready-to-show', () => {
    splashWindow?.show();
  });

  splashWindow.center();
};

const createMainWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: Math.min(1400, width),
    height: Math.min(900, height),
    minWidth: 1200,
    minHeight: 700,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#0a0a0a',
    show: false, // Ne pas afficher avant que la splash screen soit fermée
    icon: getIconPath(),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, 'preload.js'),
      webSecurity: false, // Désactiver pour le développement
    },
  });

  // Ouvrir DevTools en mode développement
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.webContents.openDevTools();
  }

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'));
  }

  mainWindow.webContents.on('did-finish-load', () => {
    // Simulate loading time (2-3 seconds)
    setTimeout(() => {
      if (splashWindow) {
        splashWindow.close();
        splashWindow = null;
      }
      // Attendre un peu après la fermeture de la splash screen
      setTimeout(() => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.show();
          mainWindow.center();
          mainWindow.focus();
        }
      }, 100);
    }, 2500);
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });

  mainWindow.setMenuBarVisibility(false);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', () => {
  createSplashWindow();
  createMainWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createSplashWindow();
    createMainWindow();
  }
});

// Gestion des contrôles de fenêtre
ipcMain.on('window-minimize', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.on('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

