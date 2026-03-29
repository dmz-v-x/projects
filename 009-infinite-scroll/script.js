const feed = document.getElementById('feed');
const loader = document.getElementById('loader');
const endMessage = document.getElementById('endMessage');
const sentinel = document.getElementById('sentinel');

const TOTAL_ITEMS = 60;
const BATCH_SIZE = 8;
let loadedCount = 0;
let isLoading = false;

function createCard(index) {
  const article = document.createElement('article');
  article.className = 'card';

  const img = document.createElement('img');
  img.src = `https://picsum.photos/seed/infinite-${index}/900/500`;
  img.alt = `Random image ${index}`;
  img.loading = 'lazy';

  const content = document.createElement('div');
  content.className = 'card-content';

  const title = document.createElement('h3');
  title.textContent = `Post #${index}`;

  const text = document.createElement('p');
  text.textContent = 'This item was appended by JavaScript as part of an infinite scrolling list.';

  content.append(title, text);
  article.append(img, content);
  return article;
}

async function loadMoreItems() {
  if (isLoading || loadedCount >= TOTAL_ITEMS) {
    return;
  }

  isLoading = true;
  loader.hidden = false;

  await new Promise((resolve) => setTimeout(resolve, 550));

  const remaining = TOTAL_ITEMS - loadedCount;
  const amountToLoad = Math.min(BATCH_SIZE, remaining);

  for (let i = 1; i <= amountToLoad; i += 1) {
    const nextIndex = loadedCount + i;
    feed.appendChild(createCard(nextIndex));
  }

  loadedCount += amountToLoad;
  loader.hidden = true;
  isLoading = false;

  if (loadedCount >= TOTAL_ITEMS) {
    observer.disconnect();
    endMessage.hidden = false;
  }
}

const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      loadMoreItems();
    }
  },
  {
    root: null,
    rootMargin: '260px',
    threshold: 0
  }
);

loadMoreItems();
observer.observe(sentinel);
