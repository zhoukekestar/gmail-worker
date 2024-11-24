import { REDIRECT_URI, TOKEN_URL } from './const.mjs'

export default async ({ req, env }) => {
  // 回调参数
  const url = new URL(req.url)
  const searchParams = url.searchParams
  const code = searchParams.get('code')
  if (!code) {
    return new Response('no text found')
  }

  // 初始化 authclient
  const kv = env['gmail-worker-kv']
  const clientId = await kv.get('clientId')
  const clientSecret = await kv.get('clientSecret')

  // 获取 token
  const tokens = await getToken({
    clientId,
    clientSecret,
    redirectUri: REDIRECT_URI,
    codeVerifier: '',
    code
  })

  // 保存 token
  if (tokens.access_token) {
    tokens.updated = new Date().toISOString();
    await kv.put('credentials', JSON.stringify(tokens))
    return new Response('auth success!')
  } else {
    console.log('token error', JSON.stringify(tokens))
    return new Response('auth error!')
  }
}

async function getToken ({
  clientId,
  code,
  redirectUri,
  codeVerifier,
  clientSecret
}) {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'google-api-nodejs-client/9.15.0',
    'x-goog-api-client': 'gl-node/18.18.2'
  }
  const values = {
    client_id: clientId,
    code_verifier: codeVerifier,
    code: code,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
    client_secret: clientSecret
  }

  console.log(
    'fetch ',
    TOKEN_URL,
    new URLSearchParams(values).toString(),
    headers
  )
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    body: new URLSearchParams(values).toString(),
    headers
  }).then(d => d.json())

  console.log('token_result: ', JSON.stringify(res))
  return res
}
