export default async ({ req, env }) => {
  console.log('push webhook start!')

  const body = await req.text()

  console.log('push webhook. search: ', req.url, ' body: ', body)
  return new Response('OK')
}
