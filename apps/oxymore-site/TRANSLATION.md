# Système de Traduction Oxymore

Ce document explique comment utiliser le système de traduction automatique d'Oxymore.

## Fonctionnalités

- **Détection automatique de la langue** : Le système détecte automatiquement la langue du navigateur
- **Support français et anglais** : Traductions complètes en français et anglais
- **Persistance** : La langue choisie est sauvegardée dans le localStorage
- **Changement dynamique** : Possibilité de changer de langue en temps réel
- **Fallback intelligent** : Si une traduction n'existe pas, la clé est affichée

## Structure des fichiers

```
src/
├── locales/
│   ├── fr.json          # Traductions françaises
│   └── en.json          # Traductions anglaises
├── context/
│   └── LanguageContext.tsx  # Contexte React pour la gestion des langues
└── components/
    └── LanguageSelector/
        ├── LanguageSelector.tsx  # Composant de sélection de langue
        └── LanguageSelector.scss # Styles du sélecteur
```

## Utilisation

### 1. Dans un composant React

```tsx
import { useLanguage } from '../context/LanguageContext';

const MonComposant = () => {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div>
      <h1>{t('home.hero.title')}</h1>
      <p>{t('home.hero.subtitle')}</p>
      <button onClick={() => setLanguage('en')}>
        Switch to English
      </button>
    </div>
  );
};
```

### 2. Fonction de traduction

La fonction `t()` accepte des clés imbriquées séparées par des points :

```tsx
// Accès simple
t('nav.home') // "Accueil" ou "Home"

// Accès imbriqué
t('home.hero.title') // "Plateforme de Tournois Gaming" ou "Gaming Tournament Platform"

// Accès aux fonctionnalités
t('home.platformIntro.features.create.title') // "Créer facilement" ou "Create easily"
```

### 3. Ajout du sélecteur de langue

```tsx
import LanguageSelector from '../components/LanguageSelector/LanguageSelector';

const Header = () => {
  return (
    <header>
      {/* ... autres éléments ... */}
      <LanguageSelector />
    </header>
  );
};
```

## Ajout de nouvelles traductions

### 1. Ajouter dans fr.json

```json
{
  "nouvelleSection": {
    "titre": "Mon nouveau titre",
    "description": "Ma nouvelle description"
  }
}
```

### 2. Ajouter dans en.json

```json
{
  "nouvelleSection": {
    "titre": "My new title",
    "description": "My new description"
  }
}
```

### 3. Utiliser dans le code

```tsx
const { t } = useLanguage();

return (
  <div>
    <h1>{t('nouvelleSection.titre')}</h1>
    <p>{t('nouvelleSection.description')}</p>
  </div>
);
```

## Logique de détection de langue

1. **Vérification du localStorage** : Si une langue a été précédemment choisie, elle est utilisée
2. **Détection du navigateur** : Si la langue du navigateur commence par "fr" (fr, fr-FR, fr-BE, etc.), le français est utilisé
3. **Fallback** : Par défaut, l'anglais est utilisé

## Bonnes pratiques

1. **Organisation** : Organisez les traductions par sections logiques (nav, home, about, etc.)
2. **Cohérence** : Utilisez des clés cohérentes et descriptives
3. **Fallback** : Si une traduction n'existe pas, la clé est affichée, ce qui aide au débogage
4. **Performance** : Les traductions sont chargées une seule fois au démarrage de l'application

## Exemple complet

```tsx
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from '../components/LanguageSelector/LanguageSelector';

const MonPage = () => {
  const { t, language } = useLanguage();

  return (
    <div>
      <header>
        <LanguageSelector />
        <nav>
          <a href="/">{t('nav.home')}</a>
          <a href="/about">{t('nav.about')}</a>
          <a href="/contact">{t('nav.contact')}</a>
        </nav>
      </header>

      <main>
        <h1>{t('home.hero.title')}</h1>
        <p>{t('home.hero.subtitle')}</p>
        <button>{t('common.getStarted')}</button>
      </main>

      <footer>
        <p>{t('footer.copyright')}</p>
      </footer>
    </div>
  );
};

export default MonPage;
```

## Support des langues

Actuellement supporté :
- 🇫🇷 Français (fr, fr-FR, fr-BE, etc.)
- 🇬🇧 Anglais (en, en-US, en-GB, etc.)

Pour ajouter une nouvelle langue :
1. Créer un nouveau fichier `xx.json` dans `src/locales/`
2. Ajouter la langue dans le type `Language` dans `LanguageContext.tsx`
3. Ajouter la traduction dans l'objet `translations`
4. Mettre à jour la fonction `getDefaultLanguage()`
