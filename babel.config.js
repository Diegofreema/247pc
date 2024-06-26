module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Required for expo-router

      ['module:react-native-dotenv'],
      'react-native-reanimated/plugin',
    ],
  };
};
