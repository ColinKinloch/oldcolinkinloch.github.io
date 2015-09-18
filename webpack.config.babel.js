let babelrc = require('./babelrc.js')

let config = {
  context: __dirname + '/app',
  entry: {
    //game: './game',
    main: './main.js'
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader', query: babelrc },
      { test: /\.(frag|vect|glsl[v,f]?)$/, exclude: /node_modules/, loader: 'raw' },
      { test: /\.(frag|vect|glsl[v,f]?)$/, exclude: /node_modules/, loader: 'glslify' }
    ]
  }

}
module.exports = config
