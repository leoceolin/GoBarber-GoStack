module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      // query responsavel por adicionar coluna avatar_id na tabela users
      'users',
      'avatar_id',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'files', // cria chave estrangeira para a tabela files
          key: 'id', // chave que será referenciada, no caso id
        },
        onUpdate: 'CASCADE', // ação feita quando alterar arquivo
        onDelete: 'SET NULL', // ação feita quando alterar arquivo
        allowNull: true,
      }
    );
  },

  down: queryInterface => {
    return queryInterface.removeColumun('users', 'avatar_id');
  },
};
