/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-featured
 * Base block: columns
 * Source selector: .featured-article
 * Structure: 2 columns per row — [image | text content (tag, heading, description, CTA)]
 * Generated: 2026-05-18
 */
export default function parse(element, { document }) {
  // Column 1: Extract the featured image
  const image = element.querySelector('.featured-article-image img, img');

  // Column 2: Extract text content elements
  const tag = element.querySelector('p.tag, .tag');
  const heading = element.querySelector('h2.h2-heading, h2, h3, [class*="heading"]');
  const description = element.querySelector('p.paragraph-lg, p.paragraph, p:not(.tag)');
  const cta = element.querySelector('.featured-article-footer a.button, a.button, a[class*="button"]');

  // Build column 1 content (image)
  const col1 = [];
  if (image) col1.push(image);

  // Build column 2 content (tag + heading + description + CTA)
  const col2 = [];
  if (tag) col2.push(tag);
  if (heading) col2.push(heading);
  if (description) col2.push(description);
  if (cta) col2.push(cta);

  // Columns block: single row with two cells (one per column)
  const cells = [
    [col1, col2],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-featured', cells });
  element.replaceWith(block);
}
