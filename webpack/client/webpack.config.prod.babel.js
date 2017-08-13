import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';

export default {
  entry: {
    app: './src/client/index',
  },
  output: {
    path: path.resolve(process.cwd(), 'dist/public'),
    filename: '[name].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: ['env', 'react'],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/assets/index.html',
    }),
    new webpack.EnvironmentPlugin({
      BUILD_TARGET: 'client',
      NODE_ENV: 'production',
    }),
  ],
};
