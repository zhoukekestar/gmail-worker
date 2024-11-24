export default () => {
  const message404 = `404 error - resource not found.<br/>Would you like to <a href="/setup">Setup OAuth</a> OR <a href="/test">Send a test email?</a>`
  return new Response(message404, {
    headers: { 'Content-type': 'text/html' },
    status: 404
  })
}
