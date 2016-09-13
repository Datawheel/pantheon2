'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _appConfig = require('./config/appConfig');

var _express3 = require('./config/express');

var _express4 = _interopRequireDefault(_express3);

var _routes = require('./config/routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var App = require('../public/assets/server');
var app = (0, _express2.default)();

if (_appConfig.ENV === 'development') {
  var webpackDevConfig = require('../webpack/webpack.config.dev-client');
  var compiler = (0, _webpack2.default)(webpackDevConfig);
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackDevConfig.output.publicPath
  }));

  app.use(require('webpack-hot-middleware')(compiler));
}

/*
 * Bootstrap application settings
 */
(0, _express4.default)(app);

/*
 * REMOVE if you do not need any routes
 *
 * Note: Some of these routes have passport and database model dependencies
 */
(0, _routes2.default)(app);

/*
 * This is where the magic happens. We take the locals data we have already
 * fetched and seed our stores with data.
 * App is a function that requires store data and url
 * to initialize and return the React-rendered html string
 */
app.get('*', App.default);

app.listen(app.get('port'));