import path from 'path';
import nodeExternals from 'webpack-node-externals';
import webpack from 'webpack';

export default {
  entry: {
    server: './src/server/index',
  },
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: [nodeExternals()],
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
                ['env', { modules: false, targets: { node: 'current' } }],
                'stage-2',
                'react',
              ],
              plugins: [
                'transform-decorators-legacy',
              ],
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              emitFile: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      BUILD_TARGET: 'server',
      NODE_ENV: 'production',
    }),
  ],
};
