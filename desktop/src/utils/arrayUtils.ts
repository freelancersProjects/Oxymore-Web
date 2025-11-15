/**
 * Utilitaires pour les opérations sur les tableaux
 */

/**
 * Supprime les doublons d'un tableau
 */
export const removeDuplicates = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

/**
 * Prend un élément aléatoire d'un tableau
 */
export const getRandomElement = <T>(array: T[]): T | undefined => {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Trouve l'élément avec la valeur maximale d'une propriété
 */
export const maxBy = <T>(array: T[], key: keyof T): T | undefined => {
  if (array.length === 0) return undefined;

  return array.reduce((max, current) => {
    return (current[key] as any) > (max[key] as any) ? current : max;
  });
};
