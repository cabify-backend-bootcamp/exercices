const CircuitBreaker = require("circuit-breaker-js");
module.exports = new CircuitBreaker({
  windowDuration: 60000,
  volumeThreshold: 5,
  onCircuitOpen: metrics => console.error("circuit open", metrics),
	onCircuitClose: metrics => console.error("circuit close", metrics),
});
