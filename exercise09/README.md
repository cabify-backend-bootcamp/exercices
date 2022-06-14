# Exercise 9

## 1. Intro

So far we've only been talking about code. However, that code has to run too, somewhere. And it needs to run reliably and in a controlled way. In this exercise you'll learn about deployment strategies and how to protect yourself from critical errors that could potentially take down the system and cause an outage.

### 2. Architecture for this exercise

For this exercise you're provided with a load balancer running on port 48151, connected to a Service Discovery tool (Consul). Consul works in combination with the load balancer, registering any changes to the replicas that are running. For instance, if there's a new replica, Consul will let the load balancer know that it can send traffic to that new replica. If one of the replicas gets down, again Consul will let the load balancer know not to send any traffic there anymore.

This will give you a lot more flexibility and ability to react to changes in the system. You can use docker-compose to control the number of replicas.

Note that the provided haproxy configuration includes services with the names `service-v1` and `service-v2`. To work with it you'll need to define these environment variables when spinning up your containerised services:
- `SERVICE_NAME` with the value `service-v1` for the stable set of replicas
- `SERVICE_NAME` with the value `service-v2` for the canaries

### 3. How to deploy your service

Let's assume a similar architecture to what you've been building up to exercise 8 (provided here as an the example). That is a distributed system consisting on several microservices, each of them running more than one replica to avoid [SPOFs](https://en.wikipedia.org/wiki/Single_point_of_failure).

Ideally, when you release a new version of a service, those changes get deployed to production and the clients can start using it. Of course, reality is a bit more complicated and there's a myriad reasons why a new version of the service may fail. There are strategies designed to cope with these possibilities, ways to prevent disasters to strike and take down your whole system. The idea itself is quite simple: release the new version or feature to a limited number of users first. If it fails, you'll be able to see it, while at the same time most users will keep going about their business as usual, unaware of any problems.

There are different ways to do this. For instance, you could route a small percentage of traffic to the replicas running the new version of the service, while the rest of the traffic hits the previous replica set. That's the idea behind blue/green deployments or canaries. Or you could mark a subset of clients with a flag, for instance, so that only them can access the new feature.

#### 3.1. Canary deployments

- Deploy your message and credit services using this distributed architecture, and set 4 replicas for each of those services. Check that the traffic reaches all those replicas as expected.

- Add a shiny new feature! It can be something as simple as adding a testing endpoint such as `/version`, for instance, that returns information about the version of the service that's serving any particular request.

- Deploy the service in phases, checking that only a fraction of the requests have access to the fancy new feature. You'll need to update the `docker-compose.yml` file for this. Try deploying the new version to a single instance first.

- Check out the new endpoint. You can use the command `ab -n 400 localhost:48151/<new-endpoint>`. If you've only deployed your new version to 1 out of 4 instances, you should see the same distribution in the responses you get. Only about 25% (around 100) of the requests should be getting the new response.

- Once you're sure that the new version works as expected, it's just a matter of reducing the number of replicas running the old version, while at the same time adding more replicas running the new one. You can use `docker service scale` to do that.

#### 3.2. Targeted oriented deployments

Another strategy is to add a header to the requests that you want to route to the new replicas, making it explicit.

- Apply headers specific HAProxy configuration and restart the container to load the new config. You can use docker-compose for that.

- Deploy some changes.

- Take a look at that config and try to figure out what's the header you need to use on that `ab` command you've used before, to route the requests to the new replicas.

- Like before, propagate the change until there are no old replicas left.
