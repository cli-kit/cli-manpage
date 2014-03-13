var exec = require('child_process').exec;
var path = require('path');
var pages = require('./pages');
var write = require('./write');

function standalone(req, callback) {
  process.env.CLI_TOOLKIT_HELP_STYLE='man';
  process.env.CLI_TOOLKIT_MAN_PUBLISH=true;
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
  this.log.info('exec %s', cmd);
  exec(cmd, function(err, stdout, stderr) {
    if(err) {
      return scope.raise(err);
    }
    write(file, errstream ? stderr : stdout, function(err) {
      if(err) {
        return scope.raise(err);
      }
      scope.log.info('wrote %s', file);
      if(callback) callback();
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
  standalone.call(this, req, function() {
    process.env.CLI_TOOLKIT_HELP_STYLE='json';
    json.call(scope, req, function(err, document) {
      if(err) {
        return scope.raise(err);
      }
      var doc = null;
      try {
        doc = JSON.parse(document);
      }catch(e) {
        return scope.raise(e);
      }
      var hasCommands = doc.commands
        && Object.keys(doc.commands).length > 0;
      if(hasCommands) {
        pages.call(scope, req, doc, function(err) {
          if(err) {
            return scope.raise(err);
          }
        });
      }
    });
  });
}

module.exports = function build(req) {
  if(this.standalone) {
    return standalone.call(this, req);
  }
  all.call(this, req);
}
