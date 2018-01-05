import webpack from 'webpack';
const $ = require('gulp-load-plugins')();
const { production } = $.environments;

export default {
  devtool: 'source-map',
  output: {
    devtoolLineToLine: true,
    sourceMapFilename: 'bundle.js.map',
    pathinfo: true,
    path: __dirname,
    filename: production ? 'bundle.min.js' : 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: '/node_modules/',
        query: {
          presets: ['es2015'],
        },
      },
    ],
  },
  plugins: production
    ? [new webpack.optimize.UglifyJsPlugin({ minimize: true, comments: false })]
    : [],
};
