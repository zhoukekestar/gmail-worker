
let globalEnv = null;

export function getEnv() {
    return globalEnv;
}

export function setEnv(env) {
    globalEnv = env;
}