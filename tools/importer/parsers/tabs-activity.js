/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-activity
 * Base block: tabs
 * Structure: 2 columns per row: [tab-label | tab-content] - each row is one tab
 * Source selector: .tab-container.tab-container--wide
 * Generated: 2026-05-18
 *
 * Source HTML structure:
 * - div.tab-menu > button.tab-menu-link (tab labels)
 * - div.tab-pane (tab content panels), each containing:
 *   - a.article-card with image, tag, heading, description
 */
export default function parse(element, { document }) {
  // Extract tab labels from tab menu buttons
  const tabButtons = element.querySelectorAll('.tab-menu .tab-menu-link, .tab-menu button');
  // Extract tab content panes
  const tabPanes = element.querySelectorAll('.tab-pane');

  const cells = [];

  // Iterate over each tab - pair label with content
  tabButtons.forEach((btn, index) => {
    const label = btn.textContent.trim();
    const pane = tabPanes[index];

    if (!pane) return;

    // Build content cell: extract article cards from this tab pane
    const contentContainer = document.createElement('div');
    const cards = pane.querySelectorAll('a.article-card, .article-card');

    cards.forEach((card) => {
      // Extract card elements
      const img = card.querySelector('.article-card-image img, img');
      const tag = card.querySelector('.article-card-meta .tag, .tag');
      const heading = card.querySelector('h3, .h6-heading, [class*="heading"]');
      const description = card.querySelector('p.paragraph-sm, .article-card-body p');
      const href = card.getAttribute('href') || card.querySelector('a')?.getAttribute('href');

      // Build card content as structured elements
      if (img) {
        const imgClone = img.cloneNode(true);
        contentContainer.appendChild(imgClone);
      }
      if (tag) {
        const tagEl = document.createElement('p');
        tagEl.textContent = tag.textContent.trim();
        contentContainer.appendChild(tagEl);
      }
      if (heading) {
        const h = document.createElement('h3');
        h.textContent = heading.textContent.trim();
        contentContainer.appendChild(h);
      }
      if (description) {
        const desc = document.createElement('p');
        desc.textContent = description.textContent.trim();
        contentContainer.appendChild(desc);
      }
      if (href) {
        const link = document.createElement('a');
        link.setAttribute('href', href);
        link.textContent = heading ? heading.textContent.trim() : 'Read more';
        contentContainer.appendChild(link);
      }

      // Add separator between cards (line break)
      contentContainer.appendChild(document.createElement('hr'));
    });

    // Remove trailing hr if present
    const lastChild = contentContainer.lastElementChild;
    if (lastChild && lastChild.tagName === 'HR') {
      contentContainer.removeChild(lastChild);
    }

    // Each row: [tab-label | tab-content]
    cells.push([label, contentContainer]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-activity', cells });
  element.replaceWith(block);
}
