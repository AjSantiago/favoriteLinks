const { format } = require("timeago.js");

const helpers = {};

helpers.timeAgo = (timestamp) => {
	return format(timestamp);
};

module.exports = helpers;
