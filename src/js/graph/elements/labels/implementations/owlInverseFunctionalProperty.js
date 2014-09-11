webvowl.labels.owlinversefunctionalproperty = (function () {

	var o = function () {
		webvowl.labels.BaseLabel.call(this);

		this.attributes(["inverse functional"])
			.styleClass("inversefunctionalproperty")
			.type("owl:InverseFunctionalProperty");
	};
	o.prototype = Object.create(webvowl.labels.BaseLabel.prototype);
	o.prototype.constructor = o;

	return o;
}());