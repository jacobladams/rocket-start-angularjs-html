/// <binding AfterBuild='build' />
var gulp = require('gulp');
var args = require('yargs').argv;
var browserSync = require('browser-sync');
var config = require('./gulp.config')();
var del = require('del');
var merge = require('merge-stream');
// var eventStream = require('event-stream');
//var streamQueue = require('streamqueue');
var path = require('path');
//var _ = require('lodash');
var $ = require('gulp-load-plugins')({ lazy: true });
var port = process.env.PORT || config.browserSync.port;

//todo: 
//    javascript
//      minify
//      concat
//    sass
//      minify
//      concat
//      autoprefix?
//    images
//      min
//    html
//      assemble
//      min
//    browsersync




gulp.task('clean', function () {
    return clean(config.build);
});

gulp.task('clean-scripts', function (done) {
    return clean(config.scripts.clean, done);
});


gulp.task('clean-shared-scripts', function (done) {
    return clean(config.sharedScripts.clean, done);
});

gulp.task('clean-fonts', function (done) {
    return clean(config.fonts.clean, done);
});

gulp.task('clean-images', function (done) {
    //clean(config.build + 'images/**/*.*');
    return clean(config.images.clean, done);
});

gulp.task('clean-styles', function (done) {
    return clean(config.styles.clean, done);
});

// gulp.task('clean-html', function (done) {
//     return clean(config.htmlClean);
// });


gulp.task('build-shared-scripts', gulp.series('clean-shared-scripts', function () {

    log('Compiling shared JavaScript, minifying, and creating sourcemaps');

    return gulp.src(config.sharedScripts.src)
        .pipe($.plumber())        
        .pipe($.sourcemaps.init({loadMaps: true})) // This means sourcemaps will be generated 
        .pipe($.concat(config.sharedScripts.buildFileName))
        .pipe($.uglify()) // You can use other plugins that also support gulp-sourcemaps 
        .pipe($.sourcemaps.write('./')) // Now the sourcemaps are added to the .js file 
        .pipe(gulp.dest(config.sharedScripts.build));
}));


gulp.task('build-scripts', gulp.series('clean-scripts', function () {

    var tsProject = $.typescript.createProject("tsconfig.json", {
        outFile: config.scripts.buildFileName
    });

    log('Compiling Angular template cache');    

    var templateCache = gulp.src(config.angularTemplates.src)
        //.pipe($.plumber())
        //.pipe($.sourcemaps.init({ loadMaps: true })) // This means sourcemaps will be generated     
        .pipe($.angularTemplatecache(config.angularTemplates.options));
    

    log('Compiling typescript, minifying, and creating sourcemaps');


    var typeScript = merge(tsProject.src())
        //.pipe($.plumber())
        //.pipe($.sourcemaps.init({ loadMaps: true })) // This means sourcemaps will be generated 
        .pipe(tsProject()).js;
    

   return merge(typeScript, templateCache)
    //return eventStream.merge(typeScript, templateCache)
    //return streamQueue(typeScript, templateCache)
    //return typeScript
        .pipe($.concat(config.scripts.buildFileName))    
        .pipe($.uglify()) // You can use other plugins that also support gulp-sourcemaps 
        .pipe($.sourcemaps.write('./')) // Now the sourcemaps are added to the .js file 
        .pipe(gulp.dest(config.scripts.build));
}));


gulp.task('build-shared-styles', function () {

    log('Compiling shared style, minifying, and creating sourcemaps');

    return gulp.src(config.styles.shared)
        .pipe($.plumber())        
        .pipe($.sourcemaps.init({ loadMaps: true })) // This means sourcemaps will be generated 
        .pipe($.sass())
        .pipe($.concat(config.styles.sharedFileName))
        .pipe($.csso()) // You can use other plugins that also support gulp-sourcemaps 
        .pipe($.sourcemaps.write('./')) // Now the sourcemaps are added to the .js file 
        .pipe(gulp.dest(config.styles.build));
});

gulp.task('build-styles', gulp.series(['clean-styles', gulp.parallel('build-shared-styles', function () {
    log('Compiling styles, minifying, and creating sourcemaps');

    return gulp.src(config.styles.src)
        .pipe($.plumber())        
        .pipe($.sourcemaps.init({ loadMaps: true })) // This means sourcemaps will be generated 
        .pipe($.sass())
        .pipe($.concat(config.styles.buildFileName))
        .pipe($.csso()) // You can use other plugins that also support gulp-sourcemaps 
        .pipe($.sourcemaps.write('./')) // Now the sourcemaps are added to the .js file 
        .pipe(gulp.dest(config.styles.build));
})]));

gulp.task('images', gulp.series(['clean-images', function () {
    log('Copying and compressing the images');

    return gulp
        .src(config.images.src)
        .pipe($.imagemin({optimizationLevel: 4}))
        .pipe(gulp.dest(config.images.build));
}]));

gulp.task('fonts', gulp.series(['clean-fonts', function () {
    log('Copying fonts');

    return gulp
        .src(config.fonts.src)
        .pipe(gulp.dest(config.fonts.build));
}]));

gulp.task('build', gulp.parallel(['build-scripts', 'build-shared-scripts', 'build-styles',  'images', 'fonts']));

gulp.task('watch-scripts', function (done) {
    gulp.watch([config.scripts.watch], gulp.series(['build-scripts', function (done) {
        browserSync.reload();
        done();
    }]));
    done();
});

gulp.task('watch-styles', function (done) {
    gulp.watch([config.styles.watch], gulp.series(['build-styles', function (done) {
        browserSync.reload();
        done();
    }]));
    done();
});

// gulp.task('watch', gulp.parallel(['watch-scripts', 'watch-styles', 'watch-html', 'watch-images']))
gulp.task('watch', gulp.parallel(['watch-scripts', 'watch-styles']))

gulp.task('browsersync', function (done) {
    startBrowserSync(done);
});

gulp.task('serve-build', gulp.series(['build', gulp.parallel(['watch', 'browsersync'])]));





// // function watch(done) {
// //    // return gulp.watch([config.sass, config.js, config.html, config.images, config.htmlLayouts], gulp.series(['build']));
// //     return gulp.watch([config.sass, config.js, config.html, config.images], gulp.series(['build', browserSync.reload]));
// //     done();
// // }

function startBrowserSync( done) {
    log('first ' + port);
    if (args.nosync || browserSync.active) {
        return;
    }

    log('Starting browser-sync on port ' + port);

    //    if (specRunner) {
    //        options.startPath = config.specRunnerFile;
    //    }

    //    browserSync(options);

    browserSync.init(config.browserSync);
    done();
    // browserSync(options, done);
}


function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    return del(path, done);
}

function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}
