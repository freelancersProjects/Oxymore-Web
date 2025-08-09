const stylelint = require('stylelint');
const ruleName = 'custom/oxymore-rules';
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (value) => `Utilisez rem-calc() au lieu de ${value}`,
  rejectedColor: (value) => `Utilisez une variable de couleur ($color-*) au lieu de ${value}`,
  rejectedFont: (value) => `Utilisez les classes .orbitron ou .outfit au lieu de font-family: "${value}"`
});

module.exports = stylelint.createPlugin(ruleName, (enabled, options = {}) => {
  return (root, result) => {
    if (!enabled) return;

    root.walkDecls(decl => {
      const { prop, value } = decl;
      const enforcePxToRem = options.enforcePxToRem !== false;
      const enforceColorVar = options.enforceColorVar === true; // par défaut false pour se concentrer sur rem-calc
      const enforceFontFamily = options.enforceFontFamily === true; // par défaut false

      // Vérifier l'utilisation de px de manière plus subtile (rem-calc)
      if (enforcePxToRem && value.includes('px')) {
        // Extraire la valeur numérique
        const pxMatch = value.match(/(\d+(?:\.\d+)?)px/);
        if (pxMatch) {
          const pxValue = parseFloat(pxMatch[1]);

          // Ne flagger que les valeurs importantes
          const shouldFlag = (
            // Tailles importantes (width, height, font-size, etc.)
            (['width', 'height', 'min-width', /* 'max-width' exclu */ 'min-height', 'max-height', 'font-size', 'line-height'].includes(prop) && pxValue >= 8) ||
            // Espacements significatifs (padding uniquement; margin exclu)
            (['padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right'].includes(prop) && pxValue >= 8) ||
            // Positions importantes
            (['top', 'bottom', 'left', 'right'].includes(prop) && pxValue >= 8) ||
            // Gap et espacements de layout
            (['gap', 'row-gap', 'column-gap'].includes(prop) && pxValue >= 4) ||
            // Border-radius (seulement si assez grand)
            (prop === 'border-radius' && pxValue >= 8) ||
            // Transform scale/translate (seulement si assez grand)
            ((prop === 'transform' && (value.includes('scale') || value.includes('translate'))) && pxValue >= 8)
          );

          // Ne PAS flagger les petites valeurs subtiles
          const shouldIgnore = (
            // Ignorer toutes les propriétés border*
            prop.startsWith('border') ||
            // Ignorer toutes les propriétés margin*
            prop.startsWith('margin') ||
            // Ignorer max-width explicitement
            prop === 'max-width' ||
            // Ignorer size (si utilisé)
            prop === 'size' ||
            // Bordures fines (pour les cas spécifiques résiduels)
            (prop.includes('border') && pxValue <= 2) ||
            // Ombres subtiles
            (prop.includes('box-shadow') && pxValue <= 4) ||
            // Z-index
            prop === 'z-index' ||
            // Opacité
            prop === 'opacity' ||
            // Flex basis/grow/shrink
            ['flex-basis', 'flex-grow', 'flex-shrink'].includes(prop) ||
            // Grid
            ['grid-template-columns', 'grid-template-rows', 'grid-column', 'grid-row'].includes(prop) ||
            // Media queries (doivent rester en px)
            decl.parent && decl.parent.type === 'atrule' && decl.parent.name === 'media'
          );

          if (shouldFlag && !shouldIgnore) {
            stylelint.utils.report({
              message: messages.rejected(value),
              node: decl,
              result,
              ruleName
            });
          }
        }
      }

      // Vérifier les couleurs hexadécimales (désactivé par défaut)
      if (enforceColorVar) {
        if ((prop.includes('color') || prop.includes('background') || prop.includes('border')) &&
            /#[0-9a-fA-F]{3,6}/.test(value) &&
            !value.includes('$color-')) {
          stylelint.utils.report({
            message: messages.rejectedColor(value),
            node: decl,
            result,
            ruleName
          });
        }
      }

      // Vérifier les font-family hardcodées (désactivé par défaut)
      if (enforceFontFamily) {
        if (prop === 'font-family' && (value.includes('"Orbitron"') || value.includes('"Outfit"'))) {
          stylelint.utils.report({
            message: messages.rejectedFont(value),
            node: decl,
            result,
            ruleName
          });
        }
      }
    });
  };
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;
