import { localClientId, localClientSecret, redirectUri } from './const.mjs'
import base64js from 'base64-js'
// import crypto from 'node:crypto'

const TOKEN_URL = 'https://oauth2.googleapis.com/token'

// https://gmail-worker.zhoukekestar.workers.dev/oauth2callback
export default async ({ req, env }) => {
  // 初始化 authclient
  const kv = env['gmail-worker-kv']
  const clientId = (await kv.get('clientId')) || localClientId
  const clientSecret = (await kv.get('clientSecret')) || localClientSecret
  const credentials = JSON.parse(await kv.get('credentials'))
  const refreshToken = credentials.refresh_token

  const tokens = await getToken({
    clientId,
    clientSecret,
    refreshToken
  })

  await kv.put('credentials', JSON.stringify(tokens))

  return new Response('hi')
}

async function getToken ({ clientId, refreshToken, clientSecret }) {
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
    // ...OAuth2Client.RETRY_CONFIG,
    method: 'POST',
    // url,
    body: new URLSearchParams(values).toString(),
    // data: querystring.stringify(values),
    headers
  }).then(d => d.json())

  console.log('token_result: ', JSON.stringify(res))
  return res
  // const tokens = res.data
}
