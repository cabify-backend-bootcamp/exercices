import newcredit from "../clients/newCredit.js";

export default async (req, res) => {
  await newcredit({
      ...req.body,
      status: "OK"
  });

  res.end("OK");
};
