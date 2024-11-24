
import { Router } from '@tsndr/cloudflare-worker-router'
import hello from './hello.mjs'
import auth from './auth.mjs'

const router = new Router()

router.get('/hello', hello)
router.get("/auth", auth);


export default {
  async fetch (request, env, ctx) {
    return router.handle(request, env, ctx)
  }
}
