const packageJSON = require("./package.json");
process.env.VERSION = packageJSON.version;
process.env.ENV_PATH = packageJSON.env.envPath;
const helper = require(process.env.ENV_PATH);
process.env = helper.getEnv('PRODUCTION');
process.env.NODE_ENV = 'production';
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BrotliGzipPlugin = require('brotli-gzip-webpack-plugin');
const webpack = require("webpack");
const path = require("path");
const loaders = require('./webpack/loaders.js');
process.env.ENV.BUILD_TIME = new Date();
const env = require('./webpack/env.js');
//console.log('process.env.ENV',process.env.ENV);
module.exports = {
    mode:'production',
    entry: {
        index: path.resolve(__dirname+'/../client/', "src", "main.js")
    },
    module: {
        rules: loaders
    },
    output: {
        path: path.resolve(__dirname, "../builds/app/client/"),
        chunkFilename: '[name].bundle.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "src", "index.html")
        }),
        new webpack.DefinePlugin(env),
        new BrotliGzipPlugin({
            asset: '[path].br[query]',
            algorithm: 'brotli',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8,
            quality: 11
        }),
        new BrotliGzipPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8
        }),
    ]
};