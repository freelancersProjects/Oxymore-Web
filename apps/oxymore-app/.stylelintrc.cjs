module.exports = {
  extends: [
    'stylelint-config-standard-scss'
  ],
  plugins: [
    'stylelint-scss',
    '@stylistic/stylelint-plugin',
    './stylelint-custom-rules.cjs'
  ],
  rules: {
    'custom/oxymore-rules': [true, {
      enforcePxToRem: true,
      enforceColorVar: true,
      enforceFontFamily: false
    }],
    // Désactiver les règles qui interfèrent
    'unit-allowed-list': null,
    '@stylistic/color-hex-case': null,
    '@stylistic/declaration-block-semicolon-newline-after': null,
    '@stylistic/declaration-colon-space-after': null,
    '@stylistic/declaration-colon-space-before': null,
    'selector-class-pattern': null,
    'no-descending-specificity': null,
    'no-duplicate-selectors': null,
    'keyframes-name-pattern': null,
    'scss/at-extend-no-missing-placeholder': null,
    'scss/no-global-function-names': null,
    'font-family-no-missing-generic-family-keyword': null,
    'declaration-block-single-line-max-declarations': null
  }
};
