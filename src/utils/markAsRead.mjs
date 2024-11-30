import { postWithToken } from './request.mjs'
export default async (env, id) => {
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
