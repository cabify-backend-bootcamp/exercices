# Exercise 5

## Intro

Availability is measured as the percentage of time your service is up and running, and accessible to its users. Every service is vulnerable in the face of its infrastructure failing: a server can go down, the disk can get full, etc. And all those problems directly impact the availability of the service.

In this case, the goal is to guarantee that the service remains available even in the event of a database failure. You'll be creating a new instance of the database, and implementing different replication models between its two nodes.

### 1 - Create a replica instance

- Define a new Mongo instance. You'll use it as the replica of the main database. Data replication is a solved issue in the industry, but you'll be implementing it yourself for this exercise.

### 2 - Data replication

The nature of this database lends itself to having more than one replication model:

- The credit database is critical. That information must never be outdated when processing any payment. Implement a replication model that guarantees strong consistency of the data. That means that the contents of the main database and those of the replica must match at all times. What changes do you need to implement in the writing operations?
The message record doesn't require such a strong consistency. Implement an eventually consistent model. It's not as strict as the previous one. How will you handle writing operations?

### 3 - How reliable are your replication mechanisms?

Once implemented, it's time to make sure the replication models work as expected:

- Is the service available even if the database main node fails? Stop the node and check it out.
- Is the data on the replica node consistent with the main one? It's important to check that the credit data is consistent. Using outdated data to pay for new messages is not acceptable.
- Once the main node comes back online, data there will be outdated. In this scenario, the nodes will switch roles. The one that had been the replica will become the main one, and vice versa. The new replica will also need to update its content since the service kept running while this node was offline.
- Think about this and other scenarios in which database nodes could be unavailable.
