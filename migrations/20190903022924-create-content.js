'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Contents', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false
            },
            done: {
                type: Sequelize.BOOLEAN,
                default: 0,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        }, {
            tableName: 'contents',
            charset: 'utf8mb4',
            collate: 'utf8mb4_bin'
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Contents');
    }
};