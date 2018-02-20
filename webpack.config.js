const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
var path = require('path');
const webpack = require('webpack');

//The libraries declared in the externals are packaged into sperate nodemodules directory and ignored until unless specified in the webpackIncludeModules in the serverless.yml
// All other libs will be bundled into the same single bundle js.
module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  externals: ['aws-sdk'],
  devtool: "source-map",
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      include: __dirname,
      exclude: /node_modules/,
    }]
  },
  output: {
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]',
    libraryTarget: 'commonjs',
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  }
};