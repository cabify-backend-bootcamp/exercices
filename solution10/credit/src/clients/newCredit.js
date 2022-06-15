const Credit = require("../models/credit");
const newCreditTransaction = require("../transactions/newCredit");

module.exports = function(creditParams, cb) {
  let CreditModel = Credit()
  let credit = new CreditModel(creditParams);
  let conditions = {
    location: credit.location
  };
  newCreditTransaction(conditions, creditParams, cb);
};

