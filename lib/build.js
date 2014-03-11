var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');

function write(path, contents, callback) {
  fs.writeFile(path, contents, function(err) {
    callback(err);
  })
}

function standalone(req) {
  var scope = this;
  var output = this.output;
  var section = this.section || '1';
  var args = req.args.slice(0);
  var file = path.join(output, path.basename(args[0]) + '.' + section);
  var arg = this.argument || '--help';
  if(!~args.indexOf(arg)) {
    args.push(arg);
  }
  var errstream = this.err === true;
  var cmd = args.join(' ');
  this.log.info('directory %s', output);
  this.log.info('file %s', file);
  exec(cmd, function(err, stdout, stderr) {
    if(err) {
      return scope.raise(err);
    }
    //process.stdout.write(errstream ? stderr : stdout);
    write(file, errstream ? stderr : stdout, function(err) {
      if(err) {
        return scope.raise(err);
      }
      scope.log.info('wrote %s', file);
    });
  })
}

function json(req, callback) {
  var args = req.args.slice(0);
  var arg = this.argument || '--help';
  if(!~args.indexOf(arg)) {
    args.push(arg);
  }
  var errstream = this.err === true;
  var cmd = args.join(' ');
  exec(cmd, function(err, stdout, stderr) {
    callback(err, errstream ? stderr : stdout);
  })
}

function all(req) {
  var scope = this;
  standalone.call(this, req)
  process.env.CLI_TOOLKIT_HELP_STYLE='json';
  json.call(this, req, function(err, document) {
    if(err) {
      return scope.raise(err);
    }
    var doc = null;
    try {
      doc = JSON.parse(document);
    }catch(e) {
      return scope.raise(e);
    }
    console.dir(doc);
  });
}

module.exports = function build(req) {
  process.env.CLI_TOOLKIT_HELP_STYLE='man';
  if(this.standalone) {
    return standalone.call(this, req);
  }
  all.call(this, req);
}
