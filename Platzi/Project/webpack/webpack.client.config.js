const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const combineLoaders = require('webpack-combine-loaders');


const config = {
  entry: './src/client.jsx',
  output: {
    filename: 'app.js',
    path: './build/statics',
    publicPath: process.env.NODE_ENV === 'production'
      ? 'https://jmferrete-react-project.now.sh'
      : 'http://localhost:8080',
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
          env: {
            production: {
              presets: ['es2015'],
              plugins: ['transform-regenerator', 'transform-runtime'],
            },
            development: {
              plugins: ['transform-es2015-modules-commonjs'],
            },
          },
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
    extensions: ['.js', '.jsx', '.css', '.json'],
  },
  devtool: '#source-map',
  target: 'web',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new ExtractTextPlugin('../statics/styles.css'),
  ],
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      mangle: {
        except: ['$super', '$', 'exports', 'require'],
      },
    })
  );
}

module.exports = config;
