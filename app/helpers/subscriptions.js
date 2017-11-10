require("rootpath")();

var _ = require("lodash");
var Q = require("q");
var request = require("request");
var variablesHelper = require("./variables");

var config = require("config")();

var isResponseError = function isResponseError(response) {
	return response.statusCode >= 400;
};

var getServerUrl = function getServerUrl() {
	return _.get(config, "multitenancy.proxyPath", null) || _.get(config, "server.domain", "");
};

var getSubscriptionBody = function getSubscriptionBody(variables) {
	var wcmApiKey = variables.wcmApikey || variables.apikey;

	return {
		topic: variables.topic,
		config: {
			push: {
				url: getServerUrl() + "acpaas-portal-subscriptions/" + variables.subscriptionName +
					"?tenant=" + config.name +
					"&apikey=" + wcmApiKey,
				httpVerb: "POST",
				authentication: {
					apikey: {
						key: wcmApiKey,
					},
				},
			},
			retries: {
				firstLevelRetries: {
					onFailure: "second",
					retries: 3,
					enabled: true,
				},
				secondLevelRetries: {
					onFailure: "error",
					ttl: 10000,
					retries: 5,
				},
			},
			maxConcurrentDeliveries: 1,
			customHeaders: {
				tenant: config.name,
				apikey: wcmApiKey,
			},
		},
	};
};

var eventRequest = function eventRequest(variables, method, url, body) {
	var d = Q.defer();

	request({
		url: url,
		method: method,
		headers: {
			"apikey": variables.apikey,
			"owner-key": variables.ownerKey,
		},
		body: body || undefined,
		json: true,
	}, function(err, response, responseBody) {
		if (err || isResponseError(response)) {
			return d.reject(err || responseBody);
		}

		d.resolve(responseBody);
	});

	return d.promise;
};

var create = function create(variables) {
	var body = getSubscriptionBody(variables);
	var url = variables.apiDomain +
		variables.namespace + "/" +
		"subscriptions/" +
		variables.subscriptionName;

	eventRequest(variables, "POST", url, body);
};

var update = function update(variables) {
	var body = getSubscriptionBody(variables);
	var url = variables.apiDomain +
		variables.namespace + "/" +
		"subscriptions/" +
		variables.subscriptionName;

	return eventRequest(variables, "PUT", url, body);
};

// var remove = function remove() {

// };

var check = function check(variables) {
	var url = variables.apiDomain +
		variables.namespace +
		"/subscriptions";

	return eventRequest(variables, "GET", url)
		.then(function onSuccess(body) {
			return Q.when(!!_.find(body.subscriptions, { name: variables.subscriptionName }));
		});
};

module.exports.upsert = function upsert() {
	var variables = null;

	return variablesHelper()
		.then(function(result) {
			if (!result) {
				return Q.reject("Could not get variables");
			}

			variables = result;

			return variables;
		})
		.then(check)
		.then(function onSuccess(isSubscriptionDefined) {
			if (isSubscriptionDefined) {
				return update(variables);
			}

			return create(variables);
		}, function onError(responseError) {
			console.log(responseError);
		});
};
