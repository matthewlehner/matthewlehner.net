var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');

module.exports = {
  entry: {
    index: [
      './source/stylesheets/app.scss',
      './source/javascripts/index.js'
    ],
    // vendor: ['babel/polyfill']
  },

  resolve: {
    root: __dirname + '/source/javascripts'
  },

  output: {
    path: __dirname + '/.tmp/dist',
    filename: 'javascripts/[name].js'
  },

  module: {
    loaders: [{
    //   test: /\.js$/,
    //   exclude: /node_modules|\.tmp|vendor/,
    //   loader: 'babel'
    // },{
      test: /.*\.scss$/,
      loader: ExtractTextPlugin.extract("style", "css!postcss!sass")
    }]
  },

  sassLoader: {
    includePaths: [path.resolve(__dirname, "./node_modules")]
  },

  postcss: [ autoprefixer({browsers: 'last 2 versions'}) ],

  plugins: [
    new ExtractTextPlugin("stylesheets/app.css")
  ]
}
