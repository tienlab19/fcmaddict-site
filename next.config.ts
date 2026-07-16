import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const githubBasePath = "/FCMaddict";

const nextConfig: NextConfig = {
  distDir: isGitHubPages ? ".next-github" : ".next",
  output: isGitHubPages ? "export" : undefined,
  basePath: isGitHubPages ? githubBasePath : undefined,
  assetPrefix: isGitHubPages ? githubBasePath : undefined,
  trailingSlash: isGitHubPages,
  images: {
    unoptimized: isGitHubPages,
  },
};

export default nextConfig;
