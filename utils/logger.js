import winston, { createLogger, transports } from "winston";

const { combine, timestamp, errors, printf } = winston.format;

const formattedInfoLog = printf(({ timestamp, level, message, reqMethod, reqUrl })=>{

  return `${timestamp} [${level}] ${message} | Method: ${reqMethod} | URL: ${reqUrl}`;
});

const formattedErrorLog = printf(({ timestamp, level, message, reqMethod, reqUrl, stack })=>{

  return (
    `${timestamp} [${level}] ${message} | Method: ${reqMethod} | URL: ${reqUrl} | Stack: ${stack}`
  );
});

const infoLogger = createLogger({
  transports: [
    new transports.File({
      filename: "server.log",
      level: "info",
      format: combine(
        timestamp(),
        formattedInfoLog,
      ),
    }),
    new transports.File({
      filename: "error.log",
      level: "error",
      format: combine(
        timestamp(),
        errors({ stack: true }),
        formattedErrorLog,
      ),
    }),
  ],
});

export default infoLogger;
