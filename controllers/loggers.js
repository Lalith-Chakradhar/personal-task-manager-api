import winston from "winston";

const { combine, timestamp, json, prettyPrint, errors } = winston.format;

winston.loggers.add("infoLogger", {
  level: "info",
  format: combine(
    timestamp(),
    json(),
    prettyPrint(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "server.log" }),
  ],
});

winston.loggers.add("errorLogger", {
  level: "error",
  format: combine(
    timestamp(),
    errors({ stack: true }),
    json(),
    prettyPrint(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log" }),
  ],
});

