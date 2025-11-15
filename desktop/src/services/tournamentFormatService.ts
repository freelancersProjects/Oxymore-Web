/**
 * Service for mapping tournament structure and format values to readable labels
 */

export const tournamentFormatService = {
  /**
   * Get the readable label for a tournament structure
   * @param structure - The tournament structure value (e.g., 'single_elimination', 'group_single')
   * @returns The readable label (e.g., 'Single Elimination', 'Group Stage + Single Elimination')
   */
  getStructureLabel: (structure?: string | null): string => {
    if (!structure) {
      return 'Single Elimination';
    }

    const structureMap: Record<string, string> = {
      'single_elimination': 'Single Elimination',
      'double_elimination': 'Double Elimination',
      'group_single': 'Group Stage + Single Elimination',
      'group_double': 'Group Stage + Double Elimination',
    };

    return structureMap[structure] || structure;
  },

  /**
   * Get the readable label for a tournament format
   * @param format - The tournament format value (e.g., 'BO1', 'BO3', 'BO5')
   * @returns The readable label (e.g., 'Best of 1', 'Best of 3', 'Best of 5')
   */
  getFormatLabel: (format?: string | null): string => {
    if (!format) {
      return 'Best of 1';
    }

    const formatMap: Record<string, string> = {
      'BO1': 'Best of 1',
      'BO3': 'Best of 3',
      'BO5': 'Best of 5',
    };

    return formatMap[format] || format;
  },
};

