import {redisClient}   from "../utils/cache";

export const log = async (payload: any) => {
  await redisClient.publish('logger', JSON.stringify(payload));
}