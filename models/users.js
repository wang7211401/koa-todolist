'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('Users', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        username: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        password: {
            type: DataTypes.CHAR(32),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE
        }
    }, {
        tableName: 'users'
    });
    User.associate = function(models) {
        // associations can be defined here
        User.hasMany(models.Contents, {
            foreignKey: 'user_id'
        });
    };
    return User;
};