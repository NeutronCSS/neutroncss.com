var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var concat = require('gulp-concat');
var bower = require('gulp-bower');
var browserSync = require('browser-sync').create()
var autoprefixer = require('gulp-autoprefixer');
var del = require('del');

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

// Clear built folder
gulp.task('clean', function (cb) {
	del([
		'assets/built/**/*',
		'!assets/built/.gitkeep'
	], cb(err));
});

// SASS Compilation
gulp.task('sass', ['clean'], function(cb) {
    return sass(config.path.sass, {style: 'expanded'})
	.pipe(autoprefixer({
		browsers: ['last 2 versions'],
		cascade: false,
		remove: false
	}))
    .pipe(gulp.dest(config.path.built))
	.on('error', sass.logError);
	
	cb(err);
});

// Scripts Concatenation
gulp.task('scripts', ['clean'], function(cb) {
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

// Build assets
gulp.task('build', function(cb) {
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
