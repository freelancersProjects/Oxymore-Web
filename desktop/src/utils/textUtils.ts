/**
 * Met la première lettre en majuscule
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Met tout en majuscule
 */
export const toUpperCase = (str: string): string => {
  return str.toUpperCase();
};

/**
 * Met tout en minuscule
 */
export const toLowerCase = (str: string): string => {
  return str.toLowerCase();
};
