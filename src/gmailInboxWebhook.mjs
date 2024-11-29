import { fetchWithToken, postWithToken } from './utils.mjs'
import { GoogleGenerativeAI } from './ai-sdk.mjs'

export default async ({ req, env }) => {
  console.log('push webhook start!')
  const kv = env['gmail-worker-kv']
  const APIKEY = await kv.get('GEMINI_APIKEY');
  if (!APIKEY) {
    return new Response("NO APIKEY Found!");
  }

  // 获取最新的邮件
  const { text, from, to } = await fetchLastMessage(env);

  // AI 回复
  const responseText = await getGeminiResponse(APIKEY, text);

  // 发送邮件
  const res = await sendEmail(env, to, from, responseText)

  // 返回结果
  return new Response(JSON.stringify(res));
}


async function fetchLastMessage (env) {
  
  const list = await fetchWithToken(
    env,
    'https://gmail.googleapis.com/gmail/v1/users/me/messages?labelIds=Label_5193471176394763511'
  )
  const lastMessageId = list?.messages[0]?.id
  const msg = await fetchWithToken(
    env,
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${lastMessageId}`
  )
  const text = msg.snippet
  const from = msg.payload.headers.find(t => t.name == 'From').value
  const to = msg.payload.headers.find(t => t.name == 'To').value

  return { text, from, to }
}

/**
 * 获取 AI 文本
 * @param {*} APIKEY
 * @param {*} text
 * @returns
 */
async function getGeminiResponse (APIKEY, text) {
  const genAI = new GoogleGenerativeAI(APIKEY)

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const result = await model.generateContent(text)
  const response = await result.response
  const responseText = response.text()

  return responseText
}

async function sendEmail (env, from, to, text) {
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
