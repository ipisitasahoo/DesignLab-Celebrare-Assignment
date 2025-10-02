const carousel = document.getElementById('carousel');
const slides = document.querySelectorAll('.slide');
const thumbs = document.querySelectorAll('.thumb');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const addTextBtn = document.getElementById('addTextBtn');
const delTextBtn = document.getElementById('delTextBtn');
const downloadBtn = document.getElementById('downloadBtn');

let currentIndex = 0;
let activeBlock = null;

function qs(selector, root=document) { return root.querySelector(selector); }
function qsa(selector, root=document) { return Array.from(root.querySelectorAll(selector)); }

function updateCarousel() {
  carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
  thumbs.forEach(t=>t.classList.remove('active'));
  document.querySelector('.thumb[data-index="'+(currentIndex+1)+'"]').classList.add('active');
  setActiveBlock(null);
}
prevBtn.addEventListener('click', ()=>{ currentIndex = (currentIndex-1+slides.length)%slides.length; updateCarousel(); });
nextBtn.addEventListener('click', ()=>{ currentIndex = (currentIndex+1)%slides.length; updateCarousel(); });
thumbs.forEach(t=>t.addEventListener('click', ()=>{ currentIndex = parseInt(t.dataset.index)-1; updateCarousel(); }));
updateCarousel();

function setActiveBlock(el) {
  if(activeBlock) activeBlock.classList.remove('selected');
  activeBlock = el;
  if(activeBlock) {
    activeBlock.classList.add('selected');
    document.getElementById('activeLabel').textContent = activeBlock.dataset.id || 'Text';

    const style = window.getComputedStyle(activeBlock);
    document.getElementById('fontSelect').value = style.fontFamily || '';
    document.getElementById('fontSize').value = parseInt(style.fontSize) || 48;
    document.getElementById('fzVal').textContent = parseInt(style.fontSize) || 48;
    document.getElementById('fontColor').value = rgbToHex(style.color);

    qsa('.align-btn').forEach(b=>b.classList.remove('active'));
    const align = style.textAlign || 'center';
    const btn = document.querySelector('.align-btn[data-align="'+align+'"]');
    if(btn) btn.classList.add('active');
  } else {
    document.getElementById('activeLabel').textContent = 'None';
  }
}

let blockCounter = 0;
addTextBtn.addEventListener('click', ()=>{
  const slide = slides[currentIndex];
  const overlay = slide.querySelector('.overlay');
  blockCounter += 1;
  const tb = document.createElement('div');
  tb.className = 'text-block';
  tb.contentEditable = true;
  tb.dataset.id = 'T' + blockCounter;
  tb.innerText = 'New text';

  tb.style.fontSize = '48px';
  tb.style.fontFamily = 'Poppins, sans-serif';
  tb.style.color = '#ffffff';

  tb.style.left = '50%'; tb.style.top = '50%'; tb.style.transform = 'translate(-50%,-50%)';
  overlay.appendChild(tb);
  makeDraggable(tb);
  tb.addEventListener('click', (e)=>{ e.stopPropagation(); setActiveBlock(tb); });
  tb.addEventListener('input', ()=>{ /* keep content updated */ });
  setActiveBlock(tb);
});

delTextBtn.addEventListener('click', ()=>{
  if(activeBlock && confirm('Delete selected text block?')) {
    const parent = activeBlock.parentElement;
    activeBlock.remove();
    setActiveBlock(null);
  }
});

document.querySelectorAll('.overlay').forEach(o=>{
  o.addEventListener('click', ()=> setActiveBlock(null));
});

function makeDraggable(el) {
  let isDown=false, startX=0, startY=0, origX=0, origY=0;
  el.addEventListener('pointerdown', (e)=>{
    e.stopPropagation();
    isDown = true;
    el.setPointerCapture(e.pointerId);
    startX = e.clientX; startY = e.clientY;
    const rect = el.getBoundingClientRect();
    const parentRect = el.parentElement.getBoundingClientRect();
    origX = rect.left - parentRect.left;
    origY = rect.top - parentRect.top;
    setActiveBlock(el);
  });
  document.addEventListener('pointermove', (e)=>{
    if(!isDown) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const parentRect = el.parentElement.getBoundingClientRect();
    let nx = origX + dx; let ny = origY + dy;

    nx = Math.max(0, Math.min(nx, parentRect.width - el.offsetWidth));
    ny = Math.max(0, Math.min(ny, parentRect.height - el.offsetHeight));

    const px = (nx + el.offsetWidth/2) / parentRect.width * 100;
    const py = (ny + el.offsetHeight/2) / parentRect.height * 100;
    el.style.left = px + '%';
    el.style.top = py + '%';
    el.style.transform = 'translate(-50%,-50%)';
  });
  document.addEventListener('pointerup', (e)=>{ if(isDown){ isDown=false; try{ el.releasePointerCapture(e.pointerId); }catch{} } });
}

document.getElementById('fontSelect').addEventListener('change', (e)=>{ if(activeBlock) activeBlock.style.fontFamily = e.target.value; });
document.getElementById('fontSize').addEventListener('input', (e)=>{ if(activeBlock) activeBlock.style.fontSize = e.target.value + 'px'; document.getElementById('fzVal').textContent = e.target.value; });
document.getElementById('fontColor').addEventListener('input', (e)=>{ if(activeBlock) activeBlock.style.color = e.target.value; });
qsa('.align-btn').forEach(b=>b.addEventListener('click', ()=>{ if(!activeBlock) return; qsa('.align-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); activeBlock.style.textAlign = b.dataset.align; }));
document.getElementById('languageSelect').addEventListener('change', (e)=>{ if(activeBlock) { activeBlock.lang = e.target.value; if(e.target.value === 'ar') activeBlock.style.direction = 'rtl'; else activeBlock.style.direction = 'ltr'; } });
document.getElementById('boldBtn').addEventListener('click', ()=>{ if(!activeBlock) return; activeBlock.style.fontWeight = activeBlock.style.fontWeight === '700' ? '400' : '700'; });
document.getElementById('italicBtn').addEventListener('click', ()=>{ if(!activeBlock) return; activeBlock.style.fontStyle = activeBlock.style.fontStyle === 'italic' ? 'normal' : 'italic'; });
document.getElementById('uppercaseBtn').addEventListener('click', ()=>{ if(!activeBlock) return; if(activeBlock.style.textTransform === 'uppercase') activeBlock.style.textTransform = 'none'; else activeBlock.style.textTransform = 'uppercase'; });

function initExistingBlocks() {
  qsa('.overlay').forEach(overlay=>{
    qsa('.text-block', overlay).forEach(tb=> makeDraggable(tb) );
  });
}
initExistingBlocks();

function rgbToHex(rgb) {
  const m = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if(!m) return '#ffffff';
  return '#' + [1,2,3].map(i=>('0'+parseInt(m[i]).toString(16)).slice(-2)).join('');
}

downloadBtn.addEventListener('click', async ()=>{
  const slide = slides[currentIndex];
  const img = slide.querySelector('img');
  const overlay = slide.querySelector('.overlay');

  const w = img.naturalWidth || 1080;
  const h = img.naturalHeight || 1920;
  const off = document.createElement('canvas');
  off.width = w; off.height = h;
  const ctx = off.getContext('2d');

  ctx.drawImage(img, 0, 0, w, h);

  const blocks = qsa('.text-block', overlay);
  const parentRect = overlay.getBoundingClientRect();
  blocks.forEach(tb=>{
    const style = window.getComputedStyle(tb);
    const fontSize = parseInt(style.fontSize) || 48;
    const fontFamily = style.fontFamily || 'sans-serif';
    ctx.fillStyle = style.color || '#fff';
    ctx.textAlign = style.textAlign === 'center' ? 'center' : (style.textAlign === 'right' ? 'right' : 'left');
    ctx.font = (style.fontWeight || '400') + ' ' + fontSize * (w / parentRect.width) + 'px ' + fontFamily;

    const rect = tb.getBoundingClientRect();
    const cx = ((rect.left + rect.width/2) - parentRect.left) / parentRect.width * w;
    const cy = ((rect.top + rect.height/2) - parentRect.top) / parentRect.height * h + fontSize/3;
    const lines = tb.innerText.split('\n');
    lines.forEach((ln,i)=> ctx.fillText(ln, cx, cy + i * (fontSize * (w / parentRect.width) * 1.05)) );
  });
  const url = off.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url; a.download = 'slide.png'; document.body.appendChild(a); a.click(); a.remove();
});

