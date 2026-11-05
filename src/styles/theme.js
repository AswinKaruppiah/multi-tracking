// Design tokens for JS. Mirrored as CSS @theme tokens in src/styles/global.css.
const colors = {
  brand: {
    gray: '#E8E8E8',
    black: '#000000',
    white: '#FFFFFF',
  },
};

// CSS gradient strings for React Native's experimental_backgroundImage (no native gradient classes).
const gradients = {
  mono: `linear-gradient(135deg, ${colors.brand.black} 30%, ${colors.brand.gray} 130%)`,
};

module.exports = { colors, gradients };
