const database = require("../database");
const CreditModel = require("../models/credit");
const { cleanClone } = require("../utils");
const logger = require("loglevel");

function newCredit(creditModel, conditions, newValue) {
  return creditModel.findOneAndUpdate(conditions, newValue, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true
  });
}

function newCreditTransaction(conditions, newValue) {

  const CreditPrimary = CreditModel();
  const CreditReplica = CreditModel("replica");

  let oldValue;

  return Promise.resolve(CreditPrimary.findOne(conditions))
    .then(doc => {
      oldValue = doc;
    })
    .then(() => {
      return newCredit(CreditPrimary, conditions, newValue).then(doc => {
        logger.info("Credit updated successfully", doc);
        return doc;
      });
    })
    .then(cleanClone)
    .then(replica => {
      return newCredit(CreditReplica, conditions, replica).then(doc => {
        logger.info("Credit replicated successfully", doc);
        return doc;
      });
    })
    .then(doc => {
      if (doc == null) {
        throw "Credit transaction couldn't be replicated";
      }
      return doc;
    })
    .catch(err => {
      logger.info("Error saving credit transaction:", err);
      if (oldValue) {
        oldValue.markModified("amount");
        oldValue.save().then(() => {
          throw err;
        });
      } else {
        throw err;
      }
    });
}

module.exports = function(conditions, newValue, cb) {
  if (database.isReplicaOn()) {
    newCreditTransaction(conditions, newValue)
      .then(doc => cb(doc))
      .catch(err => {
        cb(undefined, err);
      });
  } else {
    newCredit(Credit(), conditions, newValue)
      .then(doc => {
        logger.info("Credit updated successfully", doc);
        cb(doc);
      })
      .catch(err => {
        cb(undefined, err);
      });
  }
};

