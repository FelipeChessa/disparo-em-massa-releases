// GET /api/admin/activations?token=SEU_ADMIN_TOKEN — lista todas as chaves já ativadas e em
// qual computador.

import { redis } from '../../lib/redis.js'
import { requireAdmin } from '../../lib/verify.js'

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return

  const keys = await redis.keys('activation:*')
  const result = {}
  for (const redisKey of keys) {
    result[redisKey.replace('activation:', '')] = await redis.get(redisKey)
  }
  res.status(200).json(result)
}
