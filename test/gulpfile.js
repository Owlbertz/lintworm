var gulp = require('gulp');
var lintworm = require('../index');


gulp.task('lintworm:error', function (cb) {
    console.log('Should find one error.');
    return gulp.src(['./files/error.txt'])
        .pipe(lintworm([
            { string: 'ERROR', level: 'error' },
            { string: 'WARNING', level: 'warn' }
        ])).on('end', cb);
});

gulp.task('lintworm:warn', function (cb) {
    console.log('Should find one warning.');
    return gulp.src(['./files/warning.txt'])
        .pipe(lintworm([
            { string: 'ERROR', level: 'error' },
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

gulp.task('lintworm:all', ['lintworm:error', 'lintworm:warn', 'lintworm:none']);