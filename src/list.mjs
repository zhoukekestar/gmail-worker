import { localClientId, localClientSecret, redirectUri } from './const.mjs'
// import { google } from 'googleapis';
// import { OAuth2Client } from 'google-auth-library'

export default async ({ req, env }) => {
  // 初始化 authclient
  const kv = env['gmail-worker-kv']
  // const clientId = await kv.get('clientId') || localClientId;
  // const clientSecret = await kv.get('clientSecret') || localClientSecret
  const credentials = JSON.parse(await kv.get('credentials'))
  // const client = new OAuth2Client(clientId, clientSecret)

  const headers = {
    'x-goog-api-client': 'gdcl/7.2.0 gl-node/18.18.2',
    'Accept-Encoding': 'gzip',
    'User-Agent': 'google-api-nodejs-client/7.2.0 (gzip)',
    Authorization:
      credentials?.access_token || credentials?.credentials?.access_token
  }

  const res = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages?historyId=929386',
    {
      headers
    }
  ).then(d => d.text())
  // "options": {
  //       "url": "https://gmail.googleapis.com/gmail/v1/users/{userId}/messages",
  //       "method": "GET",
  //       "apiVersion": ""
  //   },
  //   "params": {
  //       "userId": "me",
  //       "historyId": 929386
  //   },

  return new Response(res)
}
