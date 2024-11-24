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

export default {
	fetch: router.handle
}