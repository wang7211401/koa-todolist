'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */
        return queryInterface.addColumn('Contents', 'user_id', {
            type: Sequelize.INTEGER,
            allowNull: false
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('Contents', 'user_id');
    }
};