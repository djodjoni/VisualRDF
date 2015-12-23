/**
 * Contains the logic for the ontology listing and conversion.
 *
 * @returns {{}}
 */
module.exports = function (loadWvoJson) {

	var ontologyMenu = {},
	// Selections for the app
		loadingError = d3.select("#loading-error"),
		loadingProgress = d3.select("#loading-progress"),
		ontologyMenuTimeout;

	ontologyMenu.setup = function () {
		setupConverterButtons();
		var descriptionButton = d3.select("#error-description-button").datum({open: false});
		descriptionButton.on("click", function (data) {
			var errorContainer = d3.select("#error-description-container");
			var errorDetailsButton = d3.select(this);

			// toggle the state
			data.open = !data.open;
			var descriptionVisible = data.open;
			if (descriptionVisible) {
				errorDetailsButton.text("Hide error details");
			} else {
				errorDetailsButton.text("Show error details");
			}
			errorContainer.classed("hidden", !descriptionVisible);
		});

		setupUriListener();
	};


	function setupUriListener() {
		// parse the url initially
		parseLocationURLAndLoad();

		// reload ontology when hash parameter gets changed manually
		d3.select(window).on("hashchange", function () {
			var oldURL = d3.event.oldURL, newURL = d3.event.newURL;

			if (oldURL !== newURL) {
				// don't reload when just the hash parameter gets appended
				if (newURL === oldURL + "#") {
					return;
				}

				updateNavigationHrefs();
				parseLocationURLAndLoad();
			}
		});

		updateNavigationHrefs();
	}

	/**
	 * Quick fix: update all anchor tags that are used as buttons because a click on them
	 * changes the url and this will load an other ontology.
	 */
	function updateNavigationHrefs() {
		d3.selectAll("#optionsMenu > li > a").attr("href", location.hash || "#");
	}


    function getSearchParameters() {
        var prmstr = location.search.substr(1);
        return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
    }

    function transformToAssocArray( prmstr ) {
        var params = {};
        var prmarr = prmstr.split("&");
        for ( var i = 0; i < prmarr.length; i++) {
            var tmparr = prmarr[i].split("=");
            params[tmparr[0]] = tmparr[1];
        }
        return params;
    }

	function parseLocationURLAndLoad() {

        var uri = getSearchParameters().uri;

		if (!uri) {
            uri = "https://raw.githubusercontent.com/cristianvasquez/WebVOWL/master/src/app/data/test.json";
		}

		// IRI parameter
        if (uri) {
            //var iri = decodeURIComponent(hashParameter.slice(iriKey.length));
            loadFromUri(uri);
			d3.select("#converter-option").classed("selected-ontology", true);
		}
	}

	function loadFromUri(requestedUri) {
        displayLoadingIndicators();
        d3.xhr(requestedUri, "application/json", function (error, request) {
            var loadingSuccessful = !error;
            var errorInfo;

            var turtleText;
            if (loadingSuccessful) {
                turtleText = request.responseText;
            } else {
                if (error.status === 404) {
                    errorInfo = "Cannot retrieve ."+requestedUri;
                }
            }

            loadWvoJson(turtleText);
            setLoadingStatus(loadingSuccessful, error ? error.response : undefined, errorInfo);
            hideLoadingInformations();
        });
	}

	function setupConverterButtons() {
		var iriConverterButton = d3.select("#iri-converter-button");
		var iriConverterInput = d3.select("#iri-converter-input");

		iriConverterInput.on("input", function () {
			keepOntologySelectionOpenShortly();

			var inputIsEmpty = iriConverterInput.property("value") === "";
			iriConverterButton.attr("disabled", inputIsEmpty || undefined);
		}).on("click", function () {
			keepOntologySelectionOpenShortly();
		});

		d3.select("#iri-converter-form").on("submit", function () {
			location.hash = "iri=" + iriConverterInput.property("value");
			iriConverterInput.property("value", "");
			iriConverterInput.on("input")();

			// abort the form submission because we set the hash parameter manually to prevent the ? attached in chrome
			d3.event.preventDefault();
			return false;
		});
	}

	function keepOntologySelectionOpenShortly() {
		// Events in the menu should not be considered
		var ontologySelection = d3.select("#select .toolTipMenu");
		ontologySelection.on("click", function () {
			d3.event.stopPropagation();
		}).on("keydown", function () {
			d3.event.stopPropagation();
		});

		ontologySelection.style("display", "block");

		function disableKeepingOpen() {
			ontologySelection.style("display", undefined);

			clearTimeout(ontologyMenuTimeout);
			d3.select(window).on("click", undefined).on("keydown", undefined);
			ontologySelection.on("mouseover", undefined);
		}

		// Clear the timeout to handle fast calls of this function
		clearTimeout(ontologyMenuTimeout);
		ontologyMenuTimeout = setTimeout(function () {
			disableKeepingOpen();
		}, 3000);

		// Disable forced open selection on interaction
		d3.select(window).on("click", function () {
			disableKeepingOpen();
		}).on("keydown", function () {
			disableKeepingOpen();
		});

		ontologySelection.on("mouseover", function () {
			disableKeepingOpen();
		});
	}


	function displayLoadingIndicators() {
		loadingError.classed("hidden", true);
		loadingProgress.classed("hidden", false);
	}

	function setLoadingStatus(success, description, information) {
		loadingError.classed("hidden", success);

		var errorInfo = d3.select("#error-info");
		if (information) {
			errorInfo.text(information);
		} else {
			errorInfo.html("An error occurred loading the resource");
		}

		var descriptionMissing = !description;
		var descriptionVisible = d3.select("#error-description-button").classed("hidden", descriptionMissing).datum().open;
		d3.select("#error-description-container").classed("hidden", descriptionMissing || !descriptionVisible);
		d3.select("#error-description").text(description || "");
	}

	function hideLoadingInformations() {
		loadingProgress.classed("hidden", true);
	}

	return ontologyMenu;
};
