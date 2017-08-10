var hooksController = require("../controllers/hooks");

module.exports = function(app, hooks) {
	// Handle hooks
	hooksController(hooks);
};
