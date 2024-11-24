import crypto from 'node:crypto';
import base64js from "base64-js";

async function generateCodeVerifierAsync () {
    // base64 encoding uses 6 bits per character, and we want to generate128
    // characters. 6*128/8 = 96.
    // const crypto = (0, crypto_1.createCrypto)();
    // const localCrypto = crypto.createCrypto();
    const randomString = randomBytesBase64(96)
    // The valid characters in the code_verifier are [A-Z]/[a-z]/[0-9]/
    // "-"/"."/"_"/"~". Base64 encoded strings are pretty close, so we're just
    // swapping out a few chars.
    const codeVerifier = randomString
      .replace(/\+/g, '~')
      .replace(/=/g, '_')
      .replace(/\//g, '-')
    // Generate the base64 encoded SHA256
    const unencodedCodeChallenge = await sha256DigestBase64(codeVerifier)
    // We need to use base64UrlEncoding instead of standard base64
    const codeChallenge = unencodedCodeChallenge
      .split('=')[0]
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
    return { codeVerifier, codeChallenge }
  }
  
  function randomBytesBase64(count) {
    const array = new Uint8Array(count);
    crypto.getRandomValues(array);
    return base64js.fromByteArray(array);
  }
  
  async function sha256DigestBase64(str) {
    // SubtleCrypto digest() method is async, so we must make
    // this method async as well.
    // To calculate SHA256 digest using SubtleCrypto, we first
    // need to convert an input string to an ArrayBuffer:
    const inputBuffer = new TextEncoder().encode(str);
    // Result is ArrayBuffer as well.
    const outputBuffer = await crypto.subtle.digest('SHA-256', inputBuffer);
    return base64js.fromByteArray(new Uint8Array(outputBuffer));
  }

  console.log(await generateCodeVerifierAsync())
