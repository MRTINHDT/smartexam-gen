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

  const answersList = [];
  const letters = ['A', 'B', 'C', 'D'];

  questions.forEach((q, i) => {
    // Find section
    let secId = state.exam.sections[state.exam.sections.length - 1].id;
    for (const s of state.exam.sections) {
      if (i >= s.range[0] && i < s.range[1]) { secId = s.id; break; }
    }
    sectionResults[secId].total++;

    const userAns = state.answers[i];
    const isCorrect = userAns === q.answer;

    if (userAns === undefined) {
      skipped++;
    } else if (isCorrect) {
      correct++;
      sectionResults[secId].correct++;
    } else {
      wrong++;
    }

    // Determine category based on section id
    let category = 'grammar_vocabulary';
    if (secId === 'phonetics') category = 'phonetics';
    else if (secId === 'grammar' || secId === 'vocabulary') category = 'grammar_vocabulary';
    else if (secId === 'reading' || secId === 'reading_comprehension') category = 'reading_comprehension';
    else if (secId === 'writing' || secId === 'error_identification') category = 'error_identification';
    else if (secId === 'sentence_transformation') category = 'sentence_transformation';

    const questionId = q.id || `${state.examId}_q_${i}`;
    answersList.push({
      questionId: questionId,
      questionText: q.text,
      options: q.options,
      correctAnswer: letters[q.answer],
      explanation: q.explanation || 'Không có giải thích',
      topic: q.topic || 'General',
      category: category,
      selected: userAns !== undefined ? letters[userAns] : 'Chưa chọn',
      isCorrect: isCorrect
    });
  });

  // Score out of 10
  const rawScore = (correct / questions.length) * 10;
  const score = Math.round(rawScore * 10) / 10;

  // Time used
  const timeUsed = state.totalTime - state.timeLeft;
  const tm = Math.floor(timeUsed / 60), ts = timeUsed % 60;
  const timeStr = `${String(tm).padStart(2,'0')}:${String(ts).padStart(2,'0')}`;

  // Save attempt using DbService if registered globally
  if (window.DbService) {
    const attemptData = {
      examId: state.examId,
      examTitle: state.exam.title,
      score: score,
      timeSpent: timeUsed,
      totalQuestions: questions.length,
      correctCount: correct,
      answers: answersList
    };
    
    const result = window.DbService.saveAttempt(attemptData);
    if (result && result.success) {
      let toastMsg = `Thành tích đã được lưu! Nhận được +${result.xpResult.xpEarned} XP 🌟.`;
      if (result.streakResult && result.streakResult.count > 0) {
        toastMsg += ` Chuỗi học tập: ${result.streakResult.count} ngày liên tục 🔥!`;
      }
      showToast(toastMsg, 'success');
      
      if (result.xpResult.leveledUp) {
        setTimeout(() => {
          showToast(`🎉 CHÚC MỪNG! Bạn đã thăng cấp lên Cấp ${result.xpResult.newLevel}! Thầy Cú Thông Thái rất tự hào về con! 🦉✨`, 'success');
        }, 1200);
      }
    }
  }

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
      <div class="rev-explanation">
        <div class="rev-exp-label">💡 Giải thích:</div>
        <p>${q.explanation}</p>
        <div style="margin-top: 12px; display: flex; justify-content: flex-end;">
          <button class="ask-ai-tutor-btn" onclick="initAIChatForQuestion(${i})" style="display: flex; align-items: center; gap: 6px; padding: 6px 12px; background: var(--em-500); color: white; border: none; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 8px rgba(16,185,129,0.2);">
            <span>Hỏi Trợ Lý AI</span> 🦉
          </button>
        </div>
      </div>
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

// ── AI Tutor Chatbot Panel Logic ──────────────────────
let aiChatState = {
  questionText: '',
  options: [],
  selectedAnswer: '',
  correctAnswer: '',
  history: []
};

function toggleAIChat(isOpen) {
  const win = document.getElementById('aiTutorChatWindow');
  if (win) {
    if (isOpen) win.classList.add('open');
    else win.classList.remove('open');
  }
}

function initAIChatForQuestion(idx) {
  const q = state.exam.questions[idx];
  const letters = ['A', 'B', 'C', 'D'];
  const userAnsIdx = state.answers[idx];
  const userAns = userAnsIdx !== undefined ? letters[userAnsIdx] : 'Chưa chọn';
  const correctAns = letters[q.answer];
  
  initAIChatWithContext(q.text, q.options, userAns, correctAns);
}

function initAIChatWithContext(qText, options, userAns, correctAns) {
  aiChatState.questionText = qText;
  aiChatState.options = options;
  aiChatState.selectedAnswer = userAns;
  aiChatState.correctAnswer = correctAns;
  aiChatState.history = [];
  
  toggleAIChat(true);
  
  // Clean question tags from text for cleaner chat prompt
  const cleanQText = qText.replace(/<[^>]*>/g, '');
  
  // Reset chat body to typing state
  const body = document.getElementById('aiChatBody');
  body.innerHTML = `
    <div class="ai-chat-msg tutor">
      <span class="ai-chat-sender">Cú Thông Thái</span>
      <div class="ai-chat-bubble">
        Chào con! 🦉 Thầy Cú đang đọc câu hỏi của con rồi. Hãy đợi thầy một chút để thầy giải thích thật chi tiết và dễ hiểu cho con nhé! ✨
      </div>
    </div>
    <div class="ai-chat-msg tutor ai-chat-typing" id="aiTypingIndicator">
      <span class="ai-chat-sender">Cú Thông Thái</span>
      <div class="ai-chat-bubble">
        <span>.</span><span>.</span><span>.</span>
      </div>
    </div>
  `;
  body.scrollTop = body.scrollHeight;

  // Trigger automatic AI call for initial explanation
  setTimeout(async () => {
    try {
      const explanation = await window.AiService.askAITutor(
        cleanQText, 
        options, 
        userAns, 
        correctAns, 
        [], 
        ''
      );
      
      // Remove typing indicator
      const typing = document.getElementById('aiTypingIndicator');
      if (typing) typing.remove();
      
      // Add explanation message
      appendChatBubble('tutor', explanation);
      
      // Push to state history
      aiChatState.history.push({ role: 'model', message: explanation });
    } catch (err) {
      console.error(err);
      const typing = document.getElementById('aiTypingIndicator');
      if (typing) typing.remove();
      appendChatBubble('tutor', 'Ối, thầy bị lạc đường mất tiêu rồi. Con hãy kiểm tra lại kết nối mạng hoặc thử hỏi thầy lại nhé! 🦉❤️');
    }
  }, 400);
}

function appendChatBubble(role, text) {
  const body = document.getElementById('aiChatBody');
  const div = document.createElement('div');
  div.className = `ai-chat-msg ${role === 'tutor' ? 'tutor' : 'user'}`;
  
  // Format simple markdown structures to HTML
  const formattedText = parseChatMarkdown(text);
  
  div.innerHTML = `
    <span class="ai-chat-sender">${role === 'tutor' ? 'Cú Thông Thái' : 'Học sinh'}</span>
    <div class="ai-chat-bubble">${formattedText}</div>
  `;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function parseChatMarkdown(text) {
  if (!text) return '';
  let html = text;
  
  // Escape HTML to prevent code injection, except for safe tags we specify later
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  // Bold text
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Italic text
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Code snippets
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Bullet lists
  html = html.replace(/^\s*-\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.+<\/li>)/s, '<ul>$1</ul>');
  
  // Carriage returns to breaks
  html = html.replace(/\n/g, '<br>');
  
  return html;
}

async function sendAIChatMessage() {
  const input = document.getElementById('aiChatInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  
  input.value = '';
  
  // Append user bubble
  appendChatBubble('user', text);
  aiChatState.history.push({ role: 'user', message: text });
  
  // Append typing indicator
  const body = document.getElementById('aiChatBody');
  const typingDiv = document.createElement('div');
  typingDiv.className = 'ai-chat-msg tutor ai-chat-typing';
  typingDiv.id = 'aiTypingIndicator';
  typingDiv.innerHTML = `
    <span class="ai-chat-sender">Cú Thông Thái</span>
    <div class="ai-chat-bubble">
      <span>.</span><span>.</span><span>.</span>
    </div>
  `;
  body.appendChild(typingDiv);
  body.scrollTop = body.scrollHeight;
  
  // Call API
  try {
    const cleanQText = aiChatState.questionText.replace(/<[^>]*>/g, '');
    const response = await window.AiService.askAITutor(
      cleanQText,
      aiChatState.options,
      aiChatState.selectedAnswer,
      aiChatState.correctAnswer,
      aiChatState.history.slice(0, -1), // Send previous history up to current question
      text
    );
    
    const typing = document.getElementById('aiTypingIndicator');
    if (typing) typing.remove();
    
    appendChatBubble('tutor', response);
    aiChatState.history.push({ role: 'model', message: response });
  } catch (err) {
    console.error(err);
    const typing = document.getElementById('aiTypingIndicator');
    if (typing) typing.remove();
    appendChatBubble('tutor', 'Ối, thầy bị lạc đường mất tiêu rồi. Con hãy nhắn lại nhé! 🦉❤️');
  }
}

// ── Dynamic exam catalogue builder ───────────────────
function renderExamCatalogue() {
  const grid = document.querySelector('.catalogue-grid');
  if (!grid) return;
  grid.innerHTML = '';
  
  Object.keys(window.EXAM_DATABASE).forEach(id => {
    const exam = window.EXAM_DATABASE[id];
    const isCustom = id.toString().startsWith('custom');
    
    // Calculate attempts and average score if DbService exists
    let attemptsCount = 0;
    let avgScore = '--';
    if (window.DbService) {
      const attempts = window.DbService.getAttempts().filter(a => a.examId == id);
      attemptsCount = attempts.length;
      if (attemptsCount > 0) {
        const sum = attempts.reduce((acc, a) => acc + Number(a.score), 0);
        avgScore = (sum / attemptsCount).toFixed(1);
      }
    }
    
    const diffLabel = exam.questions[0]?.difficulty || 'medium';
    const diffClass = diffLabel === 'easy' ? 'easy' : diffLabel === 'hard' ? 'hard' : 'medium';
    const diffText = diffLabel === 'easy' ? 'Dễ' : diffLabel === 'hard' ? 'Khó' : 'Trung bình';
    
    const card = document.createElement('div');
    card.className = `cat-exam-card ${isCustom ? 'featured' : id == 1 ? 'featured' : ''}`;
    if (isCustom) card.style.border = '2px dashed var(--em-400)';
    
    card.innerHTML = `
      ${isCustom ? '<div class="cat-card-badge" style="background:#10b981">✨ Sinh bởi AI</div>' : id == 1 ? '<div class="cat-card-badge">🔥 Phổ biến nhất</div>' : ''}
      <div class="cat-card-header">
        <div class="cat-card-icon">${isCustom ? '🤖' : id == 1 ? '📘' : id == 2 ? '📗' : '📙'}</div>
        <div class="cat-card-meta">
          <h3 class="cat-card-title">${exam.title}</h3>
          <p class="cat-card-sub">${exam.subtitle || 'Đề thi trắc nghiệm tiếng Anh'}</p>
        </div>
      </div>
      <div class="cat-card-info">
        <div class="info-row"><span class="info-label">📝 Số câu:</span><span>${exam.questions.length} câu trắc nghiệm</span></div>
        <div class="info-row"><span class="info-label">⏱ Thời gian:</span><span>${exam.duration} phút</span></div>
        <div class="info-row"><span class="info-label">🎯 Mức độ:</span><span class="diff-badge ${diffClass}">${diffText}</span></div>
        <div class="info-row"><span class="info-label">📊 Chuyên đề:</span><span>Phát âm, Ngữ pháp, Đọc hiểu</span></div>
      </div>
      <div class="cat-card-stats">
        <div class="mini-stat"><span class="ms-num">${attemptsCount}</span><span class="ms-lbl">lượt thi</span></div>
        <div class="mini-stat"><span class="ms-num">${avgScore}</span><span class="ms-lbl">điểm TB</span></div>
        <div class="mini-stat"><span class="ms-num">${exam.duration}'</span><span class="ms-lbl">thời lượng</span></div>
      </div>
      <button class="start-exam-btn ${isCustom ? '' : id > 1 ? 'secondary' : ''}" onclick="startExam('${id}')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/></svg>
        Bắt đầu thi ngay
      </button>
    `;
    grid.appendChild(card);
  });
}

// ── Init ─────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  // 1. Merge custom exams from localStorage
  try {
    const stored = localStorage.getItem('smartexam_custom_exams');
    if (stored && window.EXAM_DATABASE) {
      const custom = JSON.parse(stored);
      Object.assign(window.EXAM_DATABASE, custom);
    }
  } catch (e) {
    console.error('Lỗi khi tải đề thi tự tạo:', e);
  }

  // 2. Render exam list dynamically
  renderExamCatalogue();

  // 3. Check query parameter auto-start
  const urlParams = new URLSearchParams(window.location.search);
  const examId = urlParams.get('id');
  if (examId && window.EXAM_DATABASE && window.EXAM_DATABASE[examId]) {
    setTimeout(() => {
      startExam(examId);
    }, 800);
  } else {
    setTimeout(() => showToast('Chào mừng con! Chọn đề thi dưới đây để bắt đầu ôn luyện nhé 📚', 'info'), 600);
  }
});
