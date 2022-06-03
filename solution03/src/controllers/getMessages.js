import getMessages from "../clients/getMessages.js";

export default async (req, res) => {
  const messages = await getMessages();
  
  res.json(messages);
}
