import Sequelize, { Model } from 'sequelize';

class File extends Model {
  // campos no model não precisam ser um reflexo total dos campos contidos no banco
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/files/${this.path}`; // url para o arquivo do avatar / process.env -> busca variaveis presentes no arquivo .env
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default File;
