import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    content: {
      // conteudo da notificação
      type: String,
      required: true,
    },
    user: {
      // usuario que recebera a notificação
      type: Number,
      required: true,
    },
    read: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Notification', NotificationSchema);
