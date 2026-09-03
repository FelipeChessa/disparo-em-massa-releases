// Cliente Redis compartilhado. A integração Upstash-Vercel cria as variáveis de ambiente com
// o prefixo KV_ (compatibilidade com o antigo produto "Vercel KV"), não UPSTASH_ — por isso não
// dá pra usar Redis.fromEnv() direto, precisa apontar os nomes certos manualmente.

import { Redis } from '@upstash/redis'

const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

export const redis = new Redis({ url, token })
