module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('restocks', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      financial_statements_id: {
        type: Sequelize.INTEGER,
        references: { model: 'financial_statements', key: 'id' },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      freight_id: {
        type: Sequelize.INTEGER,
        references: { model: 'freights', key: 'id' },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      name_establishment: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      value_fuel: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      liters_fuel: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      total_value_fuel: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      total_nota_value: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      payment: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {
          modo: '',
          value: 0,
          parcels: 0,
          flag: '',
        },
        validate: {
          notEmpty: true,
        },
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('restocks');
  },
};
