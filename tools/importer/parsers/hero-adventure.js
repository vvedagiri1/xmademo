/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-adventure
 * Base block: hero
 * Structure: 1 column, 3 rows: [block-name] | [background-image] | [heading + subheading + CTAs]
 * Source selector: .hero-section.hero-section--full
 * Generated: 2026-05-18
 */
export default function parse(element, { document }) {
  // Extract background image from .hero-bg container
  const bgImage = element.querySelector('.hero-bg img, img[class*="background"], img[class*="hero-bg"]');

  // Extract tag text (e.g. "WKND Adventures")
  const tag = element.querySelector('.tag, p.tag, .hero-content-inner > p:first-child');

  // Extract main heading
  const heading = element.querySelector('h1, .h1-heading, h2, [class*="heading"]');

  // Extract subheading/lead paragraph
  const description = element.querySelector('.paragraph-xl, .hero-lead, .hero-content-inner > p:not(.tag)');

  // Extract CTA buttons from button group
  const ctaLinks = Array.from(
    element.querySelectorAll('.button-group a, .hero-content-inner a.accent-button, .hero-content-inner a.button--ghost, .hero-content-inner a[class*="button"]')
  );

  // Build cells array matching hero block structure:
  // Row 1: background image
  // Row 2: tag + heading + description + CTAs (combined content cell)
  const cells = [];

  // Row 1: Background image
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: All text content and CTAs in a single cell
  const contentCell = [];
  if (tag) contentCell.push(tag);
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (ctaLinks.length > 0) contentCell.push(...ctaLinks);
  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-adventure', cells });
  element.replaceWith(block);
}
