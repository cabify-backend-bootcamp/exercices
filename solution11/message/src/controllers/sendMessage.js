const sendMessage = require("../jobs/sendMessage");
const counterMethodIncrement = require('../metrics');
const logger = require("loglevel");
module.exports = function(req, res) {
  sendMessage(req.body)
    .then(messageId => {
      const response = {
        messageId
      };

      res.statusCode = 200;
      res.end(JSON.stringify(response));
      counterMethodIncrement("send_message")
    })
    .catch(error => {
      logger.error(error);
      res.statusCode = 500;
      res.end(JSON.stringify(error));
    });
};
