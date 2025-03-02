import { GoogleGenerativeAI } from './ai-sdk.mjs'
// import { GoogleGenerativeAI } from '@google/generative-ai'
// import fetch from 'node-fetch';
// import { HttpsProxyAgent } from 'https-proxy-agent';

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

  // let agent;
  // if (process.env.http_proxy) {
  //   agent = new HttpsProxyAgent(process.env.http_proxy);
  // }


  const result = await model.generateContent(text, {
    // fetch,
    // agent,
  })
  const response = await result.response
  const responseText = response.text()

  return responseText
}
