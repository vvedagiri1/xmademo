/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Adventures section breaks and section metadata.
 * Inserts <hr> between sections and adds Section Metadata blocks for styled sections.
 * Selectors validated against migration-work/cleaned.html and page-templates.json.
 *
 * Section layout (from cleaned.html, children of <main>):
 *   1: section.hero-section.hero-section--full (no style)
 *   2: section.secondary-section with .featured-article -> style "secondary"
 *   3: section with .tab-container.tab-container--wide (no style)
 *   4: div.ticker-strip (no style)
 *   5: section.inverse-section with .container--narrow (first inverse) -> style "dark"
 *   6: section with .faq-list (no style)
 *   7: section.secondary-section with .editorial-index -> style "secondary"
 *   8: section.inverse-section with .grid-images -> style "dark"
 *   9: section.accent-section -> style "accent"
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    const document = element.ownerDocument;

    // Find section elements using unique identifiers from cleaned.html.
    // Avoid :has() and :scope as they may not be supported in all contexts.
    // Instead, find elements by their unique class combinations or children.
    function findSection(sectionDef) {
      switch (sectionDef.id) {
        case 'section-1':
          return element.querySelector('section.hero-section--full');
        case 'section-2':
          return element.querySelector('.featured-article')
            && element.querySelector('.featured-article').closest('section');
        case 'section-3':
          return element.querySelector('.tab-container--wide')
            && element.querySelector('.tab-container--wide').closest('section');
        case 'section-4':
          return element.querySelector('.ticker-strip');
        case 'section-5': {
          // First inverse-section (contains container--narrow without grid-images)
          const inverseSections = element.querySelectorAll('section.inverse-section');
          for (const s of inverseSections) {
            if (s.querySelector('.container--narrow') && !s.querySelector('.grid-images')) return s;
          }
          return null;
        }
        case 'section-6':
          return element.querySelector('.faq-list')
            && element.querySelector('.faq-list').closest('section');
        case 'section-7':
          return element.querySelector('.editorial-index')
            && element.querySelector('.editorial-index').closest('section');
        case 'section-8':
          return element.querySelector('.grid-images')
            && element.querySelector('.grid-images').closest('section');
        case 'section-9':
          return element.querySelector('section.accent-section');
        default:
          return null;
      }
    }

    // Process sections in reverse order to avoid position shifts
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionEl = findSection(section);

      if (!sectionEl) continue;

      // Add Section Metadata block if this section has a style
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.append(metaBlock);
      }

      // Insert <hr> before every section except the first
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
