# Exercise 7

## Intro

By now you have a functional version of this application, featuring high availability and capable of handling a high volume of requests. On one hand you can send messages, and on the other you can invoice that service.

### 1 - Divide and conquer

As time goes by, you may get requests to either fine tune or extend the application. Current architecture could make that somewhat difficult. To prepare for it, you'll implement an event based architecture instead. This design will enable you to more easily add new features later on without having to modify existing code.
 
- Extract to a module all functionality related to invoicing and credit handling, and containerise it.
- Split the databases so that each service will only persist the information it deals with. The service that sends messages will have its own database, containing the record of sent messages. The new service for credit management and invoicing will have its own database for that data.
- Create a way for those two services to communicate among each other. When a service creates or updates data, it will publish an event (to a queue, for instance) so that other service can consume that event and react to it updating its own data.

### 2 - Any news about my request?

Now both services process the information independently of each other, and can communicate among each other too. Check whether the application still provides the exact same features it did up until now, but using this event based architecture that you just wrote.

- Think about the possible statuses a message could have now that there are two separate services involved.
- What do these changes mean to the data model? Are you saving the same data?
- Update the messages record so that it can reflect those statuses.
