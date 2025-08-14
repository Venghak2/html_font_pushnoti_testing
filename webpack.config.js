const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'jaosua-sdk.js',
    library: 'JaosuaSDK',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  mode: 'production',
  experiments: {
    outputModule: false,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
