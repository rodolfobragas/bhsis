import { createClient } from "redis";
import logger from "./logger";

let redisClient: ReturnType<typeof createClient> | null = null;

export async function initRedis() {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            logger.error("Redis reconnection attempts exceeded");
            return new Error("Redis max retries exceeded");
          }
          return retries * 50;
        },
      },
    });

    redisClient.on("error", (err) => logger.error("Redis error:", err));
    redisClient.on("connect", () => logger.info("Redis connected"));

    await redisClient.connect();
    logger.info("Redis initialized successfully");
  } catch (error) {
    logger.error("Failed to initialize Redis:", error);
    // Continue without Redis if connection fails
  }
}

export function getRedisClient() {
  return redisClient;
}

export async function closeRedis() {
  if (redisClient) {
    await redisClient.quit();
  }
}
