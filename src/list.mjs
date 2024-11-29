import { fetchWithToken } from './utils.mjs'

export default async ({ req, env }) => {
  const res = await fetchWithToken(
    env,
    'https://gmail.googleapis.com/gmail/v1/users/me/messages'
  )

  res.fetchWithToken = true
  return new Response(JSON.stringify(res))
}
