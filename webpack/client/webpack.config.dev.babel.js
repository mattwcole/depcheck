import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin';
import webpack from 'webpack';

export default {
  entry: {
    app: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:3001',
      'webpack/hot/only-dev-server',
      'babel-polyfill',
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
  target: 'web',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: [
                ['env', { modules: false }],
                'stage-2',
                'react',
              ],
              plugins: [
                'transform-decorators-legacy',
                'react-hot-loader/babel',
              ],
            },
          },
        ],
      },
      {
        test: /\.(scss|sass)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/assets/index.html',
      alwaysWriteToDisk: true,
    }),
    new HtmlWebpackHarddiskPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.EnvironmentPlugin({
      BUILD_TARGET: 'client',
      NODE_ENV: 'development',
    }),
  ],
  devServer: {
    host: '0.0.0.0',
    port: 3001,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};
