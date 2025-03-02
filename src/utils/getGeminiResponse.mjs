import { GoogleGenerativeAI } from './ai-sdk.mjs'
/**
 * 获取 AI 文本
 * @param {*} APIKEY
 * @param {*} text
 * @returns
 */
export default async (APIKEY, text) => {
  const genAI = new GoogleGenerativeAI(APIKEY)

  // https://aistudio.google.com/app/apikey
  // update model name
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const result = await model.generateContent(text)
  const response = await result.response
  const responseText = response.text()

  return responseText
}
