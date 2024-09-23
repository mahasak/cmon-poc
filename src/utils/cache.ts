import IoRedis from "ioredis";
import { CacheContainer } from 'node-ts-cache'
import { IoRedisStorage } from "node-ts-cache-storage-ioredis"


export const redisClient = new IoRedis({
    port: 6379, // Redis port
    host: process.env.REDIS_SERVER, // Redis host
    family: 4, // 4 (IPv4) or 6 (IPv6)
    password: process.env.REDIS_AUTH,
    db: 0
})

export const redisCache = new CacheContainer(new IoRedisStorage(redisClient))



