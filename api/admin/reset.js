// POST /api/admin/reset?token=SEU_ADMIN_TOKEN  body: { "key": "..." }
// Libera a chave para ser ativada em outro computador (cliente trocou de PC ou formatou).
// Também desfaz uma revogação, se houver.

import { redis } from '../../lib/redis.js'
import { requireAdmin } from '../../lib/verify.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' })
  if (!requireAdmin(req, res)) return

  const { key } = req.body || {}
  await redis.del(`activation:${(key || '').trim()}`)
  res.status(200).json({ ok: true })
}
