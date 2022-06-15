const express = require("express");

const bodyParser = require("body-parser");
const {
  Validator,
  ValidationError
} = require("express-json-validator-middleware");

const newCredit = require("./src/controllers/newCredit");
const receiveMessage = require("./src/jobs/receiveMessage");
const app = express();
const validator = new Validator({ allErrors: true });
const { validate } = validator;

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

app.use(function(err, req, res, next) {
  console.log(res.body);
  if (err instanceof ValidationError) {
    res.sendStatus(400);
  } else {
    res.sendStatus(500);
  }
});

receiveMessage()

app.listen(9020, function() {
  console.log("App started on PORT 9020");
});
