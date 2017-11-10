require("rootpath")();
var _ = require("lodash");

var VariableHelper = require("@wcm/module-helper").variables;
var packageConfig = require("../../package.json");
var CTModel = require("app/models/contentType");
var taxonomyModel = require("app/models/taxonomy");

var variables = null;

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
	return VariableHelper.getAll(packageConfig.name, packageConfig.version)
		.then(function onSuccess(response) {
			if (!response || !response.subscriberConfig || !response.contentConfig) {
				throw "no variables available";
			}

			return addCTID(response);
		})
		.then(addCRMTaxonomyTag)
		.then(function onSuccess(response) {
			variables = Object.assign({}, response.subscriberConfig.variables, response.contentConfig.variables);

			return variables;
		})
		.catch(function onError(responseError) {
			console.error("Failed getting variables (eventhandler module)");
			console.error(responseError);

			throw responseError;
		});
};

