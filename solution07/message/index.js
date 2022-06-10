import express from "express";

import bodyParser from "body-parser";
import {
  Validator,
  ValidationError
} from "express-json-validator-middleware";

import sendMessage from "./src/controllers/sendMessage.js";
import getMessages from "./src/controllers/getMessages.js";
import getMessageStatus from "./src/controllers/getMessageStatus.js";

const app = express();

const validator = new Validator({ allErrors: true });
const { validate } = validator;

const messageSchema = {
  type: "object",
  required: ["destination", "body"],
  properties: {
    destination: {
      type: "string"
    },
    body: {
      type: "string"
    },
    location: {
      name: {
        type: "string"
      },
      cost: {
        type: "number"
      }
    }
  }
};

app.post(
  "/messages",
  bodyParser.json(),
  validate({ body: messageSchema }),
  sendMessage
);

app.get("/messages", getMessages);

app.get("/message/:messageId/status", getMessageStatus);

app.use((err, req, res, next) => {
  console.log(res.body);
  if (err instanceof ValidationError) {
    res.sendStatus(400);
  } else {
    res.sendStatus(500);
  }
});

app.listen(9007, () => {
  console.log("App started on PORT 9007");
});
