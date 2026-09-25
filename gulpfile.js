'use strict';

var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var livereload = require('gulp-livereload');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass')(require('sass')); 
var sourcemaps = require('gulp-sourcemaps');
var stripCssComments = require('gulp-strip-css-comments');
var uglify = require('gulp-uglify');
var googleWebFonts = require('gulp-google-webfonts');

// Google Web Fonts
gulp.task('fonts', function () {
  return gulp.src('./fonts.list')
    .pipe(googleWebFonts({}))
    .pipe(gulp.dest('./fonts'));
});

// Minify JavaScript
gulp.task('uglify', function() {
  return gulp.src('scripts/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('js'));
});

// Compile SCSS
gulp.task('sass', function () {
  return gulp.src('./scss/**/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    // Bootstrap 5.3 still uses @import and older Sass functions; hide those
    // deprecation warnings so real errors stand out.
    .pipe(sass({
      quietDeps: true,
      silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'mixed-decls', 'legacy-js-api'],
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 2 versions'],
      cascade: false
    }))
    .pipe(stripCssComments({preserve: false}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./css'))
    .pipe(livereload());
});

// Default Task (Watch Files)
gulp.task('default', function(){
  livereload.listen();
  gulp.watch('./scss/**/*.scss', gulp.series('sass'));
  gulp.watch('./js/*.js', gulp.series('uglify'));
  gulp.watch('./fonts.list', gulp.series('fonts'));
  gulp.watch(['./css/style.css', './**/*.twig', './scripts/*.js']).on('change', livereload.reload);
});
