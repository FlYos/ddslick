const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const inProduction = (process.env.NODE_ENV == 'production');

module.exports = {
  entry: './src/main.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'jquery.ddslick.js'
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: ["css-loader", "sass-loader"],
          fallback: ["style-loader"],
        })
      },
      { 
        test: /\.js$/, 
        exclude: /node_modules/, 
        loader: "babel-loader" 
      },
      {
        test: /\.html$/,
        loader: 'mustache-loader?minify'
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin("jquery.ddslick.css")
  ]

};

if(inProduction == true) {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      minimize: true
    })
  )
}