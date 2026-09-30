import { contentPages } from "../lib/content.ts";
import { paypalRules } from "../lib/fees/paypal-rules.ts";
import { pages } from "../lib/site.ts";

const required = new Set(pages);
const actual = new Set(["/", ...contentPages.map((page) => page.path)]);
const missing = [...required].filter((path) => !actual.has(path));
const duplicateTitles = contentPages
  .map((page) => page.title)
  .filter((title, index, arr) => arr.indexOf(title) !== index);
const misleading = contentPages.filter((page) => /official paypal calculator|endorsed by paypal|paypal logo/i.test(`${page.title} ${page.description}`));
const customRichPages = new Set([
  "/paypal-fee-calculator/",
  "/paypal-international-fee-calculator/",
  "/paypal-reverse-fee-calculator/",
  "/paypal-currency-conversion-calculator/",
  "/paypal-fees/",
  "/paypal-fees/us/",
  "/paypal-vs-wise/",
  "/methodology/",
  "/rate-log/",
]);
const administrativePages = new Set(["/about/", "/contact/", "/privacy/", "/terms/", "/editorial-policy/", "/advertising-policy/", "/sitemap/"]);
const wordCount = (page: (typeof contentPages)[number]) => page.sections.reduce((sum, section) => sum + section.body.join(" ").split(/\s+/).filter(Boolean).length, 0);
const thin = contentPages.filter((page) => !customRichPages.has(page.path) && !administrativePages.has(page.path) && !page.path.startsWith("/paypal-fees/") && wordCount(page) < 160);
const genericFaqs = contentPages.filter((page) => !customRichPages.has(page.path) && !administrativePages.has(page.path) && !page.path.startsWith("/paypal-fees/") && (page.faq?.length ?? 0) < 3);
const countryCodes = ["US", "CA", "GB", "AU", "PH", "IN"];
const missingCountryRules = countryCodes.filter((country) => !paypalRules.some((rule) => rule.country === country));

if (missing.length || duplicateTitles.length || misleading.length || thin.length || genericFaqs.length || missingCountryRules.length) {
  console.error({
    missing,
    duplicateTitles,
    misleading: misleading.map((page) => page.path),
    thin: thin.map((page) => ({ path: page.path, words: wordCount(page) })),
    genericFaqs: genericFaqs.map((page) => page.path),
    missingCountryRules,
  });
  process.exit(1);
}

console.log("Content audit passed: routes, titles, affiliation language, specialist depth, page-specific FAQs, and country-rule coverage look acceptable.");
