const ExtractTextPlugin = require('extract-text-webpack-plugin');
const combineLoaders = require('webpack-combine-loaders');

module.exports = {
  entry: './src/client.jsx',
  output: {
    filename: 'app.js',
    path: './build/statics',
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        query: {
          presets: ['es2016', 'es2017', 'react'],
          plugins: ['transform-es2015-modules-commonjs'],
        },
        rules: [
          {
            test: /\.jsx?$/,
            enforce: 'pre',
            loader: 'eslint-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: combineLoaders([{
            loader: 'css-loader',
            query: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          }]),
        }),
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devtool: '#source-map',
  target: 'web',
  plugins: [
    new ExtractTextPlugin('../statics/styles.css'),
  ],
};
