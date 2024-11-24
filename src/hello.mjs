import { getEnv } from './env.mjs'
export default async () => {
  let message = `<h1>hello</h1>`
  const env = getEnv()

  if (env['gmail-worker-kv']) {
    message += ' gmail-worker-kv: ' + (await env['gmail-worker'].get('test1'))
  }

  return new Response(message, {
    headers: { 'Content-type': 'text/html' },
    status: 200
  })
}
