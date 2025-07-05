import Redis from "ioredis";
import { REDIS_URL } from "../config/env.js";

const redisClient = new Redis(REDIS_URL);

redisClient.on("connect", () => {
  console.log("Redis connected");
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

export default redisClient;