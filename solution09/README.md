# Solution steps

1. Add the `deploy: replicas` field to the `docker-compose.yml` file for your two services. In this proposed solution you'll see a `hello-world` image used as example. You'd be of course using your own containerised applications here.
    
   Note that you need to use `docker-compose --compatibility up` to get the `deploy: replicas` field to work.

2. Check that everything works as intended. You can use `while :; do curl localhost:48151 2>&1 | grep host ; done`. This would output the hostname of the container that is processing each request sent, and you should see that the canary one is only showing up for a fraction of them.

3. Add `-H "X-MISTERY-SHOPPER;"` to the curl command and you should see all traffic hitting the canary.

4. The `ab` command is useful to stress test your system and see how it works with a high number of requests. You can use it like this: `ab  -H 'X-MISTERY-SHOPPER' -n 500 -c 5 http://localhost:48151/` 

Remember that there's not only one way to roll out. The idea here is for you to play around with it and learn.
- You can keep adding canary instances and switching off the previous version ones one by one, simply by editing the `docker-compose.yml` file. Traffic will continue to randomly hit all instances available, but as you roll out the new version little by little, it will start receiving the new responses.
- You can choose to change the load balancer configuration in the `haproxy.cfg` file. Reload it in real time and you'll see the traffic stopped being routed to the old instances and hitting the new ones instead, as they become the new V1.


