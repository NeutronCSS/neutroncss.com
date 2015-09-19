var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var concat = require('gulp-concat');
var bower = require('gulp-bower');
var browserSync = require('browser-sync').create()
	  
var config = {
	path: {
		root: "./",
		bower: "./assets/built/",
		sass: "./assets/css/**/*.scss",
		built: "./assets/built",
		js: "./assets/js/*.js"
	}
}

// SASS
gulp.task('sass', function() {
    return sass(config.path.sass, {style: 'expanded'})
	.on('error', sass.logError)
    .pipe(gulp.dest(config.path.built));
});

// Scripts concatenation
gulp.task('scripts', function() {
  return gulp.src(config.path.js)
    .pipe(concat('app.js'))
    .pipe(gulp.dest(config.path.built));
});

// Bower Setup
gulp.task('bower', function() {
  return bower(config.path.built)
    .pipe(gulp.dest(config.path.built))
});

// Run browsersync server
gulp.task('serve', ['sass', 'scripts'], function () {

    browserSync.init({
        server: config.path.root
    });

    gulp.watch(config.scss, ['sass']).on('change', browserSync.reload);
    gulp.watch(config.appJavaScript, ['scripts']).on('change', browserSync.reload);
    gulp.watch(config.source + '/**/*.html').on('change', browserSync.reload);

});

//Default task
gulp.task('setup', ['sass', 'bower', 'scripts']);

// Watch tasks
gulp.task('watch',function() {
    gulp.watch(config.path.sass, ['sass']);
    gulp.watch(config.path.js, ['scripts']);
});

//Default task
gulp.task('default', ['sass', 'scripts', 'serve', 'watch']);
