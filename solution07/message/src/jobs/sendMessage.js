import http from "http";
import { v1 as uuid } from "uuid";

import send_queue from "../queues/pub.js";
import receive_queue from "../queues/sub.js";
import saveMessage from "../clients/saveMessage.js";

import Message from "../models/message.js";

import urls from "../urls.js";

const random = (n) => Math.floor(Math.random() * Math.floor(n));

receive_queue.process(async (job, done) => {
  const messageData = { ...job.data };

  if (job.data.status !== "OK") {
    console.log("Credito insuficiente");

    await saveMessage({
      ...messageData,
      status: "ERROR",
    });

    done();
    return;
  }

  const postOptions = {
    host: urls.MESSAGEAPP_HOST,
    port: 3000,
    path: "/message",
    method: "post",
    json: true,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(JSON.stringify(messageData)),
    },
  };

  const postReq = http.request(postOptions);

  console.log("Processing job");
  console.log(messageData);

  postReq.on("response", async (postRes) => {
    if (postRes.statusCode === 200) {
      await saveMessage({
        ...messageData,
        status: "OK",
      });
    } else {
      console.error("Error while sending message");
      await saveMessage({
        ...messageData,
        status: "ERROR",
      });
    }

    done();
  });

  postReq.setTimeout(random(6000));

  postReq.on("timeout", async () => {
    console.error("Timeout Exceeded!");
    postReq.abort();

    await saveMessage({
      ...messageData,
      status: "TIMEOUT",
    });

    done();
  });

  postReq.on("error", () => {});

  postReq.write(JSON.stringify(messageData));
  postReq.end();
});

export default async function addJob(jobParams) {
  const messageId = uuid();

  const messageParams = {
    ...jobParams,
    _id: messageId,
    status: "QUEUED",
  };

  const jobOpts = {
    delay: 2000,
  };

  await saveMessage(messageParams);

  const MessageModel = Message();
  const message = new MessageModel(messageParams);
  await send_queue.add(message, jobOpts);

  return messageId;
}
