require("dotenv").config();

const fs = require("fs");

import path from "path";

import { Sequelize, DataTypes } from "sequelize";

const basename = path.basename(__filename);

const env = process.env.NODE_ENV || "development";

// const config = require(__dirname + "/../config/config.json")[env];

const logger = require("../utils/logUtils");

interface dbconfig {
  DB_NAME: string;

  DB_USER: string;

  DB_PASSWORD: string;

  DB_HOST: string;
}

type DB = { [key: string]: any };

const db: DB = {};

const dbConfig: dbconfig = {
  DB_NAME: process.env.DB_NAME ?? "",

  DB_USER: process.env.DB_USER ?? "",

  DB_PASSWORD: process.env.DB_PASSWORD ?? "",

  DB_HOST: process.env.DB_HOST ?? "",
};

const sequelize = new Sequelize(
  dbConfig.DB_NAME,

  dbConfig.DB_USER,

  dbConfig.DB_PASSWORD,

  {
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
  }
);

fs.readdirSync(__dirname)

  .filter((file: string) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      (file.slice(-3) === ".ts" || file.slice(-3) === ".js") &&
      file.indexOf(".test.js") === -1
    );
  })

  .forEach((file: string) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);

    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

db.Sequelize = Sequelize;

module.exports = db;
