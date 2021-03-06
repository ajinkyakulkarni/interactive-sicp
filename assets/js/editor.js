// Generated by CoffeeScript 1.3.3
(function() {
  var SchemeEditor, currentEditor, interpreter,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  currentEditor = null;

  interpreter = new BiwaScheme.Interpreter(function(e, state) {
    this.after_evaluate = function() {};
    return currentEditor.showError(e);
  });

  SchemeEditor = (function() {

    function SchemeEditor(elementToReplace) {
      this.revertContent = __bind(this.revertContent, this);

      this.run = __bind(this.run, this);

      this.showResult = __bind(this.showResult, this);

      this.showError = __bind(this.showError, this);
      this.render($(elementToReplace));
      this.setUpTextEditor();
      this.addButtonEvents();
    }

    SchemeEditor.prototype.setUpTextEditor = function() {
      this.codeMirror = CodeMirror.fromTextArea(this.el.find('textarea').get(0), {
        mode: 'scheme'
      });
      return this.getButtons().hide();
    };

    SchemeEditor.prototype.render = function(elementToReplace) {
      this.originalContent = elementToReplace.text();
      this.el = $("\"\n<div class=\"row\">\n  <span class='span11'>\n    <pre><textarea>" + this.originalContent + "</textarea></pre>\n  </span>\n  <div class=\"btn-group offset-half\">\n    <button class='btn run-btn btn-primary'>Run</button>\n    <button class=\"btn btn-primary dropdown-toggle\" data-toggle=\"dropdown\">\n      <span class=\"caret\"></span>\n    </button>\n    <ul class=\"dropdown-menu\">\n      <li><a href=\"#\" class='run-btn'>Run code</a></li>\n      <li><a href=\"#\" class='revert-btn'>Revert content</a></li>\n    </ul>\n  </div>\n  <span class='span11 editor-results'></span>\n</div>");
      return elementToReplace.replaceWith(this.el);
    };

    SchemeEditor.prototype.addButtonEvents = function() {
      var _this = this;
      this.delegateClick(".run-btn", this.run);
      this.delegateClick(".revert-btn", this.revertContent);
      this.focussed = false;
      this.codeMirror.setOption('onFocus', function() {
        _this.focus = true;
        return _this.getButtons().fadeIn(500);
      });
      this.hover = false;
      this.el.mouseover(function() {
        return _this.hover = true;
      });
      this.codeMirror.setOption('onBlur', function() {
        _this.focus = false;
        return _this.scheduleHideButtons();
      });
      return this.el.mouseout(function() {
        _this.hover = false;
        return _this.scheduleHideButtons();
      });
    };

    SchemeEditor.prototype.scheduleHideButtons = function() {
      var unhide,
        _this = this;
      unhide = function() {
        if (!(_this.focus || _this.hover)) {
          return _this.getButtons().fadeOut(500);
        }
      };
      return window.setTimeout(unhide, 3000);
    };

    SchemeEditor.prototype.delegateClick = function(sel, callback) {
      return this.el.delegate(sel, 'click', callback);
    };

    SchemeEditor.prototype.renderResult = function(type, message) {
      return $("<div class=\"alert alert-" + type + "\">\n  <button type=\"button\" class=\"close\" data-dismiss=\"alert\">x</button>\n  " + message + "\n</div>");
    };

    SchemeEditor.prototype.appendResult = function(type, message) {
      return this.el.find('.editor-results').prepend(this.renderResult(type, message));
    };

    SchemeEditor.prototype.showError = function(e) {
      return this.appendResult('error', e.message);
    };

    SchemeEditor.prototype.showResult = function(res) {
      return this.appendResult('info', res.toString());
    };

    SchemeEditor.prototype.getContent = function() {
      return this.codeMirror.getValue();
    };

    SchemeEditor.prototype.getButtons = function() {
      var _ref;
      return (_ref = this.buttons) != null ? _ref : this.buttons = this.el.find('div.btn-group');
    };

    SchemeEditor.prototype.run = function() {
      var _this = this;
      try {
        currentEditor = this;
        return interpreter.evaluate(this.getContent(), function(result) {
          return _this.appendResult('info', result);
        });
      } finally {
        currentEditor = null;
      }
    };

    SchemeEditor.prototype.revertContent = function() {
      return this.codeMirror.setValue(this.originalContent);
    };

    return SchemeEditor;

  })();

  $(function() {
    return $('tt').each(function() {
      return new SchemeEditor(this);
    });
  });

}).call(this);
