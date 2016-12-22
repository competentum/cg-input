var webpack = require('webpack');
var path = require('path');
var cgBanner = require('cg-components-banner');
var upperCamelCase = require('uppercamelcase');
var autoprefixer = require('autoprefixer');

var buildPath = path.resolve(__dirname, './build');

var pkg = require('./package.json');
var banner = pkg.name + ' v' + pkg.version + ' - ' + pkg.description + '\n\n' + cgBanner;

var entry = {};
entry[pkg.name] = [path.resolve(__dirname, './src/index.js')];

module.exports = {
  entry: entry,
  output: {
    path: buildPath,
    filename: pkg.name + '.js',
    library: upperCamelCase(pkg.name),
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.BannerPlugin(banner)
  ],
  module: {
    loaders: [
      {
        test: /\.less$/,
        loader: 'style!css!postcss!less'
      },
      {
        test: /\.css$/,
        loader: 'style!css!postcss'
      },
      {
        test: /\.(png|svg)$/i,
        loader: "url-loader?limit=100000"
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  postcss: [autoprefixer({browsers: ['last 2 versions']})]
};