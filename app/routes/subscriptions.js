"use strict";

require("rootpath")();

var subscriptionsController = require("../controllers/subscriptions");

var config = require("config")();
// Building the baseUrl based on the configuration. Every API call needs to be located after the api/ route
var baseUrl = "/" + config.api.prefix + config.api.version + "acpaas-portal-subscriptions";

module.exports = function(app) {
	app.route(baseUrl + "/:type").post(subscriptionsController.handleSubscription);
};
