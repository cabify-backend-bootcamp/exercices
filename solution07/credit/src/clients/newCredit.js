import Credit from "../models/credit.js";
import newCreditTransaction from "../transactions/newCredit.js";

export default (creditParams) => {
  const CreditModel = Credit()
  const credit = new CreditModel(creditParams);
  const conditions = {
    location: credit.location
  };
  return newCreditTransaction(conditions, creditParams);
};

