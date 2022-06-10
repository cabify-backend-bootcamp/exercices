import Message from "../models/message.js";

export default (conditions = {}) => {
  return Message().findOne(conditions);
};
