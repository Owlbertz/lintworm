var gulp = require('gulp');
var runSequence = require('run-sequence');
var lintworm = require('../index');


gulp.task('lintworm:error', function () {
    console.log('Should find one error.');
    return gulp.src(['./files/error.txt'])
        .pipe(lintworm([
            { string: 'ERROR', level: 'error' }
        ], {failOnError: false}));
});

gulp.task('lintworm:warn', function () {
    console.log('Should find one warning.');
    return gulp.src(['./files/warning.txt'])
        .pipe(lintworm([
            { string: 'WARNING', level: 'warn' }
        ], {failOnError: false}));
});

gulp.task('lintworm:none', function () {
    console.log('Should find no error and no warning.');
    return gulp.src(['./files/none.txt'])
        .pipe(lintworm([
            { string: 'ERROR', level: 'error' },
            { string: 'WARNING', level: 'warn' }
        ], {failOnError: false}));
});

gulp.task('lintworm:skip-error', function () {
    console.log('Should find no error and no warning.');
    return gulp.src(['./files/error.txt'])
        .pipe(lintworm([
            { string: 'ERROR', level: 'error', files: 'notfound.txt' }
        ], {failOnError: false}));
});

gulp.task('lintworm:filter-text', function () {
    console.log('Should find two warnings in error.txt and warning.txt and no error.');
    return gulp.src(['./files/*.txt'])
        .pipe(lintworm([
            { string: 'TEXT', level: 'warn', files: 'files/{warning,error}.txt' },
            { string: 'ERROR', level: 'error', files: 'files/none.txt' }
        ], {failOnError: false}));
});

gulp.task('lintworm:fail-on-error', function () {
    console.log('Should find one error.');
    return gulp.src(['./files/error.txt'])
        .pipe(lintworm([
            { string: 'ERROR', level: 'error' }
        ], {failOnError: true}));
});

gulp.task('lintworm:all', function(done) {
    runSequence(
        'lintworm:error',
        'lintworm:warn',
        'lintworm:none',
        'lintworm:skip-error',
        'lintworm:filter-text',
        'lintworm:fail-on-error',
        done
    );
});