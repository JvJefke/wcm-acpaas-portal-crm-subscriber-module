var hooksController = require("./controllers/hooks");
var subscriptionRoutes = require("./routes/subscriptions");
var variablesHelper = require("./helpers/variables");

module.exports = function(app, hooks, info) {
	// Set info to variables helper;
	variablesHelper.set(info);
	// Handle hooks
	hooksController(hooks);
	// routes init
	subscriptionRoutes(app);
};
