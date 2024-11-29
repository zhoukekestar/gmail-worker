import { TOKEN_URL, DEFAULT_HEADERS } from './const.mjs'

export const getToken = async env => {
  // 初始化 authclient
  const kv = env['gmail-worker-kv']
  const credentials = JSON.parse(await kv.get('credentials'))

  const now = Date.now()
  if (credentials.expired > now) {
    return credentials?.access_token
  }

  return await refreshAndGetToken(kv, credentials)
}

async function refreshAndGetToken (kv, credentials) {
  // 初始化 authclient
  const clientId = await kv.get('clientId')
  const clientSecret = await kv.get('clientSecret')
  const refreshToken = credentials.refresh_token

  if (!refreshToken) {
    throw new Error('no refreshtoken found!')
  }

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

    // 过期时间，提前一分钟刷新，避免以为没过期，但过期的情况
    token.expired = Date.now() + token.expires_in * 1000 - 1000 * 60;
    token.expired_iso_time = new Date(token.expired).toISOString();
    
    // 写入更新时间
    tokens.updated_iso_time = new Date().toISOString()

    // 更新
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
