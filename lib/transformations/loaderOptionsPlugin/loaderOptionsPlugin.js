const isEmpty = require('lodash/isEmpty');
const findPluginsByName = require('../utils').findPluginsByName;
const createOrUpdatePluginByName = require('../utils').createOrUpdatePluginByName;
const safeTraverse = require('../utils').safeTraverse;

module.exports = function(j, ast) {
	const loaderOptions = {};

	// If there is debug: true, set debug: true in the plugin
	// TODO: remove global debug setting
	// TODO: I can't figure out how to find the topmost `debug: true`. help!
	if (ast.find(j.Identifier, { name: 'debug' }).size()) {
		loaderOptions.debug = true;
	}

	// If there is UglifyJsPlugin, set minimize: true
	if (findPluginsByName(j, ast, ['webpack.optimize.UglifyJsPlugin']).size()) {
		loaderOptions.minimize = true;
	}

	return ast
		.find(j.ArrayExpression)
		.filter(path => safeTraverse(path, ['parent', 'value', 'key', 'name']) === 'plugins')
		.forEach(path => {
			!isEmpty(loaderOptions) &&
			createOrUpdatePluginByName(j, path, 'webpack.LoaderOptionsPlugin', loaderOptions);
		});
};
