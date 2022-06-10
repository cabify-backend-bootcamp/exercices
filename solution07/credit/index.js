import express from "express";
import bodyParser from "body-parser";
import {
  Validator,
  ValidationError
} from "express-json-validator-middleware";

import newCredit from "./src/controllers/newCredit.js";
import receiveMessage from "./src/jobs/receiveMessage.js";

const app = express();
const {validate} = new Validator({ allErrors: true });

const creditSchema = {
  type: "object",
  required: ["amount"],
  properties: {
    location: {
      type: "string"
    },
    amount: {
      type: "number"
    }
  }
};

app.post(
  "/credit",
  bodyParser.json(),
  validate({ body: creditSchema }),
  newCredit
);

app.use((err, req, res, next) => {
  console.log(res.body);
  if (err instanceof ValidationError) {
    res.sendStatus(400);
  } else {
    res.sendStatus(500);
  }
});

receiveMessage();

app.listen(9017, () => {
  console.log("App started on PORT 9017");
});
