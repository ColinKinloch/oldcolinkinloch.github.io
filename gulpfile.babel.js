import _ from 'lodash'
import del from 'del'

import gulp from 'gulp'
import util from 'gulp-util'
import eslint from 'gulp-eslint'
import livereload from 'gulp-livereload'
import runSequence from 'run-sequence'

import webpackConfig from './webpack.config.babel.js'

gulp.task('default', ['build'], () => {
})
gulp.task('build', ['webpack', 'copy', 'jade', 'sass'])

gulp.task('jade', () => {
  let jade = require('gulp-jade')
  return gulp.src('./app/**/*.jade')
    .pipe(jade({}))
    .pipe(gulp.dest('dist'))
    .pipe(livereload())
})
gulp.task('sass', () => {
  let sass = require('gulp-sass')
  return gulp.src('./app/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist'))
    .pipe(livereload())
})
gulp.task('webpack', ['eslint'], (cb) => {
  let webpack = require('webpack-stream')
  return gulp.src('./app/**/*.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('dist'))
    .pipe(livereload())
})

gulp.task('eslint', () => {
  return gulp.src(['./app/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})
gulp.task('copy', () => {
  return gulp.src([
    'app/test.png',
    'app/CNAME'
  ])
    .pipe(gulp.dest('dist'))
})

gulp.task('clean', () => {
  return del(['dist'])
})

let port = 8080
let host = 'localhost'

gulp.task('serve', () => {
  runSequence(['jade', 'sass', 'copy'], 'webpack-server-server', () => {
    gulp.watch('./app/**/*.jade', ['jade'])
    gulp.watch('./app/**/*.scss', ['sass'])
    // require('opn')(`http://localhost:${port}`)
  })
})

gulp.task('server', () => {
  let webpack = require('webpack')
  let WebpackDevServer = require('webpack-dev-server')
  let webpackDevConfig = _.extend(webpackConfig, {
    stats: { colors: true }
  })
  let devCompiler = webpack(webpackDevConfig)
  devCompiler.plugin('done', state => livereload.reload())
  let devServer = new WebpackDevServer(devCompiler, {
    contentBase: 'dist',
    stats: { colors: true }
  })
  devServer.listen(port, host, () => {
    util.log('Listening at', util.colors.magenta(`http://${host}:${port}`))
  })
})
