const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');

const config = getDefaultConfig(__dirname);

// withUniwindConfig must stay the outermost wrapper. rem: 14 keeps NativeWind's sizing.
module.exports = withUniwindConfig(config, {
  cssEntryFile: './src/styles/global.css',
  dtsFile: './src/uniwind-types.d.ts',
  polyfills: { rem: 14 },
});
