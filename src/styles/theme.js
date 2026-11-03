// Single source of truth for design tokens. Used by tailwind.config.js and importable in JS.
const colors = {
  brand: {
    gray: '#E8E8E8',
    black: '#000000',
    white: '#FFFFFF',
  },
};

// CSS gradient strings for React Native's experimental_backgroundImage (NativeWind has no native gradient classes).
const gradients = {
  mono: `linear-gradient(135deg, ${colors.brand.black} 30%, ${colors.brand.gray} 130%)`,
};

// Keys are the font family names registered in src/styles/fonts.js.
const fontFamily = {
  'helvetica-thin': ['HelveticaNeue-Thin'],
  'helvetica-light': ['HelveticaNeue-Light'],
  helvetica: ['HelveticaNeue-Roman'],
  'helvetica-medium': ['HelveticaNeue-Medium'],
  'helvetica-bold': ['HelveticaNeue-Bold'],
  'helvetica-black': ['HelveticaNeue-Black'],
};

module.exports = { colors, gradients, fontFamily };
