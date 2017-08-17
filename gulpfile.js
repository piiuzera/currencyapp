var Gulp 			= require('gulp');
var GulpJsHint 		= require('gulp-jshint');
var GulpClean 		= require('gulp-clean');
var GulpUglify		= require('gulp-uglify');
var GulpConcat		= require('gulp-concat');
var GulpRun			= require('run-sequence');

Gulp.task('Clean', function() {
	return Gulp.src('public_html/dist')
		.pipe(GulpClean());
});

Gulp.task('CleanApp', function() {
	return Gulp.src('public_html/dist/js/*.js')
		.pipe(GulpClean());
});

Gulp.task('CleanController', function() {
	return Gulp.src('public_html/dist/js/controllers/**/*.js')
		.pipe(GulpClean());
});

Gulp.task('CleanRoutes', function() {
	return Gulp.src('public_html/dist/js/routes/**/*.js')
		.pipe(GulpClean());
});

Gulp.task('CleanService', function() {
	return Gulp.src('public_html/dist/js/services/**/*.js')
		.pipe(GulpClean());
});

Gulp.task('JsHintAppJs', function() {
	return Gulp.src(['dist/js/*.js'])
		.pipe(GulpJsHint())
		.pipe(GulpJsHint.reporter('default'));
});

Gulp.task('UglifyAppJs', function() {
	return Gulp.src(['dist/js/*.js'])
		.pipe(GulpUglify())
		.pipe(GulpConcat('app.min.js'))
		.pipe(Gulp.dest('public_html/dist/js'));
});

Gulp.task('JsHintControllerJs', function() {
	return Gulp.src(['dist/js/controllers/**/*.js'])
		.pipe(GulpJsHint())
		.pipe(GulpJsHint.reporter('default'));
});

Gulp.task('UglifyControllerJs', function() {
	return Gulp.src(['dist/js/controllers/**/*.js'])
		.pipe(GulpUglify())
		.pipe(GulpConcat('controller.min.js'))
		.pipe(Gulp.dest('public_html/dist/js'));
});

Gulp.task('JsHintRoutesJs', function() {
	return Gulp.src(['dist/js/routes/*.js'])
		.pipe(GulpJsHint())
		.pipe(GulpJsHint.reporter('default'));
});

Gulp.task('UglifyRoutesJs', function() {
	return Gulp.src(['dist/js/routes/*.js'])
		.pipe(GulpUglify())
		.pipe(GulpConcat('routes.min.js'))
		.pipe(Gulp.dest('public_html/dist/js'));
});

Gulp.task('JsHintServiceJs', function() {
	return Gulp.src(['dist/js/services/**/*.js'])
		.pipe(GulpJsHint())
		.pipe(GulpJsHint.reporter('default'));
});

Gulp.task('UglifyServiceJs', function() {
	return Gulp.src(['dist/js/services/**/*.js'])
		.pipe(GulpUglify())
		.pipe(GulpConcat('service.min.js'))
		.pipe(Gulp.dest('public_html/dist/js'));
});

Gulp.task('default', function(totalTime) {
	return GulpRun('Clean', ['JsHintAppJs',
							 'UglifyAppJs',
							 'JsHintControllerJs',
							 'UglifyControllerJs',
							 'JsHintRoutesJs',
							 'UglifyRoutesJs',
							 'JsHintServiceJs',
							 'UglifyServiceJs']);
});

Gulp.task('WatchDefault', function() {
	GulpRun('default');
	
	Gulp.watch(['dist/js/*.js'], function() {
		return GulpRun('CleanApp', ['JsHintAppJs',
								 	'UglifyAppJs']);
	});

	Gulp.watch(['dist/js/controllers/**/*.js'], function() {
		return GulpRun('CleanController', ['JsHintControllerJs',
								 		   'UglifyControllerJs']);
	});

	Gulp.watch(['dist/js/routes/*.js'], function() {
		return GulpRun('CleanRoutes', ['JsHintRoutesJs',
								 	   'UglifyRoutesJs']);
	});

	Gulp.watch(['dist/js/services/**/*.js'], function() {
		return GulpRun('CleanService', ['JsHintServiceJs',
								 		'UglifyServiceJs']);
	});
});

Gulp.task('watch', ['WatchDefault']);