# Exercise 4

Costs of sending messages have gone through the roof. But maybe there's a way to use the fact that messages are persisted to limit those costs...

The new feature you'll be implementing now is a message budget. Once the client reaches that budget, the service will start returning errors.

As in previous exercises, you'll build this feature on top of the API your service is already offering.

## 1. Store the budget
- Widen your data model to include a _global_ budget.

## 2. Pay per message
- The `/message` now needs to check if there's credit left to send the message.
- If there is, it'll send the message. Then, if the message request succeeds, deduct that from the credit left.
- It there's no credit left, return an error message indicating that there's no credit left.

## 3. Top up the budget

Clients will need a way to top up their credit, so that the service doesn't stop working once they've run out of money. You'll be adding a new endpoint to the API for this feature:
- the path will be `/credit`
- the method will be `POST`
- the body of the request will be a JSON string, containing a single field, `amount`, of type integer.

```json
{
  "amount": 10
}
```

## 4. How safe is your credit system?

As usual, you need to stop for a minute to think about your system's reliability. You'll want to make sure you're not sending messages when there's no credit, that the client can top up their credit and most of all, that the topped up credit, usage of the service and credit left remain consistent. Money should not be appearing out of the blue, nor disappearing into thin air!

Here are some aspects you should take into account:
- If 2 messages are sent at the same time, concurrently, both should be deducted from the credit.
- If a message is sent at the same time the credit is being topped up, the credit should reflect both operations, the topup and the charge.
- If there's credit left and the message request fails, it should not be charged, even if there were other messages being sent at the same time.
- Define a behaviour for the case when there's credit left but the external provider times out. You could, for instance, charge the operation, and check again later on to revert that charge if the provider indeed failed to send the message.

Because you're working with a single instance for now, you can solve all of these issues using locks.