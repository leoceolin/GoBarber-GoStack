import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  // campos no model não precisam ser um reflexo total dos campos contidos no banco
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // existirá somente no código por ser virtual
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    // antes de salvar qualquer usuario no BD será executado o código contido na função
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8); // numero da força da criptografia
      }
    });

    return this; // retorna o model inicializado
  }

  static associate(models) {
    // associando models USER e FILE, associate(models) recebe todos os models
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' }); // belongsTo -> tipo de relacionamento, pertence ao model File e será armazenado dentro do model User / nome da chave estrangeira que será referencia para o arquivo / AS: 'avatar' -> para trazer a resposta json com nome de Avatar no lugar de File
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash); // compara as senhas, senha digitada com a senha no banco
  }
}

export default User;
