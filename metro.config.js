const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
// El backend vive en la misma carpeta: que Metro no lo indexe (Windows y Unix)
config.resolver.blockList = [/[\\/]backend[\\/].*/];

// zustand v5 publica una build ESM con import.meta que deja la versión web en blanco:
// se fuerza la build CommonJS
config.resolver.unstable_conditionNames = ['browser', 'require', 'react-native'];

module.exports = config;
