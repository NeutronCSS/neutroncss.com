var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var concat = require('gulp-concat');
var bower = require('gulp-bower');
var browserSync = require('browser-sync').create()
var err = null; //Used for callback error tracking	 
	  
var config = {
	path: {
		root: "./",
		bower: "./assets/built/",
		sass: "./assets/css/**/*.scss",
		built: "./assets/built",
		js: "./assets/js/*.js"
	}
}

// SASS Compilation
gulp.task('sass', function(cb) {
    return sass(config.path.sass, {style: 'expanded'})
	.on('error', sass.logError)
    .pipe(gulp.dest(config.path.built));
	
	cb(err);
});

// Scripts Concatenation
gulp.task('scripts', function(cb) {
  return gulp.src(config.path.js)
    .pipe(concat('app.js'))
    .pipe(gulp.dest(config.path.built));
	
	cb(err);
});

// Bower Setup
gulp.task('bower', function(cb) {
  return bower(config.path.built)
    .pipe(gulp.dest(config.path.built));
	
	cb(err);
});

// Run browsersync server
gulp.task('browsersync', ['sass', 'scripts', 'bower'], function (cb) {
    browserSync.init({
        server: config.path.root
    });
	
	cb(err);
});

// Watch tasks
gulp.task('watch', ['browsersync'], function() {
    gulp.watch(config.path.sass, ['sass']).on('change', browserSync.reload);
    gulp.watch(config.path.js, ['scripts']).on('change', browserSync.reload);
    gulp.watch(config.path.root + '/**/*.html').on('change', browserSync.reload);
});

//Default task
gulp.task('default', ['watch']);
