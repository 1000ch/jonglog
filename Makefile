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

	npm install .
	node_modules/bower/bin/bower install

copy:
	@echo ""
	@echo ">>> Copy"
	@echo ""

	cp -r public/ratchet/dist/fonts public

concat:
	@echo ""
	@echo ">>> Concatenate"
	@echo ""

	cat public/jquery/dist/jquery.js public/underscore/underscore.js public/backbone/backbone.js public/ratchet/js/rachet.js public/moment/moment.js > public/js/lib.js
	cat public/ratchet/dist/css/ratchet.css public/ratchet/dist/css/ratchet-theme-ios.css > public/css/lib.css

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