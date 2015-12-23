module.exports = function () {

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
		sidebar = require("./sidebar")(graph),
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

		exportMenu = require("./menu/exportMenu")(options.graphContainerSelector());
		gravityMenu = require("./menu/gravityMenu")(graph);
		filterMenu = require("./menu/filterMenu")(graph, datatypeFilter, subclassFilter, disjointFilter, setOperatorFilter, nodeDegreeFilter);
		modeMenu = require("./menu/modeMenu")(graph, pickAndPin, nodeScalingSwitch, compactNotationSwitch);
		pauseMenu = require("./menu/pauseMenu")(graph);
		resetMenu = require("./menu/resetMenu")(graph, [gravityMenu, filterMenu, modeMenu,
			focuser, selectionDetailDisplayer, pauseMenu]);
		importMenu = require("./menu/importMenu")(loadWvoJson);


		console.log(turtledVersion);
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

    function addNode(template, s){

        if (N3Util.isIRI(s)){
            var sId;
            if (graphIds[s]===undefined){
                sId = newId();
                template.class.push( {
                    "id" : sId,
                    "type" : "rdfs:Resource"
                });
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
        //console.log(sId,oId);

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

    function shrinkLabel(label, prefixes) {
        var index = label.indexOf('#');
        if (index) {
            var prefix = label.substr(0, index);
            var postfix = label.substr(index + 1);
            var key = Object.keys(prefixes).filter(function (key) {
                    return prefixes[key] === prefix
                }
            )[0];
            if (key) {
                label = key + ":" + postfix;
            } else {
                label = postfix;
            }
        }
        return label;
    }

	function loadWvoJson(turtleInput){

        var template = {
            "_comment": "Created by hand",
            "namespace": [],
            "header": {
                "title": {
                    "undefined": "The title"
                },
                "iri": "http://rdfFiles.org/1.ttl",
                "version": "0.99",
                "author": ["Bob", "Alice"]
            },
            "class" : [],
            "classAttribute" : [],
            "datatype" : [],
            "datatypeAttribute" : [],
            "property" : [],
            "propertyAttribute" : []
        };

        var turtle = '@prefix c: <http://example.org/cartoons#>.\n' +
            ' c:Tom a c:Cat.\n' +
            ' c:Jerry a c:Mouse;\n' +
            ' c:hasLiteral "literal"; ' +
            ' c:smarterThan c:Tom.'
            ;
		parser.parse(turtle,
			function (error, triple, prefixes) {
				if (triple){

                    var sId = addNode(template,triple.subject);
                    var oId = addNode(template,triple.object);
                    addPredicate(template,sId, triple.predicate, oId);

                } else {
//                    console.log("# That's all, folks!", prefixes);

                    postProcess(template,prefixes);

                    pauseMenu.reset();
 //                   var name = languageTools.textInLanguage(names);
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
