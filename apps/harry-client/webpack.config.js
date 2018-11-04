const webpack = require('webpack');
const path = require('path');

const paths = require('./paths');

const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HappyPack = require("happypack");

module.exports = {
  entry: './src/index.tsx',
  mode: "development",
  devtool: 'source-map',
  devServer: {
    disableHostCheck: true,
  },
  output: {
    path: paths.build,
    filename: '[name].js',
    publicPath: 'http://0.0.0.0:8000',
  },
  resolve: {
    modules: ['node_modules', paths.src],
    extensions: ['.js', '.ts', '.tsx', '.emo'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: require.resolve("happypack/loader"),
          options: {
            id: "ts",
            transpileOnly: true,
          },
        },
      },
      {
        test: /\.emo$/,
        use: [
          {
            loader: require.resolve("happypack/loader"),
            options: {
              id: "ts",
              transpileOnly: true,
            },
          },
          require.resolve('@hp/hermione'),
        ]
      },
      {
        test: /\.js$/,
        loader: require.resolve('babel-loader'),
        include: [
          paths.src,
        ],
      },
      {
        test: /\.css$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
              localIdentName: '[folder]--[local]--[hash:base64:6]',
            },
          },
        ],
      },
      {
        test: /\.(jpg|png)$/,
        loader: require.resolve('file-loader'),
        options: {
          name: 'static/[name].[ext]',
          publicPath: '/',
        },
      },
    ],
  },
  plugins: [
    new HappyPack({
      id: "ts",
      threads: 2,
      loaders: [
        {
          path: "ts-loader",
          query: { happyPackMode: true },
        },
      ],
    }),
    new ManifestPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.html,
    }),
  ],
};