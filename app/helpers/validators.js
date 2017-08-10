module.exports.CRMTender = function validateCRMTender(crmBody) {
	return crmBody && crmBody.id && crmBody.title && crmBody.description;
};
