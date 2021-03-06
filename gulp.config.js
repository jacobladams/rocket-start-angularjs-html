module.exports = function () {
	var client = '.';
	var clientApp = client + '/app';

	// var temp = './.tmp/';
	var build = './dist';
    // var sassBuild = temp + 'styles/';

    var config = {
		build: build,
		angularTemplates: {
			src: client + '/app/**.html',
			options: {
				module: 'rocket-start-templates',
				standalone:true
			},
			watch: client + '/app/**.html',
        },
		fonts: {
			src: client + '/assets/fonts/**',
			build: build + '/assets/fonts',
			clean: build + '/assets/fonts/**'
		},
		images: {
			src: client + '/assets/images/**',
			build: build + '/assets/images',
			buildFileName: 'sprite.png',
			clean: build + '/assets/image/**'
		},
		scripts: {
			// src: client + '/app/**/*.ts',
			build: build + '/scripts',
			buildFileName: 'app.min.js',
			clean: build + '/scripts/app.min.js',
			watch: client + '/app/**/*.ts',

			// shared: [
			// 	client + '/node_modules/jquery/dist/jquery.js',
			// 	client + '/node_modules/angular/angular.js',
			// 	client + '/node_modules/bootstrap/dist/js/bootstrap.js',
			// 	// client + '/node_modules/kendo-ui-core/js/kendo.ui.core.js',
			// 	client + '/node_modules/moment/moment.js',
			// 	client + '/node_modules/lodash/lodash.js'

			// ],
			// sharedFileName: 'shared.min.js',

		},
		sharedScripts: {
			src: [
				client + '/node_modules/jquery/dist/jquery.js',
				client + '/node_modules/angular/angular.js',
				client + '/node_modules/bootstrap/dist/js/bootstrap.js',
				// client + '/node_modules/kendo-ui-core/js/kendo.ui.core.js',
				client + '/node_modules/moment/moment.js',
				client + '/node_modules/lodash/lodash.js'

			],
			build: build + '/scripts',
			buildFileName: 'shared.min.js',
			clean: build + '/scripts/shared.min.js',
			// watch: client + '/app/**/*.ts',
		},
		styles: {
			src: client + '/app/app.module.scss',
			build: build + '/styles',
			buildFileName: 'styles.min.css',
			clean: build + '/styles/**',
			watch: client + '/app/**/*.scss',
			shared: [
				client + '/node_modules/bootstrap/dist/css/bootstrap.css'
				// 'kendo'
				// 'toastr'
			],
			sharedFileName: 'shared.min.css',
		},
		browserSync: {
			ghostMode: {
				clicks: true,
				location: false,
				forms: true,
				scroll: true
			},
			injectChanges: true,
			logFileChanges: true,
			logLevel: 'debug',
			logPrefix: 'gulp-patterns',
			notify: true,
			reloadDelay: 250,
			server: true,
			port: 3000,
			// server: {
			//     baseDir: config.build
			// }
			browser : ['chrome'],
			// browser : ['chrome', 'edge', 'Internet Explorer', firefox','opera'],
        	startPath: '/index.html',
			// files: [
            // 	build + '/**/*'
        	// ]
		}
	};
	return config;
};
