import database from "../database.js";
import CreditModel from "../models/credit.js";
import { cleanClone } from "../utils.js";

function newCredit(creditModel, conditions, newValue) {
  return creditModel.findOneAndUpdate(conditions, newValue, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true
  });
}

async function newCreditTransaction(conditions, newValue) {

  const CreditPrimary = CreditModel();
  const CreditReplica = CreditModel("replica");


  const primaryCreditDoc = await Promise.resolve(CreditPrimary.findOne(conditions))

  try {
    const updatedCreditPrimaryTx = await newCredit(CreditPrimary, conditions, newValue);
    console.log("Credit updated successfully", updatedCreditPrimaryTx);

    const updatedCreditReplicaTx = await newCredit(CreditReplica, conditions, cleanClone(updatedCreditPrimaryTx));

    console.log("Credit replicated successfully", updatedCreditReplicaTx);


    if (!updatedCreditReplicaTx) {
      throw "Credit transaction couldn't be replicated";
    }

    return updatedCreditReplicaTx;

  } catch (err) {
    console.log("Error saving credit transaction:", err);

    if (primaryCreditDoc) {
      primaryCreditDoc.markModified("amount");
      await primaryCreditDoc.save();
    }

    throw err;
  }
}

export default async (conditions, newValue) => {
  if (database.isReplicaOn()) {
    const doc = await newCreditTransaction(conditions, newValue);
    return doc;
  } else {
    const doc = await newCredit(Credit(), conditions, newValue);
    console.log("Credit updated successfully", doc);
    return doc;
  }
};

