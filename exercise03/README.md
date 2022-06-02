# Exercise 3

You've built a service that encapsulates the logic of sending messages to an external provider, and offers an API contract fully documented and tested.

Now, you'll be adding a new feature: a record of all the messages so that we can find out at any given time what messages have been sent.

## 1. Create an API to record the messages
For the persistence layer you'll be using [MongoDB](https://www.mongodb.com/). Follow these steps:
- Build the model. You can use [mongoose](https://mongoosejs.com/), but if you'd rather use a different technology, go ahead. Just make sure you explain why you chose that solution instead.
- Implement a module that records the messages on the database.

As you can see, you're expected to use encapsulation here too, by keeping this feature within its own module. This allows you to develop the recording feature separately from the other components of the service, and will allow for changes in the implementation of the persistence layer that will come along later on.

You're also expected to define this new module API's contract, document it, and test it. You're expected to deliver a robust component with a well defined contract and fully tested.

## 2. Record the messages in the persistence layer

Use the module you've just created to persist the messages that the service receives via its `/messages` endpoint.

## 3. Check messages sent
The clients of this service want to be able to check the messages they've sent. In order to do that, you'll need to provide some kind of access to the record, but... Did you take it into account when designing the persistence module's API? If the answer's no, don't worry. Now is the time to do it.

- Implement the changes you need in the persistence module to add this new feature of reading the messages stored in there.
- Add a new endpoint to the service's API. It will use the GET HTTP method, and will return all the messages.

## 4. Is your recording feature robust?
The external service that you're using to send messages bills you per message sent, but the math isn't adding up. You'll want to use the record to check if the provider's invoices are correct but, are you certain that your record of sent messages is absolutely correct?

You have to make sure that it behaves as expected in every possible scenario:
- If the external provider returns a 200 OK to the message request, that should be recorded.
- If the external provider returns an error message to your request, the record should show that the message was not sent.
- If the external provider timed out, the message should be recorded as sent but not confirmed.

What if the database malfunctions?
Is an error in sending a message equally important as an error checking the record?

Think about how to handle those errors to guarantee that your data is consistent. Your clients will expect your services and APIs to work exactly as their contracts say they do.