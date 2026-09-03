// POST /api/admin/revoke?token=SEU_ADMIN_TOKEN  body: { "key": "..." }
// Bloqueia uma chave (ex: cliente pediu reembolso). Ela para de ativar em qualquer computador.

import { Redis } from '@upstash/redis'
import { requireAdmin } from '../../lib/verify.js'

const redis = Redis.fromEnv()

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' })
  if (!requireAdmin(req, res)) return

  const { key } = req.body || {}
  const redisKey = `activation:${(key || '').trim()}`
  const existing = await redis.get(redisKey)
  if (!existing) {
    return res.status(404).json({ error: 'Chave não encontrada (ainda não foi ativada por ninguém).' })
  }
  existing.revoked = true
  await redis.set(redisKey, existing)
  res.status(200).json({ ok: true })
}
