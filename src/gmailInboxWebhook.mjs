import getGeminiResponse from './utils/getGeminiResponse.mjs'
import sendMail from './utils/sendMail.mjs'
import markAsRead from './utils/markAsRead.mjs'
import { marked } from 'marked'
import getUnreadMsgs from './utils/getUnreadMsgs.mjs'

export default async ({ req, env }) => {
  console.log('push webhook start!')
  const kv = env['gmail-worker-kv']
  const APIKEY = await kv.get('GEMINI_APIKEY')
  if (!APIKEY) {
    return new Response('NO APIKEY Found!')
  }

  const unreads = await getUnreadMsgs(env)

  for (let i = 0; i < unreads.length; i++) {
    const { text, from, to, id } = unreads[i]

    console.log('process ', from, to, text)

    const read = await markAsRead(env, id)

    console.log('mark read ', read)

    // AI 回复
    const responseText = await getGeminiResponse(APIKEY, text)

    console.log('response ' + responseText)

    // 发送邮件
    const res = await sendMail(env, to, from, marked(responseText), unreads[i])

    console.log('res ', res)
  }

  // 返回结果
  return new Response('process ' + unreads.length)
}
