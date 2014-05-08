PROJECTNAME="JONGLOG"

all: prologue init concat copy minify finish epilogue

prologue:
	@echo ""
	@echo ">>> $(PROJECTNAME) build started"
	@echo ""

init:
	@echo ""
	@echo ">>> Initialize"
	@echo ""

	node_modules/bower/bin/bower install
	mkdir -p public/js
	mkdir -p public/css

copy:
	@echo ""
	@echo ">>> Copy"
	@echo ""

	cp -r bower_components/ratchet/dist/fonts public

concat:
	@echo ""
	@echo ">>> Concatenate"
	@echo ""

	cat bower_components/jquery/dist/jquery.js bower_components/underscore/underscore.js bower_components/backbone/backbone.js bower_components/ratchet/dist/js/ratchet.js bower_components/moment/moment.js > public/js/lib.js
	cat bower_components/ratchet/dist/css/ratchet.css bower_components/ratchet/dist/css/ratchet-theme-ios.css > public/css/lib.css

minify:
	@echo ""
	@echo ">>> Minify"
	@echo ""

	node_modules/uglify-js/bin/uglifyjs public/js/lib.js > public/js/lib.min.js

epilogue:
	@echo ""
	@echo ">>> $(PROJECTNAME) build has successfully finished"
	@echo ""

.PHONY: prologue init concat copy minify finish epilogue