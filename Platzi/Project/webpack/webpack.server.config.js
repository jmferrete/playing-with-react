const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const combineLoaders = require('webpack-combine-loaders');

const nodeModules = fs
  .readdirSync('node_modules')
  .filter(x => ['.bin'].indexOf(x) === -1)
  .reduce(
    (modules, module) => Object.assign(modules, { [module]: `commonjs ${module}` }),
    {}
  );

const config = {
  entry: './src/server.jsx',
  output: {
    filename: 'index.js',
    path: './build/server',
    publicPath: process.env.NODE_ENV === 'production'
      ? 'https://jmferrete-react-project.now.sh'
      : 'http://localhost:8080/',
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
          presets: ['latest-minimal', 'react'],
          env: {
            production: {
              presets: ['es2015'],
              plugins: ['transform-regenerator', 'transform-runtime'],
            },
            development: {
              presets: ['latest-minimal'],
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
  target: 'node',
  externals: nodeModules,
  plugins: [
    new ExtractTextPlugin('../statics/styles.css'),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(true),
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
