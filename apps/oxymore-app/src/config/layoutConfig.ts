// Configuration pour les pages qui doivent masquer la sidebar, header et footer
export const LAYOUT_CONFIG = {
  // Pages qui doivent être en plein écran (sans sidebar, header, footer)
  fullscreenPages: [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/game-selection",
    "/teams/create",
    // '/oxia'
  ],

  // Pages qui doivent masquer seulement la sidebar
  noSidebarPages: ["/mobile-dashboard", "/mobile-settings"],

  // Pages qui doivent masquer seulement le header
  noHeaderPages: [
    "/oxia",
    "/highlights",
    "/upload",
    "/demo",
    "/messages",
    "/subscription",
  ],

  // Pages qui doivent masquer le header avec pattern
  noHeaderPatterns: ["/teams/:id"],

  // Pages qui doivent masquer seulement le footer
  noFooterPages: ["/dashboard", "/admin"],

  //Pages qui doivent masquer seulement la sidebar du profile
  noProfileSidebarPatterns: ["/subscription", "/teams/:id", "/upload", "/highlights", "/tournaments/:id"],
};

// Fonction utilitaire pour vérifier si une page doit être en plein écran
export const isFullscreenPage = (pathname: string): boolean => {
  return LAYOUT_CONFIG.fullscreenPages.some((page) =>
    pathname.startsWith(page)
  );
};

// Fonction utilitaire pour vérifier si une page doit masquer la sidebar
export const shouldHideSidebar = (pathname: string): boolean => {
  return (
    LAYOUT_CONFIG.fullscreenPages.some((page) => pathname.startsWith(page)) ||
    LAYOUT_CONFIG.noSidebarPages.some((page) => pathname.startsWith(page))
  );
};

// Fonction utilitaire pour vérifier si une page doit masquer le header
export const shouldHideHeader = (pathname: string): boolean => {
  const matchesFullscreen = LAYOUT_CONFIG.fullscreenPages.some((page) => pathname.startsWith(page));
  const matchesNoHeader = LAYOUT_CONFIG.noHeaderPages.some((page) => pathname.startsWith(page));
  const matchesPattern = LAYOUT_CONFIG.noHeaderPatterns?.some((pattern) => {
    if (!pattern.includes(':')) {
      return pathname === pattern;
    }
    const patternParts = pattern.split('/');
    const pathParts = pathname.split('/');
    if (patternParts.length !== pathParts.length) return false;
    return patternParts.every((part, index) => {
      return part.startsWith(':') || part === pathParts[index];
    });
  }) || false;

  return matchesFullscreen || matchesNoHeader || matchesPattern;
};

// Fonction utilitaire pour vérifier si une page doit masquer le footer
export const shouldHideFooter = (pathname: string): boolean => {
  return (
    LAYOUT_CONFIG.fullscreenPages.some((page) => pathname.startsWith(page)) ||
    LAYOUT_CONFIG.noFooterPages.some((page) => pathname.startsWith(page))
  );
};

// Fonction utilitaire pour vérifier si une page doit masquer la sidebar du profile
export const shouldHideProfileSidebar = (pathname: string): boolean => {
  return LAYOUT_CONFIG.noProfileSidebarPatterns.some((pattern) => {
    // Vérifier si c'est un match exact (pas de paramètres dynamiques)
    if (!pattern.includes(':')) {
      return pathname === pattern;
    }

    // Vérifier les patterns avec paramètres (ex: /teams/:id)
    const patternParts = pattern.split('/');
    const pathParts = pathname.split('/');

    if (patternParts.length !== pathParts.length) return false;

    return patternParts.every((part, index) => {
      return part.startsWith(':') || part === pathParts[index];
    });
  });
};

// Fonction pour ajouter une classe CSS au body selon la page
export const updateBodyClass = (pathname: string): void => {
  const body = document.body;

  // Supprimer toutes les classes de layout précédentes
  body.classList.remove(
    "fullscreen-layout",
    "no-sidebar",
    "no-header",
    "no-footer",
    "no-profile-sidebar"
  );

  // Ajouter les classes appropriées
  if (isFullscreenPage(pathname)) {
    body.classList.add("fullscreen-layout");
  } else {
    if (shouldHideSidebar(pathname)) {
      body.classList.add("no-sidebar");
    }
    if (shouldHideHeader(pathname)) {
      body.classList.add("no-header");
    }
    if (shouldHideFooter(pathname)) {
      body.classList.add("no-footer");
    }
    if (shouldHideProfileSidebar(pathname)) {
      body.classList.add("no-profile-sidebar");
    }
  }
};

// Fonction utilitaire pour vérifier si on est sur la page Oxia
export const isOxiaPage = (pathname: string): boolean => {
  return pathname.startsWith("/oxia");
};
