import fs from 'fs';
import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import { promisify } from 'util';
import toml from 'toml';
import 'regenerator-runtime';

const readFileAsync = promisify(fs.readFile);

const src  = path.resolve(__dirname, 'src')
const dist = path.resolve(__dirname, 'dist')
const envPath = path.resolve(__dirname, '../.env.toml');

export default async () => {
  const tomlenv = await readFileAsync(envPath, 'utf-8');
  const env = toml.parse(tomlenv.toString());
  return {
    mode: 'development', entry: src + '/index.jsx',

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
          test: /\.(txt|toml)$/,
          use: [
            {
              loader: 'raw-loader',
              options: {
                name: '[name].[ext]',
                outputPath: '/wsTachometer/img/',
                publicPath: path => '/wsTachometer/img/' + path.split('/').slice(-1)[0],
              },
            },
          ],
        },
        {
          test: /\.(jpg|png|svg|gif|mp4)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: '/wsTachometer/img/',
                publicPath: path => '/wsTachometer/img/' + path.split('/').slice(-1)[0],
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
        'process.env': env
      }),
    ],
    devServer: {
      historyApiFallback: true, 
      hot: true,
      contentBase: dist,
    }
  }
}
