// Verificação da assinatura da chave de licença — mesma lógica e mesma chave pública de
// src/license.js. As duas precisam ficar em sincronia (se o par de chaves for trocado, atualize
// aqui também).

import crypto from 'crypto'

const PUBLIC_KEY = crypto.createPublicKey(`-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAz0gFUiYAWxgjt6fe2ocMxVXRvsoYOhv6dr/TlGWzU3E=
-----END PUBLIC KEY-----`)

function base64UrlDecode(str) {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(str.length / 4) * 4, '=')
  return Buffer.from(padded, 'base64')
}

export function base64UrlEncode(buf) {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function verifySignature(licenseKey) {
  const parts = (licenseKey || '').trim().split('.')
  if (parts.length !== 2) return null
  const [payloadB64, sigB64] = parts
  try {
    const ok = crypto.verify(null, Buffer.from(payloadB64), PUBLIC_KEY, base64UrlDecode(sigB64))
    if (!ok) return null
    return JSON.parse(base64UrlDecode(payloadB64).toString('utf8'))
  } catch {
    return null
  }
}

export function requireAdmin(req, res) {
  const token = req.query?.token || req.headers['x-admin-token']
  if (!process.env.ADMIN_TOKEN) {
    res.status(503).json({ error: 'ADMIN_TOKEN não configurado no projeto Vercel.' })
    return false
  }
  if (token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Não autorizado.' })
    return false
  }
  return true
}
