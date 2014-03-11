var fs = require('fs');

module.exports = function write(path, contents, callback) {
  fs.writeFile(path, contents, function(err) {
    callback(err);
  })
}
