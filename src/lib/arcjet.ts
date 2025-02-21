import arcjet, {
  shield,
  detectBot,
  fixedWindow,
  tokenBucket,
  request,
} from "@arcjet/next";

// Re-export the rules to simplify imports inside handlers
export { shield, detectBot, fixedWindow, tokenBucket, request };

// Create a base Arcjet instance for use by each handler
export default arcjet({
  key: process.env.ARCJET_KEY!,
  // We specify a custom fingerprint so we can dynamically build it within each
  // demo route.
  // characteristics: ["fingerprint"],
  // characteristics: ["userId", "http.uri"],
  // characteristics: ["ip.src"],
  rules: [],
});
