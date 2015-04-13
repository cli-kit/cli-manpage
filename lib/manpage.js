var fs = require('fs')
  , path = require('path')
  , util = require('util')
  , CommandInterface = require('cli-interface').CommandInterface
  , cli = require('cli-command')
  , types = require('cli-types')
  , print = require('./print')
  , build = require('./build');

var ManualPage = function() {
  // quick hack, name is not currently overriding package descriptor
  var pkg = arguments[0];
  pkg.name = arguments[2];
  CommandInterface.apply(this, arguments);
}

util.inherits(ManualPage, CommandInterface);

ManualPage.prototype.configure = function() {
  var options = {
    commands: {},
    options: {
      output: types.file('d')
    }
  }
  var file = path.join(__dirname, 'manpage.md');
  var conf = {
    compiler: {
      input: [file],
      definition: options
    },
    manual: {
      dir: path.normalize(path.join(__dirname, '..', 'doc', 'man')),
      dynamic: true
    }
  }
  this
    .configure(conf)
    .usage();
}

ManualPage.prototype.use = function() {
  this
    .use(require('cli-mid-color'))
    .use(require('cli-mid-manual'))
    .use(require('cli-mid-logger'), null);
  this.converter(cli.types.file('efx'));
}

ManualPage.prototype.on = function() {
  this
    .once('load', function(req) {
      this.help('-h, --help').version();
    })
    .once('empty', function(help, version, req) {
      help.call(this, false, req);
    })
    .once('complete', function(req) {
      if(!this.output) {
        return print.call(this, req);
      }
      build.call(this, req);
    })
}

module.exports = function(pkg, name, description) {
  return new ManualPage(pkg, name, description);
}
