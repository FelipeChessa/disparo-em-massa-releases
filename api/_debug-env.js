export default function handler(req, res) {
  const names = Object.keys(process.env).filter((k) =>
    /redis|upstash|kv_/i.test(k)
  )
  res.status(200).json({ names })
}
