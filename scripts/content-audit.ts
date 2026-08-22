import { contentPages } from "../lib/content";
import { pages } from "../lib/site";

const required = new Set(pages);
const actual = new Set(["/", ...contentPages.map((page) => page.path)]);
const missing = [...required].filter((path) => !actual.has(path));
const duplicateTitles = contentPages
  .map((page) => page.title)
  .filter((title, index, arr) => arr.indexOf(title) !== index);
const misleading = contentPages.filter((page) => /official paypal calculator|endorsed by paypal|paypal logo/i.test(`${page.title} ${page.description}`));
const thin = contentPages.filter((page) => page.sections.reduce((sum, section) => sum + section.body.join(" ").split(/\s+/).length, 0) < 45 && !["/about/", "/contact/", "/privacy/", "/terms/"].includes(page.path));

if (missing.length || duplicateTitles.length || misleading.length || thin.length) {
  console.error({ missing, duplicateTitles, misleading: misleading.map((p) => p.path), thin: thin.map((p) => p.path) });
  process.exit(1);
}

console.log("Content audit passed: routes, titles, affiliation language, and thin-page checks look acceptable.");
