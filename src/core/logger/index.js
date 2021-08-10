const { createLogger, format, transports } = require('winston');
const { printf } = format;

const myFormat = printf(info => {
  if (info[Symbol.for('splat')]) {
    if (info[Symbol.for('splat')].length > 0) {
      return `[${info.level}][${info.timestamp}]:${getMessageContent(
        info.message
      )} ${getMessageContent(info[Symbol.for('splat')][0])}`;
    }
  }
  return `[${info.level}][${info.timestamp}]:${getMessageContent(
    info.message
  )}`;
});

function getMessageContent(msg) {
  let message = null;
  if (msg) {
    if (typeof msg === 'string') {
      message = msg;
    } else if (typeof msg === 'object') {
      message = JSON.stringify(msg);
    } else {
      message = '';
    }
  } else {
    message = '';
  }
  return message;
}

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.colorize(),
    format.splat(),
    format.simple(),
    myFormat
  ),
  level: 'debug',
  handleExceptions: true,
  defaultMeta: { service: 'user-service' },
  transports: [new transports.Console()]
});

module.exports = logger;
