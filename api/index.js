// GET /api — checagem rápida de que o deploy está no ar.

export default function handler(req, res) {
  res.status(200).json({ ok: true, service: 'servidor de ativação de licenças (Vercel)' })
}
