import credit from "../models/credit.js";
import updatecredittransaction from "../transactions/updateCredit.js";

export default (messageparams) => {
  const conditions = {
    location: messageparams.location.name
  };

  return updatecredittransaction(conditions, messageparams);
};
