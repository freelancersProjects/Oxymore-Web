import cs2Logo from '../assets/images/games/cs2.webp';
import rlLogo from '../assets/images/games/rl.webp';
import lolLogo from '../assets/images/games/lol.webp';

export const gameService = {
  getGameLogoByName: (gameName: string): string | null => {
    const gameNameLower = gameName?.toLowerCase() || '';

    if (gameNameLower.includes('counter strike') || gameNameLower.includes('counter-strike') || gameNameLower.includes('cs2') || gameNameLower.includes('cs 2')) {
      return cs2Logo;
    }
    if (gameNameLower.includes('rocket league') || gameNameLower.includes('rl')) {
      return rlLogo;
    }
    if (gameNameLower.includes('league of legends') || gameNameLower.includes('lol')) {
      return lolLogo;
    }

    return null;
  }
};
