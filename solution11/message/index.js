const express = require("express");
const logger = require("loglevel");
const promClient = require("prom-client");

logger.setLevel("info")

const bodyParser = require("body-parser");
const {
  Validator,
  ValidationError
} = require("express-json-validator-middleware");

const sendMessage = require("./src/controllers/sendMessage");
const getMessages = require("./src/controllers/getMessages");
const getMessageStatus = require("./src/controllers/getMessageStatus");

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

// https://github.com/pavlovdog/grafana-prometheus-node-js-example/
// https://reachmnadeem.wordpress.com/2021/02/11/instrumenting-nodejs-express-applications-for-prometheus-metrics/
// Initialize metrics
const Counter = promClient.Counter;
const c = new Counter({
  name: 'metric_test_counter',
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

app.use(function(err, req, res, next) {
  logger.info(res.body);
  if (err instanceof ValidationError) {
    res.sendStatus(400);
  } else {
    res.sendStatus(500);
  }
});

app.listen(9010, function() {
  logger.info("App started on PORT 9010");
});
