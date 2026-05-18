/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Adventures site-wide cleanup.
 * Removes non-authorable content (header, footer, skip link).
 * Selectors validated against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove skip link (non-authorable accessibility utility)
    // Found in cleaned.html: <a href="#main-content" class="skip-link">Skip to main content</a>
    WebImporter.DOMUtils.remove(element, ['.skip-link']);
  }
  if (hookName === TransformHook.afterTransform) {
    // Remove site header navigation
    // Found in cleaned.html: <div class="navbar">...</div>
    WebImporter.DOMUtils.remove(element, ['.navbar']);

    // Remove site footer
    // Found in cleaned.html: <footer class="footer inverse-footer">...</footer>
    WebImporter.DOMUtils.remove(element, ['footer.footer']);

    // Remove leftover non-content elements
    WebImporter.DOMUtils.remove(element, ['link', 'noscript']);
  }
}
