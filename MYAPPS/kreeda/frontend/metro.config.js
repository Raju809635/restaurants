const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add support for additional source extensions including CSS for web
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs', 'css'];

// Add CSS asset extension for web platform
config.resolver.assetExts = [...config.resolver.assetExts, 'css'];

// Ensure proper path resolution on Windows
config.resolver.platforms = ['native', 'web', 'default'];

// Fix Windows path issues
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;
