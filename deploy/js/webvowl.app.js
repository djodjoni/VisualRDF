webvowl.app =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(75);
	__webpack_require__(77);
	
	module.exports = __webpack_require__(78);


/***/ },

/***/ 9:
/***/ function(module, exports) {

	module.exports = d3;

/***/ },

/***/ 75:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 77:
/***/ function(module, exports) {

	/* Taken from here: http://stackoverflow.com/a/17907562 */
	function getInternetExplorerVersion() {
		var ua,
			re,
			rv = -1;
		if (navigator.appName === "Microsoft Internet Explorer") {
			ua = navigator.userAgent;
			re = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");
			if (re.exec(ua) !== null) {
				rv = parseFloat(RegExp.$1);
			}
		} else if (navigator.appName === "Netscape") {
			ua = navigator.userAgent;
			re = new RegExp("Trident/.*rv:([0-9]{1,}[\\.0-9]{0,})");
			if (re.exec(ua) !== null) {
				rv = parseFloat(RegExp.$1);
			}
		}
		return rv;
	}
	
	function showBrowserWarningIfRequired() {
		var version = getInternetExplorerVersion();
		if (version > 0 && version <= 11) {
			document.write("<div id=\"browserCheck\">The WebVOWL demo does not work in Internet Explorer. Please use another browser, such as <a href=\"http://www.mozilla.org/firefox/\">Mozilla Firefox</a> or <a href=\"https://www.google.com/chrome/\">Google Chrome</a>, to run the WebVOWL demo.</div>");
			// hiding any additional menus and features
			var canvasArea = document.getElementById("canvasArea"),
				detailsArea = document.getElementById("detailsArea"),
				optionsArea = document.getElementById("optionsArea");
			canvasArea.className = "hidden";
			detailsArea.className = "hidden";
			optionsArea.className = "hidden";
		}
	}
	
	
	module.exports = showBrowserWarningIfRequired;


/***/ },

/***/ 78:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(d3) {module.exports = function () {
	
	    var app = {},
	        turtledVersion = turtled.version,
	        graph = webvowl.graph(),
			options = graph.graphOptions(),
			languageTools = webvowl.util.languageTools(),
			graphSelector = "#graph",
		// Modules for the webvowl app
			importMenu,
			exportMenu,
			gravityMenu,
			filterMenu,
			modeMenu,
			resetMenu,
			pauseMenu,
			sidebar = __webpack_require__(79)(graph),
			setupableMenues,
		// Graph modules
			statistics = webvowl.modules.statistics(),
			focuser = webvowl.modules.focuser(),
			selectionDetailDisplayer = webvowl.modules.selectionDetailsDisplayer(sidebar.updateSelectionInformation),
			datatypeFilter = webvowl.modules.datatypeFilter(),
			subclassFilter = webvowl.modules.subclassFilter(),
			disjointFilter = webvowl.modules.disjointFilter(),
			nodeDegreeFilter = webvowl.modules.nodeDegreeFilter(),
			setOperatorFilter = webvowl.modules.setOperatorFilter(),
			nodeScalingSwitch = webvowl.modules.nodeScalingSwitch(graph),
			compactNotationSwitch = webvowl.modules.compactNotationSwitch(graph),
			pickAndPin = webvowl.modules.pickAndPin();
	
		app.initialize = function () {
			options.graphContainerSelector(graphSelector);
			options.selectionModules().push(focuser);
			options.selectionModules().push(selectionDetailDisplayer);
			options.selectionModules().push(pickAndPin);
			options.filterModules().push(statistics);
			options.filterModules().push(datatypeFilter);
			options.filterModules().push(subclassFilter);
			options.filterModules().push(disjointFilter);
			options.filterModules().push(setOperatorFilter);
			options.filterModules().push(nodeScalingSwitch);
			options.filterModules().push(nodeDegreeFilter);
			options.filterModules().push(compactNotationSwitch);
	
			exportMenu = __webpack_require__(80)(options.graphContainerSelector());
			gravityMenu = __webpack_require__(81)(graph);
			filterMenu = __webpack_require__(82)(graph, datatypeFilter, subclassFilter, disjointFilter, setOperatorFilter, nodeDegreeFilter);
			modeMenu = __webpack_require__(83)(graph, pickAndPin, nodeScalingSwitch, compactNotationSwitch);
			pauseMenu = __webpack_require__(84)(graph);
			resetMenu = __webpack_require__(85)(graph, [gravityMenu, filterMenu, modeMenu,
				focuser, selectionDetailDisplayer, pauseMenu]);
			importMenu = __webpack_require__(86)(loadWvoJson);
	
	
			d3.select(window).on("resize", adjustSize);
	
			// setup all bottom bar modules
			setupableMenues = [exportMenu, gravityMenu, filterMenu, modeMenu, resetMenu, pauseMenu, sidebar, importMenu];
			setupableMenues.forEach(function (menu) {
				menu.setup();
			});
	
			graph.start();
			adjustSize();
		};
	
	
	    /**
	     * A quick transform
	     */
	
	    var counter = 0;
	    var graphIds = {};
	    var parser = N3.Parser();
	    var N3Util = N3.Util;
	
	    function newId(){
	        return ""+(counter++)+"";
	    }
	
	    function isblankNode (string) {
	        var prefix = "_:";
	        return string.slice(0, prefix.length) == prefix;
	    }
	
	
	    function addNode(template, s){
	
	        if (N3Util.isIRI(s) || isblankNode(s)){
	            var sId;
	            if (graphIds[s]===undefined){
	                sId = newId();
	
	                if (isImage(s)){
	                    template.class.push( {
	                        "id" : sId,
	                        "imgUrl" :s,
	                        "type": "foaf:depiction"
	                    });
	                } else {
	                    template.class.push( {
	                        "id" : sId,
	                        "type" : "rdfs:Resource"
	                    });
	                }
	
	                template.classAttribute.push(                 {
	                    "id" : sId,
	                    "label" : {
	                        "undefined" : s
	                    },
	                    "iri" : s
	                });
	                graphIds[s] = sId;
	            } else {
	                sId = graphIds[s];
	            }
	            return sId;
	
	        } else {
	            var lId = newId();
	            template.datatype.push(
	                {
	                    "id" : lId,
	                    "type" : "rdfs:Datatype"
	                }
	            );
	            template.datatypeAttribute.push(
	                {
	                    "id" : lId,
	                    "label" : {
	                        "undefined" : N3Util.getLiteralValue(s)
	                    },
	                    "iri" : N3Util.getLiteralType(s)
	                }
	            );
	            return lId;
	        }
	
	    }
	
	    /*
	        From turtle, there is always a new predicate created
	     */
	    function addPredicate(template, sId, p, oId){
	
	        var id = newId();
	        template.property.push(
	            {
	                "id" : id,
	                "type" : "rdf:Property"
	            }
	        );
	        template.propertyAttribute.push(
	            {
	                "id" : id,
	                "label" : {
	                    "undefined" : p
	                },
	                "iri" : p,
	                "isDefinedBy" : "http://example.org/",
	                "domain" : sId,
	                "range" : oId
	            }
	        );
	    }
	
	    // Warning: Nothing is tested here !
	
	    function postProcess(template,prefixes){
	        template.propertyAttribute.forEach(function (current) {
	            var label = current.label.undefined;
	            current.label.undefined = shrinkLabel(label, prefixes);
	        });
	        template.classAttribute.forEach(function (current) {
	            var label = current.label.undefined;
	            current.label.undefined = shrinkLabel(label, prefixes);
	        });
	    }
	
	    function isImage(url) {
	        return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
	    }
	
	
	    function shrinkLabel(label, prefixes) {
	
	            if (prefixes){
	                var index = label.indexOf('#');
	                if (index) {
	                    var key = Object.keys(prefixes).filter(function (key) {
	                            return prefixes[key] === prefix
	                    }
	                    )[0];
	                    var prefix = label.substr(0, index);
	                    var postfix = label.substr(index + 1);
	                    if (key) {
	                        label = key + ":" + postfix;
	                    } else {
	                        label = postfix;
	                    }
	                }
	            }
	
	        return label;
	    }
	
		function loadWvoJson(rdfInput, url){
	
	        var template = {
	            "_comment": "Created from: "+url,
	            "namespace": [],
	            "header": {
	                "title": {
	                    "undefined": url.substring(url.lastIndexOf('/') + 1)
	                },
	                "iri": url,
	                "version": "unknown, could be the github revision",
	                "author": ["Bob", "Alice"]
	            },
	            "class" : [],
	            "classAttribute" : [],
	            "datatype" : [],
	            "datatypeAttribute" : [],
	            "property" : [],
	            "propertyAttribute" : []
	        };
	
			parser.parse(rdfInput,
				function (error, triple, prefixes) {
					if (triple){
	
	                    var sId = addNode(template,triple.subject);
	                    var oId = addNode(template,triple.object);
	                    addPredicate(template,sId, triple.predicate, oId);
	
	                } else {
	                    postProcess(template,prefixes);
	
	                    pauseMenu.reset();
	                    exportMenu.setJsonText(JSON.stringify(template));
	                    options.data(template);
	                    graph.reload();
	                    sidebar.updateOntologyInformation(template, statistics);
	                    exportMenu.setFilename(template.header.title);
	                }
				});
	
			return template;
		}
	
	
	
		function adjustSize() {
			var graphContainer = d3.select(graphSelector),
				svg = graphContainer.select("svg"),
				height = window.innerHeight - 40,
				width = window.innerWidth - (window.innerWidth * 0.22);
	
			graphContainer.style("height", height + "px");
			svg.attr("width", width)
				.attr("height", height);
	
			options.width(width)
				.height(height);
			graph.updateStyle();
		}
	
		return app;
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ },

/***/ 79:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(d3) {/**
	 * Contains the logic for the sidebar.
	 * @param graph the graph that belongs to these controls
	 * @returns {{}}
	 */
	module.exports = function (graph) {
	
		var sidebar = {},
			languageTools = webvowl.util.languageTools(),
			elementTools = webvowl.util.elementTools(),
		// Required for reloading when the language changes
			ontologyInfo,
			lastSelectedElement;
	
	
		/**
		 * Setup the menu bar.
		 */
		sidebar.setup = function () {
			setupCollapsing();
		};
	
		function setupCollapsing() {
			// adapted version of this example: http://www.normansblog.de/simple-jquery-accordion/
			function collapseContainers(containers) {
				containers.classed("hidden", true);
			}
	
			function expandContainers(containers) {
				containers.classed("hidden", false);
			}
	
			var triggers = d3.selectAll(".accordion-trigger");
	
			// Collapse all inactive triggers on startup
			collapseContainers(d3.selectAll(".accordion-trigger:not(.accordion-trigger-active) + div"));
	
			triggers.on("click", function () {
				var selectedTrigger = d3.select(this),
					activeTriggers = d3.selectAll(".accordion-trigger-active");
	
				if (selectedTrigger.classed("accordion-trigger-active")) {
					// Collapse the active (which is also the selected) trigger
					collapseContainers(d3.select(selectedTrigger.node().nextElementSibling));
					selectedTrigger.classed("accordion-trigger-active", false);
				} else {
					// Collapse the other trigger ...
					collapseContainers(d3.selectAll(".accordion-trigger-active + div"));
					activeTriggers.classed("accordion-trigger-active", false);
					// ... and expand the selected one
					expandContainers(d3.select(selectedTrigger.node().nextElementSibling));
					selectedTrigger.classed("accordion-trigger-active", true);
				}
			});
		}
	
		/**
		 * Updates the information of the passed ontology.
		 * @param data the graph data
		 * @param statistics the statistics module
		 */
		sidebar.updateOntologyInformation = function (data, statistics) {
			data = data || {};
			ontologyInfo = data.header || {};
	
			updateGraphInformation();
			displayGraphStatistics(data.metrics, statistics);
			displayMetadata(ontologyInfo.other);
	
			// Reset the sidebar selection
			sidebar.updateSelectionInformation(undefined);
	
			setLanguages(ontologyInfo.languages);
		};
	
		function setLanguages(languages) {
			languages = languages || [];
	
			// Put the default and unset label on top of the selection labels
			languages.sort(function (a, b) {
				if (a === webvowl.util.constants().LANG_IRIBASED) {
					return -1;
				} else if (b === webvowl.util.constants().LANG_IRIBASED) {
					return 1;
				}
				if (a === webvowl.util.constants().LANG_UNDEFINED) {
					return -1;
				} else if (b === webvowl.util.constants().LANG_UNDEFINED) {
					return 1;
				}
				return a.localeCompare(b);
			});
	
			var languageSelection = d3.select("#language")
				.on("change", function () {
					graph.language(d3.event.target.value);
					updateGraphInformation();
					sidebar.updateSelectionInformation(lastSelectedElement);
				});
	
			languageSelection.selectAll("option").remove();
			languageSelection.selectAll("option")
				.data(languages)
				.enter().append("option")
				.attr("value", function (d) {
					return d;
				})
				.text(function (d) {
					return d;
				});
	
			if (!trySelectDefaultLanguage(languageSelection, languages, "en")) {
				if (!trySelectDefaultLanguage(languageSelection, languages, webvowl.util.constants().LANG_UNDEFINED)) {
					trySelectDefaultLanguage(languageSelection, languages, webvowl.util.constants().LANG_IRIBASED);
				}
			}
		}
	
		function trySelectDefaultLanguage(selection, languages, language) {
			var langIndex = languages.indexOf(language);
			if (langIndex >= 0) {
				selection.property("selectedIndex", langIndex);
				graph.language(language);
				return true;
			}
	
			return false;
		}
	
		function updateGraphInformation() {
			var title = languageTools.textInLanguage(ontologyInfo.title, graph.language());
			d3.select("#title").text(title || "No title available");
			d3.select("#about").attr("href", ontologyInfo.iri).attr("target", "_blank").text(ontologyInfo.iri);
			d3.select("#version").text(ontologyInfo.version || "--");
			var authors = ontologyInfo.author;
			if (typeof authors === "string") {
				// Stay compatible with author info as strings after change in january 2015
				d3.select("#authors").text(authors);
			} else if (authors instanceof Array) {
				d3.select("#authors").text(authors.join(", "));
			} else {
				d3.select("#authors").text("--");
			}
	
			var description = languageTools.textInLanguage(ontologyInfo.description, graph.language());
			d3.select("#description").text(description || "No description available.");
		}
	
		function displayGraphStatistics(deliveredMetrics, statistics) {
			// Metrics are optional and may be undefined
			deliveredMetrics = deliveredMetrics || {};
	
			d3.select("#classCount")
				.text(deliveredMetrics.classCount || statistics.classCount());
			d3.select("#objectPropertyCount")
				.text(deliveredMetrics.objectPropertyCount || statistics.objectPropertyCount());
			d3.select("#datatypePropertyCount")
				.text(deliveredMetrics.datatypePropertyCount || statistics.datatypePropertyCount());
			d3.select("#individualCount")
				.text(deliveredMetrics.totalIndividualCount || statistics.totalIndividualCount());
			d3.select("#nodeCount")
				.text(statistics.nodeCount());
			d3.select("#edgeCount")
				.text(statistics.edgeCount());
		}
	
		function displayMetadata(metadata) {
			var container = d3.select("#ontology-metadata");
			container.selectAll("*").remove();
	
			listAnnotations(container, metadata);
	
			if (container.selectAll(".annotation").size() <= 0) {
				container.append("p").text("No annotations available.");
			}
		}
	
		function listAnnotations(container, annotationObject) {
			annotationObject = annotationObject || {};  //todo
	
			// Collect the annotations in an array for simpler processing
			var annotations = [];
			for (var annotation in annotationObject) {
				if (annotationObject.hasOwnProperty(annotation)) {
					annotations.push(annotationObject[annotation][0]);
				}
			}
	
			container.selectAll(".annotation").remove();
			container.selectAll(".annotation").data(annotations).enter().append("p")
				.classed("annotation", true)
				.classed("statisticDetails", true)
				.text(function (d) {
					return d.identifier + ":";
				})
				.append("span")
				.each(function (d) {
					appendIriLabel(d3.select(this), d.value, d.type === "iri" ? d.value : undefined);
				});
		}
	
		/**
		 * Update the information of the selected node.
		 * @param selectedElement the selection or null if nothing is selected
		 */
		sidebar.updateSelectionInformation = function (selectedElement) {
			lastSelectedElement = selectedElement;
	
			// Click event was prevented when dragging
			if (d3.event && d3.event.defaultPrevented) {
				return;
			}
	
	
			var isTriggerActive = d3.select("#selection-details-trigger").classed("accordion-trigger-active");
			if (selectedElement && !isTriggerActive) {
				d3.select("#selection-details-trigger").node().click();
			} else if (!selectedElement && isTriggerActive) {
				showSelectionAdvice();
				return;
			}
	
			if (elementTools.isProperty(selectedElement)) {
				displayPropertyInformation(selectedElement);
			} else if (elementTools.isNode(selectedElement)) {
				displayNodeInformation(selectedElement);
			}
		};
	
		function showSelectionAdvice() {
			setSelectionInformationVisibility(false, false, true);
		}
	
		function setSelectionInformationVisibility(showClasses, showProperties, showAdvice) {
			d3.select("#classSelectionInformation").classed("hidden", !showClasses);
			d3.select("#propertySelectionInformation").classed("hidden", !showProperties);
			d3.select("#noSelectionInformation").classed("hidden", !showAdvice);
		}
	
		function displayPropertyInformation(property) {
			showPropertyInformations();
	
			setIriLabel(d3.select("#propname"), property.labelForCurrentLanguage(), property.iri());
			d3.select("#typeProp").text(property.type());
	
			if (property.inverse() !== undefined) {
				d3.select("#inverse").classed("hidden", false);
				setIriLabel(d3.select("#inverse span"), property.inverse().labelForCurrentLanguage(), property.inverse().iri());
			} else {
				d3.select("#inverse").classed("hidden", true);
			}
	
			var equivalentIriSpan = d3.select("#propEquivUri");
			listNodeArray(equivalentIriSpan, property.equivalents());
	
			listNodeArray(d3.select("#subproperties"), property.subproperties());
			listNodeArray(d3.select("#superproperties"), property.superproperties());
	
			if (property.minCardinality() !== undefined) {
				d3.select("#infoCardinality").classed("hidden", true);
				d3.select("#minCardinality").classed("hidden", false);
				d3.select("#minCardinality span").text(property.minCardinality());
				d3.select("#maxCardinality").classed("hidden", false);
	
				if (property.maxCardinality() !== undefined) {
					d3.select("#maxCardinality span").text(property.maxCardinality());
				} else {
					d3.select("#maxCardinality span").text("*");
				}
	
			} else if (property.cardinality() !== undefined) {
				d3.select("#minCardinality").classed("hidden", true);
				d3.select("#maxCardinality").classed("hidden", true);
				d3.select("#infoCardinality").classed("hidden", false);
				d3.select("#infoCardinality span").text(property.cardinality());
			} else {
				d3.select("#infoCardinality").classed("hidden", true);
				d3.select("#minCardinality").classed("hidden", true);
				d3.select("#maxCardinality").classed("hidden", true);
			}
	
			setIriLabel(d3.select("#domain"), property.domain().labelForCurrentLanguage(), property.domain().iri());
			setIriLabel(d3.select("#range"), property.range().labelForCurrentLanguage(), property.range().iri());
	
			displayAttributes(property.attributes(), d3.select("#propAttributes"));
	
			setTextAndVisibility(d3.select("#propDescription"), property.descriptionForCurrentLanguage());
			setTextAndVisibility(d3.select("#propComment"), property.commentForCurrentLanguage());
	
			listAnnotations(d3.select("#propertySelectionInformation"), property.annotations());
		}
	
		function showPropertyInformations() {
			setSelectionInformationVisibility(false, true, false);
		}
	
		function setIriLabel(element, name, iri) {
			element.selectAll("*").remove();
			appendIriLabel(element, name, iri);
		}
	
		function appendIriLabel(element, name, iri) {
			var tag;
	
			if (iri) {
				tag = element.append("a")
					.attr("href", iri)
					.attr("title", iri)
					.attr("target", "_blank");
			} else {
				tag = element.append("span");
			}
			tag.text(name);
		}
	
		function displayAttributes(attributes, textSpan) {
			var spanParent = d3.select(textSpan.node().parentNode);
	
			if (attributes && attributes.length > 0) {
				// Remove redundant redundant attributes for sidebar
				removeElementFromArray("object", attributes);
				removeElementFromArray("datatype", attributes);
				removeElementFromArray("rdf", attributes);
			}
	
			if (attributes && attributes.length > 0) {
				textSpan.text(attributes.join(", "));
	
				spanParent.classed("hidden", false);
			} else {
				spanParent.classed("hidden", true);
			}
		}
	
		function removeElementFromArray(element, array) {
			var index = array.indexOf(element);
			if (index > -1) {
				array.splice(index, 1);
			}
		}
	
		function displayNodeInformation(node) {
			showClassInformations();
	
			setIriLabel(d3.select("#name"), node.labelForCurrentLanguage(), node.iri());
	
			/* Equivalent stuff. */
			var equivalentIriSpan = d3.select("#classEquivUri");
			listNodeArray(equivalentIriSpan, node.equivalents());
	
			d3.select("#typeNode").text(node.type());
			listNodeArray(d3.select("#individuals"), node.individuals());
	
			/* Disjoint stuff. */
			var disjointNodes = d3.select("#disjointNodes");
			var disjointNodesParent = d3.select(disjointNodes.node().parentNode);
	
			if (node.disjointWith() !== undefined) {
				disjointNodes.selectAll("*").remove();
	
				node.disjointWith().forEach(function (element, index) {
					if (index > 0) {
						disjointNodes.append("span").text(", ");
					}
					appendIriLabel(disjointNodes, element.labelForCurrentLanguage(), element.iri());
				});
	
				disjointNodesParent.classed("hidden", false);
			} else {
				disjointNodesParent.classed("hidden", true);
			}
	
			displayAttributes(node.attributes(), d3.select("#classAttributes"));
	
			setTextAndVisibility(d3.select("#nodeDescription"), node.descriptionForCurrentLanguage());
			setTextAndVisibility(d3.select("#nodeComment"), node.commentForCurrentLanguage());
	
			listAnnotations(d3.select("#classSelectionInformation"), node.annotations());
		}
	
		function showClassInformations() {
			setSelectionInformationVisibility(true, false, false);
		}
	
		function listNodeArray(textSpan, nodes) {
			var spanParent = d3.select(textSpan.node().parentNode);
	
			if (nodes && nodes.length) {
				textSpan.selectAll("*").remove();
				nodes.forEach(function (element, index) {
					if (index > 0) {
						textSpan.append("span").text(", ");
					}
					appendIriLabel(textSpan, element.labelForCurrentLanguage(), element.iri());
				});
	
				spanParent.classed("hidden", false);
			} else {
				spanParent.classed("hidden", true);
			}
		}
	
		function setTextAndVisibility(label, value) {
			var parentNode = d3.select(label.node().parentNode);
			var hasValue = !!value;
			if (value) {
				label.text(value);
			}
			parentNode.classed("hidden", !hasValue);
		}
	
	
		return sidebar;
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ },

/***/ 80:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(d3) {/**
	 * Contains the logic for the export button.
	 *
	 * @param graphSelector the associated graph svg selector
	 * @returns {{}}
	 */
	module.exports = function (graphSelector) {
	
		var exportMenu = {},
			exportSvgButton,
			exportFilename,
			exportJsonButton,
			exportableJsonText;
	
	
		/**
		 * Adds the export button to the website.
		 */
		exportMenu.setup = function () {
			exportSvgButton = d3.select("#exportSvg")
				.on("click", exportSvg);
			exportJsonButton = d3.select("#exportJson")
				.on("click", exportJson);
		};
	
		exportMenu.setFilename = function (filename) {
			exportFilename = filename || "export";
		};
	
		exportMenu.setJsonText = function (jsonText) {
			exportableJsonText = jsonText;
		};
	
		function exportSvg() {
			// Get the d3js SVG element
			var graphSvg = d3.select(graphSelector).select("svg"),
				graphSvgCode,
				escapedGraphSvgCode,
				dataURI;
	
			// inline the styles, so that the exported svg code contains the css rules
			inlineVowlStyles();
			hideNonExportableElements();
	
			graphSvgCode = graphSvg.attr("version", 1.1)
				.attr("xmlns", "http://www.w3.org/2000/svg")
				.node().parentNode.innerHTML;
	
			// Insert the reference to VOWL
			graphSvgCode = "<!-- href:" + dataURI + " -->\n" + graphSvgCode;
	
			escapedGraphSvgCode = escapeUnicodeCharacters(graphSvgCode);
			//btoa(); Creates a base-64 encoded ASCII string from a "string" of binary data.
			dataURI = "data:image/svg+xml;base64," + btoa(escapedGraphSvgCode);
	
			exportSvgButton.attr("href", dataURI)
				.attr("download", exportFilename + ".svg");
	
			// remove graphic styles for interaction to go back to normal
			removeVowlInlineStyles();
			showNonExportableElements();
		}
	
		function escapeUnicodeCharacters(text) {
			var textSnippets = [],
				i, textLength = text.length,
				character,
				charCode;
	
			for (i = 0; i < textLength; i++) {
				character = text.charAt(i);
				charCode = character.charCodeAt(0);
	
				if (charCode < 128) {
					textSnippets.push(character);
				} else {
					textSnippets.push("&#" + charCode + ";");
				}
			}
	
			return textSnippets.join("");
		}
	
		function inlineVowlStyles() {
			d3.selectAll(".text").style("font-family", "Helvetica, Arial, sans-serif").style("font-size", "12px");
			d3.selectAll(".subtext").style("font-size", "9px");
			d3.selectAll(".text.instance-count").style("fill", "#666");
			d3.selectAll(".external + text .instance-count").style("fill", "#aaa");
			d3.selectAll(".cardinality").style("font-size", "10px");
			d3.selectAll(".text, .embedded").style("pointer-events", "none");
			d3.selectAll(".class, .object, .disjoint, .objectproperty, .disjointwith, .equivalentproperty, .transitiveproperty, .functionalproperty, .inversefunctionalproperty, .symmetricproperty").style("fill", "#acf");
			d3.selectAll(".label .datatype, .datatypeproperty").style("fill", "#9c6");
			d3.selectAll(".rdf, .rdfproperty").style("fill", "#c9c");
			d3.selectAll(".literal, .node .datatype").style("fill", "#fc3");
			d3.selectAll(".deprecated, .deprecatedproperty").style("fill", "#ccc");
			d3.selectAll(".external, .externalproperty").style("fill", "#36c");
			d3.selectAll("path, .nofill").style("fill", "none");
			d3.selectAll(".symbol").style("fill", "#69c");
			d3.selectAll(".arrowhead, marker path").style("fill", "#000");
			d3.selectAll(".class, path, line, .fineline").style("stroke", "#000");
			d3.selectAll(".white, .subclass, .dottedMarker path, .subclassproperty, .external + text").style("fill", "#fff");
			d3.selectAll(".class.hovered, .property.hovered, path.arrowhead.hovered, .cardinality.hovered, .normalMarker path.hovered, .cardinality.focused, .normalMarker path.focused, circle.pin").style("fill", "#f00").style("cursor", "pointer");
			d3.selectAll(".focused, path.hovered").style("stroke", "#f00");
			d3.selectAll(".label .indirectHighlighting, .feature:hover").style("fill", "#f90");
			d3.selectAll(".class, path, line").style("stroke-width", "2");
			d3.selectAll(".fineline").style("stroke-width", "1");
			d3.selectAll(".special").style("stroke-dasharray", "8");
			d3.selectAll(".dotted").style("stroke-dasharray", "3");
			d3.selectAll("rect.focused, circle.focused").style("stroke-width", "4px");
			d3.selectAll(".nostroke").style("stroke", "none");
			d3.selectAll("#width-test").style("position", "absolute").style("float", "left").style("white-space", "nowrap").style("visibility", "hidden");
			d3.selectAll("marker path").style("stroke-dasharray", "50");
		}
	
		/**
		 * For example the pin of the pick&pin module should be invisible in the exported graphic.
		 */
		function hideNonExportableElements() {
			d3.selectAll(".hidden-in-export").style("display", "none");
		}
	
		function removeVowlInlineStyles() {
			d3.selectAll(".text, .subtext, .text.instance-count, .external + text .instance-count, .cardinality, .text, .embedded, .class, .object, .disjoint, .objectproperty, .disjointwith, .equivalentproperty, .transitiveproperty, .functionalproperty, .inversefunctionalproperty, .symmetricproperty, .label .datatype, .datatypeproperty, .rdf, .rdfproperty, .literal, .node .datatype, .deprecated, .deprecatedproperty, .external, .externalproperty, path, .nofill, .symbol, .arrowhead, marker path, .class, path, line, .fineline, .white, .subclass, .dottedMarker path, .subclassproperty, .external + text, .class.hovered, .property.hovered, path.arrowhead.hovered, .cardinality.hovered, .normalMarker path.hovered, .cardinality.focused, .normalMarker path.focused, circle.pin, .focused, path.hovered, .label .indirectHighlighting, .feature:hover, .class, path, line, .fineline, .special, .dotted, rect.focused, circle.focused, .nostroke, #width-test, marker path").attr("style", null);
		}
	
		function showNonExportableElements() {
			d3.selectAll(".hidden-in-export").style("display", null);
		}
	
		function exportJson() {
			if (!exportableJsonText) {
				alert("No graph data available.");
				// Stop the redirection to the path of the href attribute
				d3.event.preventDefault();
				return;
			}
	
			var dataURI = "data:text/json;charset=utf-8," + encodeURIComponent(exportableJsonText);
			exportJsonButton.attr("href", dataURI)
				.attr("download", exportFilename + ".json");
		}
	
		return exportMenu;
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ },

/***/ 81:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(d3) {/**
	 * Contains the logic for setting up the gravity sliders.
	 *
	 * @param graph the associated webvowl graph
	 * @returns {{}}
	 */
	module.exports = function (graph) {
	
		var gravityMenu = {},
			sliders = [],
			options = graph.graphOptions(),
			defaultCharge = options.charge();
	
	
		/**
		 * Adds the gravity sliders to the website.
		 */
		gravityMenu.setup = function () {
			addDistanceSlider("#classSliderOption", "class", "Class distance", options.classDistance);
			addDistanceSlider("#datatypeSliderOption", "datatype", "Datatype distance", options.datatypeDistance);
		};
	
		function addDistanceSlider(selector, identifier, label, distanceFunction) {
			var defaultLinkDistance = distanceFunction();
	
			var sliderContainer,
				sliderValueLabel;
	
			sliderContainer = d3.select(selector)
				.append("div")
				.datum({distanceFunction: distanceFunction}) // connect the options-function with the slider
				.classed("distanceSliderContainer", true);
	
			var slider = sliderContainer.append("input")
				.attr("id", identifier + "DistanceSlider")
				.attr("type", "range")
				.attr("min", 10)
				.attr("max", 600)
				.attr("value", distanceFunction())
				.attr("step", 10);
	
			sliderContainer.append("label")
				.classed("description", true)
				.attr("for", identifier + "DistanceSlider")
				.text(label);
	
			sliderValueLabel = sliderContainer.append("label")
				.classed("value", true)
				.attr("for", identifier + "DistanceSlider")
				.text(distanceFunction());
	
			// Store slider for easier resetting
			sliders.push(slider);
	
			slider.on("input", function () {
				var distance = slider.property("value");
				distanceFunction(distance);
				adjustCharge(defaultLinkDistance);
				sliderValueLabel.text(distance);
				graph.updateStyle();
			});
		}
	
		function adjustCharge(defaultLinkDistance) {
			var greaterDistance = Math.max(options.classDistance(), options.datatypeDistance()),
				ratio = greaterDistance / defaultLinkDistance,
				newCharge = defaultCharge * ratio;
	
			options.charge(newCharge);
		}
	
		/**
		 * Resets the gravity sliders to their default.
		 */
		gravityMenu.reset = function () {
			sliders.forEach(function (slider) {
				slider.property("value", function (d) {
					// Simply reload the distance from the options
					return d.distanceFunction();
				});
				slider.on("input")();
			});
		};
	
	
		return gravityMenu;
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ },

/***/ 82:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(d3) {/**
	 * Contains the logic for connecting the filters with the website.
	 *
	 * @param graph required for calling a refresh after a filter change
	 * @param datatypeFilter filter for all datatypes
	 * @param subclassFilter filter for all subclasses
	 * @param disjointFilter filter for all disjoint with properties
	 * @param setOperatorFilter filter for all set operators with properties
	 * @param nodeDegreeFilter filters nodes by their degree
	 * @returns {{}}
	 */
	module.exports = function (graph, datatypeFilter, subclassFilter, disjointFilter, setOperatorFilter, nodeDegreeFilter) {
	
		var filterMenu = {},
			checkboxData = [],
			degreeSlider;
	
	
		/**
		 * Connects the website with graph filters.
		 */
		filterMenu.setup = function () {
			addFilterItem(datatypeFilter, "datatype", "Datatype prop.", "#datatypeFilteringOption");
			addFilterItem(subclassFilter, "subclass", "Solitary subclass.", "#subclassFilteringOption");
			addFilterItem(disjointFilter, "disjoint", "Disjointness info", "#disjointFilteringOption");
			addFilterItem(setOperatorFilter, "setoperator", "Set operators", "#setOperatorFilteringOption");
	
			addNodeDegreeFilter("#nodeDegreeFilteringOption");
		};
	
	
		function addFilterItem(filter, identifier, pluralNameOfFilteredItems, selector) {
			var filterContainer,
				filterCheckbox;
	
			filterContainer = d3.select(selector)
				.append("div")
				.classed("checkboxContainer", true);
	
			filterCheckbox = filterContainer.append("input")
				.classed("filterCheckbox", true)
				.attr("id", identifier + "FilterCheckbox")
				.attr("type", "checkbox")
				.property("checked", filter.enabled());
	
			// Store for easier resetting
			checkboxData.push({checkbox: filterCheckbox, defaultState: filter.enabled()});
	
			filterCheckbox.on("click", function () {
				// There might be no parameters passed because of a manual
				// invocation when resetting the filters
				var isEnabled = filterCheckbox.property("checked");
				filter.enabled(isEnabled);
				graph.update();
			});
	
			filterContainer.append("label")
				.attr("for", identifier + "FilterCheckbox")
				.text(pluralNameOfFilteredItems);
		}
	
		function addNodeDegreeFilter(selector) {
			nodeDegreeFilter.setMaxDegreeSetter(function (maxDegree) {
				degreeSlider.attr("max", maxDegree);
				degreeSlider.property("value", Math.min(maxDegree, degreeSlider.property("value")));
			});
	
			nodeDegreeFilter.setDegreeQueryFunction(function () {
				return degreeSlider.property("value");
			});
	
			var sliderContainer,
				sliderValueLabel;
	
			sliderContainer = d3.select(selector)
				.append("div")
				.classed("distanceSliderContainer", true);
	
			degreeSlider = sliderContainer.append("input")
				.attr("id", "nodeDegreeDistanceSlider")
				.attr("type", "range")
				.attr("min", 0)
				.attr("step", 1);
	
			sliderContainer.append("label")
				.classed("description", true)
				.attr("for", "nodeDegreeDistanceSlider")
				.text("Degree of collapsing");
	
			sliderValueLabel = sliderContainer.append("label")
				.classed("value", true)
				.attr("for", "nodeDegreeDistanceSlider")
				.text(0);
	
			degreeSlider.on("change", function () {
				graph.update();
			});
	
			degreeSlider.on("input", function () {
				var degree = degreeSlider.property("value");
				sliderValueLabel.text(degree);
			});
		}
	
		/**
		 * Resets the filters (and also filtered elements) to their default.
		 */
		filterMenu.reset = function () {
			checkboxData.forEach(function (checkboxData) {
				var checkbox = checkboxData.checkbox,
					enabledByDefault = checkboxData.defaultState,
					isChecked = checkbox.property("checked");
	
				if (isChecked !== enabledByDefault) {
					checkbox.property("checked", enabledByDefault);
					// Call onclick event handlers programmatically
					checkbox.on("click")();
				}
			});
	
			degreeSlider.property("value", 0);
			degreeSlider.on("change")();
			degreeSlider.on("input")();
		};
	
	
		return filterMenu;
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ },

/***/ 83:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(d3) {/**
	 * Contains the logic for connecting the modes with the website.
	 *
	 * @param graph the graph that belongs to these controls
	 * @param pickAndPin mode for picking and pinning of nodes
	 * @param nodeScaling mode for toggling node scaling
	 * @param compactNotation mode for toggling the compact node
	 * @returns {{}}
	 */
	module.exports = function (graph, pickAndPin, nodeScaling, compactNotation) {
	
		var modeMenu = {},
			checkboxes = [];
	
	
		/**
		 * Connects the website with the available graph modes.
		 */
		modeMenu.setup = function () {
			addModeItem(pickAndPin, "pickandpin", "Pick & Pin", "#pickAndPinOption", false);
			addModeItem(nodeScaling, "nodescaling", "Node Scaling", "#nodeScalingOption", true);
			addModeItem(compactNotation, "compactnotation", "Compact Notation", "#compactNotationOption", true);
		};
	
		function addModeItem(module, identifier, modeName, selector, updateGraphOnClick) {
			var moduleOptionContainer,
				moduleCheckbox;
	
			moduleOptionContainer = d3.select(selector)
				.append("div")
				.classed("checkboxContainer", true)
				.datum({module: module, defaultState: module.enabled()});
	
			moduleCheckbox = moduleOptionContainer.append("input")
				.classed("moduleCheckbox", true)
				.attr("id", identifier + "ModuleCheckbox")
				.attr("type", "checkbox")
				.property("checked", module.enabled());
	
			// Store for easier resetting all modes
			checkboxes.push(moduleCheckbox);
	
			moduleCheckbox.on("click", function (d) {
				var isEnabled = moduleCheckbox.property("checked");
				d.module.enabled(isEnabled);
	
				if (updateGraphOnClick) {
					graph.update();
				}
			});
	
			moduleOptionContainer.append("label")
				.attr("for", identifier + "ModuleCheckbox")
				.text(modeName);
		}
	
		/**
		 * Resets the modes to their default.
		 */
		modeMenu.reset = function () {
			checkboxes.forEach(function (checkbox) {
				var defaultState = checkbox.datum().defaultState,
					isChecked = checkbox.property("checked");
	
				if (isChecked !== defaultState) {
					checkbox.property("checked", defaultState);
					// Call onclick event handlers programmatically
					checkbox.on("click")(checkbox.datum());
				}
	
				// Reset the module that is connected with the checkbox
				checkbox.datum().module.reset();
			});
		};
	
	
		return modeMenu;
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ },

/***/ 84:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(d3) {/**
	 * Contains the logic for the pause and resume button.
	 *
	 * @param graph the associated webvowl graph
	 * @returns {{}}
	 */
	module.exports = function (graph) {
	
		var pauseMenu = {},
			pauseButton;
	
	
		/**
		 * Adds the pause button to the website.
		 */
		pauseMenu.setup = function () {
			pauseButton = d3.select("#pause-button")
				.datum({paused: false})
				.on("click", function (d) {
					if (d.paused) {
						graph.unfreeze();
					} else {
						graph.freeze();
					}
					d.paused = !d.paused;
					updatePauseButton();
				});
	
			// Set these properties the first time manually
			updatePauseButton();
		};
	
		function updatePauseButton() {
			updatePauseButtonClass();
			updatePauseButtonText();
		}
	
		function updatePauseButtonClass() {
			pauseButton.classed("paused", function (d) {
				return d.paused;
			});
		}
	
		function updatePauseButtonText() {
			if (pauseButton.datum().paused) {
				pauseButton.text("Resume");
			} else {
				pauseButton.text("Pause");
			}
		}
	
		pauseMenu.reset = function () {
			// Simulate resuming
			pauseButton.datum().paused = false;
			graph.unfreeze();
			updatePauseButton();
		};
	
	
		return pauseMenu;
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ },

/***/ 85:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(d3) {/**
	 * Contains the logic for the reset button.
	 *
	 * @param graph the associated webvowl graph
	 * @param resettableModules modules that can be resetted
	 * @returns {{}}
	 */
	module.exports = function (graph, resettableModules) {
	
		var resetMenu = {},
			options = graph.graphOptions(),
			untouchedOptions = webvowl.options();
	
	
		/**
		 * Adds the reset button to the website.
		 */
		resetMenu.setup = function () {
			d3.select("#reset-button").on("click", resetGraph);
		};
	
		function resetGraph() {
			options.classDistance(untouchedOptions.classDistance());
			options.datatypeDistance(untouchedOptions.datatypeDistance());
			options.charge(untouchedOptions.charge());
			options.gravity(untouchedOptions.gravity());
			options.linkStrength(untouchedOptions.linkStrength());
			graph.reset();
	
			resettableModules.forEach(function (module) {
				module.reset();
			});
	
			graph.updateStyle();
		}
	
	
		return resetMenu;
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ },

/***/ 86:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(d3) {/**
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
	            uri = "https://raw.githubusercontent.com/cristianvasquez/BeliefTaggerData/master/examples/prince.ttl";
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
	
	            loadWvoJson(turtleText,requestedUri);
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
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ }

/******/ });
//# sourceMappingURL=webvowl.app.js.map