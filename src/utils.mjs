import { TOKEN_URL, DEFAULT_HEADERS } from './const.mjs'

export const getToken = async env => {
  // 初始化 authclient
  const kv = env['gmail-worker-kv']
  const credentials = JSON.parse(await kv.get('credentials'))

  const now = Date.now()
  if (credentials.expired > now) {
    return credentials?.access_token
  }

  return await refreshAndGetToken(env)
}

async function refreshAndGetToken (env) {
  // 初始化 authclient
  const kv = env['gmail-worker-kv']
  const clientId = await kv.get('clientId')
  const clientSecret = await kv.get('clientSecret')
  const credentials = JSON.parse(await kv.get('credentials'))
  const refreshToken = credentials.refresh_token

  // 构造参数
  const values = {
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'refresh_token'
  }

  //   请求新的 token
  const tokens = await fetch(TOKEN_URL, {
    method: 'POST',
    body: new URLSearchParams(values).toString(),
    headers: DEFAULT_HEADERS
  }).then(d => d.json())

  // 保存 token
  if (tokens.access_token) {
    // 回写 refreshToken
    if (!tokens.refresh_token) {
      tokens.refresh_token = refreshToken
    }

    // 写入更新时间
    tokens.updated = new Date().toISOString()
    await kv.put('credentials', JSON.stringify(tokens))
    return tokens.access_token
  }
  
  throw new Error('no access_token found!')
}

export const fetchWithToken = async (env, url, opts) => {
  const token = await getToken(env)

  const headers = {
    ...DEFAULT_HEADERS,
    Authorization: `Bearer ${token}`
  }

  return await fetch(url, {
    headers,
    ...opts
  }).then(d => d.json())
}
