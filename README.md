# Lintworm

Gulp plugin to lint all kind of files based on keywords.

[![NPM](https://nodei.co/npm/lintworm.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/lintworm/)

## Usage
![Usage exmple](https://media.giphy.com/media/xUOxf943vMcwDpv8K4/giphy.gif)

Install Lintworm using npm:
```
npm install lintworm --save-dev
```

Then use it in your Gulp tasks:

```javascript
var gulp = require('gulp');
var lintworm = require('lintworm');

gulp.task('lintworm', function() {
    return gulp.src(['./src/**/*'])
           .pipe(lintworm(strings, options));
});
```

## Parameter
The following parameter can be passed to the plugin:

### strings
The strings to find in the given files.

This can either be flat array of strings or regular expressions:
```javascript
['TODO', /[Ff]ixme/]
```

or it can be an array of objects:
```javascript
[{
    string: 'TODO',
    level: 'error' // Override default level for this string
    file: 'src/*.js' // Specify files to check with this keyword using glob pattern
}]
```

### options
The following options can be passed additionally:

#### level
The default level of reported findings.

Default value is `'warn'`.

#### failOnError
Whether the task should fail if at least one finding with error level is found.

Default value is `true`.

## Full example
The following gulp-task
```javascript
var gulp = require('gulp');
var lintworm = require('lintworm');

gulp.task('lintworm', function() {
    return gulp.src(['./src/**/*'])
        .pipe(lintworm([
            // Warn for TODOs in general
            'TODO',
            // Warn for @ts-ignore statements that contain an explanation
            /@ts-ignore\s+\w+/,
            // Error on @ts-ignore statements that do not contain an explanation
            {string: /@ts\-ignore$/, level: 'error'},
            // Warn on skipped tests in spec-files
            {string: 'skip', level: 'warn', file: '*.spec.ts'}
        ]));
});
```
might output this:
```
/path/to/files/src/index.js (2)
	[25]	// TODO: A dynamically upper bound is required.
	[30]	// @ts-ignore

------------------------------------------------------------
Found 1 error and 1 warning.
```