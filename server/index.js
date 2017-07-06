import express from "express";
import webpack from "webpack";
import {ENV} from "./config/appConfig";
import expressConfig from "./config/express";
import routesConfig from "./config/routes";
const App = require("../public/assets/server");
const app = express();

import ProgressPlugin from "webpack/lib/ProgressPlugin";

if (ENV === "development") {
  const webpackDevConfig = require("../webpack/webpack.config.dev-client");
  const compiler = webpack(webpackDevConfig);

  let msgLength = 0;
  compiler.apply(new ProgressPlugin(function(percentage, msg) {
    const details = Array.prototype.slice.call(arguments, 2);
    if (percentage < 1) {
      percentage = Math.floor(percentage * 100);
      msg = `${percentage}% ${msg}`;
      if (percentage < 100) msg = ` ${msg}`;
      if (percentage < 10) msg = ` ${msg}`;
      details.forEach(detail => {
        if (!detail) return;
        if (detail.length > 40) detail = `...${detail.substr(detail.length - 37)}`;
        msg += ` ${detail}`;
      });
      if (msg.length > msgLength) msgLength = msg.length + 1;
      process.stdout.write(`\r${ new Array(msgLength).join(" ") }`);
      process.stdout.write(`\r${ msg }`);
    }
    else {
      process.stdout.write(`\r${ new Array(msgLength).join(" ") }\r`);
    }
  }));

  app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true,
    publicPath: webpackDevConfig.output.publicPath
  }));

  app.use(require("webpack-hot-middleware")(compiler));
}

/*
 * Bootstrap application settings
 */
expressConfig(app);

/*
 * REMOVE if you do not need any routes
 *
 * Note: Some of these routes have passport and database model dependencies
 */
routesConfig(app);

/*
 * This is where the magic happens. We take the locals data we have already
 * fetched and seed our stores with data.
 * App is a function that requires store data and url
 * to initialize and return the React-rendered html string
 */
app.get('*', App.default);

app.listen(app.get('port'));
