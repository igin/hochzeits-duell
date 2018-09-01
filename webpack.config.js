/* eslint-disable */

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.js'
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.join(__dirname, 'docs'),
    port: 9000
  },
  output: {
    path: path.join(__dirname, "docs"),
    filename: "bundle.js",
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "raw-loader"
          }
        ]
      }
    ]
  }
};
