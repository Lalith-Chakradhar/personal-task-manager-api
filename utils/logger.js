import winston, { createLogger, transports } from "winston";
import "winston-daily-rotate-file";

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
    new transports.DailyRotateFile({
      filename: "logs/info-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "10m",
      maxFiles: "1d",
      level: "info",
      format: combine(
        timestamp(),
        formattedInfoLog,
      ),
    }),
    new transports.DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "10m",
      maxFiles: "1d",
      level: "error",
      format: combine(
        timestamp(),
        errors({ stack: true }),
        formattedErrorLog,
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
