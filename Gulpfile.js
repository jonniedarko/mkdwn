var gulp = require('gulp'),
	plugins = require('gulp-load-plugins')(),
	notify = require('gulp-notify'),
	inject = require('gulp-inject'),
	wiredep = require('wiredep'),
	browserSync = require('browser-sync'),
	reload      = browserSync.reload;

gulp.task('webserver', function() {
	//connect.server({port:3000, root: 'public', livereload: true });
	browserSync({
		server: "app"
	});
});


gulp.task('vendor-scripts', function() {

	return gulp.src(wiredep().js)

		.pipe(gulp.dest('app/vendor/'));

});

gulp.task('vendor-css', ['install'], function() {

	return gulp.src(wiredep().css)

		.pipe(gulp.dest('app/vendor/'));

});


gulp.task('wiredep', ['vendor-scripts'],function () {

	return gulp.src('app/index.html')
		.pipe(wiredep.stream({
			html: {
				replace: {
					js: function (filePath) {
						return '<script src="' + 'vendor/' + filePath.split('/').pop() + '"></script>';
					},
					css: function (filePath) {
						return '<link rel="stylesheet" href="' + 'vendor/' + filePath.split('/').pop() + '"/>';
					}
				}
			}
		}))
		.pipe(inject(
			gulp.src(['app/vendor/**/*.js'], { read: false }), {
				addRootSlash: false,
				starttag: '<!-- bower:{{ext}} -->',
				relative: true
			}))
		.pipe(gulp.dest('app'))
});

gulp.task('inject', function () {
	var target = gulp.src('./app/index.html');
	// It's not necessary to read the files (will speed up things), we're only after their paths:
	var sources = gulp.src(['app/**/*.js', 'app/**/*.css', '!app/vendor/*.js'], {read: false});

	return target.pipe(inject(sources, { addRootSlash: false, starttag: '<!-- inject:{{ext}} -->', relative: true}))
		.pipe(gulp.dest('./app'));
});

gulp.task('reload', function() {
	notify({message: 'reloading...'});
	reload();
	//server.changed(file.path);
});

gulp.task('watch', function() {


	gulp.watch(['./app/*.html'], ['reload']);
	gulp.watch(['app/*.js', 'app/**/*.js'], ['wiredep','inject', 'reload']);


});

gulp.task('default', ['wiredep', 'inject', 'webserver','watch']);