const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for Tamagui and web platform
config.resolver.sourceExts.push('mjs');

// Ensure react-native-web is properly resolved
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'react-native') {
    return context.resolveRequest(context, 'react-native-web', platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
