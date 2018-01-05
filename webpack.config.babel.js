import webpack from 'webpack';
import path from 'path';

export default {
  entry: path.join(__dirname, '/src/js/portfolio.js'),
  output: {
    path: path.join(__dirname, 'src/js/'),
    filename: 'bundle.js',
  },
  plugins: [new webpack.NamedModulesPlugin()],
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
};
