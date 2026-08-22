import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

const root = process.cwd();
const outDir = resolve(root, "out");
const distDir = resolve(root, "dist");

if (!existsSync(outDir)) {
  throw new Error("Expected Next static export directory 'out' to exist after next build.");
}

rmSync(distDir, { recursive: true, force: true });
cpSync(outDir, distDir, { recursive: true });
const hostingMetadata = resolve(root, ".openai", "hosting.json");
if (existsSync(hostingMetadata)) {
  mkdirSync(resolve(distDir, ".openai"), { recursive: true });
  cpSync(hostingMetadata, resolve(distDir, ".openai", "hosting.json"));
}
mkdirSync(resolve(distDir, "server"), { recursive: true });

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function extension(pathname) {
  const match = pathname.match(/\.[^.\/]+$/);
  return match ? match[0] : "";
}

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    if (fullPath.startsWith(resolve(distDir, "server"))) return [];
    if (statSync(fullPath).isDirectory()) return walk(fullPath);
    const pathname = `/${relative(distDir, fullPath).split(sep).join("/")}`;
    return [[pathname, {
      type: contentTypes[extension(pathname)] ?? "application/octet-stream",
      body: readFileSync(fullPath).toString("base64"),
    }]];
  });
}

const files = Object.fromEntries(walk(distDir));

writeFileSync(
  resolve(distDir, "server", "index.js"),
  `const files = ${JSON.stringify(files)};

const legacyRedirects = new Map([
  ["/-Home", "/"],
  ["/-home", "/"],
  ["/terms/-Terms", "/terms/"],
  ["/terms/-terms", "/terms/"],
  ["/privacy/-Privacy", "/privacy/"],
  ["/privacy/-privacy", "/privacy/"],
  ["/contact/-Contact", "/contact/"],
  ["/contact/-contact", "/contact/"],
  ["/paypal-vs-wise/-Comparisons", "/paypal-vs-wise/"],
  ["/paypal-vs-wise/-comparisons", "/paypal-vs-wise/"]
]);

function decode(base64) {
  const text = atob(base64);
  const bytes = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i += 1) bytes[i] = text.charCodeAt(i);
  return bytes;
}

function candidates(pathname) {
  const clean = pathname.replace(/\\/$/, "") || "/";
  if (clean === "/") return ["/index.html"];
  if (clean.includes(".")) return [clean];
  return [clean, clean + ".html", clean + "/index.html"];
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cleanPath = url.pathname.replace(/\\/$/, "") || "/";
    const legacyDestination = legacyRedirects.get(cleanPath);
    if (legacyDestination) {
      return Response.redirect(new URL(legacyDestination, "https://tryfeeclarity.com"), 301);
    }
    if (cleanPath !== "/" && !cleanPath.includes(".") && !url.pathname.endsWith("/") && (files[cleanPath + ".html"] || files[cleanPath + "/index.html"])) {
      return Response.redirect(new URL(cleanPath + "/", "https://tryfeeclarity.com"), 301);
    }
    for (const pathname of candidates(url.pathname)) {
      const file = files[pathname];
      if (file) {
        return new Response(decode(file.body), {
          headers: {
            "content-type": file.type,
            "cache-control": pathname.startsWith("/_next/") ? "public, max-age=31536000, immutable" : "public, max-age=300"
          }
        });
      }
    }
    const notFound = files["/404.html"] ?? files["/_not-found.html"];
    return new Response(notFound ? decode(notFound.body) : "Not found", {
      status: 404,
      headers: { "content-type": notFound?.type ?? "text/plain; charset=utf-8" }
    });
  }
};
`,
);
