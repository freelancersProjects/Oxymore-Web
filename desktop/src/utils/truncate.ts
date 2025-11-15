/**
 * Tronque une chaîne de caractères à une longueur spécifiée
 * @param text - Le texte à tronquer
 * @param maxLength - La longueur maximale (par défaut 50 caractères)
 * @param suffix - Le suffixe à ajouter si le texte est tronqué (par défaut "...")
 * @returns Le texte tronqué avec le suffixe si nécessaire
 */
export const truncate = (text: string, maxLength: number = 50, suffix: string = "..."): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + suffix;
};

