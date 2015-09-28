var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create()
var autoprefixer = require('gulp-autoprefixer');
var del = require('del');

var err = null; //Used for callback error tracking	 
	  
var config = {
	path: {
		root: "./",
		bower: "./assets/built/",
		css: "./assets/css/**/*.css",
		sass: "./assets/css/**/*.scss",
		built: "./assets/built",
		js: "./assets/js/*.js"
	}
}

// SASS Compilation
gulp.task('css', function(cb) {
    sass(config.path.sass, {style: 'expanded'})
	.pipe(autoprefixer({
		browsers: ['last 2 versions'],
		cascade: false,
		remove: false
	}))
    .pipe(gulp.dest(config.path.built))
	.on('error', sass.logError);
	
	gulp.src(config.path.css)
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

// Run browsersync server
gulp.task('browsersync', ['css', 'scripts'], function (cb) {
    browserSync.init({
        server: config.path.root
    });
	
	cb(err);
});

// Watch tasks
gulp.task('watch', ['browsersync'], function() {
    gulp.watch(config.path.sass, ['css']).on('change', browserSync.reload);
    gulp.watch(config.path.js, ['scripts']).on('change', browserSync.reload);
    gulp.watch(config.path.root + '/**/*.html').on('change', browserSync.reload);
});

//Default task
gulp.task('default', ['watch']);
