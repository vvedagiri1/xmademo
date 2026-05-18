/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-faq
 * Base block: accordion
 * Structure: 2 columns per row: [question-title | answer-content] - each row is one accordion item
 * Source selector: .faq-list
 * Generated: 2026-05-18
 */
export default function parse(element, { document }) {
  // Extract all FAQ items from the source structure
  const faqItems = element.querySelectorAll('.faq-item');

  const cells = [];

  faqItems.forEach((item) => {
    // Extract question text from the button span (first span, not the icon)
    const questionButton = item.querySelector('.faq-question');
    const questionSpan = questionButton ? questionButton.querySelector('span:not(.faq-icon)') : null;
    const questionText = questionSpan ? questionSpan.textContent.trim() : '';

    // Extract answer content from the faq-answer div
    const answerDiv = item.querySelector('.faq-answer');
    const answerText = answerDiv ? answerDiv.textContent.trim() : '';

    // Build the row: [question-title | answer-content]
    if (questionText || answerText) {
      const questionEl = document.createElement('p');
      questionEl.textContent = questionText;

      const answerEl = document.createElement('p');
      answerEl.textContent = answerText;

      cells.push([questionEl, answerEl]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
