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
  const lastMessage = await fetchLastMessage(env);

  if (!lastMessage) {
    console.log('all readed');
    return new Response('NOTHING TODO');
  }

  const { text, from, to, messageId } = lastMessage;

  console.log('last ' + from + to + text);

  const read = await markAsRead(env, messageId);

  console.log('mark read ', read);

  // AI 回复
  const responseText = await getGeminiResponse(APIKEY, text);

  console.log('response ' + responseText);

  // 发送邮件
  const res = await sendEmail(env, to, from, responseText)

  console.log('res ', res)
  // 返回结果
  return new Response(JSON.stringify(res));
}


async function fetchLastMessage (env) {
  
  const list = await fetchWithToken(
    env,
    'https://gmail.googleapis.com/gmail/v1/users/me/messages?q=is:unread&labelIds=INBOX'
  )
  const lastMessageId = list?.messages?.[0]?.id

  if (!lastMessageId) return null;

  const msg = await fetchWithToken(
    env,
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${lastMessageId}`
  )
  const text = msg.snippet
  const from = msg.payload.headers.find(t => t.name == 'From').value
  const to = msg.payload.headers.find(t => t.name == 'To').value

  // 避免死循环，自己和自己对话
  if (from.indexOf('weichenhairobot') > -1) {
    console.log('from myself');
    return null;
  }

  return { text, from, to, messageId: lastMessageId }
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



async function markAsRead (env, id) {

  const res = await postWithToken(
    env,
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}/modify`,
    {
      body: JSON.stringify({
        addLabelIds: [],
        removeLabelIds: ['UNREAD']
      })
    }
  )

  return res
}
