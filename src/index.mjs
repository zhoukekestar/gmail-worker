
import { Router } from '@tsndr/cloudflare-worker-router'
import hello from './hello.mjs'
import auth from './auth.mjs'
import list from './list.mjs';
import refresh from './refresh.mjs';
import oauth2callback from './oauth2callback.mjs'
import gmailInboxWebhook from './gmailInboxWebhook.mjs'
import watch from './watch.mjs'
import send from './send.mjs'

const router = new Router()

router.get('/hello', hello)
router.get("/auth", auth);
router.get("/oauth2callback", oauth2callback);
router.get("/list", list);
router.get("/refresh", refresh);
router.get("/gmail-inbox-webhook", gmailInboxWebhook);
router.get("/watch", watch);
router.get("/send-zkk-star-demo", send);


export default {
  async fetch (request, env, ctx) {
    return router.handle(request, env, ctx)
  },
  async scheduled(event, env, ctx) {
    console.log('refresh ', new Date().toISOString());
    await refresh({ event, env, ctx })
    // ctx.waitUntil(doSomeTaskOnASchedule());
  },
}
