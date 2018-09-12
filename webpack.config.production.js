/* eslint-disable */

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  mode: 'production',
  entry: {
    app: './src/index.js'
  },
  optimization: {
    minimize: true
  },
  devServer: {
    contentBase: path.join(__dirname, 'docs'),
    port: 9000
  },
  output: {
    path: path.join(__dirname, "docs"),
    filename: "bundle.js",
  },
  plugins: [
    new CleanWebpackPlugin(['docs']),
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("production")
      }
    }),
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
      },
      {
        test: /\.(png|jpg|gif|mp3|m4a)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}
          }
        ]
      }
    ]
  }
};

