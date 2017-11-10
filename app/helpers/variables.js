require("rootpath")();
var _ = require("lodash");
var Q = require("q");

var VariableHelper = require("@wcm/module-helper").variables;
var CTModel = require("app/models/contentType");
var taxonomyModel = require("app/models/taxonomy");

var packageInfo = null;

var addCTID = function addCTID(vars) {
	var ctLabel = vars.subscriberConfig.variables.contentType;

	return CTModel.findOne({ "meta.safeLabel": ctLabel, "meta.deleted": false })
		.lean()
		.exec()
		.then(function(ct) {
			vars.subscriberConfig.variables.ctId = ct._id;

			return vars;
		});
};

var addCRMTaxonomyTag = function addCRMTaxonomyTag(vars) {
	var taxonomyLabel = vars.subscriberConfig.variables.taxonomy;

	return taxonomyModel.findOne({ "tags.safeLabel": taxonomyLabel }, { _id: 0, tags: { $elemMatch: { safeLabel: taxonomyLabel } } })
		.then(function onSuccess(taxonomy) {
			vars.subscriberConfig.variables.taxonomyItem = _.get(taxonomy, "tags[0]._id", null);

			return vars;
		});
};

module.exports = function getVariables() {
	if (packageInfo === null) {
		return Q.reject("No package info available!");
	}

	return VariableHelper.getAll(packageInfo.name, packageInfo.version)
		.then(function onSuccess(response) {
			if (!response || !response.subscriberConfig || !response.contentConfig) {
				throw "No variables available!";
			}

			return addCTID(response);
		})
		.then(addCRMTaxonomyTag)
		.then(function onSuccess(response) {
			return Object.assign({}, response.subscriberConfig.variables, response.contentConfig.variables);
		})
		.catch(function onError(responseError) {
			console.error("Failed getting variables (eventhandler module)");
			console.error(responseError);

			throw responseError;
		});
};

module.exports.set = function(info) {
	packageInfo = info;
};

module.exports.get = function() {
	return packageInfo;
};

