const path = require("path");

module.exports = {
  entry: {
    main: [path.join(__dirname, "src/index.js")]
  },
  output: {
    path: path.join(__dirname, "compiled"),
    filename: "[name].js",
    publicPath: "http://localhost:8000/assets/",
    libraryTarget: "commonjs2"
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.s[a|c]ss$/,
        loader: "style!css!sass"
      }
    ]
  },
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js"
    },
    extensions: ["*", ".js", ".vue", ".json"]
  },
  plugins: [],
  devtool: "eval-source-map",
  target: "electron-renderer"
};
