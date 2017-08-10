var variablesHelper = require("../helpers/variables");
var subscriptionsHelper = require("../helpers/subscriptions");

var onConfigurationChanged = function onConfigurationChanged() {
	// Reload config
	variablesHelper.reload()
		.then(function() {
			subscriptionsHelper.upsert();
		});
};

var beforeRemove = function beforeRemove() { };

var beforeDisable = function beforeDisable() { };

var onLoadComplete = function onLoadComplete() {
	variablesHelper.reload()
		.then(function() {
			subscriptionsHelper.upsert();
		});
};

var onEnabled = function onEnabled() {
	onLoadComplete();
};

module.exports = function handleHooks(hooks) {
	var myHooks = {
		onConfigurationChanged: onConfigurationChanged,
		beforeRemove: beforeRemove,
		beforeDisable: beforeDisable,
		onEnabled: onEnabled,
		onLoadComplete: onLoadComplete,
	};

	Object.assign(hooks, myHooks);
};
