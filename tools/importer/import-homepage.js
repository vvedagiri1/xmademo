/* eslint-disable */
/* global WebImporter */

import heroAdventureParser from './parsers/hero-adventure.js';
import columnsFeaturedParser from './parsers/columns-featured.js';
import tabsActivityParser from './parsers/tabs-activity.js';
import marqueeTickerParser from './parsers/marquee-ticker.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import cardsEditorialParser from './parsers/cards-editorial.js';

import wkndCleanupTransformer from './transformers/wknd-cleanup.js';
import wkndSectionsTransformer from './transformers/wknd-sections.js';

const parsers = {
  'hero-adventure': heroAdventureParser,
  'columns-featured': columnsFeaturedParser,
  'tabs-activity': tabsActivityParser,
  'marquee-ticker': marqueeTickerParser,
  'accordion-faq': accordionFaqParser,
  'cards-editorial': cardsEditorialParser,
};

const transformers = [
  wkndCleanupTransformer,
  wkndSectionsTransformer,
];

const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'WKND Adventures homepage with hero, featured adventures, and content sections',
  urls: ['https://wknd-adventures.com'],
  blocks: [
    {
      name: 'hero-adventure',
      instances: ['.hero-section.hero-section--full'],
    },
    {
      name: 'columns-featured',
      instances: ['.featured-article'],
    },
    {
      name: 'tabs-activity',
      instances: ['.tab-container.tab-container--wide'],
    },
    {
      name: 'marquee-ticker',
      instances: ['.ticker-strip'],
    },
    {
      name: 'accordion-faq',
      instances: ['.faq-list'],
    },
    {
      name: 'cards-editorial',
      instances: ['.editorial-index'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: 'section.hero-section.hero-section--full',
      style: null,
      blocks: ['hero-adventure'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Featured Article',
      selector: 'main > section.secondary-section:first-of-type',
      style: 'secondary',
      blocks: ['columns-featured'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Browse by Activity',
      selector: 'main > section.section:nth-of-type(3)',
      style: null,
      blocks: ['tabs-activity'],
      defaultContent: ['.section-heading .h2-heading'],
    },
    {
      id: 'section-4',
      name: 'Activity Ticker',
      selector: '.ticker-strip',
      style: null,
      blocks: ['marquee-ticker'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'Not Sure Where to Start',
      selector: 'main > section.inverse-section:first-of-type',
      style: 'dark',
      blocks: [],
      defaultContent: ['.inverse-section .container--narrow .tag', '.inverse-section .container--narrow .h2-heading', '.inverse-section .container--narrow .paragraph-lg', '.inverse-section .container--narrow .button-group'],
    },
    {
      id: 'section-6',
      name: 'Quick Answers FAQ',
      selector: 'section:has(.faq-list)',
      style: null,
      blocks: ['accordion-faq'],
      defaultContent: ['.section-heading .h2-heading'],
    },
    {
      id: 'section-7',
      name: 'How We Work',
      selector: 'section.secondary-section:has(.editorial-index)',
      style: 'secondary',
      blocks: ['cards-editorial'],
      defaultContent: ['.section-heading .h2-heading'],
    },
    {
      id: 'section-8',
      name: 'In the Field Gallery',
      selector: 'section.inverse-section:has(.grid-images)',
      style: 'dark',
      blocks: [],
      defaultContent: ['.section-heading .h2-heading', '.section-heading .text-button', '.grid-images .gallery-img', '.gallery-img--wide'],
    },
    {
      id: 'section-9',
      name: 'Final CTA',
      selector: 'section.accent-section',
      style: 'accent',
      blocks: [],
      defaultContent: ['.accent-section .h2-heading', '.accent-section .paragraph-lg', '.accent-section .button-group'],
    },
  ],
};

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
