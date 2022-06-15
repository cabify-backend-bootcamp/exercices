const getMessages = require("../clients/getMessages");
const counterMethodIncrement = require('../metrics');


module.exports = function(req, res) {
  getMessages().then(messages => {
    res.json(messages);
    counterMethodIncrement("get_messages")
  });
};
