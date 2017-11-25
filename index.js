var es = require('event-stream');
var colors = require('colors');
var PluginError = require('gulp-util').PluginError;
var through = require('through2');
var minimatch = require('minimatch');

var LOG_LEVELS = {
  WARN: 'warn',
  ERROR: 'error'
};
/**
 * Gulp plugin to check files passed within the event stream for given keywords.
 * 
 * @param {any} searchStrings Keywords to look for.
 * @param {any} options Optional options to modify the behavior.
 * @returns Gulp plugin 
 */
var lintworm = function (searchStrings, options) {
  options = Object.assign({
    failOnError: true, // Whether to exit with non 0 code when at least one error is reported
    level: LOG_LEVELS.WARN // Default log level (possible values are: 'warn', 'error')
  }, options);

  var overallFindingsPerLevel = {};
  overallFindingsPerLevel[LOG_LEVELS.ERROR] = 0;
  overallFindingsPerLevel[LOG_LEVELS.WARN] = 0;

  /**
   * Run the overall report.
   * Will emit an error if conditions are met.
   * 
   */
  function report() {
    var summary = '------------------------------------------------------------\n';
    summary += 'Found ' + overallFindingsPerLevel[LOG_LEVELS.ERROR] + ' errors and ' + overallFindingsPerLevel[LOG_LEVELS.WARN] + ' warnings.';
    var reportColor = 'green';
    if (overallFindingsPerLevel[LOG_LEVELS.ERROR]) {
      reportColor = 'red';
    } else if (overallFindingsPerLevel[LOG_LEVELS.WARN]) {
      reportColor = 'yellow';
    }
    console.log(summary[reportColor]);
    if (overallFindingsPerLevel[LOG_LEVELS.ERROR] && options.failOnError) {
      this.emit('error', new PluginError('lintworm', 'Found ' + overallFindingsPerLevel[LOG_LEVELS.ERROR] + ' errors and ' + overallFindingsPerLevel[LOG_LEVELS.WARN] + ' warnings.'));
    }
  };

  /**
   * Checks the given file based on the search strings provided as arguments.
   * 
   * @param {any} file File to check.
   * @param {any} encoding Encoding of the file.
   * @param {any} cb Callback to call when finished.
   */
  function checkFile(file, encoding, cb) {
    if (file.isBuffer()) {
      var fileContent = file.contents.toString();
      var lines = fileContent.toString(encoding).split(/\r\n|[\n\r\u0085\u2028\u2029]/g);
      var findings = [];
      var currentLineNumber = 0;
  
      while (currentLineNumber < lines.length) { // Check for each line
        var currentLine = lines[currentLineNumber];
        for (var i = 0; i < searchStrings.length; i++) { // Check for each seach string
          var currentSearchStringValue = null;
          var level = options.level;
          var filePattern = null;
  
          if (typeof searchStrings[i] === 'object' && searchStrings[i].hasOwnProperty('string')) { // Object
            currentSearchStringValue = searchStrings[i].string;
            if (searchStrings[i].hasOwnProperty('level')) {
              level = searchStrings[i].level;
            }
            if (searchStrings[i].hasOwnProperty('files')) {
              filePattern = searchStrings[i].files;
            }
          } else { // String or regular expression
            currentSearchStringValue = searchStrings[i];
          }
          if (!currentSearchStringValue) {
            continue;
          }
          if (filePattern) { // If a file pattern is set, check if the file can be skipped
            let relativeFilePath = file.path.replace(process.cwd() + '/', '');
            if (!minimatch(relativeFilePath, filePattern)) {
              continue;
            }
          }
  
          var characterPositionNumber = -1;
          if (typeof currentSearchStringValue === 'string') { // String
            characterPositionNumber = currentLine.indexOf(currentSearchStringValue);
          } else { // Regular expression
            characterPositionNumber = currentLine.search(currentSearchStringValue);
          }
          if (characterPositionNumber !== -1) { // Current line contains current search word
            findings.push({
              line: currentLineNumber + 1,
              column: characterPositionNumber,
              fullLine: currentLine.trim(),
              level: level,
              string: currentSearchStringValue
            });
          }
        }
        currentLineNumber++;
      }
  
  
      if (findings.length > 0) {
        var output = '';
        var outputForAllFindings = '';
        var outputTitle = file.path + ' (' + findings.length + ')\n';
        var errorFoundForFile = false;
        for (var f in findings) {
          var finding = findings[f];
          var outputForFinding = '\t' + '[' + finding.line + ']\t' + finding.fullLine +  '\n';
          outputForAllFindings += outputForFinding[finding.level === LOG_LEVELS.ERROR ? 'red' : 'yellow'];
          overallFindingsPerLevel[finding.level]++;
  
          if (finding.level === LOG_LEVELS.ERROR) {
            errorFoundForFile = true;
          }
        }
  
        output += outputTitle[errorFoundForFile ? 'red' : 'yellow']; // Make title red if at least one error appeared in that file
        output += outputForAllFindings;
  
        console.log(output);
      }
      cb(null, file);
    }
  }

  return through.obj(checkFile, report);
}

module.exports = lintworm;
