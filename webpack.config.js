var webpack = require('webpack')
var path = require('path')

var conf = {
  resolve: {
    extensions: [ '', '.js' ]
  },
  plugins: [],
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
    'rxjs': {
      root: 'Rx',
      commonjs2: 'rxjs',
      commonjs: 'rxjs',
      amd: 'rxjs'
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
