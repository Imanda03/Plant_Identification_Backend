"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const fs = require("fs");
const path_1 = __importDefault(require("path"));
const sequelize_1 = require("sequelize");
const basename = path_1.default.basename(__filename);
const env = process.env.NODE_ENV || "development";
// const config = require(__dirname + "/../config/config.json")[env];
const logger = require("../utils/logUtils");
const db = {};
const dbConfig = {
    DB_NAME: (_a = process.env.DB_NAME) !== null && _a !== void 0 ? _a : "",
    DB_USER: (_b = process.env.DB_USER) !== null && _b !== void 0 ? _b : "",
    DB_PASSWORD: (_c = process.env.DB_PASSWORD) !== null && _c !== void 0 ? _c : "",
    DB_HOST: (_d = process.env.DB_HOST) !== null && _d !== void 0 ? _d : "",
};
const sequelize = new sequelize_1.Sequelize(dbConfig.DB_NAME, dbConfig.DB_USER, dbConfig.DB_PASSWORD, {
    host: dbConfig.DB_HOST,
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    // logging: (msg) => logger.info(msg),
    logging: false,
});
fs.readdirSync(__dirname)
    .filter((file) => {
    return (file.indexOf(".") !== 0 &&
        file !== basename &&
        (file.slice(-3) === ".ts" || file.slice(-3) === ".js") &&
        file.indexOf(".test.js") === -1);
})
    .forEach((file) => {
    const model = require(path_1.default.join(__dirname, file))(sequelize, sequelize_1.DataTypes);
    db[model.name] = model;
});
Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
db.sequelize = sequelize;
db.Sequelize = sequelize_1.Sequelize;
module.exports = db;
//# sourceMappingURL=index.js.map