/**
 * SmartExam Gen · Quiz Engine
 * Online exam logic: timer, navigation, grading, review
 */

// ── State ───────────────────────────────────────────
let state = {
  examId: null,
  exam: null,
  currentQ: 0,
  answers: {},      // { qIndex: optionIndex }
  flagged: new Set(),
  startTime: null,
  timeLeft: 0,
  timerInterval: null,
  totalTime: 0,
  submitted: false,
  confirmCallback: null,
};

// ── Entry point ──────────────────────────────────────
function startExam(examId) {
  state.examId = examId;
  state.exam = EXAM_DATABASE[examId];
  if (!state.exam) return showToast('Không tìm thấy đề thi!', 'error');

  // Reset state
  state.currentQ = 0;
  state.answers = {};
  state.flagged = new Set();
  state.submitted = false;
  state.totalTime = state.exam.duration * 60;
  state.timeLeft = state.totalTime;
  state.startTime = Date.now();

  // UI
  document.getElementById('examListPage').style.display = 'none';
  document.getElementById('resultsPage').style.display = 'none';
  document.getElementById('quizPage').style.display = 'block';
  document.getElementById('quizExamName').textContent = state.exam.title;

  buildQuestionGrid();
  renderQuestion(0);
  startTimer();
  showToast(`✅ Đề "${state.exam.title}" đã bắt đầu. Chúc bạn làm bài tốt!`, 'success');
}

// ── Timer ──────────────────────────────────────────
function startTimer() {
  clearInterval(state.timerInterval);
  updateTimerDisplay();
  state.timerInterval = setInterval(() => {
    state.timeLeft--;
    updateTimerDisplay();
    if (state.timeLeft <= 0) {
      clearInterval(state.timerInterval);
      autoSubmit();
    }
    // Warning at 5 min
    if (state.timeLeft === 300) {
      showToast('⏰ Còn 5 phút! Hãy kiểm tra lại bài.', 'error');
      document.querySelector('.quiz-timer').classList.add('timer-warning');
    }
    if (state.timeLeft === 60) {
      showToast('⚠️ Còn 1 phút!', 'error');
    }
  }, 1000);
}

function updateTimerDisplay() {
  const m = Math.floor(state.timeLeft / 60);
  const s = state.timeLeft % 60;
  const display = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  const el = document.getElementById('quizTimer');
  if (el) {
    el.textContent = display;
    if (state.timeLeft <= 300) el.style.color = '#ef4444';
    else el.style.color = '';
  }
}

function autoSubmit() {
  showToast('⏰ Hết giờ! Bài thi đã được nộp tự động.', 'error');
  setTimeout(processResults, 600);
}

// ── Build question grid ─────────────────────────────
function buildQuestionGrid() {
  const grid = document.getElementById('qsGrid');
  grid.innerHTML = '';
  const total = state.exam.questions.length;
  for (let i = 0; i < total; i++) {
    const btn = document.createElement('button');
    btn.className = 'qs-btn';
    btn.id = `qs-btn-${i}`;
    btn.textContent = i + 1;
    btn.onclick = () => renderQuestion(i);
    grid.appendChild(btn);
  }
  updateGridState();
}

function updateGridState() {
  const total = state.exam.questions.length;
  for (let i = 0; i < total; i++) {
    const btn = document.getElementById(`qs-btn-${i}`);
    if (!btn) continue;
    btn.className = 'qs-btn';
    if (i === state.currentQ) btn.classList.add('current');
    else if (state.flagged.has(i)) btn.classList.add('flagged');
    else if (state.answers[i] !== undefined) btn.classList.add('answered');
  }
  // Update counts
  document.getElementById('answeredCount').textContent = Object.keys(state.answers).length;
  document.getElementById('flaggedCount').textContent = state.flagged.size;
  // Progress
  const pct = ((state.currentQ + 1) / total) * 100;
  const fill = document.getElementById('qMiniFill');
  if (fill) fill.style.width = pct + '%';
  document.getElementById('qProgressText').textContent = `${state.currentQ + 1} / ${total}`;
}

// ── Render question ─────────────────────────────────
function renderQuestion(idx) {
  state.currentQ = idx;
  const q = state.exam.questions[idx];
  const sections = state.exam.sections;

  // Determine section
  let currentSection = sections[sections.length - 1];
  for (const s of sections) {
    if (idx >= s.range[0] && idx < s.range[1]) { currentSection = s; break; }
  }
  document.getElementById('sectionLabel').style.display = 'flex';
  document.getElementById('sectionTitle').textContent = currentSection.name;
  document.getElementById('sectionDesc').textContent = currentSection.desc;

  // Question number
  document.getElementById('qNumber').textContent = `Câu ${idx + 1}`;

  // Passage (reading)
  const qText = document.getElementById('qText');
  let html = '';
  if (q.passage) {
    html += q.passage;
  }
  // Question text (replace \n with <br>)
  html += `<div class="q-main-text">${q.text.replace(/\n/g, '<br>')}</div>`;
  qText.innerHTML = html;

  // Options
  const opts = document.getElementById('qOptions');
  opts.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'opt-btn' + (state.answers[idx] === i ? ' selected' : '');
    btn.id = `opt-${i}`;
    btn.innerHTML = `<span class="opt-letter">${letters[i]}</span><span class="opt-text">${opt}</span>`;
    btn.onclick = () => selectAnswer(idx, i);
    opts.appendChild(btn);
  });

  // Flag
  const flagged = state.flagged.has(idx);
  document.getElementById('flagBtn').classList.toggle('flagged', flagged);
  document.getElementById('flagText').textContent = flagged ? 'Bỏ đánh dấu' : 'Đánh dấu';

  // Nav buttons
  document.getElementById('prevBtn').disabled = idx === 0;
  document.getElementById('nextBtn').disabled = idx === state.exam.questions.length - 1;

  updateGridState();
}

function selectAnswer(qIdx, optIdx) {
  state.answers[qIdx] = optIdx;
  document.querySelectorAll('.opt-btn').forEach((b, i) => {
    b.classList.toggle('selected', i === optIdx);
  });
  updateGridState();
  // Auto advance
  setTimeout(() => {
    if (state.currentQ < state.exam.questions.length - 1) {
      navigate(1);
    }
  }, 400);
}

function navigate(dir) {
  const next = state.currentQ + dir;
  if (next >= 0 && next < state.exam.questions.length) {
    renderQuestion(next);
  }
}

function toggleFlag() {
  const idx = state.currentQ;
  if (state.flagged.has(idx)) state.flagged.delete(idx);
  else state.flagged.add(idx);
  renderQuestion(idx);
}

// ── Submit ──────────────────────────────────────────
function submitExam() {
  const answered = Object.keys(state.answers).length;
  const total = state.exam.questions.length;
  const unanswered = total - answered;

  if (unanswered > 0) {
    document.getElementById('confirmTitle').textContent = `Còn ${unanswered} câu chưa trả lời`;
    document.getElementById('confirmMsg').textContent = `Bạn chưa trả lời ${unanswered} câu. Bạn vẫn muốn nộp bài?`;
    document.getElementById('confirmModal').style.display = 'grid';
    state.confirmCallback = processResults;
  } else {
    processResults();
  }
}

function confirmBack() {
  document.getElementById('confirmTitle').textContent = 'Thoát khỏi bài thi?';
  document.getElementById('confirmMsg').textContent = 'Tiến độ và câu trả lời sẽ không được lưu. Bạn có chắc muốn thoát?';
  document.getElementById('confirmModal').style.display = 'grid';
  state.confirmCallback = backToList;
}

function closeConfirm() {
  document.getElementById('confirmModal').style.display = 'none';
  state.confirmCallback = null;
}

function executeConfirm() {
  closeConfirm();
  if (state.confirmCallback) state.confirmCallback();
}

// ── Process results ─────────────────────────────────
function processResults() {
  clearInterval(state.timerInterval);
  state.submitted = true;

  const questions = state.exam.questions;
  let correct = 0, wrong = 0, skipped = 0;
  const sectionResults = {};

  // Initialize section results
  state.exam.sections.forEach(s => {
    sectionResults[s.id] = { name: s.name, correct: 0, total: 0 };
  });

  questions.forEach((q, i) => {
    // Find section
    let secId = state.exam.sections[state.exam.sections.length - 1].id;
    for (const s of state.exam.sections) {
      if (i >= s.range[0] && i < s.range[1]) { secId = s.id; break; }
    }
    sectionResults[secId].total++;

    if (state.answers[i] === undefined) {
      skipped++;
    } else if (state.answers[i] === q.answer) {
      correct++;
      sectionResults[secId].correct++;
    } else {
      wrong++;
    }
  });

  // Score out of 10
  const rawScore = (correct / questions.length) * 10;
  const score = Math.round(rawScore * 10) / 10;

  // Time used
  const timeUsed = state.totalTime - state.timeLeft;
  const tm = Math.floor(timeUsed / 60), ts = timeUsed % 60;
  const timeStr = `${String(tm).padStart(2,'0')}:${String(ts).padStart(2,'0')}`;

  // Show results page
  document.getElementById('quizPage').style.display = 'none';
  document.getElementById('examListPage').style.display = 'none';
  document.getElementById('resultsPage').style.display = 'block';

  renderResults({ score, correct, wrong, skipped, timeStr, sectionResults, total: questions.length });
}

function renderResults({ score, correct, wrong, skipped, timeStr, sectionResults, total }) {
  // Score number
  animateNumber('scoreNumber', 0, score, 1200);

  // Ring fill (SVG)
  const pct = score / 10;
  const circumference = 2 * Math.PI * 50; // r=50
  const ring = document.getElementById('ringFill');
  if (ring) {
    ring.style.strokeDasharray = circumference;
    ring.style.strokeDashoffset = circumference;
    setTimeout(() => {
      ring.style.strokeDashoffset = circumference * (1 - pct);
    }, 100);
  }

  // Banner color
  const banner = document.getElementById('scoreBanner');
  if (score >= 9) {
    banner.classList.add('score-excellent');
    document.getElementById('scoreTitle').textContent = 'Xuất sắc! 🎉';
  } else if (score >= 8) {
    banner.classList.add('score-good');
    document.getElementById('scoreTitle').textContent = 'Giỏi! 🌟';
  } else if (score >= 6.5) {
    banner.classList.add('score-ok');
    document.getElementById('scoreTitle').textContent = 'Khá! 👍';
  } else {
    banner.classList.add('score-poor');
    document.getElementById('scoreTitle').textContent = 'Cần cố gắng thêm 💪';
  }

  document.getElementById('scoreSub').textContent = `Bạn đã trả lời đúng ${correct}/${total} câu`;
  document.getElementById('correctCount').textContent = correct;
  document.getElementById('wrongCount').textContent = wrong;
  document.getElementById('skippedCount').textContent = skipped;
  document.getElementById('timeUsed').textContent = timeStr;

  // Section scores
  const secEl = document.getElementById('sectionScores');
  secEl.innerHTML = '<h3 class="section-scores-title">📊 Kết quả theo từng phần</h3><div class="ss-grid">';
  Object.values(sectionResults).forEach(s => {
    const pct2 = s.total ? Math.round((s.correct / s.total) * 100) : 0;
    const color = pct2 >= 80 ? 'var(--em-500)' : pct2 >= 60 ? '#f59e0b' : '#ef4444';
    secEl.innerHTML += `
      <div class="ss-card">
        <div class="ss-name">${s.name.replace('Phần ', '').replace(/: .+/, '')}</div>
        <div class="ss-bar-wrap"><div class="ss-bar" style="width:${pct2}%;background:${color}"></div></div>
        <div class="ss-score" style="color:${color}">${s.correct}/${s.total} (${pct2}%)</div>
      </div>
    `;
  });
  secEl.innerHTML += '</div>';
}

function animateNumber(id, from, to, duration) {
  const el = document.getElementById(id);
  if (!el) return;
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const val = from + (to - from) * eased;
    el.textContent = val.toFixed(1);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// ── Review answers ──────────────────────────────────
function reviewAnswers() {
  const reviewSection = document.getElementById('reviewSection');
  reviewSection.style.display = 'block';
  reviewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  renderReviewList('all');
}

function renderReviewList(filter) {
  const list = document.getElementById('reviewList');
  list.innerHTML = '';
  const questions = state.exam.questions;
  const letters = ['A', 'B', 'C', 'D'];

  questions.forEach((q, i) => {
    const userAns = state.answers[i];
    const isCorrect = userAns === q.answer;
    const isSkipped = userAns === undefined;

    if (filter === 'wrong' && (isCorrect || isSkipped)) return;
    if (filter === 'correct' && !isCorrect) return;

    const card = document.createElement('div');
    card.className = `review-card ${isCorrect ? 'review-correct' : isSkipped ? 'review-skipped' : 'review-wrong'}`;
    card.dataset.correct = isCorrect;

    // Options HTML
    let optsHtml = '';
    q.options.forEach((opt, oi) => {
      let cls = 'rev-opt';
      if (oi === q.answer) cls += ' rev-correct';
      else if (oi === userAns && !isCorrect) cls += ' rev-wrong';
      optsHtml += `<div class="${cls}"><span class="rev-letter">${letters[oi]}</span>${opt}${oi === q.answer ? ' ✓' : (oi === userAns && !isCorrect ? ' ✗' : '')}</div>`;
    });

    card.innerHTML = `
      <div class="rev-header">
        <span class="rev-num">Câu ${i + 1}</span>
        <span class="rev-topic">${q.topic || ''}</span>
        <span class="rev-status ${isCorrect ? 'correct' : isSkipped ? 'skipped' : 'wrong'}">
          ${isCorrect ? '✅ Đúng' : isSkipped ? '➖ Bỏ qua' : '❌ Sai'}
        </span>
      </div>
      ${q.passage ? `<div class="rev-passage-mini">📖 [Đoạn đọc hiểu]</div>` : ''}
      <div class="rev-qtext">${q.text.replace(/\n/g, '<br>')}</div>
      <div class="rev-opts">${optsHtml}</div>
      <div class="rev-user-ans">
        Bạn chọn: <b>${userAns !== undefined ? letters[userAns] + '. ' + q.options[userAns] : 'Không trả lời'}</b>
        &nbsp;|&nbsp; Đáp án đúng: <b class="rev-correct-text">${letters[q.answer]}. ${q.options[q.answer]}</b>
      </div>
      <div class="rev-explanation"><div class="rev-exp-label">💡 Giải thích:</div>${q.explanation}</div>
    `;
    list.appendChild(card);
  });

  if (!list.children.length) {
    list.innerHTML = '<div class="empty-review">Không có câu nào trong nhóm này.</div>';
  }
}

function filterReview(type, btn) {
  document.querySelectorAll('.rf-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderReviewList(type);
}

// ── Navigation ──────────────────────────────────────
function retakeExam() {
  startExam(state.examId);
}

function backToList() {
  clearInterval(state.timerInterval);
  document.getElementById('quizPage').style.display = 'none';
  document.getElementById('resultsPage').style.display = 'none';
  document.getElementById('examListPage').style.display = 'block';
  document.getElementById('reviewSection').style.display = 'none';
  document.getElementById('scoreBanner').className = 'score-banner';
}

// ── Toast ────────────────────────────────────────────
function showToast(html, type = 'success') {
  const iconMap = {
    success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="color:var(--em-500)"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><polyline points="9 12 11 14 15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    error: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="color:#ef4444"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    info: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="color:#3b82f6"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg>`,
  };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${iconMap[type] || ''}</span><span>${html}</span>`;
  const container = document.getElementById('toastContainer');
  if (container) container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0'; toast.style.transform = 'translateX(40px)'; toast.style.transition = '.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ── Filter tabs ───────────────────────────────────────
document.querySelectorAll('.filter-tab').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
  });
});

// ── Init ─────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => showToast('Chào mừng! Chọn đề thi để bắt đầu ôn luyện 📚', 'info'), 600);
});
