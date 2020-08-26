/**
 * Server setup
*/
const debug = require('debug')('app:Index');
const chalk = require('chalk');
const config = require('./appconfigs/config')();

const app = require('./appconfigs/express');

// module.parent check is required to support mocha watch

if (!module.parent) {
  app.listen(config.port, (err) => {
    if (err) {
      debug(chalk.red('Cannot run!'));
    } else {
      debug(
        chalk.green.bold(
          `
        Yep this is working 🍺
        Server is listening on port: ${config.port} 🍕
        Environment: ${config.env} 🦄
        Browse to localhost:${config.port}
      `,
        ),
      );
    }
  });
}

// process.on('SIGINT', () => process.exit(1));
