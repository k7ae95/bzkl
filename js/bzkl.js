; (function ($, window, document, undefined) {
  "use strict";

  window = (typeof window != 'undefined' && window.Math == Math)
    ? window
    : (typeof self != 'undefined' && self.Math == Math)
      ? self
      : Function('return this')()
    ;

  $.fn.bzkl = function (parameters) {
    $.fn.bzkl.settings = {
      'name': 'Mina no Nihongo - Grammar',
      'namespace': 'bzkl',

      'groups': ['main', 'phonetic', 'han-viet', 'translit', 'mean', 'notes'],

      'object': ['a00', 'a10', 'b00', 'b10'],

      'classes': {
        'chapter': 'bzkl-chapter',
        'a00': 'a00',
        'a10': 'a10',
        'b00': 'b00',
        'b10': 'b10'
      },

      'selector': {
        'chapter': '.bzkl-chapter',
        'content': '.content',
        'more': '.more',
        'a00': '.a00',
        'a10': '.a10',
        'b00': '.b00',
        'b10': '.b10'
      },

      'attribute': {
        'key': 'k'
      },

      'format': {
        'object': function () {
          return '<span class="content"></span><div class="more"><span class="arrow-border"></span><span class="arrow"></span></div>';
        },
      }
    };

    var $allModules = $(this);
    var query = arguments[0];
    var methodInvoked = (typeof query === 'string');
    var queryArguments = [].slice.call(arguments, 1);
    var returnedValue;

    $allModules.each(function () {
      var settings = $.extend(true, {}, $.fn.bzkl.settings, parameters);

      var namespace = settings.namespace;

      var groups = settings.groups;
      var object = settings.object;
      var classes = settings.classes;
      var selector = settings.selector;
      var attribute = settings.attribute;
      var format = settings.format;
      var config = settings.config;

      var eventNamespace = '.' + namespace;
      var moduleNamespace = 'module-' + namespace;

      var $module = $(this);

      var instance = $module.data(moduleNamespace);
      var module;
      var util;

      module = {
        initialize: function () {

          util.initObject();

          return 0;
        },
      };

      util = {
        initObject: function () {
          $(object).each(function () {
            var handle = this;

            $module.find(selector[handle]).each(function () {
              var $element = $(this);
              var key = $element.attr(attribute.key);

              if (key === undefined) {
                key = $element.text();
              }

              var contentValue = $element.html();

              $element.attr(attribute.key, key);
              $element.html(format.object());
              $element.find(selector.content).first().html(contentValue);

              var $content = $element.find(selector.content).first();
              var $more = $element.find(selector.more).first();

              $(groups).each(function (index, group) {
                var value = data[handle][key];

                if (value !== undefined) {
                  if (value[group] !== undefined) {
                    $more.append(value[group]);
                  }
                } else {
                  console.log({ 'element': $element, 'key': key });
                }
              });

              $content.hover(function () {
                var position = $content.position();

                var top = position.top - $more.height() - 52;
                var left = position.left + $content.width() / 2;

                if (left - $more.width() / 2 < 0) {
                  left = $more.width() / 2;
                }

                $more.css('top', top + 'px');
                $more.css('left', left + 'px');
                $more.addClass('show');
              });

              $content.mouseleave(function () {
                $more.removeClass('show');
              });
            });
          });

          return 0;
        }
      };

      if (methodInvoked) {
        module.invoke(query);
      }
      else {
        module.initialize();
      }

      return (returnedValue !== undefined) ? returnedValue : this;
    });
  }
})(jQuery, window, document);

$(document).ready(function () {
   $('.bzkl-chapter').bzkl();
});