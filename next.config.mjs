/** @type {import('next').NextConfig} */

import { withAxiom } from "next-axiom";

const nextConfig = {
  serverExternalPackages: ["puppeteer-core"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/a/**",
      },
      {
        protocol: "https",
        hostname: "sglwxnizbklgkoimhpkv.supabase.co",
        pathname: "/storage/v1/object/public/avatars/**",
      },
    ],
  },
  experimental: {
    staleTimes: {
      // This config can be used to override the cache behavior for the client router. These values indicate the time, in seconds, that the cache should be considered reusable. When the prefetch Link prop is left unspecified, this will use the dynamic value. When the prefetch Link prop is set to true, this will use the static value.
      // The dynamic property is used when the page is neither statically generated nor fully prefetched (e.g. with prefetch={true}).
      // Default: 0 seconds (not cached)
      // cache page segments in the client-side router cache for 1 hour.
      dynamic: 3600,
      // The static property is used for statically generated pages, or when the prefetch prop on Link is set to true, or when calling router.prefetch.
      // Default: 5 minutes
      // static:
    },
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default withAxiom(nextConfig);
