module.exports = function () {
	var client = '.';
	var clientApp = client + '/app';

	// var temp = './.tmp/';
	var build = './dist';
    // var sassBuild = temp + 'styles/';

	var config = {
		scripts: {
			// src: client + '/app/**.ts',
			build: build + '/scripts',
			buildFileName: 'app.min.js',
			clean: build + '/scripts/**',

			shared: [
				client + '/node_modules/jquery/dist/jquery.js',
				client + '/node_modules/angular/angular.js',
				client + '/node_modules/bootstrap/dist/js/bootstrap.js',
				// client + '/node_modules/kendo-ui-core/js/kendo.ui.core.js',
				client + '/node_modules/moment/moment.js',
				client + '/node_modules/lodash/lodash.js'

			],
			sharedFileName: 'shared.min.js',

		},
		styles: {
			src: client + '/app/app.module.scss',
			build: build + '/styles',
			buildFileName: 'styles.min.css',
			clean: build + '/styles/**',
			shared: [
				// client + '/node_modules/bootstrap/dist/css/bootstrap.css'
				// 'kendo'
				// 'toastr'
			],
			sharedFileName: 'shared.min.css',
		}
	};
	return config;
};
