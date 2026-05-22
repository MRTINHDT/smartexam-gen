/* ─────────────────────────────────────────
   SmartExam Gen · App Logic
   Emerald Edition · 2026
───────────────────────────────────────── */

/* ── Slider value sync ── */
function updateSliderBackground(slider) {
  const min = +slider.min, max = +slider.max, val = +slider.value;
  const pct = ((val - min) / (max - min)) * 100;
  slider.style.setProperty('--val', pct + '%');
  slider.style.background = `linear-gradient(to right,
    var(--em-500) 0%, var(--em-500) ${pct}%,
    var(--gray-200) ${pct}%, var(--gray-200) 100%)`;
}

function updateSlider(sliderId, displayId) {
  const slider = document.getElementById(sliderId);
  const display = document.getElementById(displayId);
  display.textContent = slider.value;
  updateSliderBackground(slider);
}

function updateTimerSlider() {
  const slider = document.getElementById('timer-range');
  const display = document.getElementById('timer-display');
  const val = +slider.value;
  if (val >= 60) {
    const h = Math.floor(val / 60), m = val % 60;
    display.textContent = m ? `${h}h ${m}m` : `${h}h`;
  } else {
    display.textContent = `${val} min`;
  }
  updateSliderBackground(slider);
}

/* ── Difficulty selector ── */
function selectDiff(btn) {
  document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  showToast(`Difficulty set to <strong>${btn.dataset.val}</strong>`, 'success');
}

/* ── Type chip toggle ── */
function toggleChip(chipId, checkbox) {
  const chip = document.getElementById(chipId);
  chip.classList.toggle('checked', checkbox.checked);
}

/* ── Nav ── */
function setActiveNav(el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
}

/* ── Sidebar toggle (mobile) ── */
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

/* ── Drag & Drop ── */
function handleDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  const files = Array.from(e.dataTransfer.files);
  processFiles(files);
}

function handleFileSelect(e) {
  const files = Array.from(e.target.files);
  processFiles(files);
}

const ALLOWED_EXT = ['pdf', 'docx', 'txt', 'pptx'];
let uploadedFiles = [];

function processFiles(files) {
  const valid = files.filter(f => {
    const ext = f.name.split('.').pop().toLowerCase();
    return ALLOWED_EXT.includes(ext);
  });

  if (valid.length !== files.length) {
    showToast('Some files were skipped (unsupported format)', 'error');
  }

  valid.forEach(file => {
    if (uploadedFiles.find(u => u.name === file.name)) return;
    uploadedFiles.push(file);
    renderFileItem(file);
    simulateUpload(file.name);
  });

  if (valid.length) {
    showToast(`<strong>${valid.length}</strong> file${valid.length > 1 ? 's' : ''} added successfully`);
    // Mark step 1 active
    document.getElementById('step1-card').querySelector('.step-badge').classList.add('active');
    document.getElementById('step2-card').querySelector('.step-badge').classList.add('active');
  }
}

function renderFileItem(file) {
  const ext = file.name.split('.').pop().toUpperCase();
  const size = formatSize(file.size);
  const id = 'file-' + Date.now() + Math.random().toString(36).slice(2);

  const div = document.createElement('div');
  div.className = 'file-item';
  div.id = id;
  div.innerHTML = `
    <div class="file-icon">${ext}</div>
    <div class="file-info">
      <div class="file-name">${escHtml(file.name)}</div>
      <div class="file-size">${size}</div>
      <div class="file-progress">
        <div class="file-progress-fill" id="prog-${id}" style="width:0%"></div>
      </div>
    </div>
    <button class="file-remove" onclick="removeFile('${id}','${escHtml(file.name)}')" title="Remove">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
    </button>
  `;
  document.getElementById('fileList').appendChild(div);
}

function simulateUpload(name) {
  const items = document.querySelectorAll('.file-item');
  const item = items[items.length - 1];
  if (!item) return;
  const bar = item.querySelector('.file-progress-fill');
  let pct = 0;
  const interval = setInterval(() => {
    pct += Math.random() * 22;
    if (pct >= 100) { pct = 100; clearInterval(interval); }
    if (bar) bar.style.width = pct + '%';
  }, 120);
}

function removeFile(id, name) {
  uploadedFiles = uploadedFiles.filter(f => f.name !== name);
  const el = document.getElementById(id);
  if (el) { el.style.opacity = '0'; el.style.transform = 'scale(.95)'; el.style.transition = '.2s'; setTimeout(() => el.remove(), 200); }
  showToast(`Removed <strong>${name}</strong>`, 'info');
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function escHtml(str) { return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* ── Generate ── */
function startGeneration() {
  const btn = document.getElementById('generateBtn');
  const progress = document.getElementById('genProgress');
  const fill = document.getElementById('progressFill');
  const label = document.getElementById('progressLabel');

  btn.disabled = true;
  btn.style.opacity = '.7';
  progress.style.display = 'block';

  const steps = [
    [10, 'Analyzing document structure…'],
    [28, 'Extracting key concepts…'],
    [45, 'Generating questions with AI…'],
    [65, 'Evaluating difficulty levels…'],
    [80, 'Applying language model…'],
    [92, 'Finalizing exam format…'],
    [100, 'Done! Exam ready 🎉'],
  ];

  let i = 0;
  const run = () => {
    if (i >= steps.length) {
      setTimeout(() => {
        progress.style.display = 'none';
        btn.disabled = false;
        btn.style.opacity = '1';
        fill.style.width = '0%';
        showModal();
        addNewExam();
      }, 600);
      return;
    }
    const [pct, msg] = steps[i++];
    fill.style.width = pct + '%';
    label.textContent = msg + ' ' + pct + '%';
    setTimeout(run, 500 + Math.random() * 400);
  };
  run();
}

function showModal() {
  const q = document.getElementById('q-display').textContent;
  const diff = document.querySelector('.diff-btn.active')?.dataset.val || 'medium';
  document.getElementById('modalDesc').textContent = `${q} ${diff} questions generated successfully. Ready to start!`;
  document.getElementById('modalOverlay').style.display = 'grid';
}

function closeModal() {
  document.getElementById('modalOverlay').style.display = 'none';
}

function startQuiz() {
  closeModal();
  showToast('<strong>Quiz started!</strong> Good luck 🎯', 'success');
}

/* ── Recent exams data ── */
const SAMPLE_EXAMS = [
  { title: 'Chapter 2: Data Structures & Algorithms', date: '21/5/2026', difficulty: 'hard', questions: 20, score: 88, attempts: 3 },
  { title: 'Macroeconomics — Final Review', date: '20/5/2026', difficulty: 'medium', questions: 15, score: 72, attempts: 1 },
  { title: 'Introduction to Machine Learning', date: '18/5/2026', difficulty: 'mixed', questions: 25, score: 95, attempts: 5 },
  { title: 'Business Ethics & Corporate Law', date: '15/5/2026', difficulty: 'easy', questions: 10, score: 60, attempts: 2 },
  { title: 'React Fundamentals — Unit 3', date: '12/5/2026', difficulty: 'medium', questions: 20, score: 83, attempts: 4 },
];

function renderExams(list) {
  const container = document.getElementById('examList');
  container.innerHTML = '';
  list.forEach((exam, idx) => {
    const diffMap = { easy: ['tag-easy', 'Easy'], medium: ['tag-medium', 'Medium'], hard: ['tag-hard', 'Hard'], mixed: ['tag-hard', 'Mixed'] };
    const [tagClass, tagLabel] = diffMap[exam.difficulty] || diffMap.medium;

    const card = document.createElement('div');
    card.className = 'exam-card';
    card.style.animationDelay = `${idx * 60}ms`;
    card.innerHTML = `
      <div class="exam-card-header">
        <div class="exam-title">${escHtml(exam.title)}</div>
        <button class="exam-menu" title="More options">⋯</button>
      </div>
      <div class="exam-meta">
        <span class="exam-tag ${tagClass}">${tagLabel}</span>
        <span class="exam-tag tag-questions">${exam.questions} Q</span>
        <span class="exam-tag tag-date">${exam.date}</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
        <div class="exam-score-bar" style="flex:1">
          <div class="exam-score-fill" style="width:${exam.score}%"></div>
        </div>
        <span style="font-size:.7rem;font-weight:700;color:var(--em-600)">${exam.score}%</span>
      </div>
      <div class="exam-actions">
        <button class="exam-btn exam-btn-primary" onclick="showToast('<strong>Starting quiz…</strong> 🚀','success')">
          ▶ Start Quiz
        </button>
        <button class="exam-btn exam-btn-ghost" onclick="showToast('Printed successfully 🖨️','info')">Print</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function addNewExam() {
  const q = document.getElementById('q-display').textContent;
  const diff = document.querySelector('.diff-btn.active')?.dataset.val || 'medium';
  const lang = document.getElementById('lang-select').value;
  const today = new Date().toLocaleDateString('en-GB');
  const newExam = {
    title: uploadedFiles.length ? uploadedFiles[0].name.replace(/\.[^.]+$/, '') : 'New AI Generated Exam',
    date: today,
    difficulty: diff,
    questions: +q,
    score: 0,
    attempts: 0
  };
  SAMPLE_EXAMS.unshift(newExam);
  renderExams(SAMPLE_EXAMS);
  showToast('<strong>Exam added</strong> to your recent list!', 'success');
}

/* ── Toast ── */
function showToast(html, type = 'success') {
  const iconMap = {
    success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="color:var(--em-500)"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><polyline points="9 12 11 14 15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    error: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="color:#ef4444"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    info: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="color:#3b82f6"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg>`,
  };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${iconMap[type]}</span><span>${html}</span>`;
  const container = document.getElementById('toastContainer');
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0'; toast.style.transform = 'translateX(40px)';
    toast.style.transition = '.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/* ── Search filter ── */
document.getElementById('search-input').addEventListener('input', function () {
  const q = this.value.toLowerCase().trim();
  const filtered = q ? SAMPLE_EXAMS.filter(e => e.title.toLowerCase().includes(q) || e.difficulty.includes(q)) : SAMPLE_EXAMS;
  renderExams(filtered);
});

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  // Sync sliders
  updateSliderBackground(document.getElementById('q-count'));
  updateSliderBackground(document.getElementById('timer-range'));

  // Render exams
  renderExams(SAMPLE_EXAMS);

  // Keyboard shortcut hint
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      document.getElementById('search-input').focus();
    }
  });

  // Welcome toast
  setTimeout(() => showToast('Welcome back, <strong>Nguyen Lan</strong>! 👋'), 800);
});
