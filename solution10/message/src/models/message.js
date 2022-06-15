const mongoose = require("mongoose");
const database = require("../database");

let messageSchema = new mongoose.Schema({
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

module.exports = (dbKey) => database.get(dbKey).model("Message", messageSchema);
