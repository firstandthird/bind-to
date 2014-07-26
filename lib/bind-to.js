(function(){
  'use strict';
  $.fn.bindTo = $.bindTo = function(config){
    var selector,
        process = function (value) {
          return value;
        };

    if (typeof config === 'object'){
      selector = config.selector;
      if (config.process && $.isFunction(config.process)){
        process = config.process;
      }
    }
    else {
      selector = config;
    }

    var $selector = $(selector),
        $this = this,
        currentVal,
        model = $selector.length ? $selector : $this,
        CHANGEABLE_INPUTS = ['checkbox', 'radio'],
        VAL_INPUTS = ['INPUT','SELECT','TEXTAREA'],
        changeEvent,
        modelUpdateFunc,
        thisApi;

    function getValFunction(node){
      var func;

      if (VAL_INPUTS.indexOf(node.nodeName) > -1){
        func = 'val';
      }
      else {
        func = 'text';
      }

      return func;
    }

    function getChangeEvent(node){
      var event = 'keyup';

      switch(node.nodeName){
        case 'INPUT':
          if (CHANGEABLE_INPUTS.indexOf(node.getAttribute('type').toLowerCase()) > -1){
            event = 'change';
          }
          break;
        case 'SELECT':
          event = 'change';
          break;
        case 'TEXTAREA':
          event = 'keyup';
          break;
        default:
          if (node.hasAttribute('contenteditable')){
            event = 'keyup';
          }
          else {
            event = null;
          }
      }

      return event + '.bindTo';
    }

    if (!model.length){
      throw new Error('bindTo is not attached to any element!');
    }

    changeEvent = getChangeEvent(model[0]);
    modelUpdateFunc = getValFunction(model[0]);
    thisApi = !!$selector.length && $this.jquery && $.bindTo($this.selector);

    var api = model.data('bindTo');

    if (!api){
      api = {
        set: function (value){
          if (api.get() !== value){
            model[modelUpdateFunc](process(value));
            if (changeEvent) {
              model.trigger(changeEvent);
            }
          }
        },
        get: function () {
          return model[modelUpdateFunc]();
        },
        onChange: function(cb){
          model.data('bindToCallbacks').push(cb);
        }
      };

      model.data('bindTo', api);
      model.data('bindToCallbacks', []);

      if (changeEvent){
        model.on(changeEvent, function (e) {
          var context = this, value = api.get();

          if (currentVal !== value){
            model.data('bindToCallbacks').forEach(function(cb){
              cb.call(context, e, value, currentVal);
            });

            currentVal = value;
          }
        });
      }
    }

    if (thisApi){
      api.onChange(function (e, val) {
        thisApi.set(val);
      });

      thisApi.onChange(function(e, value){
        api.set(value);
      });
    }

    if (api.get()){
      setTimeout(function () {
        model.trigger(changeEvent);
      }, 0);
    }

    return thisApi || api;
  };
})();
