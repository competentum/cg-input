'use strict';

var gulp = require('gulp');
var gutil = require("gulp-util");
var path = require('path');

var webpack = require("webpack");
var webpackGulp = require('gulp-webpack');
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require('./webpack.config.js');

var srcPath = path.resolve(__dirname, './src');
var buildPath = path.resolve(__dirname, '.');

gulp.task('lint', function () {
  var eslint = require('gulp-eslint');

  return gulp
    .src(['src/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('test', function () {
  var jest = require('gulp-jest').default;

  return gulp.src(['./src'])
    .pipe(jest());
});

gulp.task('webpack:build', function () {
  return gulp.src('')
    .pipe(webpackGulp(webpackConfig))
    .pipe(gulp.dest('build'));
});

//produces minified build
gulp.task('webpack:dist', ['webpack:build'], function () {
  return gulp.src('')
    .pipe(webpackGulp(addMinification(webpackConfig)))
    .pipe(gulp.dest('build'));
});

gulp.task('webpack-dev-server', function () {
  var wpConfig = Object.create(webpackConfig);

  for (var key in wpConfig.entry) {

    if (wpConfig.entry.hasOwnProperty(key)) {
      var entry = wpConfig.entry[key];

      // if type of entry is string it should be changed by array
      if (typeof entry == 'string') {
        entry = [entry];
      }

      entry.unshift('webpack/hot/dev-server');
    }
  }

  wpConfig.devtool = 'eval';
  wpConfig.debug = true;
  wpConfig.plugins = wpConfig.plugins.concat(
    new webpack.HotModuleReplacementPlugin()
  );

  var compiler = webpack(wpConfig);

  var server = new WebpackDevServer(compiler, {
    contentBase: path.resolve(__dirname, './build'),
    hot: true,
    watchOptions: {
      aggregateTimeout: 300
    },
    historyApiFallback: true
  });
  server.listen(9393, 'localhost', function (err) {
    if (err) {
      throw new gutil.PluginError('webpack-dev-server', err);
    }
    gutil.log('[webpack-dev-server]',
              'http://localhost:9393/webpack-dev-server/index.html');
  });
});

gulp.task('watch', function () {
  gulp.watch([srcPath + '/**/*.js', srcPath + '/**/*.less'], ['webpack:build']);
});

/**
 * Adds properties to config for minified version.
 * @param {object} config
 * @returns {object}
 */
function addMinification(config) {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin());
  config.output.filename = config.output.filename.replace('.js', '.min.js');

  return config;
}