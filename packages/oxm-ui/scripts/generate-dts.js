const fs = require('fs');
const path = require('path');

// Fonction pour lire le contenu d'un fichier TypeScript et extraire les interfaces
function extractInterfaces(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const interfaces = [];

    // Chercher les interfaces exportées
    const interfaceRegex = /export\s+interface\s+(\w+)/g;
    let match;

    while ((match = interfaceRegex.exec(content)) !== null) {
      interfaces.push(match[1]);
    }

    return interfaces;
  } catch (error) {
    console.warn(`⚠️ Impossible de lire ${filePath}:`, error.message);
    return [];
  }
}

// Fonction pour lire le fichier index.ts et extraire les exports
function extractExports(indexPath) {
  try {
    const content = fs.readFileSync(indexPath, 'utf8');
    const exports = [];

    // Chercher les exports de composants
    const exportRegex = /export\s+\{\s*default\s+as\s+(\w+)\s*\}\s+from\s+["']([^"']+)["']/g;
    let match;

    while ((match = exportRegex.exec(content)) !== null) {
      exports.push({
        name: match[1],
        path: match[2]
      });
    }

    return exports;
  } catch (error) {
    console.error('❌ Erreur lors de la lecture du fichier index.ts:', error.message);
    return [];
  }
}

// Fonction pour extraire le contenu d'une interface depuis un fichier
function extractInterfaceContent(filePath, interfaceName) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Chercher l'interface spécifique
    const interfaceRegex = new RegExp(`export\\s+interface\\s+${interfaceName}\\s*\\{([^}]+)\\}`, 's');
    const match = content.match(interfaceRegex);

    if (match) {
      return match[1].trim();
    }

    return null;
  } catch (error) {
    console.warn(`⚠️ Impossible de lire l'interface ${interfaceName} dans ${filePath}:`, error.message);
    return null;
  }
}

// Fonction pour générer le contenu du fichier .d.ts
function generateDtsContent(exports, srcPath) {
  let content = `import { ComponentType } from 'react';\n\n`;

  // Générer les interfaces pour chaque composant
  exports.forEach(exportItem => {
    const componentPath = path.join(srcPath, `${exportItem.path}.tsx`);
    const interfaces = extractInterfaces(componentPath);

    if (interfaces.length > 0) {
      // Utiliser la première interface trouvée (généralement la bonne)
      const interfaceName = interfaces[0];
      const interfaceContent = extractInterfaceContent(componentPath, interfaceName);

      if (interfaceContent) {
        content += `// ${exportItem.name}\nexport interface ${interfaceName} {\n`;
        content += interfaceContent;
        content += `\n}\n\n`;
      } else {
        // Fallback si on ne peut pas lire le contenu
        content += `// ${exportItem.name}\nexport interface ${interfaceName} {\n`;
        content += `  children: React.ReactNode;\n`;
        content += `  className?: string;\n`;
        content += `}\n\n`;
      }
    } else {
      // Fallback si aucune interface n'est trouvée
      const fallbackInterfaceName = `${exportItem.name}Props`;
      content += `// ${exportItem.name}\nexport interface ${fallbackInterfaceName} {\n`;
      content += `  children: React.ReactNode;\n`;
      content += `  className?: string;\n`;
      content += `}\n\n`;
    }
  });

  // Générer les exports des composants
  content += `// Component exports\n`;
  exports.forEach(exportItem => {
    const componentPath = path.join(srcPath, `${exportItem.path}.tsx`);
    const interfaces = extractInterfaces(componentPath);

    if (interfaces.length > 0) {
      const interfaceName = interfaces[0];
      content += `export declare const ${exportItem.name}: ComponentType<${interfaceName}>;\n`;
    } else {
      const fallbackInterfaceName = `${exportItem.name}Props`;
      content += `export declare const ${exportItem.name}: ComponentType<${fallbackInterfaceName}>;\n`;
    }
  });

  return content;
}

// Fonction principale
function generateDts() {
  const srcPath = path.join(__dirname, '..', 'src');
  const indexPath = path.join(srcPath, 'index.ts');
  const distPath = path.join(__dirname, '..', 'dist');
  const dtsPath = path.join(distPath, 'index.d.ts');

  console.log('🔍 Lecture du fichier index.ts...');
  const exports = extractExports(indexPath);

  if (exports.length === 0) {
    console.error('❌ Aucun export trouvé dans index.ts');
    return;
  }

  console.log(`📦 ${exports.length} composants trouvés:`);
  exports.forEach(exp => console.log(`  - ${exp.name}`));

  // Générer le contenu du fichier .d.ts
  const dtsContent = generateDtsContent(exports, srcPath);

  // Créer le dossier dist s'il n'existe pas
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
  }

  // Écrire le fichier index.d.ts
  fs.writeFileSync(dtsPath, dtsContent);

  console.log('✅ index.d.ts généré avec succès !');
  console.log(`📁 Fichier créé: ${dtsPath}`);
}

// Exécuter le script
generateDts();
