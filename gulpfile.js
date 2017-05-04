var gulp = require('gulp');


/* COMPASS - CSS */
var compass = require('gulp-compass');
var cleanCSS = require('gulp-clean-css');

gulp.task('compass', function() {
    gulp.src('./angular2/sass/app.scss')
        .pipe(compass({
            css: './angular2/css/',
            sass: './angular2/sass/',
            image: 'assets/images'
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./www/css/'));
});

var embedTemplates = require('gulp-angular-embed-templates');

/* INLINE TPL IN ANGULAR COMPONENT */
gulp.task('tpl', function(cb) {
    return gulp.src('./angular2/src/**/*.component.ts')
                .pipe( embedTemplates({sourceType:'ts'}) )
                .pipe( gulp.dest('./_dist') );
});
/* COPY OTHER TS FILES */
gulp.task('copy', ['tpl'], function (cb) {
    return gulp.src(['./angular2/src/**/*.ts', '!./angular2/src/**/*.component.ts', './angular2/css/**/*.css'])
                .pipe(gulp.dest('./_dist'));
});

/* WEBPACK BUILD */
var exec = require('child_process').exec;

gulp.task('build-dev', ['copy'], function (cb) {
    return exec('npm run build:dev', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
    });
});
gulp.task('build-prod', ['copy'], function (cb) {
    return exec('npm run build:prod');
});

/* REMOVE _DIST */
var del = require('del');
gulp.task('clean', ['build-dev'], function (cb) {
    return del([
        '_dist'
    ])
});

/* MAIN TASK */
gulp.task('dev', [
    'tpl',
    'copy',
    'build-dev',
    'clean'
]);

gulp.task('prod', [
    'clean',
    'compass',
    'tpl',
    'copy',
    'build-prod'
]);

