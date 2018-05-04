require("rootpath")();

var _ = require("lodash");
var R = require("ramda");
var variablesHelper = require("../../helpers/variables");
var ContentModel = require("app/models/content");

var generateMultiLanguageField = function generateMultiLanguageField(lang, value) {
	var obj = {
		multiLanguage: true,
	};

	obj[lang] = value;

	return obj;
};

var stripTags = function stripTags(value) {
	return (value || "").replace(/(<([^>]+)>)/ig, "");
};

var addPreSuffix = function addPreSuffix(variables, value, id) {
	var daUrl = variables.daUrl + "nl/opdrachten/detail/" + id;

	return variables.contentPrefix +
		value +
		variables.contentSuffix.replace("{{da-url}}", daUrl);
};

var prepareBody = R.curry(function prepareBody(variables, body) {
	var id = R.pathOr("", ["id"], body);
	var title = R.pathOr("", ["title"], body);
	var description = R.pathOr("", ["description"], body);
	var label = "CRM news " + title;

	return {
		fields: {
			title: generateMultiLanguageField("nl", title),
			intro: generateMultiLanguageField("nl", _.truncate(stripTags(description), { "length": 200 })),
			body: generateMultiLanguageField("nl", addPreSuffix(variables, description, id)),
			excludeFromHome: {
				exclude: false,
			},
		},
		meta: {
			contentType: variables.ctId,
			publishDate: Date.now(),
			label: label,
			status: "PUBLISHED",
			safeLabel: _.snakeCase(label),
			deleted: false,
			hasDetail: false,
			activeLanguages: [
				"nl",
			],
			hitCount: 0,
			published: true,
			lastModified: Date.now(),
			created: Date.now(),
			taxonomy: {
				tags: variables.taxonomyItem ? [variables.taxonomyItem] : [],
				dataType: "taxonomy",
				available: [],
			},
			slug: generateMultiLanguageField("nl", _.kebabCase(label)),
		},
	};
});

module.exports.create = function create(body) {
	return variablesHelper()
		.then(prepareBody(R.__, body))
		.then(ContentModel.create);
};
