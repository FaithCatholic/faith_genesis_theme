'use strict';

var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var importer = require('node-sass-globbing');
var livereload = require('gulp-livereload')
var plumber = require('gulp-plumber');
var sass = require('gulp-sass')(require('sass')); 
var sourcemaps = require('gulp-sourcemaps');
var stripCssComments = require('gulp-strip-css-comments');
var uglify = require('gulp-uglify');
var googleWebFonts = require('gulp-google-webfonts');

var sass_config = {
  importer: importer,
  includePaths: [
    'node_modules/breakpoint-sass/stylesheets/',
    'node_modules/singularitygs/stylesheets/',
    'node_modules/modularscale-sass/stylesheets',
    'node_modules/compass-mixins/lib/'
  ]
};

// Google webfonts
gulp.task('fonts', function () {
  return gulp.src('./fonts.list')
    .pipe(googleWebFonts({}))
    .pipe(gulp.dest('./fonts'));
});

gulp.task('glyphs', function() {
   gulp.src('./bootstrap/assets/fonts/bootstrap/*.{ttf,woff,woff2,eot,eof,svg}')
   .pipe(gulp.dest('./fonts/bootstrap'));
});

// Uglifies javascript
gulp.task('uglify', function() {
  return gulp.src('scripts/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('js'));
});

// Compiles sass
gulp.task('sass', function () {
  return gulp.src('./scss/**/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass(sass_config).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 version']
    }))
    .pipe(stripCssComments({preserve: false}))
    // .pipe(cssmin())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./css'));
});

// Type "gulp" in the cli to watch
gulp.task('default', function(){
  livereload.listen();
    gulp.watch('./scss/**/*.scss', gulp.series('sass'));
    gulp.watch('./js/*.js', gulp.series('uglify'));
    gulp.watch('./fonts.list', gulp.series('fonts'));
    gulp.watch(['./css/style.css', './**/*.twig', './scripts/*.js'], function (files){
      livereload.changed(files)
    });
});
