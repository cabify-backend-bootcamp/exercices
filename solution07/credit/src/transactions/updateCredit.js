import mongoose from "mongoose";
import database from "../database.js";
import Credit from "../models/credit.js";
import { cleanClone } from "../utils.js";

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
        console.log("Credit updated successfully", doc);
        return doc;
      });
    })
    .then(cleanClone)
    .then(replica => {
      console.log(replica)
      return replicateCredit(CreditReplica, conditions, replica).then(doc => {
        console.log("Credit replicated successfully", doc);
        return doc;
      });
    })
    .then(doc => {
      if (doc === null) {
        throw "Credit transaction couldn't be replicated";
      }
      return doc;
    })
    .catch(err => {
      console.log("Error updating credit transaction:", err);
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

export default async (conditions, messageData) => {
  if (database.isReplicaOn()) {
    const doc = await updateCreditTransaction(conditions, messageData)
    console.log("Credit trans. updated successfully", doc);
    return doc;
  } else {
    const doc = await updateCredit(Credit(), conditions, messageData);
    console.log("Credit updated successfully", doc);
    return doc;
  }
};
