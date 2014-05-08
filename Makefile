PROJECTNAME="JONGLOG"

JS_LIB_MINIFY = public/js/lib.min.js
JS_LIB_DIST = public/js/lib.js
JS_LIB_TARGET = bower_components/jquery/dist/jquery.js \
                bower_components/underscore/underscore.js \
                bower_components/backbone/backbone.js \
                bower_components/ratchet/dist/js/ratchet.js \
                bower_components/moment/moment.js

CSS_LIB_DIST = public/css/lib.css
CSS_LIB_TARGET = bower_components/ratchet/dist/css/ratchet.css \
                 bower_components/ratchet/dist/css/ratchet-theme-ios.css

JS_APP_MINIFY = public/js/app.min.js
JS_APP_DIST = public/js/app.js
JS_APP_TARGET = public/js/namespace.js \
                public/js/model/date.js \
                public/js/model/result.js \
                public/js/view/register.js \
                public/js/view/header.js \
                public/js/view/date-list.js \
                public/js/view/result.js \
                public/js/view/result-item.js \
                public/js/view/result-list.js \
                public/js/view/result-total-item.js \
                public/js/view/result-total.js \
                public/js/jonglog.js

all: prologue init copy concat minify finish epilogue

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

concat: $(JS_LIB_DIST) $(JS_APP_DIST) $(CSS_LIB_DIST)
	@echo ""
	@echo ">>> Concatenate"
	@echo ""

$(JS_LIB_DIST): $(JS_LIB_TARGET)
	cat $(JS_LIB_TARGET) > $(JS_LIB_DIST)

$(JS_APP_DIST): $(JS_APP_TARGET)
	cat $(JS_APP_TARGET) > $(JS_APP_DIST)

$(CSS_LIB_DIST): $(CSS_LIB_TARGET)
	cat $(CSS_LIB_TARGET) > $(CSS_LIB_DIST)

minify: $(JS_LIB_MINIFY) $(JS_APP_MINIFY)
	@echo ""
	@echo ">>> Minify"
	@echo ""

$(JS_LIB_MINIFY): $(JS_LIB_DIST)
	node_modules/uglify-js/bin/uglifyjs $(JS_LIB_DIST) > $(JS_LIB_MINIFY)
$(JS_APP_MINIFY): $(JS_APP_DIST)
	node_modules/uglify-js/bin/uglifyjs $(JS_APP_DIST) > $(JS_APP_MINIFY)

epilogue:
	@echo ""
	@echo ">>> $(PROJECTNAME) build has successfully finished"
	@echo ""

.PHONY: prologue init copy concat minify finish epilogue