let gulp = require('gulp')
let _ = require('lodash')

let livereload = require('gulp-livereload')

let webpack = require('webpack')
let webpackDevMiddleware = require('webpack-dev-middleware')
let webpackConfig = require('./webpack.config.babel.js')
let webpackDevConfig = _.extend(webpackConfig, {
  debug: true,
  devtool: 'eval'
})

gulp.task('default', ['build'], function() {
})
gulp.task('build', ['webpack'], function() {
  //TODO Do this better
  gulp.src([
    'app/CNAME',
    '.tmp/**/*'
  ])
  .pipe(gulp.dest('dist'))

})

gulp.task('jade', function() {
  let jade = require('gulp-jade')
  gulp.src('./app/**/*.jade')
  .pipe(jade({}))
  .pipe(gulp.dest('.tmp'))
  .pipe(livereload())
})
gulp.task('sass', function() {
  let sass = require('gulp-sass')
  gulp.src('./app/**/*.scss')
  .pipe(sass())
  .pipe(gulp.dest('.tmp'))
  .pipe(livereload())
})

gulp.task('webpack', ['jade', 'sass'], function(cb) {
  webpack(webpackConfig, function(err, stats) {
    cb()
  })
})

gulp.task('serve', ['server'], function() {
  require('opn')('http://localhost:9000')
})
gulp.task('server', ['jade', 'sass'], function() {
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
  let server = app.listen(9000, function() {
    let host = server.address().address
    let port = server.address().port
    console.log(`Listening at http://${host}:${port}`)
  })
  livereload.listen()
  devCompiler.plugin('done', state => livereload.reload())
  gulp.watch('./app/**/*.jade', ['jade'])
  gulp.watch('./app/**/*.scss', ['sass'])
})
