var exec = require('child_process').exec;

module.exports = function print(req) {
  var scope = this;
  process.env.CLI_TOOLKIT_HELP_STYLE='man';
  var args = req.args.slice(0);
  var arg = this.argument || '--help';
  if(!~args.indexOf(arg)) {
    args.push(arg);
  }
  var errstream = this.err === true;
  var cmd = args.join(' ');
  exec(cmd, function(err, stdout, stderr) {
    if(err) {
      return scope.raise(err);
    }
    process.stdout.write(errstream ? stderr : stdout);
  })
}
