"use strict";

import { DataTypes, Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize, dataTypes) => {
  class User extends Model {
    /**

* Helper method for defining associations.

* This method is not a part of Sequelize lifecycle.

* The `models/index` file will call this method automatically.

*/

    static associate(models) {
      // define association here
    }
  }

  User.init(
    {
      username: {
        type: DataTypes.STRING,

        allowNull: false,
      },

      address: {
        type: DataTypes.STRING,

        allowNull: true,
      },

      contactNumber: {
        type: DataTypes.STRING,

        allowNull: true,
      },

      email: {
        type: DataTypes.STRING,

        allowNull: false,

        unique: true,

        validate: {
          isEmail: {
            msg: "Please provide a valid email address.",
          },
        },
      },

      password: {
        type: DataTypes.STRING,

        allowNull: false,

        validate: {
          len: {
            args: [6, 100],

            msg: "Password must be at least 6 characters long.",
          },
        },
      },

      role: {
        type: DataTypes.STRING,

        allowNull: false,
      },
    },

    {
      sequelize: sequelize,

      modelName: "User",
    }
  );

  return User;
};
