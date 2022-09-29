'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Registers', // table name
        'createDate', // new field name
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
      ),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('Registers', 'createDate'),
    ]);
  }
};
