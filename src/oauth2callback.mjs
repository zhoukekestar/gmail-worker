import { redirectUri } from "./const.mjs"

// https://gmail-worker.zhoukekestar.workers.dev/oauth2callback
export default async ({ req, env }) => {

  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const code = searchParams.get('code')
  if (!code) {
    return new Response("no text found");
  }

  // 初始化 authclient
  const kv = env['gmail-worker-kv']
  const clientId = await kv.get('clientId')
  const clientSecret = await kv.get('clientSecret')
  const client = new OAuth2Client(clientId, clientSecret)
  
  // 获取 token
  const { tokens } = await client.getToken({
    code: code,
    redirect_uri: redirectUri,
  })

  await kv.put('credentials', JSON.stringify(tokens));

  return new Response('hi')
}
