import _ from 'lodash'

import gulp from 'gulp'
import eslint from 'gulp-eslint'
import livereload from 'gulp-livereload'

import webpackConfig from './webpack.config.babel.js'

gulp.task('default', ['build'], () => {
})
gulp.task('build', ['webpack'], () => {
  // TODO Do this better
  gulp.src([
    'app/CNAME',
    '.tmp/**/*'
  ])
  .pipe(gulp.dest('dist'))
})

gulp.task('jade', () => {
  let jade = require('gulp-jade')
  gulp.src('./app/**/*.jade')
  .pipe(jade({}))
  .pipe(gulp.dest('.tmp'))
  .pipe(livereload())
})
gulp.task('sass', () => {
  let sass = require('gulp-sass')
  gulp.src('./app/**/*.scss')
  .pipe(sass())
  .pipe(gulp.dest('.tmp'))
  .pipe(livereload())
})
gulp.task('webpack', ['eslint'], (cb) => {
  webpack(webpackConfig, (err, stats) => {
    console.error(err)
    cb()
  })
})

gulp.task('eslint', () => {
  return gulp.src(['./app/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

let port = 8080

gulp.task('serve', ['server'], () => {
  gulp.watch('./app/**/*.js', ['webpack'])
  gulp.watch('./app/**/*.jade', ['jade'])
  gulp.watch('./app/**/*.scss', ['sass'])
  livereload.listen()
  require('opn')(`http://localhost:${port}`)
})
gulp.task('server', ['jade', 'sass'], () => {
  let express = require('express')
  let devCompiler = webpack(webpackDevConfig)
  let app = express()
  .use(express.static('.tmp'))
  .use(webpackDevMiddleware(devCompiler, {
    contentBase: './app/',
    publicPath: webpackDevConfig.output.publicPath,
    stats: {
      colors: true
    }
  }))
  .use(express.static('app'))
  let server = app.listen(port, () => {
    let host = server.address().address
    let port = server.address().port
    console.log(`Listening at http://${host}:${port}`)
  })
  devCompiler.plugin('done', state => livereload.reload())
})
