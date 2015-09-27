let babelrc = require('./babelConfig.js')

let config = {
  context: `${__dirname}/app`,
  entry: {
    index: './main.js'
  },
  output: {
    path: `${__dirname}/dist`,
    pubilcPath: 'app',
    filename: '[name].js',
    pathinfo: true
  },
  devtool: '#eval-source-map',
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader', query: babelrc },
      { test: /\.(frag|vect|glsl[vf]?)$/, exclude: /node_modules/, loader: 'raw' },
      { test: /\.(frag|vect|glsl[vf]?)$/, exclude: /node_modules/, loader: 'glslify' }
    ]
  }

}
module.exports = config
