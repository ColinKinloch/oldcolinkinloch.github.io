import webpack from 'webpack'
import babelrc from './babelConfig.js'

let config = {
  context: `${__dirname}/app`,
  entry: {
    index: './main.js',
    components: './components.js'
  },
  output: {
    path: `${__dirname}/dist`,
    pubilcPath: 'app',
    filename: '[name].js',
    pathinfo: true
  },
  // devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader', query: babelrc },
      { test: /\.(frag|vect|glsl[vf]?)$/, exclude: /node_modules/, loader: 'raw' },
      { test: /\.(frag|vect|glsl[vf]?)$/, exclude: /node_modules/, loader: 'glslify' }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
        'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
    new webpack.SourceMapDevToolPlugin()
  ]
}

module.exports = config
