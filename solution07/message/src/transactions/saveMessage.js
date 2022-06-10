import database from "../database.js";
import Message from "../models/message.js";
import { unversionedClone } from "../utils.js";

function saveMessage(model, newValue) {
  /* eslint-disable no-underscore-dangle */
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
  /* eslint-enable no-underscore-dangle */
}

async function saveMessageReplica(replica, retries) {
  if (retries <= 0) {
    return;
  }

  try {
    const doc = await saveMessage(Message("replica"), replica)
    console.log("Message replicated successfully", doc);
    return doc;
  } catch {
    console.log("Error while saving message replica", err);
    console.log("Retrying...");
    return saveMessageReplica(replica, retries - 1);
  }
}

export default async (newValue) => {
  try {
    const doc = await saveMessage(Message(), newValue);
    console.log("Message saved successfully:", doc);

    const docWithoutVersion = unversionedClone(doc);

    await saveMessageReplica(docWithoutVersion, 3);

    return docWithoutVersion;
  } catch (err) {
    console.log("Error while saving message", err);
    throw err;
  }
};
