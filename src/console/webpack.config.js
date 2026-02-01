const path = require('path');
const { node } = require('webpack');

module.exports = {
  mode: 'development',
  // module: 'commonjs',
  // target: 'node',
  // type: "commonjs",
  entry: './source/main.ts',
  resolve: {
    extensions: ['.ts', '.js'], //resolve all the modules other than index.ts
    // modules: ['node_modules']
  },
  externals: {
    Serve : "Serve"
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
    filename: 'console.js',
    library: {
      name: 'Console',
      type: 'umd'
    }
  },
};