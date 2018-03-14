'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const webpack = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

gulp.task('default', ['lint'], () => runWebpackBuild());

gulp.task('lint', () =>
  gulp.src('./lib/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError()));

function runWebpackBuild() {
  return gulp.src('./lib/elevation.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('./'));
}

