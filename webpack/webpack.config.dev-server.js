var path = require('path');
var webpack = require('webpack');
var assetsPath = path.join(__dirname, '..', 'public', 'assets');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var commonLoaders = [
  {
    /*
     * TC39 categorises proposals for babel in 4 stages
     * Read more http://babeljs.io/docs/usage/experimental/
     */
    test: /\.js$|\.jsx$/,
    loader: "babel-loader",
    // Reason why we put this here instead of babelrc
    // https://github.com/gaearon/react-transform-hmr/issues/5#issuecomment-142313637
    query: {
      presets: ["es2015", "react", "stage-0"],
      plugins: ["transform-decorators-legacy"]
    },
    include: path.join(__dirname, "..", "app"),
    exclude: path.join(__dirname, "..", "node_modules")
  },
  {test: /\.json$/, loader: "json-loader"},
  {
    test: /\.(png|jpg|jpeg|gif|svg|ico)$/,
    loader: "url",
    query: {
        name: "[hash].[ext]",
        limit: 10000,
    }
  },
  // {test: /\.(jpg|png|svg)$/, loader: "file?name=[path][name].[ext]"},
  {test: /\.html$/, loader: "html-loader"},
  {
    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: "url-loader?limit=10000&mimetype=application/font-woff"
  },
  {
    test: /webfont\.(ttf|eot|svg)(\?.*)?$/,
    loader: "file-loader"
  }
];

module.exports = {
    // The configuration for the server-side rendering
    name: 'server-side rendering',
    context: path.join(__dirname, '..', 'app'),
    entry: {
      server: './server'
    },
    target: 'node',
    output: {
      // The output directory as absolute path
      path: assetsPath,
      // The filename of the entry chunk as relative path inside the output.path directory
      filename: 'server.js',
      // The output path from the view of the Javascript
      publicPath: '/assets/',
      // publicPath: '/',
      // publicPath: "http://cdn.example.com/assets/[hash]/",
      libraryTarget: 'commonjs2'
    },
    module: {
      loaders: commonLoaders.concat([
           {
              test: /\.css$/,
              loader: 'css'
              // loader: 'css/locals?module&localIdentName=[name]__[local]___[hash:base64:5]'
           }
      ])
    },
    resolve: {
      root: [path.join(__dirname, '..', 'app')],
      extensions: ['', '.js', '.jsx', '.css'],
    },
    plugins: [
        new webpack.DefinePlugin({
          __DEVCLIENT__: false,
          __DEVSERVER__: true
        }),
        new webpack.IgnorePlugin(/vertx/)
    ]
};
