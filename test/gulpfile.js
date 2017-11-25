var gulp = require('gulp');
var lintworm = require('../index');


gulp.task('lintworm:error', function (cb) {
    console.log('Should find one error.');
    return gulp.src(['./files/error.txt'])
        .pipe(lintworm([
            { string: 'ERROR', level: 'error' }
        ])).on('end', cb);
});

gulp.task('lintworm:warn', function (cb) {
    console.log('Should find one warning.');
    return gulp.src(['./files/warning.txt'])
        .pipe(lintworm([
            { string: 'WARNING', level: 'warn' }
        ])).on('end', cb);
});

gulp.task('lintworm:none', function (cb) {
    console.log('Should find no error and no warning.');
    return gulp.src(['./files/none.txt'])
        .pipe(lintworm([
            { string: 'ERROR', level: 'error' },
            { string: 'WARNING', level: 'warn' }
        ])).on('end', cb);
});

gulp.task('lintworm:skip-error', function (cb) {
    console.log('Should find nothing.');
    return gulp.src(['./files/error.txt'])
        .pipe(lintworm([
            { string: 'ERROR', level: 'error', files: 'notfound.txt' }
        ])).on('end', cb);
});

gulp.task('lintworm:filter-text', function (cb) {
    console.log('Should find two warnings in error.txt and warning.txt and no error.');
    return gulp.src(['./files/*.txt'])
        .pipe(lintworm([
            { string: 'TEXT', level: 'warn', files: 'files/{warning,error}.txt' },
            { string: 'ERROR', level: 'error', files: 'files/none.txt' }
        ])).on('end', cb);
});

gulp.task('lintworm:all', [
    'lintworm:error',
    'lintworm:warn',
    'lintworm:none',
    'lintworm:skip-error',
    'lintworm:filter-text'
]);