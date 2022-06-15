const credit = require("../models/credit");
const updatecredittransaction = require("../transactions/updateCredit");

module.exports = function(messageparams, cb) {
  let conditions = {
    location: messageparams.location.name
  };
  return updatecredittransaction(conditions, messageparams, cb);
};
