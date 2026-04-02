const client = require("./redisClient");

async function get(key) {
  if (!client.isOpen) return null;
  try {
    const raw = await client.get(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function set(key, value, ttlMs = 30000) {
  if (!client.isOpen) return;
  try {
    const payload = JSON.stringify(value);
    if (ttlMs) {
      const ttlSeconds = Math.max(1, Math.round(ttlMs / 1000));
      await client.set(key, payload, { EX: ttlSeconds });
    } else {
      await client.set(key, payload);
    }
  } catch {
    // Ignore cache errors
  }
}

async function del(key) {
  if (!client.isOpen) return;
  try {
    await client.del(key);
  } catch {
    // Ignore cache errors
  }
}

async function clearPrefix(prefix) {
  if (!client.isOpen) return;
  try {
    let cursor = "0";
    do {
      const reply = await client.scan(cursor, {
        MATCH: `${prefix}*`,
        COUNT: 100,
      });
      cursor = reply.cursor;
      if (reply.keys.length) {
        await client.del(reply.keys);
      }
    } while (cursor !== "0");
  } catch {
    // Ignore cache errors
  }
}

module.exports = {
  get,
  set,
  del,
  clearPrefix,
};
