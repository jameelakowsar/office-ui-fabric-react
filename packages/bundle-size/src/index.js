const yargs = require('yargs');

const cliSetup = yargs
  .commandDir('commands')
  .option('quiet', {
    alias: 'v',
    type: 'boolean',
    description: 'Suppress verbose build output',
    default: false,
  })
  .version(false).argv;

module.exports = cliSetup;
