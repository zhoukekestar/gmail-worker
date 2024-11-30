import parser from 'gmail-api-parse-message'
import { parseFromString } from 'dom-parser'

export default json => {
  const mailJson = parser(json)

  const rawHTML = '<div id="gmailWorkerRoot">' + mailJson.textHtml + '</div>'
  const dom = parseFromString(rawHTML)
  const root = dom.getElementById('gmailWorkerRoot')
  let text = root.textContent

  //   去除引用内容
  const replyTip = dom.getElementById('isReplyContentTip')
  const replyContent = dom.getElementById('isReplyContent')
  if (replyTip) {
    text = text.replace(replyTip.textContent, '')
  }
  if (replyContent) {
    text = text.replace(replyContent.textContent, '')
  }

  return {
    text: text.trim(),
    from: mailJson.from,
    to: mailJson.to,
    id: mailJson.id,
    historyId: mailJson.historyId,
    threadId: mailJson.threadId
  }
}
