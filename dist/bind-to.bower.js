/*!
 * bind-to - simple two way data-binding
 * v0.0.2
 * https://github.com/firstandthird/bind-to
 * copyright First+Third 2014
 * MIT License
*/
(function(){
	'use strict';
	$.fn.bindTo = $.bindTo = function(selector){
		var $selector = $(selector),
				$this = this,
				currentVal,
				model = $selector.length ? $selector : $this,
				CHANGEABLE_INPUTS = ['checkbox', 'radio'],
				VAL_INPUTS = ['INPUT','SELECT','TEXTAREA'],
				changeEvent,
				modelUpdateFunc,
				thisUpdateFunc;

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
		thisUpdateFunc = $this.jquery && getValFunction($this[0]);

		var api = {
			set: function (value){
				model[modelUpdateFunc](value);
				if (changeEvent) {
					model.trigger(changeEvent);
				}
			},
			get: function () {
				return model[modelUpdateFunc]();
			},
			onChange: function(cb){
				model.data('bindToCallbacks').push(cb);
			}
		};

		if ($this.jquery && $selector.length){
			api.onChange(function (e, val) {
				$this[thisUpdateFunc](val);
			});
		}

		if (!model.data('bindToInit')){
			model.data('bindToInit', true);
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

		if (api.get()){
			setTimeout(function () {
				model.trigger(changeEvent);
			}, 0);
		}

		return api;
	};
})();