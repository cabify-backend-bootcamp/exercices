const getMessage = require("../clients/getMessage");

module.exports = function(req, res) {
  const messageId = req.params.messageId;
  const conditions = {
    _id: messageId
  };

  getMessage(conditions)
    .then(message => {
      if (message == null) {
        res.statusCode = 404;
        res.end("Message not found");
      } else {
        res.json({
          messageId,
          status: message.status
        });
      }
    })
};