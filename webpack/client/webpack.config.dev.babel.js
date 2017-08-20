import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';

export default {
  entry: {
    app: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:3001',
      'webpack/hot/only-dev-server',
      './src/client/index',
    ],
  },
  output: {
    path: path.resolve(process.cwd(), 'dist/public'),
    filename: '[name].js',
    publicPath: 'http://localhost:3001/',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
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
              presets: [
                ['env', { modules: false }],
                'react',
              ],
              plugins: [
                'react-hot-loader/babel',
              ],
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
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.EnvironmentPlugin({
      BUILD_TARGET: 'client',
      NODE_ENV: 'development',
    }),
  ],
  devServer: {
    host: 'localhost',
    port: 3001,
    hot: true,
  },
};
