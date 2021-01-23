const packageJSON = require("./package.json");
process.env.ENV_PATH = packageJSON.env.envPath;
const helper = require(process.env.ENV_PATH);
process.env = helper.getEnv(packageJSON.env.env);
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const fs = require("fs");
const path = require("path");
const loaders = require('./webpack/loaders.js');
const swVersion = require('./webpack/helper/sw.js');
process.env.ENV.BUILD_TIME = new Date();
process.env.VERSION = packageJSON.version;
const env = require('./webpack/env.js');
console.log('ENV',process.env.ENV,'BUILD_TIME',process.env.BUILD_TIME);
let host;
// Note: For testing with tunnel disable https, set host to 0.0.0.0 and port to 5000^
//host = 'localhost';
//host = '0.0.0.0';
host = 'devchat.pairly.app';
swVersion('./public/sw.js',packageJSON.version);
module.exports = {
    mode:'development',
    entry: {
        index: path.resolve(__dirname, "src", "main.js")
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
    resolve : {
        alias : {
            "react": "preact/compat",
            "react-dom": "preact/compat",
        }
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
        key: fs.readFileSync('./cert/devchat.pairly.app.key'),
        cert: fs.readFileSync('./cert/devchat.pairly.app.cer'),
        ca: fs.readFileSync('./cert/server.pem'),

    },
};