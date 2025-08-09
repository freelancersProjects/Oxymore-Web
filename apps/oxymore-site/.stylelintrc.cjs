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
      enforceColorVar: false,
      enforceFontFamily: false
    }],

    'unit-allowed-list': null,
    'selector-class-pattern': null,
    'no-descending-specificity': null,
    'no-duplicate-selectors': null,
    'keyframes-name-pattern': null,
    'scss/at-extend-no-missing-placeholder': null,
    'scss/no-global-function-names': null,

    '@stylistic/color-hex-case': 'lower',
    '@stylistic/declaration-block-semicolon-newline-after': 'always',
    '@stylistic/declaration-colon-space-after': 'always',
    '@stylistic/declaration-colon-space-before': 'never'
  }
};
