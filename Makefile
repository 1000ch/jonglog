PROJECTNAME="JONGLOG"

all: prologue init concat minify finish epilogue

prologue:
	@echo ""
	@echo ">>> $(PROJECTNAME) build started"
	@echo ""

init:
	@echo ""
	@echo ">>> Initialize"
	@echo ""

	npm install .
	node_modules/bower/bin/bower install

concat:
	@echo ""
	@echo ">>> Concatenate"
	@echo ""

	cat public/jquery/dist/jquery.js public/underscore/underscore.js public/backbone/backbone.js public/moment/moment.js > public/js/lib.js

minify:
	@echo ""
	@echo ">>> Minify"
	@echo ""

	node_modules/uglify-js/bin/uglifyjs public/js/lib.js > public/js/lib.min.js

epilogue:
	@echo ""
	@echo ">>> $(PROJECTNAME) build has successfully finished"
	@echo ""

.PHONY: prologue init concat minify finish epilogue