module.exports = {
	extends: "leankit/test",
	rules: {
		strict: "off",
		"new-cap": 0,
		"no-template-curly-in-string": "off"
	},
	globals: {
		proxyquire: true,
		postal: true,
		should: true,
		expect: true,
		_: true,
		sinon: true,
		getWhistlepunk: true,
		stubConsoleMethods: true,
		restoreConsoleMethods: true
	}
};
