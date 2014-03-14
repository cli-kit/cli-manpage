var async = require('async');
var exec = require('child_process').exec;
var path = require('path');
var write = require('./write');

function page(req, doc, cmd, callback) {
  process.env.CLI_TOOLKIT_HELP_STYLE='man';
  process.env.CLI_TOOLKIT_MAN_PUBLISH=true;
  var scope = this;
  var args = req.args.slice(0);
  var arg = this.argument || 'help';
  if(!~args.indexOf(arg)) {
    args.push(arg);
  }
  args.push(cmd.long);
  var output = this.output;
  var section = this.section || '1';
  var file = path.join(output, cmd.id + '.' + section);
  var errstream = this.err === true;
  this.log.info('file %s', file);
  var command = args.join(' ');
  this.log.info('exec %s', command);
  exec(command, function(err, stdout, stderr) {
    if(err) return callback(err);
    write(file, errstream ? stderr : stdout, function(err) {
      //console.log(stderr);
      //console.log(stdout);
      if(!err) {
        scope.log.info('wrote %s', file);
      }
      callback(err);
    });
  })
}

module.exports = function pages(req, doc, callback) {
  var scope = this;
  var keys = Object.keys(doc.commands);
  this.log.info('commands: %s', keys.join(', '));
  async.eachSeries(keys, function(key, callback) {
    page.call(scope, req, doc, doc.commands[key], callback);
  }, function(err) {
    callback(err);
  })
}
