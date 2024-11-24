
import { Router } from '@tsndr/cloudflare-worker-router'
import hello from './hello.mjs'
import auth from './auth.mjs'
import list from './list.mjs';
import oauth2callback from './oauth2callback.mjs'

const router = new Router()

router.get('/hello', hello)
router.get("/auth", auth);
router.get("/oauth2callback", oauth2callback);
router.get("/list", list);


export default {
  async fetch (request, env, ctx) {
    return router.handle(request, env, ctx)
  },
  async scheduled(event, env, ctx) {
    console.log('refresh')
    // ctx.waitUntil(doSomeTaskOnASchedule());
  },
}
