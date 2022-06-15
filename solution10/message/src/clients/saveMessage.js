const Message = require("../models/message");
const saveMessageTransaction = require("../transactions/saveMessage");

module.exports = function(messageParams, cb) {
  const MessageModel = Message();
  let message = new MessageModel(messageParams);
  messageParams = message.toJSON()
  saveMessageTransaction(messageParams, cb);
};
