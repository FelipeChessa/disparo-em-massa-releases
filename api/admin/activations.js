// GET /api/admin/activations?token=SEU_ADMIN_TOKEN — lista todas as chaves já ativadas e em
// qual computador.

import { Redis } from '@upstash/redis'
import { requireAdmin } from '../../lib/verify.js'

const redis = Redis.fromEnv()

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return

  const keys = await redis.keys('activation:*')
  const result = {}
  for (const redisKey of keys) {
    result[redisKey.replace('activation:', '')] = await redis.get(redisKey)
  }
  res.status(200).json(result)
}
