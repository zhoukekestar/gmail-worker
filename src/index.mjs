import { Router } from 'itty-router';
import hello from './hello.mjs';
import notfound from './notfound.mjs';

const router = Router();

router.get("/hello", hello)
// router.get("/setup", setup);
// router.get("/auth", auth);
// router.get("/test", test);
// router.post("/send", send);

router.all('*', notfound);

// export default {
// 	fetch: router.handle
// }

export default {
    async fetch(request, env, ctx) {
            const { cf } = request;
            const { city, country } = cf;

            console.log(`Request came from city: ${city} in country: ${country}`);

            let message = 'Hello worker!';
            if (env['gmail-worker']) {
                message += ' gmail-worker: ' + await env['gmail-worker'].get('test1')
            }
            if (env['gmail-worker-kv']) {
                  message += ' gmail-worker-kv: ' + await env['gmail-worker'].get('test1')
              }

            return new Response(message, {
                    headers: { "content-type": "text/plain" },
            });
    },
};