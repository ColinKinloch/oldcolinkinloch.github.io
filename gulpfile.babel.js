import _ from 'lodash'

import gulp from 'gulp'
import util from 'gulp-util'
import eslint from 'gulp-eslint'
import livereload from 'gulp-livereload'
import runSequence from 'run-sequence'

import webpackConfig from './webpack.config.babel.js'

gulp.task('default', ['build'], () => {
})
gulp.task('build', ['webpack'], () => {
  // TODO Do this better
  return gulp.src([
    'app/CNAME',
    '.tmp/**/*'
  ])
    .pipe(gulp.dest('dist'))
})

gulp.task('jade', () => {
  let jade = require('gulp-jade')
  return gulp.src('./app/**/*.jade')
    .pipe(jade({}))
    .pipe(gulp.dest('.tmp'))
    .pipe(livereload())
})
gulp.task('sass', () => {
  let sass = require('gulp-sass')
  return gulp.src('./app/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('.tmp'))
    .pipe(livereload())
})
gulp.task('webpack', ['eslint'], (cb) => {
  let webpack = require('webpack-stream')
  return gulp.src('./app/**/*.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('.tmp'))
    .pipe(livereload())
})

gulp.task('eslint', () => {
  return gulp.src(['./app/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

let port = 8080

gulp.task('serve', ['webpack-server-serve'])

gulp.task('watch-serve', () => {
  runSequence(['jade', 'sass', 'webpack'], () => {
    gulp.watch('./app/**/*.js', ['webpack'])
    gulp.watch('./app/**/*.jade', ['jade'])
    gulp.watch('./app/**/*.scss', ['sass'])
    livereload.listen()
  }, 'watch-server')
  // require('opn')(`http://localhost:${port}`)
})
gulp.task('webpack-server-serve', () => {
  runSequence(['jade', 'sass'], 'webpack-server-server')
  // require('opn')(`http://localhost:${port}`)
})
gulp.task('webpack-middleware-serve', () => {
  runSequence(['jade', 'sass'], 'server', () => {
    gulp.watch('./app/**/*.jade', ['jade'])
    gulp.watch('./app/**/*.scss', ['sass'])
    livereload.listen()
  })
})

gulp.task('webpack-server-server', () => {
  let webpack = require('webpack')
  let WebpackDevServer = require('webpack-dev-server')
  let webpackDevConfig = _.extend(webpackConfig, {
    stats: { colors: true }
  })
  let devCompiler = webpack(webpackDevConfig)
  devCompiler.plugin('done', state => livereload.reload())
  let devServer = new WebpackDevServer(devCompiler)
  devServer.listen(port, 'localhost', () => {
    util.log('Listening at', util.colors.magenta(`http://localhost:${port}`))
  })
})
gulp.task('webpack-middleware-server', () => {
  let webpack = require('webpack')
  let webpackDevMiddleware = require('webpack-dev-middleware')
  let express = require('express')
  let webpackDevConfig = _.extend(webpackConfig, {
    stats: { colors: true }
  })
  let devCompiler = webpack(webpackDevConfig)
  devCompiler.plugin('done', state => livereload.reload())
  let app = express()
  .use(express.static('.tmp'))
  .use(webpackDevMiddleware(devCompiler, {
    contentBase: './app/',
    publicPath: webpackDevConfig.output.publicPath,
    devtool: '#eval-source-map',
    stats: {
      colors: true
    }
  }))
  .use(express.static('app'))
  let server = app.listen(port, () => {
    let host = server.address().address
    let port = server.address().port
    util.log('Listening at', util.colors.magenta(`http://${host}:${port}`))
  })
})
gulp.task('watch-server', () => {
  let express = require('express')
  let app = express()
  .use(express.static('.tmp'))
  .use(express.static('app'))
  let server = app.listen(port, () => {
    let host = server.address().address
    let port = server.address().port
    util.log('Listening at', util.colors.magenta(`http://${host}:${port}`))
  })
})
