import Message from "../models/message.js";

export default (conditions = {}) => Message.find(conditions);
