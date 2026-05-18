/* eslint-disable */
/* global WebImporter */

/**
 * Parser for marquee-ticker
 * Base block: marquee
 * Source: https://wknd-adventures.com
 * Selector: .ticker-strip
 * Structure: 1 column per row: [category-text] - each row is one ticker item
 * Generated: 2026-05-18
 */
export default function parse(element, { document }) {
  // Extract all ticker item spans (exclude separator spans with class 'ticker-sep')
  const tickerTrack = element.querySelector('.ticker-track');
  const container = tickerTrack || element;

  // Get all text spans that are NOT separators
  const allItems = Array.from(container.querySelectorAll('span:not(.ticker-sep)'));

  // The source HTML duplicates items for animation purposes.
  // Deduplicate by tracking seen text content to get unique ticker items.
  const seen = new Set();
  const uniqueItems = [];
  for (const item of allItems) {
    const text = item.textContent.trim();
    if (text && !seen.has(text)) {
      seen.add(text);
      uniqueItems.push(text);
    }
  }

  // Build cells: 1 column per row, each row is one ticker item
  const cells = uniqueItems.map((text) => {
    const p = document.createElement('p');
    p.textContent = text;
    return [p];
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'marquee-ticker', cells });
  element.replaceWith(block);
}
