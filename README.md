VisualRDF v2 
=======

Examples: http://openthings-cc.github.io/VisualRDF/deploy

Requirements
------------

Node.js for installing the development tools and dependencies.

Development setup
-----------------

### Simple ###
1. Download and install Node.js from http://nodejs.org/download/
2. Open the terminal in the root directory
3. Run `npm install` to install the dependencies and build the project
4. Edit the code
5. Run `npm run-script release` to (re-)build all necessary files into the deploy directory

### Advanced ###
Instead of the last step of the simple setup, install the npm package `grunt-cli` globally with
`npm install grunt-cli -g`. Now you can execute a few more advanced commands in the terminal:

* `grunt` or `grunt release` builds the release files into the deploy directory
* `grunt package` builds the development version
* `grunt webserver` starts a local live-updating webserver with the current development version
* `grunt test` starts the test runner
* `grunt zip` builds the project and puts it into a zip file
