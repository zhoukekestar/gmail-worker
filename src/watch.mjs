
export default async ({ req, env }) => {
  // 初始化 authclient
  const kv = env['gmail-worker-kv']
  const credentials = JSON.parse(await kv.get('credentials'))

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'x-goog-api-client': 'gdcl/7.2.0 gl-node/18.18.2',
    'Accept-Encoding': 'gzip',
    'User-Agent': 'google-api-nodejs-client/7.2.0 (gzip)',
    Authorization: `Bearer ${credentials?.access_token}`
  }

  const values = {
    topicName: 'projects/gmail-robot-442703/topics/gmail-inbox'
  }
  
  const res = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/watch',
    {
      method: "POST",
      headers,
      body: new URLSearchParams(values).toString(),
    }
  ).then(d => d.text())

  return new Response(res)
}
