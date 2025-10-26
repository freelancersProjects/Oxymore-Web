export interface Country {
  code: string;
  name: string;
  flag: string;
}

export const regionService = {
  // Récupérer tous les pays depuis l'API distante
  getAllCountries: async (): Promise<Country[]> => {
    try {
      // Utiliser l'API RESTCountries (gratuite, pas de clé API)
      const response = await fetch('https://restcountries.com/v3.1/all?fields=cca2,name,flag');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des pays');
      }

      const data = await response.json();

      return data
        .sort((a: any, b: any) => a.name.common.localeCompare(b.name.common))
        .map((country: any) => ({
          code: country.cca2,
          name: country.name.common,
          flag: country.flag
        }));
    } catch (error) {
      console.error('Erreur API RestCountries:', error);
      return [
        { code: 'FR', name: 'France', flag: '🇫🇷' },
        { code: 'US', name: 'United States', flag: '🇺🇸' },
        { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
        { code: 'DE', name: 'Germany', flag: '🇩🇪' },
        { code: 'ES', name: 'Spain', flag: '🇪🇸' },
        { code: 'IT', name: 'Italy', flag: '🇮🇹' },
      ];
    }
  },

  getCountryByCode: async (code: string): Promise<Country | undefined> => {
    try {
      const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}?fields=cca2,name,flag`);
      if (!response.ok) {
        throw new Error('Pays non trouvé');
      }

      const data = await response.json();
      return {
        code: data.cca2,
        name: data.name.common,
        flag: data.flag
      };
    } catch (error) {
      console.error('Erreur récupération pays:', error);
      return undefined;
    }
  },

  // Rechercher des pays
  searchCountries: async (query: string): Promise<Country[]> => {
    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${query}?fields=cca2,name,flag`);
      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.map((country: any) => ({
        code: country.cca2,
        name: country.name.common,
        flag: country.flag
      }));
    } catch (error) {
      console.error('Erreur recherche pays:', error);
      return [];
    }
  }
};

