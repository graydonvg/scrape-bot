import arcjet, {
  shield,
  detectBot,
  fixedWindow,
  tokenBucket,
} from "@arcjet/next";

// Re-export the rules to simplify imports inside handlers/server actions
export { shield, detectBot, fixedWindow, tokenBucket };

export default arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [],
});
