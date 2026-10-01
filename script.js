/* ============================================================
   EDIT YOUR PORTFOLIO HERE
   type:  "video" or "slides"
   embed: paste an embed link (YouTube, Vimeo, Loom, Google Slides,
          Canva...). Leave "" to show the placeholder.
   image: optional thumbnail path, e.g. "images/promo.jpg"
   ============================================================ */
const WORK = [
  { id:"inbox-zero", type:"video", title:"Inbox Zero: Email Management Demo", desc:"Organizing and clearing a busy inbox with streamlined systems.", embed:"", image:"" },
  { id:"calendar", type:"video", title:"Calendar Management & Meeting Scheduling", desc:"Keeping calendars aligned and meetings booked without friction.", embed:"", image:"" },
  { id:"executive-report", type:"slides", title:"Weekly Executive Report Sample", desc:"Turning scattered updates into a polished client-ready summary.", embed:"", image:"" },
  { id:"data-cleanup", type:"video", title:"Data Entry & Spreadsheet Cleanup", desc:"Cleaning, organizing, and standardizing data for reliable reporting.", embed:"", image:"" },
  { id:"social-calendar", type:"slides", title:"Social Media Content Calendar", desc:"Planning content themes, posting schedules, and campaign rhythm.", embed:"", image:"" },
  { id:"crm", type:"video", title:"Client CRM Management Demo", desc:"Tracking client details, tasks, and follow-ups in one organized place.", embed:"", image:"" },
  { id:"sop", type:"slides", title:"SOP Creation: Client Onboarding Process", desc:"Building repeatable workflows that help clients move smoothly from start to finish.", embed:"", image:"" },
  { id:"travel-planning", type:"slides", title:"Travel & Business Trip Planning Demo", desc:"Coordinating logistics, schedules, and important details for travel-ready plans.", embed:"", image:"" },
  { id:"task-board", type:"video", title:"Task Management Dashboard in Trello/Notion", desc:"Creating a clear workflow board to manage priorities and deadlines.", embed:"", image:"" }
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
