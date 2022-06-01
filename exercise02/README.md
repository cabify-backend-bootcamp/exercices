# Exercise 2

## Intro
Building a service or an API is not as simple as just writing it. You can have more control over s service that's only going to be used internally, but most frequently you'll be writing code that external clients will use.

It's important that your API or service presents a strict _contract_ explicitly. You must specify each and everyone of the possible results that the service can produce, so that other programmers and clients can identify them and know how to interact with the service.

On top of that, you'll have to protect your service too. A reckless or even malicious client could start sending unexpected requests, triggering unexpected behaviours in the service, degradation or even downtime for the rest of the clients. To avoid it, you'll need to implement software security mechanisms and a robust error handling system.

You'll be working in pairs for this second exercise, trying to cause damage to the system your partner developed on Exercise 1. You'll then document your findings and try to protect against those attacks.

###  1 - Hack your partner's service
- Download your partner's service and try to hack or break it. You can use tools such as [Postman](https://www.getpostman.com/) or [cURL](https://curl.haxx.se/) to send wrong or unexpected requests. Document the results you get versus what was the expected response for those requests.
- Document them as clearly as possible and share them with your partner once you're done.
- Implement a command line client to automate the tests that you ran that caused unexpected results. To do so, you can first create a client module for your service, and then the command line could use that. Your partner will be able to use that client too to validate whether they've solved the issues you found. Make sure you document how to use this client and include all the requests you consider relevant, including all those that caused unexpected or wrong behaviors.

### 2 - Recover your service

The goal is a robust stable service with an explicit contract. Leverage error handling and validations inside your service to make it as robust as possible. And don't forget to return the appropriate HTTP status codes so that the clients or engineers using it know at all times what's happening. Follow these steps: 
- Pick up the notes from your partner and the client they've prepared to validate your implementation changes
- Improve your service so it prevents those errors and stops breaking or behaving unexpectedly in those cases. Check your changes using the client your partner has provided.

### 3 - Documentation

Up until now, the _contract_ was just informal. Even so, you and your partner probably agree that some things were working as expected, while others not so much. It's time to make that contract official in the form of a strict documentation provided within your service.

- Create a `README.md` file or a `doc/` folder. You'll use it to document what requests your service accepts, and what are the possible success and error responses it can return.
- Document the different APIs of the components you've developed.