module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('appointments', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users', // cria chave estrangeira para a tabela users, referencia para o usuario que marcou o agendamento
          key: 'id', // chave que será referenciada, no caso id
        },
        onUpdate: 'CASCADE', // ação feita quando alterar agendamento, metodo cascade aplica a ação para tudo que estiver ligado ao id, se o usuario for editado, todos agendamentos serão editados
        onDelete: 'SET NULL', // ação feita quando alterar agendamento
        allowNull: true,
      },
      provider_id: {
        // relação para ver qual prestador de serviços ira atender o usuario
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // campo definido como nulo para manter o historico para o usuario caso o prestador de serviços seja deletado
        allowNull: true,
      },
      canceled_at: {
        type: Sequelize.DATE,
        allowNull: true,
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

  down: queryInterface => {
    return queryInterface.dropTable('appointments');
  },
};
