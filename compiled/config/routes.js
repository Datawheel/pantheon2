'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Routes for express app
 */
var usersController = null;
var topicsController = null;

exports.default = function (app) {
  // user routes
  if (usersController) {
    app.post('/login', usersController.login);
    app.post('/signup', usersController.signUp);
    app.post('/logout', usersController.logout);
  } else {
    console.warn("unsupportedMessage('users routes')");
  }

  // topic routes
  if (topicsController) {
    app.get('/topic', topicsController.all);
    app.post('/topic/:id', topicsController.add);
    app.put('/topic/:id', topicsController.update);
    app.delete('/topic/:id', topicsController.remove);
  } else {
    console.warn("unsupportedMessage('topics routes')");
  }
};