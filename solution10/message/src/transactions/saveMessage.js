const database = require("../database");
const Message = require("../models/message");
const { unversionedClone } = require("../utils");

function saveMessage(model, newValue) {
  return model.findOneAndUpdate(
    {
      _id: newValue._id
    },
    newValue,
    {
      upsert: true,
      new: true
    }
  );
}

function saveMessageReplica(replica, retries) {
  if (retries > 0) {
    return saveMessage(Message("replica"), replica)
      .then(doc => {
        console.log("Message replicated successfully", doc);
        return doc;
      })
      .catch(err => {
        console.log("Error while saving message replica", err);
        console.log("Retrying...");
        return saveMessageReplica(replica, retries - 1);
      });
  }
}

function saveMessageTransaction(newValue) {
  return saveMessage(Message(), newValue)
    .then(doc => {
      console.log("Message saved successfully:", doc);
      return unversionedClone(doc);
    })
    .then(clone => {
      saveMessageReplica(clone, 3);
      return clone;
    })
    .catch(err => {
      console.log("Error while saving message", err);
      throw err;
    });
}

module.exports = function(messageParams, cb) {
  saveMessageTransaction(messageParams)
    .then(() => cb())
    .catch(err => {
      cb(err);
    });
};
