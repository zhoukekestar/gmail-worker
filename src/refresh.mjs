import { TOKEN_URL } from './const.mjs'

export default async ({ env }) => {
  // 初始化 authclient
  const kv = env['gmail-worker-kv']
  const clientId = (await kv.get('clientId'))
  const clientSecret = (await kv.get('clientSecret'))
  const credentials = JSON.parse(await kv.get('credentials'))
  const refreshToken = credentials.refresh_token

  if (!refreshToken) {
    console.log('refreshToken is empty');
    return;
  }

  // 刷新获取新的 token
  const tokens = await refreshTokenRequest({
    clientId,
    clientSecret,
    refreshToken
  })

  // 保存 token
  if (tokens.access_token) {
    console.log('refresh token successful! ', JSON.stringify(tokens))
    await kv.put('credentials', JSON.stringify(tokens))
  } else {
    console.log('token error', JSON.stringify(tokens))
  }
  return new Response('refresh ok!');
}

async function refreshTokenRequest ({ clientId, refreshToken, clientSecret }) {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'google-api-nodejs-client/9.15.0',
    'x-goog-api-client': 'gl-node/18.18.2'
  }
  const values = {
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'refresh_token'
  }

  console.log(
    'fetch ',
    TOKEN_URL,
    new URLSearchParams(values).toString(),
    headers
  )
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    // url,
    body: new URLSearchParams(values).toString(),
    headers
  }).then(d => d.json())

  console.log('refresh token_result: ', JSON.stringify(res))
  return res
}
