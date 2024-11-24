import { localClientId, localClientSecret, redirectUri } from './const.mjs'
import base64js from "base64-js";
// import crypto from 'node:crypto'

const TOKEN_URL = 'https://oauth2.googleapis.com/token'
// const token_url = ''
// https://gmail-worker.zhoukekestar.workers.dev/oauth2callback
export default async ({ req, env }) => {
  const url = new URL(req.url)
  const searchParams = url.searchParams
  const code = searchParams.get('code')
  if (!code) {
    return new Response('no text found')
  }

  // 初始化 authclient
  const kv = env['gmail-worker-kv']
  const clientId = await kv.get('clientId') || localClientId;
  const clientSecret = await kv.get('clientSecret') || localClientSecret
  // const client = new OAuth2Client(clientId, clientSecret)

  // 获取 token
  // const { tokens } = await client.getToken({
  //   code: code,
  //   redirect_uri: redirectUri,
  // })

  const codeVerifier = await generateCodeVerifierAsync();

  await kv.put("codeVerifier", JSON.stringify(codeVerifier));
  const tokens = await getToken({
    clientId,
    clientSecret,
    redirectUri,
    codeVerifier: codeVerifier.codeVerifier,
    code,
  })

  await kv.put('credentials', JSON.stringify(tokens))

  return new Response('hi')
}

async function getToken ({ clientId, code, redirectUri, codeVerifier, clientSecret }) {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  const values = {
    client_id: clientId,
    // code_verifier: codeVerifier,
    code: code,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
    client_secret: clientSecret
  }
  // if (this.clientAuthentication === ClientAuthentication.ClientSecretBasic) {
    // const basic = Buffer.from(`${this._clientId}:${this._clientSecret}`)
    // headers['Authorization'] = `Basic ${basic.toString('base64')}`
  // }
  // if (this.clientAuthentication === ClientAuthentication.ClientSecretPost) {
  //   values.client_secret = this._clientSecret
  // }

  console.log('fetch ', TOKEN_URL, new URLSearchParams(values).toString(), headers)
  const res = await fetch(TOKEN_URL, {
    // ...OAuth2Client.RETRY_CONFIG,
    method: 'POST',
    // url,
    body: new URLSearchParams(values).toString(),
    // data: querystring.stringify(values),
    headers
  }).then(d => d.json())

  console.log("token_result: ", JSON.stringify(res))
  return res;
  // const tokens = res.data
}

async function generateCodeVerifierAsync () {
  // base64 encoding uses 6 bits per character, and we want to generate128
  // characters. 6*128/8 = 96.
  // const crypto = (0, crypto_1.createCrypto)();
  // const localCrypto = crypto.createCrypto();
  const randomString = randomBytesBase64(96)
  // The valid characters in the code_verifier are [A-Z]/[a-z]/[0-9]/
  // "-"/"."/"_"/"~". Base64 encoded strings are pretty close, so we're just
  // swapping out a few chars.
  const codeVerifier = randomString
    .replace(/\+/g, '~')
    .replace(/=/g, '_')
    .replace(/\//g, '-')
  // Generate the base64 encoded SHA256
  const unencodedCodeChallenge = await sha256DigestBase64(codeVerifier)
  // We need to use base64UrlEncoding instead of standard base64
  const codeChallenge = unencodedCodeChallenge
    .split('=')[0]
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
  return { codeVerifier, codeChallenge }
}

function randomBytesBase64(count) {
  const array = new Uint8Array(count);
  crypto.getRandomValues(array);
  return base64js.fromByteArray(array);
}

async function sha256DigestBase64(str) {
  // SubtleCrypto digest() method is async, so we must make
  // this method async as well.
  // To calculate SHA256 digest using SubtleCrypto, we first
  // need to convert an input string to an ArrayBuffer:
  const inputBuffer = new TextEncoder().encode(str);
  // Result is ArrayBuffer as well.
  const outputBuffer = await crypto.subtle.digest('SHA-256', inputBuffer);
  return base64js.fromByteArray(new Uint8Array(outputBuffer));
}
