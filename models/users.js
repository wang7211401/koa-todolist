const {DataTypes,Model} = require('sequelize');
class User extends Model {}

module.exports = (sequelize) => {
    User.init({
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
        sequelize, // 我们需要传递连接实例
        modelName:"users"
    });

    // User.associate = function(models) {
    //     // associations can be defined here
    //     User.hasMany(models.Contents, {
    //         foreignKey: 'user_id'
    //     });
    // };
    return User;
};