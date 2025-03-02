
import { Router } from '@tsndr/cloudflare-worker-router'
import auth from './auth.mjs'
import list from './list.mjs';
// import refresh from './refresh.mjs';
import oauth2callback from './oauth2callback.mjs'
import gmailInboxWebhook from './gmailInboxWebhook.mjs'
import watch from './watch.mjs'

const router = new Router()

router.get("/auth", auth);
router.get("/oauth2callback", oauth2callback);
// router.get("/refresh", refresh);
router.get("/list", list);
router.any("/gmail-inbox-webhook", gmailInboxWebhook);
router.get("/watch", watch);


export default {
  async fetch (request, env, ctx) {
    return router.handle(request, env, ctx)
  },
  async scheduled(event, env, ctx) {
    // console.log('refresh ', new Date().toISOString());
    // await refresh({ event, env, ctx })
    // console.log('refresh success');

    try {
      console.log('watch refresh');
      ctx.waitUntil(watch({ event, env, ctx}));
      // const res = await watch({ event, env, ctx});
      // console.log("watch result" + JSON.stringify(res));
    } catch(err) {
      console.log('watch error')
    }
    console.log('watch success');
    // ctx.waitUntil(doSomeTaskOnASchedule());
  },
}
