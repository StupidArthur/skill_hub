#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const file = process.argv[2];
const __dirname = dirname(fileURLToPath(import.meta.url));
const templatePath = resolve(__dirname, '..', 'assets', 'template.html');

if (!file) {
  console.error('Usage: node scripts/validate-magazine-deck.mjs <index.html>');
  process.exit(2);
}

if (!existsSync(templatePath)) {
  console.error(`Template not found: ${templatePath}`);
  process.exit(2);
}

const html = readFileSync(file, 'utf8');
const htmlForSlides = html
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/\/\*[\s\S]*?\*\//g, '');
const errors = [];
const warnings = [];

const slideRe = /<section\b[^>]*class="[^"]*\bslide\b[^"]*"[^>]*>[\s\S]*?<\/section>/g;
const slides = [...htmlForSlides.matchAll(slideRe)].map((m, idx) => ({
  idx: idx + 1,
  html: m[0],
  tag: m[0].match(/<section\b[^>]*>/)?.[0] ?? '',
}));

if (!slides.length) {
  errors.push('No <section class="slide"> pages found.');
}

slides.forEach((slide) => {
  const classAttr = slide.tag.match(/class="([^"]*)"/)?.[1] ?? '';
  const hasLight = /\blight\b/.test(classAttr);
  const hasDark = /\bdark\b/.test(classAttr);
  const hasHero = /\bhero\b/.test(classAttr);

  if (!hasLight && !hasDark) {
    errors.push(`Slide ${slide.idx}: missing light/dark theme class. Every slide must carry "light" or "dark" (hero pages need "hero light" or "hero dark").`);
  }

  if (hasHero && !hasLight && !hasDark) {
    errors.push(`Slide ${slide.idx}: hero class without light/dark. Use "hero light" or "hero dark", never bare "hero".`);
  }
});

if (slides.length >= 3) {
  let runStart = 0;
  let runTheme = themeOf(slides[0]);
  let reported = false;
  for (let i = 1; i < slides.length; i++) {
    const t = themeOf(slides[i]);
    if (t === runTheme) {
      if (i - runStart + 1 >= 3 && !reported) {
        errors.push(`Slides ${runStart + 1}-${i + 1}: 3+ consecutive pages share the same theme. Alternate light/dark every 2-3 pages.`);
        reported = true;
      }
    } else {
      runStart = i;
      runTheme = t;
      reported = false;
    }
  }
}

function themeOf(slide) {
  const classAttr = slide.tag.match(/class="([^"]*)"/)?.[1] ?? '';
  if (/\bhero\b/.test(classAttr)) return 'hero';
  if (/\blight\b/.test(classAttr)) return 'light';
  if (/\bdark\b/.test(classAttr)) return 'dark';
  return 'none';
}

if (slides.length >= 8) {
  const heroLight = slides.some((s) => /hero\s+light|light\s+hero/.test(s.tag.match(/class="([^"]*)"/)?.[1] ?? ''));
  const heroDark = slides.some((s) => /hero\s+dark|dark\s+hero/.test(s.tag.match(/class="([^"]*)"/)?.[1] ?? ''));
  if (!heroLight) {
    errors.push('Deck has 8+ slides but no "hero light" page. Add at least one hero light page.');
  }
  if (!heroDark) {
    errors.push('Deck has 8+ slides but no "hero dark" page. Add at least one hero dark page.');
  }
}

const darkBodyPages = slides.filter((s) => {
  const c = s.tag.match(/class="([^"]*)"/)?.[1] ?? '';
  return /\bdark\b/.test(c) && !/\bhero\b/.test(c);
});
if (slides.length >= 4 && darkBodyPages.length === 0) {
  errors.push('Deck has no dark body page (non-hero dark). Add at least one dark body page to avoid an all-light deck.');
}

if (/\[必填\]/.test(htmlForSlides)) {
  const matches = [...htmlForSlides.matchAll(/\[必填\][^\s<]*/g)];
  errors.push(`Unreplaced [必填] placeholder(s) found: ${matches.map((m) => m[0]).slice(0, 5).join(', ')}${matches.length > 5 ? ` ... (${matches.length} total)` : ''}`);
}

const emojiRe = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu;
const emojis = [...htmlForSlides.matchAll(emojiRe)].map((m) => m[0]);
if (emojis.length) {
  errors.push(`Emoji detected: ${[...new Set(emojis)].slice(0, 5).join(' ')}. Use Lucide icons (<i data-lucide="name"></i>) instead.`);
}

const templateHtml = readFileSync(templatePath, 'utf8');
const styleBlock = templateHtml.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? '';
const definedClasses = new Set(
  [...styleBlock.matchAll(/\.([A-Za-z][\w-]*)/g)].map((m) => m[1])
);

const BUILTIN_OR_UTILITY = new Set([
  'slide', 'light', 'dark', 'hero', 'fill', 'center', 'col', 'row', 'split',
]);

const SWISS_ONLY_CLASSES = new Set([
  'accent-block', 'ascii-bg', 'b-accent', 'b-grey', 'b-ink', 'bar-chart',
  'bar-fill', 'bar-row', 'bar-tower', 'bar-towers', 'bar-track', 'bar-value',
  'canvas-card', 'card-accent', 'card-fill', 'card-ink', 'card-outlined',
  'chrome-min', 'col-bar', 'col-desc', 'col-lbl', 'col-list', 'col-tag',
  'col-ttl', 'cross-mat', 'dot-mat', 'dots', 'dots-bold', 'dots-fine',
  'duo-compare', 'fill-accent', 'geo-circle-o', 'geo-dot', 'geo-icon',
  'geo-line', 'geo-square', 'h-hero-zh', 'h-xl-zh', 'half', 'hatch',
  'image-hero-body', 'image-hero-stats', 'ink-block', 'kpi-big', 'kpi-cell',
  'kpi-hero', 'kpi-mid', 'kpi-row-4', 'kpi-thin', 'kpi-thin-sm', 'layer-desc',
  'layer-icon', 'layer-nb', 'layer-tag', 'layer-ttl', 'name-mega', 'nb-corner',
  'num-mega', 'ring-mat', 'row-fill', 'row-lbl', 'row-track', 'row-val',
  'r-21x9', 'span-2', 'span-3', 'span-4', 'span-5', 'span-6', 'span-7',
  'span-8', 'span-9', 'span-12', 'split-half', 'split-statement',
  'stack-block', 'stack-row', 'stroke-accent', 'sub-card', 'sub-grid-3-2',
  'swiss-img-caption', 'swiss-img-copy', 'swiss-img-grid', 'swiss-img-split',
  'swiss-keyline', 'swiss-lined', 't-body', 't-body-emp', 't-body-sm',
  't-cat', 't-h-prod', 't-helper', 't-meta', 'th-node', 'timeline-h',
  'timeline-v', 'tl-node', 'tl-row', 'underline-accent', 'vrule',
]);

const usedClasses = new Set();
const classAttrRe = /class="([^"]*)"/g;
let cm;
while ((cm = classAttrRe.exec(htmlForSlides)) !== null) {
  cm[1].split(/\s+/).forEach((c) => {
    if (c && !c.startsWith('data-')) usedClasses.add(c);
  });
}

const swissContamination = [...usedClasses].filter((c) => SWISS_ONLY_CLASSES.has(c));
if (swissContamination.length) {
  errors.push(`Swiss-only class(es) detected in a Magazine (Style A) deck: ${swissContamination.slice(0, 8).map((c) => `.${c}`).join(', ')}. Style A and Style B cannot be mixed; these classes only exist in template-swiss.html.`);
}

usedClasses.forEach((c) => {
  if (!definedClasses.has(c) && !BUILTIN_OR_UTILITY.has(c)) {
    warnings.push(`Class ".${c}" is not defined in assets/template.html <style>. Confirm it is a valid inline/utility class or add it to the template.`);
  }
});

if (warnings.length) {
  console.warn('Warnings:');
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (errors.length) {
  console.error('Magazine deck validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Magazine deck validation passed: ${slides.length} slide(s).${warnings.length ? ` (${warnings.length} warning(s))` : ''}`);
