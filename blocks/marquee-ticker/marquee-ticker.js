export default function decorate(block) {
  const items = [...block.children].map((row) => row.textContent.trim());

  // Create ticker track with duplicated items for seamless loop
  const track = document.createElement('div');
  track.className = 'marquee-ticker-track';

  const separator = ' · ';
  const content = items.join(separator);

  // Duplicate content for seamless scrolling
  track.innerHTML = `<span class="marquee-ticker-content">${content}${separator}</span><span class="marquee-ticker-content">${content}${separator}</span>`;

  block.textContent = '';
  block.append(track);
}
