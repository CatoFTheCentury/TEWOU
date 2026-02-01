const path = require('path');
const { node } = require('webpack');

module.exports = {
  mode: 'production',
  // module: 'commonjs',
  // target: 'node',
  // type: "commonjs",
  entry: './source/api.ts',
  resolve: {
    extensions: ['.ts', '.js'], //resolve all the modules other than index.ts
    // modules: ['node_modules']
  },
  module: {
    rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          },
          // exclude: /node_modules/,
          // exclude: {
          //   test: [
          //     /\.html$/,
          //     /\.(js|jsx)$/,
          //     /\.css$/,
          //     /\.json$/,
          //     /\.bmp$/,
          //     /\.gif$/,
          //     /\.jpe?g$/,
          //     /\.png$/,
          //   ]}
        },
        // {
        //   test: /\.node$/,
        //   use: 'node-loader'
        // },
        // {
        //   test: /\.(png|jpg|jpeg|gif)$/i,
        //   type: "asset/resource",
        // },
      ]
    },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'engine.js',
    library: {
      name: 'TEWOU',
      type: 'window'
    }
  },
};