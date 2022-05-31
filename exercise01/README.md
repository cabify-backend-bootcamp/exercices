# Exercise 1

## Intro
During this bootcamp you'll be working on an evolving project, expanding it as you learn new concepts. It'll be a basic messaging system. Because the logistics of actually _delivering_ the messages can get rather complex, we'll leave that part out and just use an external service instead, `messageapp`, that will handle all that complexity for you.

In this first exercise, you'll build a very simple API that'll interact with that external service. The service is available here as an external docker image.

###  1 - Clone the repository and spin up messageapp
Along the instructions for the exercise, you'll find also a `docker-compose.yml` file. This file instructs docker-compose on how to build the distributed system this exercise requires. Take a closer look and you'll see there are a few lines commented out, those that start with `#`. You'll need to uncomment those lines later on. But for now, let's just spin up the `messageapp` service on its own.

To do that, move to this folder on your command line, and execute this command:
```sh
$ docker-compose up
```
If you use linux, that should work out of the box, but remember that if you're using mac, you need to start the docker daemon first, or else you'll get an error on the console.

The output of the command will show it downloads the image and spins up the container with the service. Once the service has started, you can check that it works correctly by sending a request. You can use whatever tool you are comfortable with, such as Postman or cURL, for instance. Try this request:

```
HOST 'localhost'
PORT 3000
POST '/message'
'Content-Type': 'application/json',
{
  "destination": "STRING",
  "body": "STRING"
}
```

The service will send you a response. If it's gone well, you'll be receiving a `200` HTTP response code with the message `OK` from the `messageapp` service, and you'll also be able to see some output from the container in the command window where you spun it up.

### 2 - Create your service
The goal is to create a new service that'll make use of `messageapp`. At first, it'll do basically the same `messageapp` already does, but you'll be adding more complexity to it as you progress through the bootcamp.

For now, let's just build a _hello, world_ to check that it all works. Follow these steps:
1. Implement the service using JavaScript, NodeJS and Express. The service must listen on port 9001 and respond to an endpoint with the string "Hello world".
2. Containerise the service. To do so, you'll be creating a `Dockerfile` that will describe the image.
3. Uncomment those lines that were commented out on the [docker-compose.yml](docker-compose.yml) file and spin up the whole system to check it works.

We advise that you take separate steps for building (`docker-compose build`) and spinning up (`docker-compose up`) the system, as those are two separate operations and making sure your build works first, will help you understand better the feedback from the commands output.

### 3 - Create the client module
The goal of this section is to build a NodeJS module that'll encapsulate all requests to the `messageapp` service. This will make the code more maintainable. If the `messageapp` service changed their API definition, you'd only need to adapt this part of the code to keep it working.

This module will be receiving a `destination` and a `message`, will call the `messageapp` API, and will return the result of the request. It is up to you to define its interface however you see fit.

You can also write a small client program that uses this module to test its functionality, or add automated tests. That's entirely up to you.

### 4 - Publicly expose the API
We want our clients to be able to send messages. To do so, you'll need to create a new endpoint using Express where they can submit which messages the service should be sending and to whom.

This endpoint should respect the following definition:

```
HOST 'localhost'
PORT 9001
POST '/messages'
'Content-Type': 'application/json'
{
  "destination": "STRING",
  "message": "STRING"
}
```

As you can see, it's basically the same API contract that `messageapp` offers. For now, the service you've built is just a proxy between our clients and `messageapp`.

### 5 - Error handling
Things don't always work as expected. You'll have fought your fair share of errors while completing this exercise. Maybe you've seen that the `messageapp` service can sometimes take a long time to answer, and sometimes it returns errors. 

One can never know if external services will work as expected or if they'll be even up 100% of the times. That's why it's imperative to learn how to handle errors.

This section will start laying the easiest foundation for error handling. For now there are 2 components to this system, and any of them could fail; yes, the code you've written can fail too, be it due to bugs, data inconsistencies, etc. To indicate errors, use standard status codes. For now you only need to indicate whether the request was successfully completed or not: 
- 200: Use HTTP status code 200 when the request was successfully completed and the message delivered.
- 500: Use HTTP status code 500 if anything went wrong, regardless of which service failed.

Optionally, you can also add an error message to the response, providing more information about what went wrong.

