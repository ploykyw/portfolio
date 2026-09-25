/* ---------------------------------------------------
   โหลดรูปแบบปลอดภัย
   - อ่าน path จาก data-src
   - โหลดผ่าน Image() ก่อน ถ้าสำเร็จค่อยใส่ src จริง
   - ถ้าไฟล์ไม่มี: ไม่มี error แดง ไม่มีรูปแตก
     หน้าเว็บยังใช้งานได้ปกติ เห็นเป็น placeholder
---------------------------------------------------- */
document.querySelectorAll('img[data-src]').forEach(img => {
  const path = img.dataset.src;
  if (!path) return;

  const probe = new Image();
  probe.onload = () => {
    img.src = path;
    img.classList.add('loaded');
    // เปิด lightbox ได้เฉพาะ thumbnail ที่มีรูปจริง
    const shot = img.closest('.shot');
    if (shot) {
      shot.classList.add('ready');
      shot.dataset.full = path;
    }
  };
  probe.onerror = () => { /* ไม่มีไฟล์ — ปล่อยให้โชว์ placeholder */ };
  probe.src = path;
});

/* ---------------- LIGHTBOX ---------------- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');

function openLightbox(src){
  lightboxImg.src = src;
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeLightbox(){
  lightbox.hidden = true;
  lightboxImg.src = '';
  document.body.style.overflow = '';
}

document.addEventListener('click', e => {
  const shot = e.target.closest('.shot.ready');
  if (shot && shot.dataset.full) openLightbox(shot.dataset.full);

  if (e.target === lightbox || e.target.classList.contains('lightbox-close')) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
});

/* ---------- ไฮไลต์เมนูตามส่วนที่กำลังดู ---------- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

if ('IntersectionObserver' in window && sections.length) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + entry.target.id
          ? 'var(--accent)' : '';
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(s => io.observe(s));
}

// 1. ใส่ชื่อไฟล์รูปที่มีจริงในโฟลเดอร์ของคุณตรงนี้
const shotFiles = [
  'cover.png',
  'shot-2.png',
  'shot-3.png',
  'shot-4.png',
  // อยากเพิ่มรูปไหนอีก แค่พิมพ์ชื่อไฟล์เพิ่มตรงนี้ได้เลย
];

// 2. เลือกคอนเทนเนอร์ที่ต้องการแสดงผล
const container = document.getElementById('drinkopoly-shots');

if (container && shotFiles.length > 0) {
  // 3. วนลูปสร้าง HTML ทีละรูป
  const htmlContent = shotFiles.map((filename, index) => {
    // จัดรูปแบบเลขหน้า เช่น 01, 02, 03
    const numLabel = String(index + 1).padStart(2, '0');
    const imagePath = `assets/images/Drinkopoly/${filename}`;

    return `
      <button class="shot ready" data-label="${numLabel}">
        <img src="${imagePath}" alt="Screen ${numLabel}" class="loaded">
      </button>
    `;
  }).join('');

  // 4. ยัดเข้าหน้าเว็บ
  container.innerHTML = htmlContent;
}