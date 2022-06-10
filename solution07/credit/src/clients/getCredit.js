import Credit from "../models/credit.js";

export default (conditions = { location: "Default" }) => {
  return Credit().findOne(conditions);
};
