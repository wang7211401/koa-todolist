'use strict';

const md5 = require('md5');

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Users', [{
            username: 'frank',
            password: md5('123123'),
            email: 'frank@163.com',
            createdAt: new Date(),
            updatedAt: new Date()
        }], {}).then(data => {
            return queryInterface.bulkInsert('Contents', [{
                user_id: 1,
                title: '测试任务',
                createdAt: new Date(),
                updatedAt: new Date()
            }], {})
        });
    },

    down: (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.bulkDelete('People', null, {});
        */
        return queryInterface.bulkDelete('Users', null, {})
    }
};