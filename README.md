# gmail-worker
cloudflare worker for gmail

# Test in China

```sh
$ curl -v http://gmail-worker.zhoukekestar.workers.dev/hello --resolve gmail-worker.zhoukekestar.workers.dev:80:172.64.80.2
```

https://gmail-worker.zhoukekestar.workers.dev/auth

# References

* gmail api: https://developers.google.com/gmail/api/quickstart/nodejs?hl=zh-cn
* nodejs 参考：https://github.com/googleapis/google-api-nodejs-client/blob/main/samples/gmail/list.js
* https://github.com/ryan-dutton/cloudflare-gmail-send/blob/main/src/index.js
