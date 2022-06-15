# Exercise 10

## Intro

You've come a long way in building a robust system. You've got multiple replicas, events, a queue system, high availability. You name it! But... you can still face critical problems. You depend on other services, and those could fail for any number of reasons: errors, overload, etc. You've seen that there are strategies for even such scenarios, to cope with them and minimise their impact. In this exercise you'll get to play with two hands-on cases and you'll learn about backpressure mechanisms. 

### 1 - Update the external service

For this exercise you'll be using a different version of `messageapp`. This one will allow you to simulate the problems you want to mitigate here.

Change the `messageapp` image used in the `docker-compose.yml` file to `cabify/backend-bootcamp-messageapp:exercise10`.

### 2 - Circuit breaker

You'll find that the new version of `messageapp` has a problem: the response times are mostly ok, but they spike from time to time. This is a fairly usual behaviour in overload scenarios. Response times start going up indefinitely and clients start reissuing requests, feeding back into the problem. Thus, one of the most efficient strategies to fix the problem is to stop hitting the degraded service, to alleviate the load.

Follow these steps in your code:

1. If you're not handling the timeout associated to the request to this external service, now is the time to do so. You can use a 1s timeout setup, for instance; if `messageapp` hasn't answered the request after 1s, close the connection and consider it failed.
2. Now you'll need to find a library that implements circuit breaker functionality. You'll have to use it when calling `messageapp` from your service. Configure it so that it comes into place as soon as the system reaches a handful of errors.
3. Requests can fail for, at least, 3 reasons now:
   - `messageapp` returned an error response
   - `messageapp` took too long to answer and your service timed out
   - previous errors triggered the circuit breaker and your service never actually sent the request to `messageapp`.
   
   Make sure you can tell apart all 3 cases. You can output a different message for each, for instance.
4. Use a client to issue requests to your API and check that you actually get to see all 3 cases in action in the service's logs.

### 3 - Queue size

Overload problems have a tendency to build upon each other. You'll face it here. Once your circuit breaker pops in, messages won't get sent, and will pile up in the queue. That's fine as long as the problem is transitory; but if the problem persists, the queue will continue to grow indefinitely. New problems will arise as a result that could worsen the situation and affect other components of your system. 

For instance, this growing queue could eat up all the memory of the server, causing all other components running there to fail. To prevent it, you're going to implement a simple backpressure system for this queue.

1. Use environment variables to define the limits of the queue's size. For example, a max size of 10 messages, and a recovery threshold of 5.
2. Make your service check the number of enqueued messages before putting anything else in there. If the queue reaches its max size, stop publishing messages and return and error instead. Any request received from that point on will fail, until the queue goes back to its recovery threshold. Once the queue is back to that number, you can reactivate the publishing feature until reaching the queue's max size again, and so on.
3. Print out a log message whenever you enable or disable message enqueueing.
4. Use a client to check those limits on your API. Play around with different sizes and thresholds to see how the system reacts. You should be able to see how it all happens: start seeing errors in the `messageapp` system, the circuit breaker activating, the queue getting full and messages not being enqueued anymore, until the service starts recovering and gets back to normal.

Is not enough to check that your system works as expected. Clients of this system also need to know what's happening. Make sure you return meaningful error messages, so they can implement similar strategies to the ones you're implementing here, and stop issuing requests in the case of a system overload.
