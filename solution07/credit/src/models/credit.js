import mongoose from "mongoose";
import database from "../database.js";

const creditSchema = new mongoose.Schema({
  location: {
    type: String,
    default: "Default"
  },
  amount: Number,
  status: {
    type: String,
    enum: ["ERROR", "OK", "TIMEOUT"]
  }
});

export default (dbKey) => database.get(dbKey).model("Credit", creditSchema);
