var webpack = require('webpack')
var path = require('path')

module.exports = {
  watch: true,
  entry: [
    './src/index.js'
  ],
  devtool: 'cheap-module-eval-source-map',
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      'fluorine-lib': path.join(__dirname, '../..')
    }
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        include: path.join(__dirname, 'src'),
        exclude: /node_modules/
      }
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/static/',
    filename: 'bundle.js'
  }
}
