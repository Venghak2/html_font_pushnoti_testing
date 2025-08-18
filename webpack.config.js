const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
  externals: {
    'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js': 'firebase',
    'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js': 'firebase',
    'https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js': 'firebase',
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'firebase-messaging-sw.js',
          to: 'firebase-messaging-sw.js'
        }
      ]
    })
  ],
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
