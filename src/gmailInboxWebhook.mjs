export default async ({ req, env }) => {
    const url = new URL(req.url);
    const body = await req.text();

    console.log('push webhook. search: ', url.searchParams.toString(), ' body: ', body)
    return new Response("OK")
  }
  