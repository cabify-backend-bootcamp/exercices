const express = require("express");
const logger = require("loglevel");
const promClient = require("prom-client");

logger.setLevel("info");

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


// https://github.com/pavlovdog/grafana-prometheus-node-js-example/
// https://reachmnadeem.wordpress.com/2021/02/11/instrumenting-nodejs-express-applications-for-prometheus-metrics/
// Initialize metrics
const Counter = promClient.Counter;
const c = new Counter({
  name: 'credit_test_counter',
  help: 'Example of a counter',
  labelNames: ['code'],
});
setInterval(() => {
  c.inc({ code: 200 });
}, 500);

// Setup server to Prometheus scrapes:
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

app.post(
  "/credit",
  bodyParser.json(),
  validate({ body: creditSchema }),
  newCredit
);

app.use(function(err, req, res, next) {
  logger.info(res.body);
  if (err instanceof ValidationError) {
    logger.err("Invalid request: " + res.body + " error: " + err);
    res.sendStatus(400);
  } else {
    logger.err("Unhandled internal server error: " + err);
    res.sendStatus(500);
  }
});

receiveMessage()

app.listen(9020, function() {
  logger.info("App started on PORT 9020");
});
