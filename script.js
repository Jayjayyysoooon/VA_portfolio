const WORK = [
  {
    id: "inbox-zero",
    type: "video",
    title: "Inbox Zero: Email Management Demo",
    desc: "Organizing and clearing a busy inbox with streamlined systems.",
    video: "Projects/Inbox Zero Email Management Demo.mp4",
    embed: "",
    image: ""
  },
  {
    id: "calendar",
    type: "video",
    title: "Calendar Management & Meeting Scheduling",
    desc: "Keeping calendars aligned and meetings booked without friction.",
    video: "Projects/Calendar Management & Meeting Scheduling.mp4",
    embed: "",
    image: ""
  },
  {
    id: "data-cleanup",
    type: "video",
    title: "Data Entry & Excel Cleanup Demo",
    desc: "Cleaning, organizing, and standardizing data in Excel for reliable reporting.",
    video: "Projects/Data Entry & Excel Cleanup Demo.mp4",
    embed: "",
    image: ""
  },
  {
    id: "sales-chart",
    type: "video",
    title: "Excel Sales Report Chart Demo",
    desc: "Creating a dark-style 2D area chart from January–December brand sales, with legends and a data table.",
    video: "Projects/Sales Report Chart.mp4",
    embed: "",
    image: ""
  }
];

const grid = document.getElementById('grid');
const carousel = document.getElementById('projectCarousel');
const pauseButton = carousel.querySelector('[data-carousel="pause"]');
const modal = document.getElementById('modal');
const frame = document.getElementById('frame');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let activeFilter = 'all';
let visibleCount = 1;
let projectCount = 0;
let carouselIndex = 0;
let isMoving = false;
const moveQueue = [];
let autoplayPaused = reducedMotion.matches;

function positionCarousel(animate = true) {
  grid.style.transition = animate ? '' : 'none';

  const firstCard = grid.firstElementChild;
  if (firstCard) {
    const gap = parseFloat(getComputedStyle(grid).columnGap) || 0;
    grid.style.transform = `translateX(${-carouselIndex * (firstCard.offsetWidth + gap)}px)`;
  }

  if (!animate) {
    grid.getBoundingClientRect();
    grid.style.transition = '';
  }
}

function resetCarouselIndex() {
  if (carouselIndex >= visibleCount + projectCount) {
    carouselIndex = visibleCount;
  } else if (carouselIndex < visibleCount) {
    carouselIndex = visibleCount + projectCount - 1;
  }
}

function moveCarousel(direction) {
  if (projectCount < 2) {
    return;
  }

  if (isMoving) {
    moveQueue.push(direction);
    return;
  }

  carouselIndex += direction;

  if (reducedMotion.matches) {
    resetCarouselIndex();
    positionCarousel(false);
    return;
  }

  isMoving = true;
  positionCarousel();
}

function updatePauseButton() {
  pauseButton.textContent = autoplayPaused ? '▶' : 'Ⅱ';
  pauseButton.setAttribute('aria-pressed', autoplayPaused);
  pauseButton.setAttribute(
    'aria-label',
    autoplayPaused ? 'Resume automatic project slides' : 'Pause automatic project slides'
  );
  pauseButton.title = autoplayPaused
    ? 'Resume automatic project slides'
    : 'Pause automatic project slides';
}

function render(filter = activeFilter) {
  activeFilter = filter;
  moveQueue.length = 0;
  grid.innerHTML = '';

  const projects = WORK.filter(w => filter === 'all' || w.type === filter);
  projects.forEach((w, i) => {
    const b = document.createElement('button');
    b.className = 'card c' + (i % 3);
    b.dataset.open = w.id;

    const icon = w.type === 'video' ? '▶' : '▤';
    const thumb = w.image
      ? `<img src="${w.image}" alt="">`
      : w.video
        ? `<video src="${w.video}" muted playsinline preload="metadata" aria-hidden="true"></video>`
        : `<span class="mini">${icon}</span>`;

    b.innerHTML = `<div class="thumb">${thumb}<span class="tag">${w.type === 'video' ? 'Video' : 'Slides'}</span></div>
                   <h3>${w.title}</h3><p>${w.desc}</p>`;
    grid.appendChild(b);
  });

  projectCount = projects.length;
  const preferredCount = Number.parseInt(
    getComputedStyle(grid).getPropertyValue('--cards-visible'),
    10
  ) || 1;
  visibleCount = Math.min(preferredCount, Math.max(1, projectCount - 1));

  if (projectCount > 1) {
    const cards = Array.from(grid.children);
    const cloneCard = card => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.tabIndex = -1;
      return clone;
    };

    grid.prepend(...cards.slice(-visibleCount).map(cloneCard));
    grid.append(...cards.slice(0, visibleCount).map(cloneCard));
    carouselIndex = visibleCount;
  } else {
    carouselIndex = 0;
  }

  isMoving = false;
  positionCarousel(false);
}

function openItem(id) {
  const w = WORK.find(x => x.id === id);
  if (!w) {
    return;
  }

  document.getElementById('mTitle').textContent = w.title;
  document.getElementById('mDesc').textContent = w.desc;
  frame.innerHTML = '';

  if (w.video) {
    const video = document.createElement('video');
    video.controls = true;
    video.preload = 'metadata';
    video.playsInline = true;
    video.src = w.video;
    frame.appendChild(video);
    video.play().catch(() => {});
  } else if (w.embed) {
    const f = document.createElement('iframe');
    f.src = w.embed;
    f.title = w.title;
    f.allowFullscreen = true;
    f.allow = 'autoplay; fullscreen; picture-in-picture';
    frame.appendChild(f);
  } else {
    frame.innerHTML = `<div><div class="play"></div><strong style="font-family:var(--display);font-weight:400;font-size:1.4rem;display:block;margin-top:.5rem">Coming soon</strong>
      <span>Your ${w.type === 'video' ? 'video' : 'slides'} will play here.</span></div>`;
  }

  modal.showModal();
}

document.addEventListener('click', e => {
  const carouselControl = e.target.closest('[data-carousel]');
  if (carouselControl) {
    if (carouselControl.dataset.carousel === 'previous') {
      moveCarousel(-1);
    }

    if (carouselControl.dataset.carousel === 'next') {
      moveCarousel(1);
    }

    if (carouselControl.dataset.carousel === 'pause') {
      autoplayPaused = !autoplayPaused;
      updatePauseButton();
    }

    return;
  }

  const t = e.target.closest('[data-open]');
  if (t) {
    openItem(t.dataset.open);
  }

  const tab = e.target.closest('.tab');
  if (tab) {
    document.querySelectorAll('.tab').forEach(x => {
      x.setAttribute('aria-pressed', x === tab);
    });
    render(tab.dataset.filter);
  }

  if (e.target === modal) {
    modal.close();
  }
});

grid.addEventListener('transitionend', e => {
  if (e.target !== grid || e.propertyName !== 'transform' || !isMoving) {
    return;
  }

  resetCarouselIndex();
  isMoving = false;
  positionCarousel(false);

  if (moveQueue.length) {
    moveCarousel(moveQueue.shift());
  }
});

reducedMotion.addEventListener('change', e => {
  if (e.matches) {
    autoplayPaused = true;
    updatePauseButton();
  }
});

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => render(activeFilter), 120);
});

document.querySelector('.screen').addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    openItem('reel');
  }
});

document.getElementById('close').addEventListener('click', () => modal.close());
modal.addEventListener('close', () => frame.innerHTML = ''); // stops playback
document.getElementById('year').textContent = new Date().getFullYear();

updatePauseButton();
render();

setInterval(() => {
  if (!autoplayPaused && !document.hidden && !carousel.matches(':hover, :focus-within')) {
    moveCarousel(1);
  }
}, 5000);
