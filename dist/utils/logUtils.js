"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { createLogger, format, transports } = require("winston");
const logger = createLogger({
    level: "debug",
    format: format.combine(format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), format.printf((info) => `[${info.timestamp}] ${info.level.toUpperCase()}: ${typeof info.message === "object"
        ? JSON.stringify(info.message)
        : info.message}`)),
    transports: [new transports.File({ filename: "logs/app.log" })],
});
// logger.info("Hello again distributed logs");
// logger.error("error");
// logger.warn("test message %s", "my string");
// logger.debug("This is debug");
module.exports = logger;
//# sourceMappingURL=logUtils.js.map