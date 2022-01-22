import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import dotenv from 'dotenv';

const env = dotenv.config().parsed;
const src  = path.resolve(__dirname, 'src')
const dist = path.resolve(__dirname, 'dist')

export default {
  mode: 'development',
  entry: src + '/index.jsx',

  output: {
    path: dist,
    filename: 'bundle.js',
  },

  devtool: 'eval-source-map',

  module: {
    rules: [
      {
        test: /\.(sc|c)ss$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              camelCase: true,
            }
          },
          'sass-loader',
        ],
      },
      {
        test: /\.j(s|sx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(jpg|png|svg|gif|mp4)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: '/UMIRU/img/',
              publicPath: path => '/UMIRU/img/' + path.split('/').slice(-1)[0],
            },
          },
        ],
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx'],
    alias: { '@': src },
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: src + '/index.html',
      filename: 'index.html'
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(env)
    }),
  ],
  devServer: {
    historyApiFallback: true, 
    hot: true,
    contentBase: dist,
  }
}
