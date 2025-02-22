import arcjet, {
  shield,
  detectBot,
  fixedWindow,
  tokenBucket,
  request,
} from "@arcjet/next";

// Re-export the rules to simplify imports inside handlers/server actions
export { shield, detectBot, fixedWindow, tokenBucket, request };

export default arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [],
});
