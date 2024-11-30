import parseMessage from './parseMessage.mjs'
import { fetchWithToken } from './request.mjs'

export default async env => {
  const list = await fetchWithToken(
    env,
    'https://gmail.googleapis.com/gmail/v1/users/me/messages?q=is:unread&labelIds=INBOX'
  )
  const msgs = list?.messages || []

  const parsedMessages = []

  //   解析所有未读邮件
  for (let i = 0; i < msgs.length; i++) {
    const messageId = msgs[i].id
    const response = await fetchWithToken(
      env,
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`
    )

    // 避免死循环，自己和自己对话
    if (from.indexOf('weichenhairobot@gmail.com') > -1) {
      console.log('from myself')
      continue
    }

    parsedMessages.push(parseMessage(response))
  }

  return parsedMessages
}
