/*global suite,test,setup,assert*/
suite('bind-to', function () {

	setup(function() {
		$('#fixture').empty().html($('#clone').clone());
	});

	suite('bootstrap', function () {
		test('It should expose functions on the jQuery object and on jQuery objects', function () {
			assert.equal(typeof $.bindTo, 'function');
			assert.equal(typeof $('#fixture').bindTo, 'function');
		});
		test('It should throw if it can\'t match the selector', function () {
			assert.throws(function () {
				$.bindTo('#unexistantElement');
			});
		});
		test('It should bind to the proper events depending on the binded element', function () {
			var bindText = $.bindTo('#fixture #textInput');
			var bindCheckbox = $.bindTo('#fixture #checkboxInput');
			var bindContentEditable = $.bindTo('#fixture #contentEditable');
			var bindSelect = $.bindTo('#fixture select');
			var inputText = $('#fixture #textInput').get(0),
					checkbox = $('#fixture #checkboxInput').get(0),
					select = $('#fixture select').get(0),
					contenTeditable = $('#fixture #contentEditable').get(0);

			assert.equal($._data(inputText, 'events').keyup.length, 1);
			assert.equal($._data(checkbox, 'events').change.length, 1);
			assert.equal($._data(select, 'events').change.length, 1);
			assert.equal($._data(contenTeditable, 'events').keyup.length, 1);
		});
		test('Returned object should have some methods', function () {
			var bindText = $.bindTo('#fixture #textInput');
			assert.equal(typeof bindText.set, 'function');
			assert.equal(typeof bindText.get, 'function');
			assert.equal(typeof bindText.onChange, 'function');
		});
		test('It should grab the initial value by default', function (done) {
			$('#subject').bindTo('#fixture #textInput');
			setTimeout(function () {
				assert.equal($('#subject').html(), 'Test value');
				done();
			}, 10);
		});
		test('It should only bind to the element once', function () {
			var inputText = $('#fixture #textInput').get(0);
			var anotherBinding = $.bindTo('#fixture #textInput');

			assert.equal($._data(inputText, 'events').keyup.length, 1);
		});

		test('It should support textareas', function(done) {
			$('#subject').bindTo('#fixture #textareaInput');
			setTimeout(function () {
				assert.equal($('#subject').html(), 'Test area value');
				done();
			}, 10);
		});

		test('It should support programmatically changing', function(done) {
			$('#subject').bindTo('#fixture #textareaInput');
			$('#fixture #textareaInput').val('testing');
			setTimeout(function () {
				assert.equal($('#subject').html(), 'testing');
				done();
			}, 10);
		});

		test('It should allow to pass a configuration object instead of a selector', function () {
			var bindText = $.bindTo({ selector: '#fixture #textInput' }),
					inputText = $('#fixture #textInput').get(0);

			assert.equal($._data(inputText, 'events').keyup.length, 1);
		});
	});
	suite('set', function () {
		test('It should change the value whenever a new value is set', function () {
			var bindText = $.bindTo('#fixture #textInput');
			assert.equal(bindText.get(), 'Test value');
			bindText.set('Foo');
			assert.equal(bindText.get(), 'Foo');
		});
		test('It should fire the change event on the input upon setting a new value', function (done) {
			var bindText = $.bindTo('#fixture #textInput');
			$('#fixture #textInput').on('keyup.bindTo', function () {
				done();
			});
			bindText.set('Foo');
		});
	});
	suite('get', function () {
		test('Get should figure the best method to access the value', function () {
			var bindText = $.bindTo('#fixture #textInput');
			var pBind = $.bindTo('#fixture #pWithValue');

			assert.equal(pBind.get(), 'Bar');
			assert.equal(bindText.get(), 'Test value');
		});
	});
	suite('onChange', function () {
		test('It should be possible to register to onChange more than once', function (done) {
			var fired = 0;

			var bindText = $.bindTo('#fixture #textInput');
			bindText.onChange(function () {
				fired++;
			});

			bindText.onChange(function () {
				fired++;

				assert.equal(fired, 2);
				done();
			});

			bindText.set('Foo');
		});
		test('It should pass the event, the previous value, and the newvalue while maintaining the scope', function (done) {
			setTimeout(function () {
				var bindText = $.bindTo('#fixture #textInput');
				bindText.onChange(function (e, newValue, oldValue) {
					assert.equal(e.type, 'keyup');
					//assert.equal(oldValue, 'Test value');
					assert.equal(newValue, 'Foo');
					done();
				});
				bindText.set('Foo');
			}, 10);
		});
	});
	suite('Process', function () {
		test('It should be possible to pass a process function which transforms the value', function () {
			var called = false;
			var bindText = $.bindTo({
				selector: '#fixture #textInput',
				process: function (value) {
					called = true;
					return value + ' bar';
				}
			});

			bindText.set('Foo');

			assert.equal(bindText.get(), 'Foo bar');
			assert.equal(called, true);
		});
	});
});
