const promClient = require("prom-client");
// https://github.com/pavlovdog/grafana-prometheus-node-js-example/
// https://reachmnadeem.wordpress.com/2021/02/11/instrumenting-nodejs-express-applications-for-prometheus-metrics/

const Counter = promClient.Counter;

const c = new Counter({
    name: 'message_calls',
    help: 'Counter of calls to message methods',
    labelNames: ['method'],
});


module.exports = (method) => {
    c.inc({method: method })
};