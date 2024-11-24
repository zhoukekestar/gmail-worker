export default () => {
  const message = `<h1>hello</h1>`
  return new Response(message, {
    headers: { 'Content-type': 'text/html' },
    status: 200
  })
}
