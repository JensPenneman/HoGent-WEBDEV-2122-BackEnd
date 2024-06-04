const winston = require("winston");
const {
		  combine,
		  timestamp,
		  colorize,
		  printf,
	  }       = winston.format;

let logger;

const developmentFormat = () => {
	const formatMessage = ({
							   level,
							   message,
							   timestamp,
							   name = "server",
							   ...rest
						   }) => `${timestamp} | ${name} | ${level} | ${message} | ${JSON.stringify(rest)}`;
	const formatError   = ({
							   error: {stack},
							   ...    rest
						   }) => `${formatMessage(rest)}\n\n${stack}\n`;
	const format        = (info) => info.error instanceof Error ? formatError(info) : formatMessage(info);
	return combine(
		colorize(), timestamp(), printf(format),
	);
};
const productionFormat  = () => {
	const formatMessage = ({
							   level,
							   message,
							   timestamp,
						   }) => `${timestamp} | ${level} | ${message}`;
	const formatError   = ({
							   error: {stack},
							   ...    rest
						   }) => `${formatMessage(rest)}\n\n${stack}\n`;
	const format        = (info) => info.error instanceof Error ? formatError(info) : formatMessage(info);
	return combine(
		colorize(), timestamp(), printf(format),
	);
};

const getLogger = () => {
	if (!logger) throw new Error("You must first initialize the logger");
	return logger;
};

const getChildLogger = (name, meta = {}) => {
	const logger       = getLogger();
	const previousName = logger.defaultMeta?.name;

	return logger.child({
							name: previousName ? `${previousName}.${name}` : name,
							previousName,
							...meta,
						});
};

const initializeLogger = ({
							  level,
							  disabled,
							  isProduction,
							  defaultMeta = {},
							  extraTransportOptions = [],
						  }) => {
	logger = winston.createLogger({
									  level,
									  defaultMeta,
									  format:     isProduction ? productionFormat() : developmentFormat(),
									  transports: [
										  new winston.transports.Console({
																			 silent: disabled,
																		 }),
										  ...extraTransportOptions,
									  ],
								  });

	logger.info(`Logger initialized with minimum log level: ${level}`);
};

module.exports = {
	getLogger,
	getChildLogger,
	initializeLogger,
};