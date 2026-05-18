/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-adventure.js
  function parse(element, { document }) {
    const bgImage = element.querySelector('.hero-bg img, img[class*="background"], img[class*="hero-bg"]');
    const tag = element.querySelector(".tag, p.tag, .hero-content-inner > p:first-child");
    const heading = element.querySelector('h1, .h1-heading, h2, [class*="heading"]');
    const description = element.querySelector(".paragraph-xl, .hero-lead, .hero-content-inner > p:not(.tag)");
    const ctaLinks = Array.from(
      element.querySelectorAll('.button-group a, .hero-content-inner a.accent-button, .hero-content-inner a.button--ghost, .hero-content-inner a[class*="button"]')
    );
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (tag) contentCell.push(tag);
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (ctaLinks.length > 0) contentCell.push(...ctaLinks);
    cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-adventure", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-featured.js
  function parse2(element, { document }) {
    const image = element.querySelector(".featured-article-image img, img");
    const tag = element.querySelector("p.tag, .tag");
    const heading = element.querySelector('h2.h2-heading, h2, h3, [class*="heading"]');
    const description = element.querySelector("p.paragraph-lg, p.paragraph, p:not(.tag)");
    const cta = element.querySelector('.featured-article-footer a.button, a.button, a[class*="button"]');
    const col1 = [];
    if (image) col1.push(image);
    const col2 = [];
    if (tag) col2.push(tag);
    if (heading) col2.push(heading);
    if (description) col2.push(description);
    if (cta) col2.push(cta);
    const cells = [
      [col1, col2]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-featured", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-activity.js
  function parse3(element, { document }) {
    const tabButtons = element.querySelectorAll(".tab-menu .tab-menu-link, .tab-menu button");
    const tabPanes = element.querySelectorAll(".tab-pane");
    const cells = [];
    tabButtons.forEach((btn, index) => {
      const label = btn.textContent.trim();
      const pane = tabPanes[index];
      if (!pane) return;
      const contentContainer = document.createElement("div");
      const cards = pane.querySelectorAll("a.article-card, .article-card");
      cards.forEach((card) => {
        var _a;
        const img = card.querySelector(".article-card-image img, img");
        const tag = card.querySelector(".article-card-meta .tag, .tag");
        const heading = card.querySelector('h3, .h6-heading, [class*="heading"]');
        const description = card.querySelector("p.paragraph-sm, .article-card-body p");
        const href = card.getAttribute("href") || ((_a = card.querySelector("a")) == null ? void 0 : _a.getAttribute("href"));
        if (img) {
          const imgClone = img.cloneNode(true);
          contentContainer.appendChild(imgClone);
        }
        if (tag) {
          const tagEl = document.createElement("p");
          tagEl.textContent = tag.textContent.trim();
          contentContainer.appendChild(tagEl);
        }
        if (heading) {
          const h = document.createElement("h3");
          h.textContent = heading.textContent.trim();
          contentContainer.appendChild(h);
        }
        if (description) {
          const desc = document.createElement("p");
          desc.textContent = description.textContent.trim();
          contentContainer.appendChild(desc);
        }
        if (href) {
          const link = document.createElement("a");
          link.setAttribute("href", href);
          link.textContent = heading ? heading.textContent.trim() : "Read more";
          contentContainer.appendChild(link);
        }
        contentContainer.appendChild(document.createElement("hr"));
      });
      const lastChild = contentContainer.lastElementChild;
      if (lastChild && lastChild.tagName === "HR") {
        contentContainer.removeChild(lastChild);
      }
      cells.push([label, contentContainer]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-activity", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/marquee-ticker.js
  function parse4(element, { document }) {
    const tickerTrack = element.querySelector(".ticker-track");
    const container = tickerTrack || element;
    const allItems = Array.from(container.querySelectorAll("span:not(.ticker-sep)"));
    const seen = /* @__PURE__ */ new Set();
    const uniqueItems = [];
    for (const item of allItems) {
      const text = item.textContent.trim();
      if (text && !seen.has(text)) {
        seen.add(text);
        uniqueItems.push(text);
      }
    }
    const cells = uniqueItems.map((text) => {
      const p = document.createElement("p");
      p.textContent = text;
      return [p];
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "marquee-ticker", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse5(element, { document }) {
    const faqItems = element.querySelectorAll(".faq-item");
    const cells = [];
    faqItems.forEach((item) => {
      const questionButton = item.querySelector(".faq-question");
      const questionSpan = questionButton ? questionButton.querySelector("span:not(.faq-icon)") : null;
      const questionText = questionSpan ? questionSpan.textContent.trim() : "";
      const answerDiv = item.querySelector(".faq-answer");
      const answerText = answerDiv ? answerDiv.textContent.trim() : "";
      if (questionText || answerText) {
        const questionEl = document.createElement("p");
        questionEl.textContent = questionText;
        const answerEl = document.createElement("p");
        answerEl.textContent = answerText;
        cells.push([questionEl, answerEl]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-editorial.js
  function parse6(element, { document }) {
    const items = element.querySelectorAll(".editorial-index-item");
    const cells = [];
    items.forEach((item) => {
      const number = item.querySelector(".editorial-index-number, span");
      const heading = item.querySelector('h3, h4, [class*="heading"]');
      const description = item.querySelector('p, .paragraph-lg, [class*="paragraph"]');
      const cellContent = [];
      if (number) cellContent.push(number);
      if (heading) cellContent.push(heading);
      if (description) cellContent.push(description);
      if (cellContent.length > 0) {
        cells.push(cellContent);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-editorial", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [".skip-link"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [".navbar"]);
      WebImporter.DOMUtils.remove(element, ["footer.footer"]);
      WebImporter.DOMUtils.remove(element, ["link", "noscript"]);
    }
  }

  // tools/importer/transformers/wknd-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      let findSection = function(sectionDef) {
        switch (sectionDef.id) {
          case "section-1":
            return element.querySelector("section.hero-section--full");
          case "section-2":
            return element.querySelector(".featured-article") && element.querySelector(".featured-article").closest("section");
          case "section-3":
            return element.querySelector(".tab-container--wide") && element.querySelector(".tab-container--wide").closest("section");
          case "section-4":
            return element.querySelector(".ticker-strip");
          case "section-5": {
            const inverseSections = element.querySelectorAll("section.inverse-section");
            for (const s of inverseSections) {
              if (s.querySelector(".container--narrow") && !s.querySelector(".grid-images")) return s;
            }
            return null;
          }
          case "section-6":
            return element.querySelector(".faq-list") && element.querySelector(".faq-list").closest("section");
          case "section-7":
            return element.querySelector(".editorial-index") && element.querySelector(".editorial-index").closest("section");
          case "section-8":
            return element.querySelector(".grid-images") && element.querySelector(".grid-images").closest("section");
          case "section-9":
            return element.querySelector("section.accent-section");
          default:
            return null;
        }
      };
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const document = element.ownerDocument;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionEl = findSection(section);
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.append(metaBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-adventure": parse,
    "columns-featured": parse2,
    "tabs-activity": parse3,
    "marquee-ticker": parse4,
    "accordion-faq": parse5,
    "cards-editorial": parse6
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "WKND Adventures homepage with hero, featured adventures, and content sections",
    urls: ["https://wknd-adventures.com"],
    blocks: [
      {
        name: "hero-adventure",
        instances: [".hero-section.hero-section--full"]
      },
      {
        name: "columns-featured",
        instances: [".featured-article"]
      },
      {
        name: "tabs-activity",
        instances: [".tab-container.tab-container--wide"]
      },
      {
        name: "marquee-ticker",
        instances: [".ticker-strip"]
      },
      {
        name: "accordion-faq",
        instances: [".faq-list"]
      },
      {
        name: "cards-editorial",
        instances: [".editorial-index"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: "section.hero-section.hero-section--full",
        style: null,
        blocks: ["hero-adventure"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Featured Article",
        selector: "main > section.secondary-section:first-of-type",
        style: "secondary",
        blocks: ["columns-featured"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Browse by Activity",
        selector: "main > section.section:nth-of-type(3)",
        style: null,
        blocks: ["tabs-activity"],
        defaultContent: [".section-heading .h2-heading"]
      },
      {
        id: "section-4",
        name: "Activity Ticker",
        selector: ".ticker-strip",
        style: null,
        blocks: ["marquee-ticker"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Not Sure Where to Start",
        selector: "main > section.inverse-section:first-of-type",
        style: "dark",
        blocks: [],
        defaultContent: [".inverse-section .container--narrow .tag", ".inverse-section .container--narrow .h2-heading", ".inverse-section .container--narrow .paragraph-lg", ".inverse-section .container--narrow .button-group"]
      },
      {
        id: "section-6",
        name: "Quick Answers FAQ",
        selector: "section:has(.faq-list)",
        style: null,
        blocks: ["accordion-faq"],
        defaultContent: [".section-heading .h2-heading"]
      },
      {
        id: "section-7",
        name: "How We Work",
        selector: "section.secondary-section:has(.editorial-index)",
        style: "secondary",
        blocks: ["cards-editorial"],
        defaultContent: [".section-heading .h2-heading"]
      },
      {
        id: "section-8",
        name: "In the Field Gallery",
        selector: "section.inverse-section:has(.grid-images)",
        style: "dark",
        blocks: [],
        defaultContent: [".section-heading .h2-heading", ".section-heading .text-button", ".grid-images .gallery-img", ".gallery-img--wide"]
      },
      {
        id: "section-9",
        name: "Final CTA",
        selector: "section.accent-section",
        style: "accent",
        blocks: [],
        defaultContent: [".accent-section .h2-heading", ".accent-section .paragraph-lg", ".accent-section .button-group"]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
