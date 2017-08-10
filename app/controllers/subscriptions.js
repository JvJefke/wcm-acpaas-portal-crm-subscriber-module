require("rootpath")();

var variablesHelper = require("../helpers/variables");
var validators = require("../helpers/validators");
var newsCreator = require("./helpers/newsCreator");

module.exports.handleSubscription = function handleSubscription(req, res) {
	var variables = variablesHelper();

	if (variables.subscriptionName !== req.params.type || !validators.CRMTender(req.body)) {
		return res.status(204).send();
	}

	newsCreator.create(req.body)
		.then(function() {
			return res.status(204).send();
		}, function() {
			return res.status(400).send("Failed to handle the request");
		});
};
