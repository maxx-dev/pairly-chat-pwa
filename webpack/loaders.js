module.exports = [
    {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
            loader: "babel-loader"
        }
    },
    {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
    },
    {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: "file-loader?name=/public/assets/icons/[name].[ext]"
    }
];