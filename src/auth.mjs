// import { OAuth2Client } from 'google-auth-library'
import { localClientId, redirectUri } from './const.mjs'

export default async ({ env }) => {
  const kv = env['gmail-worker-kv']
  const clientId = await kv.get('clientId') || localClientId;
  // const clientSecret = await kv.get('clientSecret')
  // const client = new OAuth2Client(clientId, clientSecret)

  // const authorizeUrl = client.generateAuthUrl({
  //   redirect_uri: redirectUri,
  //   prompt: 'consent',
  //   access_type: 'offline',
  //   scope: ['https://www.googleapis.com/auth/gmail.readonly'].join(' ')
  // })

  const query = {
    redirect_uri: redirectUri,
    prompt: 'consent',
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly'].join(' '),
    response_type: 'code',
    client_id: clientId,
  }
  const authorizeUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams(query).toString()}`;

  const statusCode = 302
  return Response.redirect(authorizeUrl, statusCode)
}
