/*eslint-disable*/
var webpack = require('webpack')
var path = require('path')

var conf = {
  resolve: {
    extensions: [ '', '.js' ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': process.env.NODE_ENV || 'development'
    })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: path.join(__dirname, 'src'),
        exclude: /node_modules/
      }
    ]
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    },
    '@reactivex/rxjs': {
      root: 'Rx',
      commonjs2: '@reactivex/rxjs',
      commonjs: '@reactivex/rxjs',
      amd: '@reactivex/rxjs'
    }
  },
  output: {
    library: 'fluorine',
    libraryTarget: 'umd'
  }
}

if (process.env.NODE_ENV === 'production') {
  conf.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
        warnings: false
      }
    })
  );
}

module.exports = conf
