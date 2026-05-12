/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  outputFileTracingIncludes: {
    "/api/generate": ["./prompts/**/*"],
  },
};
module.exports = nextConfig;
