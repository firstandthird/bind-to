suite('bind-to', function () {
	var bindText, bindCheckbox, bindContentEditable, bindSelect;

	setup(function() {
		$('#fixture').empty().html($('#clone').clone());

		bindText = $.bindTo('#fixture #textInput');
		bindCheckbox = $.bindTo('#fixture #checkboxInput');
		bindContentEditable = $.bindTo('#fixture #contentEditable');
		bindSelect = $.bindTo('#fixture select');
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
			assert.equal(typeof bindText.set, 'function');
			assert.equal(typeof bindText.get, 'function');
			assert.equal(typeof bindText.onChange, 'function');
		});
		test('It should grab the initial value by default', function () {
			
		});
	});
	suite('set', function () {

	});
	suite('get', function () {

	});
	suite('onChange', function () {

	});
});