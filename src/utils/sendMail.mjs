
import { postWithToken } from "./request.mjs"

export default async (env, from, to, text) => {
    // You can also just use a plain string if you don't need anything fancy.
    const subject = 'Auto Reply'
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`
    const messageParts = [
      `From: ${from}`,
      `To: ${to}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${utf8Subject}`,
      '',
      text
    ]
    const message = messageParts.join('\n')
  
    // The body needs to be base64url encoded.
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  
    const res = await postWithToken(
      env,
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/send`,
      {
        body: JSON.stringify({
          raw: encodedMessage
        })
      }
    )
  
    return res
  }
