'use strict';
module.exports = (sequelize, DataTypes) => {
    const Content = sequelize.define('Contents', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Users",
                key: 'id'
            }
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        done: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0
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
        tableName: 'contents'
    });
    Content.associate = function(models) {
        // associations can be defined here
        Content.belongsTo(models.Users, {
            foreignKey: 'user_id'
        });
    };
    return Content;
};