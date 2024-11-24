export default async () => {
  let message = `<h1>hello</h1>`;

  if (env['gmail-worker']) {
    message += ' gmail-worker: ' + await env['gmail-worker'].get('test1')
}
if (env['gmail-worker-kv']) {
      message += ' gmail-worker-kv: ' + await env['gmail-worker'].get('test1')
  }
  
  return new Response(message, {
    headers: { 'Content-type': 'text/html' },
    status: 200
  })
}
