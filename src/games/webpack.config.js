const path = require('path');
const { node } = require('webpack');
const webpack = require('webpack');

const gameName = 'grawlsnake';

module.exports = {
  mode: 'development',
  // externals: {
  //   'TEWOU': 'Engine', // 'Engine' is the global variable name
  // },
  // module: 'commonjs',
  // target: 'node',
  // type: "commonjs",
  entry: './'+gameName+'/main.ts',
  externals: {
    TEWOU : "TEWOU",
    Console: "Console"
  },
  resolve: {
    extensions: ['.ts','.js'], //resolve all the modules other than index.ts
    //     alias: {
    //   'TEWOU': '../engine/dist/engine.js',
    // //   // 'lodash': path.resolve(__dirname, 'src/vendor/lodash-custom.js')
    // }// modules: ['node_modules']
  },
  plugins: [
  new webpack.IgnorePlugin({
    resourceRegExp: /engine/,
    // contextRegExp: /dist/,
    }),
  ],
  // new webpack.IgnorePlugin({
  //   resourceRegExp: /\.js$/,
  //   // contextRegExp: /dist/,
  //   }),
  // ],
  module: {
    // noParse: /\.js$/,
    rules: [
        {
          test: /\.tsx?$/,
          // exclude: /\.js$/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true

            }
          },
  // test:
  //  path.resolve(__dirname, '../engine/dist/engine.js'),
          
          // exclude: /node_modules/,
        },

        ]},
        // {
          //   test: /\.node$/,
          //   use: 'node-loader'
          // },
          // {
            //   test: /\.(png|jpg|jpeg|gif)$/i,
            //   type: "asset/resource",
            // },
          
        // },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: gameName+'.js',
    iife: false
        // libraryTarget: 'umd'
  },
};