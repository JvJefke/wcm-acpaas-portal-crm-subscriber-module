require("rootpath")();

var VariableHelper = require("app/helpers/modules/lib").Variables;
var packageConfig = require("../../package.json");
var CTModel = require("app/models/contentType");

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

var init = function init() {
	return VariableHelper.getAll(packageConfig.name, packageConfig.version)
		.then(function onSuccess(response) {
			if (!response) {
				throw "no variables available";
			}

			return addCTID(response);
		})
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

init();

module.exports = function getVariables() {
	return variables;
};

module.exports.reload = init;

