const {DataTypes,Model} = require('sequelize');
class Content extends Model {}
module.exports = (sequelize) => {
    Content.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
        sequelize,
        modelName: 'contents'
    });
    // Content.associate = function(models) {
    //     // associations can be defined here
    //     Content.belongsTo(models.Users, {
    //         foreignKey: 'user_id'
    //     });
    // };
    return Content;
};