import { postWithToken } from './request.mjs'

export default async (env, from, to, text, mail) => {
  const { inReplyTo, references, subject } = mail

  // You can also just use a plain string if you don't need anything fancy.
  const utf8Subject = `=?utf-8?B?${Buffer.from(`RE:${subject || "Auto Reply"}`).toString(
    'base64'
  )}?=`
  const messageParts = [
    `From: ${from}`,
    `To: ${to}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`
  ]

  if (inReplyTo) {
    messageParts.push(`In-Reply-To: ${inReplyTo}`)
  }

  if (references) {
    messageParts.push(`References: ${references}`)
  }

  messageParts.push('')
  messageParts.push(text)

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
