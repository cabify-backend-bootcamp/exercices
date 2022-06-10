import Bull from "bull";
import urls from "../urls.js";

export default new Bull("message-service-queue", urls.REDIS_URL);
