import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';//afasffasf

class Appointment extends Model {
  // campos no model não precisam ser um reflexo total dos campos contidos no banco
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date());
          },
        },
        cancelable: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(new Date(), subHours(this.date, 2));
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    // associando models USER e APPOINTMENT, associate(models) recebe todos os models
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' }); // quando possui mais que um relacionamento, é obrigatorio inserir o apelido da relação, o ' as: 'user' '
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export default Appointment;
