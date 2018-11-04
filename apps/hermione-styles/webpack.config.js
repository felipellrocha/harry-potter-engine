const path = require("path");

const paths = {
  dist: path.resolve(__dirname, "dist"),
  modules: path.resolve(__dirname, "node_modules"),
  src: path.resolve(__dirname, "src"),
};

module.exports = {
  mode: process.env.NODE_ENV || "production",
  entry: {
    bundle: './src/index.js',
    test: './src/test.js',
  },
  devtool: "source-map",

  resolve: {
    extensions: [".js", ".pegjs"],
    modules: [paths.modules, paths.src],
  },

  output: {
    filename: "[name].js",
    path: paths.dist,
    libraryTarget: "commonjs",
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        include: [paths.src],
      },
      {
        test: /\.pegjs$/,
        use: "pegjs-loader",
        include: [paths.src],
      }
    ],
  },
};