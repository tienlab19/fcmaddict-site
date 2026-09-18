import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const isFirebase = process.env.FIREBASE_HOSTING === "true";
const isStatic = isGitHubPages || isFirebase;
const githubBasePath = "/fcmaddict-site";

const nextConfig: NextConfig = {
  distDir: isGitHubPages ? ".next-github" : isFirebase ? ".next-firebase" : ".next",
  output: isStatic ? "export" : undefined,
  basePath: isGitHubPages ? githubBasePath : undefined,
  assetPrefix: isGitHubPages ? githubBasePath : undefined,
  trailingSlash: isGitHubPages,
  images: {
    unoptimized: isStatic,
  },
};

export default nextConfig;
