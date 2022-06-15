const CircuitBreaker = require("circuit-breaker-js");
const logger = require("loglevel");

module.exports = new CircuitBreaker({
  windowDuration: 60000,
  volumeThreshold: 5,
  onCircuitOpen: metrics => logger.error("circuit open", metrics),
	onCircuitClose: metrics => logger.error("circuit close", metrics),
});
