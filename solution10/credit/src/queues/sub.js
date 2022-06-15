const Bull = require("bull");
const urls = require("../urls");

module.exports = new Bull("message-service-queue", urls.REDIS_URL);
