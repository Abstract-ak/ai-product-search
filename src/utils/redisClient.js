const { createClient } = require("redis");

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const client = createClient({ url: redisUrl });

client.on("error", (err) => {
  console.error("Redis Client Error:", err.message || err);
});

client.connect().catch((err) => {
  console.error("Redis Connect Error:", err.message || err);
});

module.exports = client;
