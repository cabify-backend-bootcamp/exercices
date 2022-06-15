const receive_queue = require("../queues/sub");
const send_queue = require("../queues/pub");
const updateCredit = require("../clients/updateCredit");
const getCredit = require("../clients/getCredit");
const logger = require("loglevel");

function processingMessage(messageParams) {
  return new Promise((ok, ko) => {
    updateCredit(messageParams, (_, err) => {
      if (err) {
        return ko(err);
      }
      send_queue.add(Object.assign(messageParams, { status: "OK" }));
      return ok();
    });
  });
}

let paused = false;
const jobsToPause = 10;
const jobsToResume = 5;

module.exports = function() {
  receive_queue.process(function(job, done) {
    send_queue.count()
      .then((n) => {
        if (paused && n <= jobsToResume) paused = false;
        else if (!paused && n >= jobsToPause) paused = true;
      });
    if (paused) return Promise.reject(new Error('Queue paused due to long queue'));

    const messageData = job.data
    return getCredit()
      .then(function(credit) {
        if ((credit.amount - messageData.location.cost) < 0) {
          send_queue.add(Object.assign(messageData, { status: "ERROR" }));
          done()
        } else {
          logger.error("Credito suficiente")
          return processingMessage(messageData)
        }
      })
      .then(() => {
        done()
      }).catch((error) => {
        logger.error(error)
        done(error)
      });
  });
}
