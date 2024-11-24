import { Buffer } from 'node:buffer';

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

  // You can use UTF-8 encoding for the subject using the method below.
  // You can also just use a plain string if you don't need anything fancy.
  const subject = '🤘 Hello 🤘'
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`
  const messageParts = [
    'From: zhoukekestar <zhoukekestar@gmail.com>',
    'To: robot replay <zhoukekestar@163.com>',
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    'This is a message just to say hello.',
    'So... <b>Hello!</b>  🤘❤️😎'
  ]
  const message = messageParts.join('\n')

  // The body needs to be base64url encoded.
  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')


  const values = {
    raw: encodedMessage,
  }
  const res = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
    {
      method: 'POST',
      headers,
      body: new URLSearchParams(values).toString()
    }
  ).then(d => d.text())

  return new Response(res)
}
