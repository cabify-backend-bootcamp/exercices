import receive_queue from "../queues/sub.js";
import send_queue from "../queues/pub.js";
import updateCredit from "../clients/updateCredit.js";
import getCredit from "../clients/getCredit.js";

export default function () {
  receive_queue.process(async (job, done) => {
    const messageData = job.data;

    try {
      const credit = await getCredit();

      if (credit.amount - messageData.location.cost < 0) {
        console.error("Credito insuficiente");
        send_queue.add({
          ...messageData,
          status: "ERROR",
        });
      } else {
        console.error("Credito suficiente");
        await updateCredit(messageData);
        send_queue.add({
          ...messageData,
          status: "OK",
        });
      }

      done();
    } catch (error) {
      console.log(error);
      done(error);
    }
  });
}
