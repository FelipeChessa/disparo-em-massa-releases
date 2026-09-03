// POST /api/activate — chamado uma vez pelo app do cliente, no momento em que ele clica
// "Ativar". Registra em qual computador (deviceId) a chave foi usada pela primeira vez e
// recusa uma segunda ativação com a mesma chave em outro computador.

import { Redis } from '@upstash/redis'
import { verifySignature } from '../lib/verify.js'

const redis = Redis.fromEnv()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Método não permitido.' })
  }

  const { key, deviceId } = req.body || {}

  const payload = verifySignature(key)
  if (!payload) {
    return res.status(400).json({ ok: false, error: 'Chave inválida.' })
  }
  if (payload.expiresAt && new Date(payload.expiresAt).getTime() < Date.now()) {
    return res.status(403).json({ ok: false, error: 'Licença expirada.' })
  }
  if (!deviceId || typeof deviceId !== 'string') {
    return res.status(400).json({ ok: false, error: 'Identificador do computador ausente.' })
  }

  const redisKey = `activation:${key.trim()}`
  const existing = await redis.get(redisKey)

  if (existing?.revoked) {
    return res.status(403).json({ ok: false, error: 'Esta chave foi revogada.' })
  }
  if (existing && existing.deviceId !== deviceId) {
    return res.status(409).json({ ok: false, error: 'Esta chave já foi ativada em outro computador.' })
  }

  await redis.set(redisKey, {
    deviceId,
    customer: payload.customer,
    firstActivatedAt: existing?.firstActivatedAt || new Date().toISOString(),
    lastSeenAt: new Date().toISOString()
  })

  res.status(200).json({ ok: true })
}
