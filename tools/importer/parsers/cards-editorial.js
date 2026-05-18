/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-editorial
 * Base block: cards
 * Source selector: .editorial-index
 * Structure: 1 column per row (no images): [text-content] - each row is one card
 * Each card contains: number (span), heading (h3), and descriptive paragraph
 * Generated: 2026-05-18
 */
export default function parse(element, { document }) {
  // Extract all card items from the editorial index
  const items = element.querySelectorAll('.editorial-index-item');

  const cells = [];

  items.forEach((item) => {
    // Extract the number element (e.g., "01", "02", "03")
    const number = item.querySelector('.editorial-index-number, span');

    // Extract the heading (h3 within the item)
    const heading = item.querySelector('h3, h4, [class*="heading"]');

    // Extract the description paragraph
    const description = item.querySelector('p, .paragraph-lg, [class*="paragraph"]');

    // Build the cell content array for this card row
    const cellContent = [];
    if (number) cellContent.push(number);
    if (heading) cellContent.push(heading);
    if (description) cellContent.push(description);

    // Each row is one card with a single column of text content
    if (cellContent.length > 0) {
      cells.push(cellContent);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-editorial', cells });
  element.replaceWith(block);
}
