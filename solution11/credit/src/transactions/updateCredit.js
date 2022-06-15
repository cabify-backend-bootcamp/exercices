const database = require("../database");
const Credit = require("../models/credit");
const { cleanClone } = require("../utils");
const logger = require("loglevel");

function updateCredit(creditModel, conditions, messageData) {
  return creditModel.findOneAndUpdate(
    {
      amount: { $gte: 1 },
      location: conditions.location
    },
    {
      $inc: { amount: -messageData.location.cost }
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    });
}

function replicateCredit(creditModel, conditions, newValue) {
  return creditModel.findOneAndUpdate(
    {
      amount: { $gte: 1 },
      location: conditions.location
    },
    newValue,
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    });
}

function updateCreditTransaction(conditions, messageData) {

  const CreditPrimary = Credit();
  const CreditReplica = Credit("replica");

  let oldValue;

  return Promise.resolve(CreditPrimary.findOne(conditions))
    .then(doc => {
      oldValue = doc;
    })
    .then(() => {
      return updateCredit(CreditPrimary, conditions, messageData).then(doc => {
        logger.info("Credit updated successfully", doc);
        return doc;
      });
    })
    .then(cleanClone)
    .then(replica => {
      logger.info(replica)
      return replicateCredit(CreditReplica, conditions, replica).then(doc => {
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
      logger.error("Error updating credit transaction:", err);
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

module.exports = function(conditions, messageData, cb) {
  if (database.isReplicaOn()) {
    updateCreditTransaction(conditions, messageData)
      .then(doc => {
        logger.info("Credit trans. updated successfully", doc);
        cb(doc)
      })
      .catch(err => {
        cb(undefined, err);
      });
  } else {
    updateCredit(Credit(), conditions, messageData)
      .then(doc => {
        logger.info("Credit updated successfully", doc);
        cb(doc);
      })
      .catch(err => {
        cb(undefined, err);
      });
  }
};
