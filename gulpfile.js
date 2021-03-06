/* File: gulpfile.js */

// grab our packages
var gulp           = require('gulp'),
    gutil          = require('gulp-util'),
    jshint         = require('gulp-jshint'),
    concat         = require('gulp-concat'),
    cssmin         =  require('gulp-minify-css'),
    uglify         = require('gulp-uglifyjs'),
    less           =  require('gulp-less'),
    sourcemaps     = require('gulp-sourcemaps'),
    connect        = require('gulp-connect'),
    browserify     = require('browserify'),
    bower          = require('gulp-bower'),
    source         = require('vinyl-source-stream'),
    buffer         = require('vinyl-buffer'),
    mainBowerFiles = require('main-bower-files'),
    addSrc         = require('gulp-add-src');


var config = {
        appFolder : "app",
        jsSourceFolder : "source/javascript",
        lessSourceFolder : "less",
        publicAssetsFolder : "public/assets",
        bowerDir : "bower_components"
    };


//Starts up a server
gulp.task('connect', function () {
    connect.server({
        root: 'public',
        port: 4000
    })
});

// configure the jshint task
gulp.task('jshint', function() {
    return gulp.src(config.lessSourceFolder + '/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});


// Transform less file into css and write it into the public folder
gulp.task('less', function(){

   return gulp.src(mainBowerFiles({ filter: new RegExp('.*less$', 'i') }))
        .pipe(less())
        .on('error', gutil.log)
        .pipe(concat("main.css"))
        .pipe(addSrc(config.lessSourceFolder + '/**/*.less'))
        .pipe(less())
        .pipe(gutil.env.type === 'production' ? cssmin() : gutil.noop())
        .pipe(gutil.env.type === 'production' ? concat("main.min.css") : concat("main.css"))
        .pipe( gulp.dest(config.publicAssetsFolder + '/stylesheets'));



});

//Bundles app.js content into a single minified main.js file
gulp.task('browserify', function() {
    // Grabs the app.js file
    return browserify(config.appFolder + '/app.js')
        // bundles it and creates a file called main.js
        .bundle()
        .pipe(gutil.env.type === 'production' ? source('main.min.js') : source('main.js'))
        .pipe(buffer())
        .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
        // saves it the public/js/ directory
        .pipe(gulp.dest(config.publicAssetsFolder + '/javascript/'));
});


gulp.task('libs', function() {
    // mainBowerFiles is used as a src for the task,
    // usually you pipe stuff through a task
   return gulp.src(mainBowerFiles({ filter: new RegExp('.*js$', 'i') }))
        // Then pipe it to wanted directory, I use
       .pipe(gutil.env.type === 'production' ? concat('libs.min.js') : concat('libs.js'))
        // dist/lib but it could be anything really
        .pipe(buffer())
        .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
        .pipe(gulp.dest(config.publicAssetsFolder + '/libs'));
});

// Watch for changes to javascript files
gulp.task('watch', function() {
    gulp.watch(config.jsSourceFolder + '/**/*.js', ['jshint']);
    gulp.watch(config.appFolder + '/**/*.js', ['browserify']);
    gulp.watch(config.lessSourceFolder + '**/*.less', ['less']);
});


// define the default task and add the watch task to it
gulp.task('default', ['build']) // development

gulp.task('build', ['libs', 'less', 'browserify', 'watch', 'connect']) // build for production
