var fs = require('fs');
var path = require('path');
var util = require('util');
var glue = require('cli-interface');
var CommandInterface = glue.CommandInterface;
var cli = glue.cli, help = cli.help;

var print = require('./print');
var build = require('./build');

var ManualPage = function() {
  CommandInterface.apply(this, arguments);
}

util.inherits(ManualPage, CommandInterface);

ManualPage.prototype.configure = function() {
  var options = {
    commands: {
    },
    options: {
      output: cli.types.file('d')
    }
  }
  var file = path.join(__dirname, 'manpage.md');
  var conf = {
    load: {
      file: file, options: options
    },
    substitute: {enabled: true},
    manual: {
      dir: path.normalize(path.join(__dirname, '..', 'doc', 'man'))
    }
  }
  this
    .configure(conf)
    .usage();
}

ManualPage.prototype.use = function() {
  this
    .use(cli.middleware.color)
    .use(cli.middleware.manual)
    .use(cli.middleware.logger, null);
  this.converter(cli.types.file('efx'));
}

ManualPage.prototype.on = function() {
  this
    .once('load', function(req) {
      this.help().version();
    })
    .once('empty', function(req) {
      help.call(this);
    })
    .once('complete', function(req) {
      if(!this.output) {
        return print.call(this, req);
      }
      build.call(this, req);
    })
}

module.exports = function(pkg) {
  return new ManualPage(pkg);
}
