var webpack = require('webpack')

var conf = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  output: {
    library: 'fluorine',
    libraryTarget: 'umd'
  }
}

module.exports = conf
