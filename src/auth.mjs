import { REDIRECT_URI } from './const.mjs'

export default async ({ env }) => {
  const kv = env['gmail-worker-kv']
  const clientId = await kv.get('clientId')

  const query = {
    redirect_uri: REDIRECT_URI,
    prompt: 'consent',
    access_type: 'offline',
    scope: [
      'https://mail.google.com/',
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.compose',
      'https://www.googleapis.com/auth/gmail.send'
    ].join(' '),
    response_type: 'code',
    client_id: clientId
  }

  // 拼接 google 授权路径
  const authorizeUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams(
    query
  ).toString()}`

  // 302 跳转
  const statusCode = 302
  return Response.redirect(authorizeUrl, statusCode)
}
