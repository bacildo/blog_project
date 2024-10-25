const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  devtool: "source-map",
  entry: {
    application: "./app/javascript/application.js"
  },
  output: {
    filename: "[name].js",
    sourceMapFilename: "[file].map",
    chunkFormat: "module",
    path: path.resolve(__dirname, "app/assets/builds"),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Regex para identificar arquivos .js e .jsx
        exclude: /node_modules/, // Exclui a pasta node_modules
        use: {
          loader: 'babel-loader', // Usa o babel-loader para processar os arquivos
        },
      },
    ],
  },
  resolve: { 
    extensions: ['.js', '.jsx'], // Permite a importação de arquivos .js e .jsx sem precisar especificar a extensão
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  ]
}
