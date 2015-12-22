module.exports = function () {
	/**
	 * @constructor
	 */
	var options = {},
		compactNotation = false;

	options.compactNotation = function (p) {
		if (!arguments.length) return compactNotation;
		compactNotation = p;
		return options;
	};

	return options;
};
