var hooksController = require("./controllers/hooks");
var subscriptionRoutes = require("./routes/subscriptions");

module.exports = function(app, hooks) {
	// Handle hooks
	hooksController(hooks);
	// routes init
	subscriptionRoutes(app);
};
