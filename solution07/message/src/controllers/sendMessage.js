import sendMessage from "../jobs/sendMessage.js";

export default async (req, res) => {
  const messageId = await sendMessage(req.body);
  const response = {
    messageId,
  };

  res.statusCode = 200;
  res.end(JSON.stringify(response));
};
