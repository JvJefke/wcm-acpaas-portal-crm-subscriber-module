require("rootpath")();

var _ = require("lodash");
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

var addPreSuffix = function addPreSuffix(value, id) {
	var addUrl = variablesHelper().addUrl.url + "nl/opdrachten/detail/" + id;

	return variablesHelper().contentPrefix +
		value +
		variablesHelper().contentSuffix.replace("{{da-url}}", addUrl);
};

var prepareBody = function prepareBody(body) {
	var id = _.get(body, "id", "");
	var title = _.get(body, "title", "");
	var description = _.get(body, "description", "");
	var label = "CRM news " + title;

	return {
		fields: {
			title: generateMultiLanguageField("nl", title),
			intro: generateMultiLanguageField("nl", _.truncate(stripTags(description), { "length": 50 })),
			body: generateMultiLanguageField("nl", addPreSuffix(description, id)),
			banner: variablesHelper().defaultBannerImage,
			thumbnail: variablesHelper().defaultThumbnailImage,
			excludeFromHome: {
				exclude: false,
			},
		},
		meta: {
			contentType: variablesHelper().ctId,
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
				tags: [],
				dataType: "taxonomy",
				available: [],
			},
			slug: generateMultiLanguageField("nl", _.kebabCase(label)),
		},
	};
};

module.exports.create = function create(body) {
	return ContentModel.create(prepareBody(body));
};
