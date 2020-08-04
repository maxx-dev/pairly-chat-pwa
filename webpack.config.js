const packageJSON = require("../package.json");
process.env.ENV_PATH = packageJSON.env.envPath;
const helper = require(process.env.ENV_PATH);
process.env = helper.getEnv(packageJSON.env.env);
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const fs = require("fs");
const path = require("path");
const loaders = require('./webpack/loaders.js');
process.env.ENV.BUILD_TIME = new Date();
const env = require('./webpack/env.js');
console.log('ENV',process.env.ENV,'BUILD_TIME',process.env.BUILD_TIME);
let host;
// Note: For testing with tunnel disable https, set host to 0.0.0.0 and port to 5000^
//host = 'localhost';
//host = '0.0.0.0';
host = 'devchat.pairly.app';
//host = '172.16.113.55.nip.io';
//host = '172.16.113.55';
module.exports = {
    mode:'development',
    entry: {
        index: path.resolve(__dirname+'/../client/', "src", "main.js")
    },
    module: {
        rules: loaders
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "src", "index.html")
        }),
        new webpack.DefinePlugin(env)
    ],
    output: {
        filename: 'main.js',
        chunkFilename: '[name].bundle.js',
    },
    devServer: {
        contentBase:'public', // enables to serve manifest.json and sw.js correctly
        historyApiFallback: true,
        disableHostCheck:true,
        hot: true,
        inline: true,
        host:host,
        port: 443,
        //port: 5000,
        proxy: {
            '/api/*': {
                target: 'https://'+host+':8081',
                secure: false
            },
            '/socket.io/*': {
                target: 'https://'+host+':8081',
                secure: false
            }
        },
        https: true,
        key: fs.readFileSync('../server/cert/pairly.app.key'),
        cert: fs.readFileSync('../server/cert/pairly.app.cer'),
        ca: fs.readFileSync('../server/cert/server.pem'),

    },
};