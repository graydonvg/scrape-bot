/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      // This config can be used to override the cache behavior for the client router. These values indicate the time, in seconds, that the cache should be considered reusable. When the prefetch Link prop is left unspecified, this will use the dynamic value. When the prefetch Link prop is set to true, this will use the static value.

      // The dynamic property is used when the page is neither statically generated nor fully prefetched (e.g. with prefetch={true}).
      // Default: 0 seconds (not cached)

      // cache page segments in the client-side router cache for 1 year.
      dynamic: 31536000,

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

export default nextConfig;
