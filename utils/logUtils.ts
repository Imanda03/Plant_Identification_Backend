const { createLogger, format, transports } = require("winston");
import { Request, Response, NextFunction } from "express";

const logger = createLogger({
  level: "debug",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      (info: any) =>
        `[${info.timestamp}] ${info.level.toUpperCase()}: ${
          typeof info.message === "object"
            ? JSON.stringify(info.message)
            : info.message
        }`
    )
  ),
  transports: [new transports.File({ filename: "logs/app.log" })],
});

// logger.info("Hello again distributed logs");
// logger.error("error");
// logger.warn("test message %s", "my string");
// logger.debug("This is debug");
module.exports = logger;
