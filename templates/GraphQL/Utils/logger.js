
const winston = require('winston');
const appRoot = require('app-root-path');

const level = process.env.LOG_LEVEL || 'debug';

const options = {
    file: {
      level: 'info',
      filename: `${appRoot}/logs/app.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    }
  };

const logger = winston.createLogger({
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console({
            level: level,
            timestamp: () => {
                return (new Date()).toISOString();
            }
        })
    ]
});

logger.stream = {
    write: function(message, encoding) {
      // use the 'info' log level so the output will be picked up by both transports (file and console)
      logger.info(message);
    },
  };


module.exports = logger;