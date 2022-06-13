# Exercise 8

## Intro

The next steps for better availability are improving the system's ability to handle a higher number of requests and reducing its downtime by removing some critical elements.

### 1 - Redundancy

A common strategy to avoid dealing with a single point of failure is to spin up multiple instances of the application:

- Change and configure the topology of the system so it spins up multiple instances.
- Make sure you can still access each and everyone of them separately.

### 2 - Load balancing

Once you have multiple instances of the same application running at the same time, then the problem becomes how to distribute the requests among them. You need a single entry point to the whole system, and then a load balancer will distribute the load among the instances, so that each gets more or less the same number of requests as the others.

- Add a load balancer such as [HAProxy](http://www.haproxy.org/) and configure it to distribute the load among the instances you've created.
- Logging connections to each instance might be useful to make sure the load balancer is working as expected.

### 3 - Can you receive traffic?

If any of the instances starts failing or becomes unavailable, the load balancer should not send any more requests there. This way you prevent a problem within the system to become a problem for the users.

- Create a `/health` endpoint within the application. This endpoint will report the status of the service.
- Configure the load balancer so that it checks that endpoint before sending requests to the instances. It should send requests to healthy instances only.
- Check that the load balancer doesn't send requests to any instances reporting problems via the `/health` endpoint.
