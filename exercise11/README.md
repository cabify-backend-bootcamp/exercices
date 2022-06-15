# Exercise 11

## Intro

Your code is almost done. It's time to think about monitoring: how you're going to be able to detect problems in production and react to them.

This exercise focuses on systems' observability. You will improve your logs' format, report metrics to an analysis dashboard and check out how those systems interact by using distributed tracing.

### 1 - Standardise logging format

Logging information is only the beginning. To make the most out of the information you're logging, you need to keep its format consistent. This way you'll be able to analyse and classify those logs, save them, index them, and search for the information you need easily and efficiently.

- Standardise the logs' format using a dedicated logging library.
- Make sure that unrecoverable errors get logged with the _error_ level.
- Make sure recoverable errors get logged with the _warning_ level.
- Make sure debugging information gets logged with the _debug_ level.
- Double check that all errors within the application get logged.

### 2 - Monitoring metrics

Exposing internal metrics for each service will give you the ability to know and understand how the system is behaving in production. With them, you'll be able to build analytics dashboards where you'll be seeing all that information at a glance.

Here you'll be introducing a stats service. You'll expose a few metrics, and create dashboards from which you'll monitor and investigate the behaviour of the system in real time.

- Install a [Grafana](https://grafana.com/) image with a [Prometheus](https://prometheus.io/) plugin.
- Monitor the application using a dedicated metrics endpoint for Prometheus.
- Using Prometheus, expose the following metrics and setup their corresponding panels in Grafana:
  - Requests ratio
  - Errors ratio
  - Response times
  - How long a message stays in the queue
  - How long a message takes to get enqueued
  - Enqueueing messages ratio
  - Errors enqueuing messages ratio
  
### 3 - Tracing requests

Service side metrics are just one piece of the puzzle. To be able to pinpoint bottlenecks in the system you'll need to adapt the way your application interacts with the other components. You'll be adding new data to your requests, that will enable you to trace them across the whole system.

- Introduce Jaeger (Open Tracing) in the system.
- Monitor your application using Jaeger. Extract and send the trace identifier to any services your application connects to. Send that information to the Jaeger agent.

### 4 - Alerting

The data panels you've been creating let you monitor the system, but you need to be actively looking at them to know whether the system is behaving as intended or not.

Instead, you can trigger alerts when the system starts behaving in ways it shouldn't or that require immediate attention from you.

- Create an alert on any of the metrics you're monitoring on Grafana, and send a Slack message about it on any channel you choose.
