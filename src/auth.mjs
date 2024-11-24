import { OAuth2Client } from 'google-auth-library'
import { redirectUri } from './const.mjs'

export default async ({ env }) => {
  const kv = env['gmail-worker-kv']
  const clientId = await kv.get('clientId')
  const clientSecret = await kv.get('clientSecret')
  const client = new OAuth2Client(clientId, clientSecret)

  const authorizeUrl = client.generateAuthUrl({
    redirect_uri: redirectUri,
    prompt: 'consent',
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly'].join(' ')
  })

  const statusCode = 302
  return Response.redirect(authorizeUrl, statusCode)
}
