var ImageNode = require("../ImageNode");

module.exports = (function () {

	var o = function (graph) {
		ImageNode.apply(this, arguments);

		var superDrawFunction = this.draw;

		this.attributes(["rdf"])
			.label("Resource")
			.radius(90)
			.styleClass("rdfsresource")
			.type("foaf:depiction");

		this.draw = function (element) {
			superDrawFunction(element, ["rdf", "special"]);
		};
	};
	o.prototype = Object.create(ImageNode.prototype);
	o.prototype.constructor = o;

	return o;
}());
