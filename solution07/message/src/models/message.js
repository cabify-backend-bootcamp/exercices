import mongoose from "mongoose";
import database from "../database.js";

const messageSchema = new mongoose.Schema({
  _id: String,
  destination: String,
  body: String,
  location: {
  	name: {
      type: String,
      default: "Default"
    },
    cost: {
      type: Number,
      default: 1
    }
  },
  status: {
    type: String,
    enum: ["ERROR", "OK", "TIMEOUT", "QUEUED"]
  }
});

export default (dbKey) => database.get(dbKey).model("Message", messageSchema);
