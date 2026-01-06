module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
    ],
    plugins: [
      // Required for react-native-reanimated
      'react-native-reanimated/plugin',
    ],
    env: {
      test: {
        plugins: [
          // Additional plugins for testing environment
          ['@babel/plugin-transform-modules-commonjs', { loose: true }],
          // Don't include reanimated plugin in test env as it can cause issues
        ],
      },
    },
  };
};
