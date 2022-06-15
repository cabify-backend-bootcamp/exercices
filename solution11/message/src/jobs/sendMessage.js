const http = require("http");
const uuid = require("uuid/v1");
const logger = require("loglevel");

const send_queue = require("../queues/pub");
const receive_queue = require("../queues/sub");
const saveMessage = require("../clients/saveMessage");

const Message = require("../models/message");

const breaker = require("../circuit-breaker");

const urls = require("../urls");

function sendMessage(messageData, success, failed) {
  const postOptions = {
    host: urls.MESSAGEAPP_HOST,
    port: 3000,
    path: "/message",
    method: "post",
    json: true,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(JSON.stringify(messageData))
    }
  };

  let postReq = http.request(postOptions);

  logger.info("Processing job with data: ", messageData);

  postReq.on("response", postRes => {
    if (postRes.statusCode === 200) {
      saveMessage(Object.assign(messageData, { status: "OK" }), success);
    } else {
      logger.error("Error while sending message", err);
      saveMessage(Object.assign(messageData, { status: "ERROR" }), failed);
    }
  });

  postReq.on("timeout", () => {
    logger.error("Timeout Exceeded!", err);
    postReq.abort();

    saveMessage(Object.assign(messageData, { status: "TIMEOUT" }), failed);
  });

  postReq.on("error", () => {
    logger.error("Connection error!", err);
    failed();
  });

  postReq.write(JSON.stringify(messageData));
  postReq.end();
}

function fallback(messageData, done) {
  logger.error("Unable to attempt to send message: circuit open");
  saveMessage(Object.assign(messageData, { status: "ERROR" }), done);
}

receive_queue.process(function(job, done) {
  if (job.data.status == "OK") {
    const messageData = Object.assign({}, job.data);
    breaker.run(
      (success, failed) => {sendMessage(messageData, success, failed); done();},
      () => fallback(messageData, done)
    );
  } else {
    logger.error("Credito insuficiente");
    const messageData = Object.assign({}, job.data);
    saveMessage(Object.assign(messageData, { status: "ERROR" }), done);
  }
});

function processingMessage(messageParams) {
  return new Promise((ok, ko) => {
    saveMessage(messageParams, err => {
      if (err) {
        return ko(err);
      }
      return ok();
    });
  });
}

let paused = false;
const jobsToPause = 10;
const jobsToResume = 5;

module.exports = function addJob(jobParams) {
  const messageId = uuid();
  const messageParams = Object.assign(
    {},
    jobParams,
    { _id: messageId },
    { status: "QUEUED" }
  );

  const jobOpts = {
    delay: 2000
  };

  send_queue.count()
    .then((n) => {
      if (paused && n <= jobsToResume) paused = false;
      else if (!paused && n >= jobsToPause) paused = true;
    });
  if (paused) return Promise.reject('Queue paused due to long queue');

  return processingMessage(messageParams)
    .then(() => {
      const MessageModel = Message();
      let message = new MessageModel(messageParams);
      return send_queue.add(message, jobOpts);
    })
    .then(() => {
      return messageId;
    })
    .catch((error) => {
      logger.error(error)
      return error
    });
}
