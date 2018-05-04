var subscriptionsHelper = require("../helpers/subscriptions");

var onConfigurationChanged = function onConfigurationChanged() {
	// Reload config
	subscriptionsHelper.upsert();
};

var onLoadComplete = function onLoadComplete() {
	subscriptionsHelper.upsert();
};

var onEnabled = function onEnabled() {
	onLoadComplete();
};

module.exports = function handleHooks(hooks) {
	var myHooks = {
		onConfigurationChanged: onConfigurationChanged,
		onEnabled: onEnabled,
		onLoadComplete: onLoadComplete,
	};

	Object.assign(hooks, myHooks);
};
