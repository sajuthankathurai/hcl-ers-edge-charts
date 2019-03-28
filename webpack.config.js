// webpack.config.js
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
//const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const myPackage = process.env.npm_config_myPackage;
const sassBuild = process.env.npm_config_sassBuild;
//npm run dev --myPackage=cwc-chart-datatypes

const entryPointsObj = {
  'cat-components': __dirname + '/packages/index.js'
  // 'cwc-applicationtime/applicationtime': __dirname + '/packages/cwc-applicationtime/cwc-applicationtime.js',
  // 'cwc-chart-datatypes/index': __dirname + '/packages/cwc-chart-datatypes/cwc-chart-datatypes.js'
};

const sassEntryPoints = {
  'cwc-charts/cwc-charts': __dirname + '/packages/cwc-charts/cwc-charts.scss',
  'cwc-chart-datatypes/cwc-chart-datatypes': __dirname + '/packages/cwc-chart-datatypes/cwc-chart-datatypes.scss'
}

let entryPoints = {},
  pathsToClean,
  // the clean options to use
  cleanOptions = {
    root: path.resolve(__dirname),
    verbose: true,
    dry: false
  };
if (myPackage) {
  pathsToClean = 'dist/' + myPackage + '/';
  Object.keys(entryPointsObj).forEach(function (key) {
    let objKey = key;
    if (entryPointsObj[key].indexOf(myPackage) > -1) {
      let objValue = entryPointsObj[key];
      // the clean options to use
      return entryPoints[objKey] = objValue;
    }
  });
} else {
  entryPoints = entryPointsObj;
  pathsToClean = 'dist/';
}

module.exports = {
 entry: ["./src/core-chart-datatypes/core-chart-datatypes.js"],
  watch: false,
  mode: 'none',
  //devtool: 'source-map',
  output: {
    path: (sassBuild) ? path.resolve(__dirname, 'packages') : path.resolve(__dirname, 'dist'),
    filename: (sassBuild) ? '[name].css' : '[name].js'
  },
  resolve: {
    // resolve file extensions
    extensions: ['.js', '.scss']
  },
  module: {
    rules: [{
        test: /\.(scss)$/,
        loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
      },
      {
        test: /\.html$/,
        use: [{
            loader: 'babel-loader',
            options: {
              presets: ['env'],
              plugins: ['syntax-dynamic-import']
            }
          },
          {
            loader: 'polymer-webpack-loader'
          }
        ]
      },
      {
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }]
      }
    ]
  },
  /*optimization:{
    minimizer:[
      new UglifyJsPlugin({
        uglifyOptions:{
          test: /\.js(\?.*)?$/i,
          warnings: false,
          parse:{},
          compress:{},
          mangle:true,
          toplevel:false,
          nameCache: null,
          ie8: false,
          keepfnames: false,
          output:{
            comments: false
          }
        }
      })
    ]
  },*/
  plugins: [
    new CleanWebpackPlugin(pathsToClean, cleanOptions),
    // Specify output file name and path
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: false
    }),
    /*new UglifyJsPlugin({
      uglifyOptions:{
        output:{
          comments: false
        },
        compress: {
          warnings: false
        }
      }
    })*/
    /*new HtmlWebpackPlugin({
            template: './demo/template.html',
            inject: 'head',
            hash: true,
            filename: "../demo/index.html"
        })*/
  ]
};