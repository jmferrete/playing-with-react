const ExtractTextPlugin = require('extract-text-webpack-plugin');
const combineLoaders = require('webpack-combine-loaders');

module.exports = {
    entry: './src/server.js',
    output: {
        filename: 'index.js',
        path: './build/server',
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
                    presets: ['latest-minimal', 'react']
                }
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: combineLoaders([{
                        loader: 'css-loader',
                        query: {
                            modules: true,
                            localIdentName: '[name]__[local]___[hash:base64:5]'
                        }
                    }])}
                )
            }
        ]
    },
    devtool: "#source-map",
    target: 'node',
    plugins: [
        new ExtractTextPlugin('../statics/styles.css')
    ],
};
