import Message from "../models/message.js";
import saveMessageTransaction from "../transactions/saveMessage.js";

export default function(messageParams) {
  const MessageModel = Message();
  const message = new MessageModel(messageParams);

  return saveMessageTransaction(message.toJSON());
};
