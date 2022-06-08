# Exercise 6

## Intro

You've made some crucial improvements in reliability that the clients of this application will love. With more clients, now the application will have to be able to deal with a high number of concurrent requests.

### 1 - Leave things for later

Asynchronicity is a key strategy to be able to serve a bigger number of requests without overloading the system. To implement it, you'll be using queues. This will enable the system to process each incoming request faster, and thus also to process more requests from more clients.

- Define and spin up a `redis` instance
- Implement a work queue based on `redis`. You can write it from scratch or use any existing library, it's up to you.
- Implement a process that gets the enqueued requests (in chronological order) and sends the messages.
- Update the `/messages` endpoint. Now it should enqueue the requests it receives, so that they are processed asynchronously later on. Think about what the response from this endpoint should look like now that the messages aren't processed immediately. What can it respond before the request gets processed?

### 2 - Any news about my request?

Now there's a new problem. A client sends a request but they don't know whether their message got through or not. You need to offer them a way to check the status of that message: was it delivered? is it still waiting? were there any errors? In order to do this, you'll need a way to uniquely identify those messages. 

- Assign a unique identifier to each message received via the `/messages` endpoint. This will enable the system to check the status of those messages later on.
- Implement a new `GET` `/message/:messageId/status` endpoint that lets a client check the status of a message. It will accept a message id as a parameter within its path. For instance: `http://127.0.0.1:9006/message/156656739486/status`. Its response will be a JSON string with a single field `status` that will contain the status of the message requested.
- Think about what statuses a message could have now that they're processed asynchronously.
- What do these changes mean for the data model you've been using up until now? Should you be saving some more data? Should the way you save that data change at all?
