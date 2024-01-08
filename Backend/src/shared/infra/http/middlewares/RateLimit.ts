import { type Request, type Response, type NextFunction } from 'express'
import { createClient } from 'redis'
import { RateLimiterRedis } from 'rate-limiter-flexible'
import AppError from '../../../errors/AppError'

const redisClient = createClient({
  password: undefined,
  socket: {
    host: 'localhost',
    port: 6379,
    tls: true
  }
})

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'ratelimit',
  points: 5,
  duration: 1
})

export default async function rateLimiter (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  try {
    await limiter.consume(request.ip)

    next()
  } catch (err) {
    throw new AppError('Too many requests', 429)
  }
}
