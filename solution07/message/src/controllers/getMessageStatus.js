import getMessage from "../clients/getMessage.js";

export default async (req, res) => {
  const { messageId } = req.params;

  const conditions = {
    _id: messageId,
  };

  const message = await getMessage(conditions);

  if (message === null) {
    res.statusCode = 404;
    res.end("Message not found");
    return;
  } 

  res.json({
    messageId,
    status: message.status,
  });
};
