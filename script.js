/* ============================================================
   EDIT YOUR PORTFOLIO HERE
   type:  "video" or "slides"
   embed: paste an embed link (YouTube, Vimeo, Loom, Google Slides,
          Canva...). Leave "" to show the placeholder.
   image: optional thumbnail path, e.g. "images/promo.jpg"
   ============================================================ */
const WORK = [
  { id:"reel",  type:"video",  title:"Intro reel",          desc:"A short hello and what I do.",        embed:"", image:"" },
  { id:"inbox", type:"video",  title:"Inbox zero tour",     desc:"How I sort a messy inbox in a day.",  embed:"", image:"" },
  { id:"cal",   type:"slides", title:"Calendar setup deck", desc:"A client scheduling system, step by step.", embed:"", image:"" },
  { id:"social",type:"slides", title:"Content calendar",    desc:"A month of social posts, planned.",   embed:"", image:"" },
  { id:"travel",type:"video",  title:"Travel plan demo",    desc:"Planning a 5-day trip from scratch.", embed:"", image:"" },
  { id:"report",type:"slides", title:"Weekly report sample",desc:"A one-page summary clients love.",    embed:"", image:"" }
];

const grid = document.getElementById('grid');
const modal = document.getElementById('modal');
const frame = document.getElementById('frame');

function render(filter = 'all'){
  grid.innerHTML = '';
  WORK.filter(w => filter === 'all' || w.type === filter).forEach((w, i) => {
    const b = document.createElement('button');
    b.className = 'card c' + (i % 3);
    b.dataset.open = w.id;
    const icon = w.type === 'video' ? '▶' : '▤';
    const thumb = w.image ? `<img src="${w.image}" alt="">` : `<span class="mini">${icon}</span>`;
    b.innerHTML = `<div class="thumb">${thumb}<span class="tag">${w.type === 'video' ? 'Video' : 'Slides'}</span></div>
                   <h3>${w.title}</h3><p>${w.desc}</p>`;
    grid.appendChild(b);
  });
}

function openItem(id){
  const w = WORK.find(x => x.id === id); if(!w) return;
  document.getElementById('mTitle').textContent = w.title;
  document.getElementById('mDesc').textContent = w.desc;
  frame.innerHTML = '';
  if (w.embed){
    const f = document.createElement('iframe');
    f.src = w.embed; f.title = w.title; f.allowFullscreen = true;
    f.allow = 'autoplay; fullscreen; picture-in-picture';
    frame.appendChild(f);
  } else {
    frame.innerHTML = `<div><div class="play"></div><strong style="font-family:var(--display);font-weight:400;font-size:1.4rem;display:block;margin-top:.5rem">Coming soon</strong>
      <span>Your ${w.type === 'video' ? 'video' : 'slides'} will play here.</span></div>`;
  }
  modal.showModal();
}

document.addEventListener('click', e => {
  const t = e.target.closest('[data-open]');
  if (t) openItem(t.dataset.open);
  const tab = e.target.closest('.tab');
  if (tab){
    document.querySelectorAll('.tab').forEach(x => x.setAttribute('aria-pressed', x === tab));
    render(tab.dataset.filter);
  }
  if (e.target === modal) modal.close();
});
document.querySelector('.screen').addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openItem('reel'); }
});
document.getElementById('close').addEventListener('click', () => modal.close());
modal.addEventListener('close', () => frame.innerHTML = '');  // stops playback
document.getElementById('year').textContent = new Date().getFullYear();
render();
