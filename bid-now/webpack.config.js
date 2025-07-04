const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

console.log("Webpack running from:", __dirname);
console.log(
  "Looking for template:",
  path.resolve(__dirname, "public/index.html")
);

module.exports = {
  entry: "./src/index.js", // your main file
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js", // for long-term caching
    clean: true // clean dist folder before build
  },
  mode: "development", // change to 'development' during dev
  resolve: {
    extensions: [".js", ".jsx"] // allows importing without extensions
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // transpile .js/.jsx files
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.css$/, // process CSS
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/, // handle images
        type: "asset/resource"
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
      minify: true
    })
  ],
  optimization: {
    splitChunks: {
      chunks: "all" // extract common dependencies
    },
    runtimeChunk: "single" // better long-term caching
  },
  devServer: {
    static: path.resolve(__dirname, "public"),
    port: 3000,
    open: true,
    historyApiFallback: true // for React Router
  }
};
