/* File: gulpfile.js */

// grab our packages
var gulp       = require('gulp'),
    gutil      = require('gulp-util'),
    jshint     = require('gulp-jshint'),
    concat     = require('gulp-concat'),
    cssmin      =  require('gulp-minify-css'),
    uglify     = require('gulp-uglifyjs'),
    less        =  require('gulp-less'),
    sourcemaps = require('gulp-sourcemaps');


var jsSourceFolder = "source/javascript",
    publicAssetsFolder = "public/assets",
    lessSourceFolder = "source/less";

// configure the jshint task
gulp.task('jshint', function() {
    return gulp.src(lessSourceFolder + '/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});


// Watch for changes to javascript files
gulp.task('watch', function() {
    gulp.watch(jsSourceFolder + '/**/*.js', ['jshint']);
});

// Builds js into a bundle.js file and writes its uglified content into the public folder
gulp.task('build-js', function() {
    return gulp.src(jsSourceFolder + '/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js'))
        //only uglify if gulp is ran with '--type production'
        .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(publicAssetsFolder + '/javascript'));
});

// Transform less file into css and write it into the public folder
gulp.task('less', function(){
    return gulp.src(lessSourceFolder + '/**/*.less')
        .pipe(sourcemaps.init())  // Process the original sources
        .pipe(less())
        .on('error', gutil.log)
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(publicAssetsFolder + '/stylesheets'));
});


// define the default task and add the watch task to it
gulp.task('default', ['build']) // development

gulp.task('build', ['less', 'build-js', 'watch']) // build for production
