/* ─────────────────────────────────────────
   SmartExam AI · App Logic (app.js)
   Emerald Edition · 2026
   Client-Side SPA Architecture
───────────────────────────────────────── */

// --- Global variables for ApexCharts ---
let radarChartInstance = null;
let lineChartInstance = null;
let uploadedFiles = [];
let generatedExamId = null;

// --- AI Chat State for Dashboard Chatbot ---
let aiChatState = {
  questionText: '',
  options: [],
  selectedAnswer: '',
  correctAnswer: '',
  history: []
};

/* ── View Router ── */
function switchView(viewId) {
  // Hide all sections
  const views = ['materials', 'history', 'analytics', 'mistakes', 'settings'];
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) el.style.display = 'none';
  });
  
  // Show target section
  const target = document.getElementById(`view-${viewId}`);
  if (target) target.style.display = 'block';
  
  // Update sidebar navigation active state
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(n => {
    n.classList.remove('active');
  });
  
  // Handle matching sidebar nav class list
  const activeNav = document.getElementById(`nav-${viewId}`);
  if (activeNav) activeNav.classList.add('active');
  
  // Clear search input on tab change
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';
  
  // Actions upon view loaded
  if (viewId === 'analytics') {
    if (window.DbService) {
      const analytics = window.DbService.getAnalytics();
      renderDashboardCharts(analytics);
    }
  } else if (viewId === 'mistakes') {
    renderMistakesList();
  } else if (viewId === 'history') {
    renderHistoryTable();
  }
  
  // Sync general gamification badges
  syncGamification();
  
  // Close responsive mobile sidebar on transition
  const sidebar = document.getElementById('sidebar');
  if (sidebar && sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
  }
}

/* ── Gamification Status Synchronizer ── */
function syncGamification() {
  if (!window.DbService) return;
  const { totalXp, level, xpInCurrentLevel, nextLevelXp } = window.DbService.getXpAndLevel();
  const streak = window.DbService.getStreak();
  const settings = window.DbService.getSettings();
  
  // Update levels and XP in Sidebar
  const xpDisplay = document.getElementById('quota-xp-display');
  if (xpDisplay) xpDisplay.textContent = `${xpInCurrentLevel} / ${nextLevelXp} XP`;
  
  const xpBar = document.getElementById('quota-xp-bar');
  if (xpBar) xpBar.style.width = `${(xpInCurrentLevel / nextLevelXp) * 100}%`;
  
  const lvlHint = document.getElementById('quota-level-hint');
  if (lvlHint) lvlHint.textContent = `Cấp độ ${level} · Thầy Cú tự hào về con! 🦉`;
  
  // Update student avatar/name/role in Sidebar
  const sidebarAvatar = document.getElementById('sidebar-user-avatar');
  if (sidebarAvatar) sidebarAvatar.textContent = settings.userName ? settings.userName.slice(0, 2).toUpperCase() : 'HS';
  
  const sidebarName = document.getElementById('sidebar-user-name');
  if (sidebarName) sidebarName.textContent = settings.userName;
  
  const sidebarRole = document.getElementById('sidebar-user-role');
  if (sidebarRole) sidebarRole.textContent = `Ôn thi lớp 6: ${settings.targetSchool}`;
  
  // Update Streak & XP Pills in Topbar
  const streakCountHeader = document.getElementById('streak-count-header');
  if (streakCountHeader) streakCountHeader.textContent = streak.count;
  
  const xpCountHeader = document.getElementById('xp-count-header');
  if (xpCountHeader) xpCountHeader.textContent = totalXp;
  
  // Update user chip in Topbar
  const headerAvatar = document.getElementById('header-user-avatar');
  if (headerAvatar) headerAvatar.textContent = settings.userName ? settings.userName.slice(0, 2).toUpperCase() : 'HS';
  
  const headerName = document.getElementById('header-user-name');
  if (headerName) headerName.textContent = settings.userName;

  // Personalize Hero text on home dashboard
  const heroTitleText = document.getElementById('hero-title-text');
  if (heroTitleText) heroTitleText.textContent = `Mục tiêu thi đỗ: ${settings.targetSchool}`;

  const heroSubText = document.getElementById('hero-sub-text');
  if (heroSubText) heroSubText.textContent = `Chào mừng ${settings.userName}! Tải tệp tài liệu ôn thi hoặc chụp hình ảnh đề bài tập gửi Cú để biên soạn bộ đề thi tùy biến nhé! 🦉✨`;
  
  // Sync homepage stats
  const attempts = window.DbService.getAttempts();
  const statCreatedExams = document.getElementById('stat-created-exams');
  if (statCreatedExams) {
    const customExams = JSON.parse(localStorage.getItem('smartexam_custom_exams') || '{}');
    statCreatedExams.textContent = Object.keys(customExams).length;
  }
  
  const statTotalScore = document.getElementById('stat-total-score');
  if (statTotalScore) {
    if (attempts.length > 0) {
      const sum = attempts.reduce((acc, a) => acc + Number(a.score), 0);
      statTotalScore.textContent = (sum / attempts.length).toFixed(1);
    } else {
      statTotalScore.textContent = '0.0';
    }
  }
  
  const statTotalStreak = document.getElementById('stat-total-streak');
  if (statTotalStreak) statTotalStreak.textContent = `🔥 ${streak.count}`;

  // Sync settings form fields
  const setNameInput = document.getElementById('set-student-name');
  if (setNameInput && !setNameInput.dataset.initialSet) {
    setNameInput.value = settings.userName;
    setNameInput.dataset.initialSet = "true";
  }
  
  const setSchoolSelect = document.getElementById('set-target-school');
  if (setSchoolSelect && !setSchoolSelect.dataset.initialSet) {
    setSchoolSelect.value = settings.targetSchool;
    setSchoolSelect.dataset.initialSet = "true";
  }
  
  const setKeyInput = document.getElementById('set-gemini-key');
  if (setKeyInput && !setKeyInput.dataset.initialSet) {
    setKeyInput.value = settings.geminiApiKey;
    setKeyInput.dataset.initialSet = "true";
  }
  
  // Sync system mode status badge text
  const modeStatusText = document.getElementById('ai-mode-status-text');
  if (modeStatusText) {
    if (settings.geminiApiKey) {
      modeStatusText.innerHTML = `<span style="color:#10b981;font-weight:bold;">🚀 Đang hoạt động: Chế độ AI (Gemini API)</span><br/>Sinh đề thi thông minh từ hình ảnh bài tập chụp thực tế và gia sư trực quan.`;
    } else {
      modeStatusText.innerHTML = `<span style="color:#f59e0b;font-weight:bold;">⚠️ Đang hoạt động: Chế độ Local (Sinh đề mô phỏng)</span><br/>Bác phụ huynh hãy cấu hình Gemini API Key trong cài đặt bên dưới để kích hoạt AI thực nhé!`;
    }
  }

  // Update navbar mistake badge
  const mistakes = window.DbService.getWrongQuestions();
  const wrongCountBadge = document.getElementById('wrong-count-badge');
  if (wrongCountBadge) wrongCountBadge.textContent = mistakes.length;
  
  const wrongCountText = document.getElementById('wrong-count-text');
  if (wrongCountText) wrongCountText.textContent = mistakes.length;
}

/* ── Settings Controls ── */
function savePersonalSettings() {
  if (!window.DbService) return;
  
  const nameInput = document.getElementById('set-student-name');
  const schoolSelect = document.getElementById('set-target-school');
  
  if (!nameInput || !schoolSelect) return;
  
  const settings = window.DbService.getSettings();
  settings.userName = nameInput.value.trim() || 'Học sinh thông thái';
  settings.targetSchool = schoolSelect.value;
  
  if (window.DbService.saveSettings(settings)) {
    showToast('🎉 Đã cập nhật thông tin học sinh thành công!', 'success');
    syncGamification();
  } else {
    showToast('Lưu cấu hình thất bại!', 'error');
  }
}

function saveAIApiSettings() {
  if (!window.DbService) return;
  
  const keyInput = document.getElementById('set-gemini-key');
  if (!keyInput) return;
  
  const settings = window.DbService.getSettings();
  settings.geminiApiKey = keyInput.value.trim();
  
  if (window.DbService.saveSettings(settings)) {
    if (settings.geminiApiKey) {
      showToast('🚀 Khóa Gemini API đã lưu thành công! Đã kích hoạt trí tuệ nhân tạo.', 'success');
    } else {
      showToast('Đã ngắt kết nối Gemini API. Hệ thống trở về Chế độ Local.', 'info');
    }
    syncGamification();
  } else {
    showToast('Lưu API key thất bại!', 'error');
  }
}

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
  display.textContent = `${val} phút`;
  updateSliderBackground(slider);
}

/* ── Difficulty Selector ── */
function selectDiff(btn) {
  document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const levelText = btn.dataset.val === 'easy' ? 'Nhận biết' : btn.dataset.val === 'hard' ? 'Khó / Chuyên' : 'Thông hiểu';
  showToast(`Mức độ câu hỏi: <strong>${levelText}</strong>`, 'success');
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

const ALLOWED_EXT = ['pdf', 'docx', 'txt', 'png', 'jpg', 'jpeg'];

function processFiles(files) {
  const valid = files.filter(f => {
    const ext = f.name.split('.').pop().toLowerCase();
    return ALLOWED_EXT.includes(ext);
  });

  if (valid.length !== files.length) {
    showToast('Tệp không được hỗ trợ! Định dạng ảnh chụp (.png, .jpg), .txt được tối ưu nhất.', 'error');
  }

  valid.forEach(file => {
    const ext = file.name.split('.').pop().toLowerCase();
    const isImg = ['png', 'jpg', 'jpeg'].includes(ext);
    const isTxt = ext === 'txt';
    
    // Check duplication
    if (uploadedFiles.some(f => f.name === file.name)) return;
    
    const fileId = 'file-' + Date.now() + Math.random().toString(36).slice(2);
    const fileRecord = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: isImg ? 'image' : isTxt ? 'text' : 'binary',
      base64: null,
      textContent: null,
      fileRef: file
    };
    
    uploadedFiles.push(fileRecord);
    renderFileItem(fileRecord);
    
    // Read file payload
    const reader = new FileReader();
    reader.onload = function(e) {
      if (isImg) {
        fileRecord.base64 = e.target.result;
      } else if (isTxt) {
        fileRecord.textContent = e.target.result;
      }
      
      // Update upload bar to 100%
      const bar = document.getElementById(`prog-${fileId}`);
      if (bar) bar.style.width = '100%';
    };
    
    if (isImg) {
      reader.readAsDataURL(file);
    } else if (isTxt) {
      reader.readAsText(file);
    } else {
      simulateUpload(fileId);
    }
  });

  if (valid.length) {
    showToast(`Đã nạp thành công <strong>${valid.length}</strong> tài liệu ôn thi!`);
    document.getElementById('step1-card').querySelector('.step-badge').classList.add('active');
    document.getElementById('step2-card').querySelector('.step-badge').classList.add('active');
  }
}

function renderFileItem(file) {
  const ext = file.name.split('.').pop().toUpperCase();
  const size = formatSize(file.size);

  const div = document.createElement('div');
  div.className = 'file-item';
  div.id = file.id;
  div.innerHTML = `
    <div class="file-icon" style="background:var(--em-100);color:var(--em-700);font-weight:bold;">${ext}</div>
    <div class="file-info">
      <div class="file-name" style="font-weight:500;">${escHtml(file.name)}</div>
      <div class="file-size">${size}</div>
      <div class="file-progress">
        <div class="file-progress-fill" id="prog-${file.id}" style="width:0%"></div>
      </div>
    </div>
    <button class="file-remove" onclick="removeFile('${file.id}','${escHtml(file.name)}')" title="Remove">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
    </button>
  `;
  document.getElementById('fileList').appendChild(div);
}

function simulateUpload(id) {
  const bar = document.getElementById(`prog-${id}`);
  if (!bar) return;
  let pct = 0;
  const interval = setInterval(() => {
    pct += Math.random() * 25;
    if (pct >= 100) { pct = 100; clearInterval(interval); }
    bar.style.width = pct + '%';
  }, 100);
}

function removeFile(id, name) {
  uploadedFiles = uploadedFiles.filter(f => f.id !== id);
  const el = document.getElementById(id);
  if (el) {
    el.style.opacity = '0';
    el.style.transform = 'scale(.95)';
    el.style.transition = '.2s';
    setTimeout(() => el.remove(), 200);
  }
  showToast(`Đã gỡ bỏ: <strong>${name}</strong>`, 'info');
  
  if (uploadedFiles.length === 0) {
    document.getElementById('step1-card').querySelector('.step-badge').classList.remove('active');
    document.getElementById('step2-card').querySelector('.step-badge').classList.remove('active');
  }
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function escHtml(str) {
  return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

/* ── Custom AI Exam Generator ── */
async function startGeneration() {
  if (uploadedFiles.length === 0) {
    showToast('⚠️ Vui lòng kéo thả hoặc tải lên tài liệu/ảnh chụp đề bài tập ở Bước 1 trước!', 'error');
    return;
  }

  const btn = document.getElementById('generateBtn');
  const progress = document.getElementById('genProgress');
  const fill = document.getElementById('progressFill');
  const label = document.getElementById('progressLabel');

  btn.disabled = true;
  btn.style.opacity = '.7';
  progress.style.display = 'block';

  // Read config settings
  const questionCount = parseInt(document.getElementById('q-count').value) || 10;
  const difficulty = document.querySelector('.diff-btn.active')?.dataset.val || 'medium';
  const duration = parseInt(document.getElementById('timer-range').value) || 15;
  const settings = window.DbService ? window.DbService.getSettings() : { targetSchool: 'THCS Thanh Xuân', geminiApiKey: '' };
  
  const hasApiKey = !!settings.geminiApiKey;
  const firstFile = uploadedFiles[0];

  // Helper function to animate progress messages
  const runProgress = (steps, callback) => {
    let i = 0;
    const interval = setInterval(() => {
      if (i >= steps.length) {
        clearInterval(interval);
        callback();
        return;
      }
      const [pct, msg] = steps[i++];
      fill.style.width = pct + '%';
      label.textContent = `${msg} ${pct}%`;
    }, 450);
  };

  if (!hasApiKey) {
    // === MOCK MODE (Simulated OCR & Generation) ===
    const mockSteps = [
      [15, '🔍 Đang phân tích chữ viết bằng thuật toán OCR…'],
      [35, '📖 Đang tìm kiếm các cấu trúc câu tiếng Anh…'],
      [55, '🧠 Biên tập lời giải thích chi tiết cho học sinh…'],
      [75, '🎯 Sắp xếp câu hỏi theo chuẩn THCS Thanh Xuân…'],
      [95, '📑 Đóng gói đề thi trắc nghiệm…'],
      [100, '🎉 Đã tạo đề mô phỏng thành công!']
    ];
    
    runProgress(mockSteps, () => {
      // Build structured mock exam
      const mockExam = generateMockExam(firstFile.name, questionCount, difficulty, duration, settings.targetSchool);
      const newId = 'custom_' + Date.now();
      
      saveCustomExam(newId, mockExam);
      generatedExamId = newId;

      // Reset Wizard UI
      progress.style.display = 'none';
      btn.disabled = false;
      btn.style.opacity = '1';
      fill.style.width = '0%';
      
      showModal(mockExam.title, questionCount, difficulty);
      renderExamsList();
      
      showToast('💡 Đang hoạt động ở <strong>Local Mode (Sinh đề mô phỏng)</strong>. Hãy lưu Gemini Key ở Cài đặt để sinh đề AI thật nhé!', 'info');
    });

  } else {
    // === REAL AI GEMINI OCR GENERATION ===
    const ocrSteps = [
      [10, '🛰️ Đang kết nối máy chủ Google Gemini AI…'],
      [25, '🔍 Đang quét tài liệu bằng thị giác AI…'],
      [45, '🤖 Đang bóc tách OCR và dịch nghĩa…'],
      [70, '✍️ Đang soạn thảo câu hỏi & lời giải tiếng Việt dễ thương…'],
      [90, '📊 Phân loại kỹ năng và chủ đề chuyên môn…'],
      [98, '⚙️ Hoàn thành các khâu biên soạn cuối…']
    ];

    try {
      let runCompleted = false;
      // Start simulated progress loop for smoother visual experience
      runProgress(ocrSteps, () => {
        runCompleted = true;
      });

      let aiResult = null;
      if (firstFile.type === 'image') {
        if (!firstFile.base64) {
          throw new Error('Ảnh chưa được mã hóa base64 xong, vui lòng thử lại.');
        }
        aiResult = await window.AiService.generateQuizFromImage(
          firstFile.base64,
          firstFile.fileRef.type,
          { numQuestions: questionCount, difficulty, targetSchool: settings.targetSchool }
        );
      } else if (firstFile.type === 'text') {
        if (!firstFile.textContent) {
          throw new Error('File văn bản chưa đọc xong, vui lòng thử lại.');
        }
        aiResult = await window.AiService.generateQuizFromText(
          firstFile.textContent,
          { numQuestions: questionCount, difficulty, targetSchool: settings.targetSchool }
        );
      } else {
        // Fallback for DOCX/PDF - notify user to use screenshots
        throw new Error('Để bóc tách đề bằng AI tốt nhất, con vui lòng chụp ảnh màn hình bài tập (.png, .jpg) rồi tải lên nhé!');
      }

      // Merge results
      const transformed = transformAIExam(aiResult, duration, settings.targetSchool);
      const newId = 'custom_' + Date.now();
      
      saveCustomExam(newId, transformed);
      generatedExamId = newId;

      // Wait until progress bar simulation finishes
      const checkInterval = setInterval(() => {
        if (runCompleted) {
          clearInterval(checkInterval);
          progress.style.display = 'none';
          btn.disabled = false;
          btn.style.opacity = '1';
          fill.style.width = '0%';
          
          showModal(transformed.title, questionCount, difficulty);
          renderExamsList();
          showToast('🎉 Siêu đỉnh! Google Gemini AI đã bóc tách ảnh bài tập và sinh bộ đề thi chuẩn rồi đó!', 'success');
        }
      }, 200);

    } catch (err) {
      console.error(err);
      progress.style.display = 'none';
      btn.disabled = false;
      btn.style.opacity = '1';
      fill.style.width = '0%';
      showToast(`❌ Không thể sinh đề: ${err.message}`, 'error');
    }
  }
}

/* ── Custom Exam Local Storage Manager ── */
function saveCustomExam(examId, examData) {
  try {
    let customExams = {};
    const stored = localStorage.getItem('smartexam_custom_exams');
    if (stored) {
      customExams = JSON.parse(stored);
    }
    customExams[examId] = examData;
    localStorage.setItem('smartexam_custom_exams', JSON.stringify(customExams));
    return true;
  } catch (e) {
    console.error('Lỗi khi lưu đề thi AI:', e);
    return false;
  }
}

/* ── AI Exam Formatter (Gemini Output -> EXAM_DATABASE schema) ── */
function transformAIExam(aiResult, duration, targetSchool) {
  const ansMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
  
  // Group questions by skill category
  const grouped = {
    phonetics: [],
    grammar_vocabulary: [],
    reading_comprehension: [],
    sentence_transformation: [],
    error_identification: []
  };
  
  const rawQuestions = aiResult.questions || [];
  rawQuestions.forEach((q, idx) => {
    let cat = q.category || 'grammar_vocabulary';
    if (!grouped[cat]) cat = 'grammar_vocabulary';
    
    let answerIndex = 0;
    if (q.correct_answer !== undefined) {
      if (typeof q.correct_answer === 'string') {
        const char = q.correct_answer.toUpperCase().trim();
        answerIndex = ansMap[char] !== undefined ? ansMap[char] : 0;
      } else if (typeof q.correct_answer === 'number') {
        answerIndex = q.correct_answer;
      }
    }
    
    grouped[cat].push({
      id: idx + 1,
      text: q.question_text || '',
      options: q.options || ['Option A', 'Option B', 'Option C', 'Option D'],
      answer: answerIndex,
      explanation: q.explanation || 'Không có giải thích chi tiết.',
      topic: q.topic || 'Kiến thức ôn thi',
      category: cat
    });
  });
  
  const finalQuestions = [];
  const sections = [];
  const categoriesOrder = ['phonetics', 'grammar_vocabulary', 'reading_comprehension', 'sentence_transformation', 'error_identification'];
  
  const categoryMeta = {
    phonetics: { name: "Phần I: PHÁT ÂM", desc: "Chọn từ có phần gạch chân phát âm KHÁC với các từ còn lại" },
    grammar_vocabulary: { name: "Phần II: NGỮ PHÁP & TỪ VỰNG", desc: "Chọn đáp án đúng nhất để hoàn thành câu" },
    reading_comprehension: { name: "Phần III: ĐỌC HIỂU", desc: "Đọc kỹ đoạn văn và chọn đáp án chính xác" },
    sentence_transformation: { name: "Phần IV: BIẾN ĐỔI CÂU", desc: "Chọn câu viết lại có nghĩa không thay đổi" },
    error_identification: { name: "Phần V: TÌM LỖI SAI", desc: "Chọn phần gạch chân có lỗi sai cần chỉnh sửa" }
  };
  
  categoriesOrder.forEach(cat => {
    const list = grouped[cat];
    if (list && list.length > 0) {
      const startIdx = finalQuestions.length;
      list.forEach(q => {
        finalQuestions.push(q);
      });
      const endIdx = finalQuestions.length;
      
      sections.push({
        id: cat,
        name: categoryMeta[cat].name,
        desc: categoryMeta[cat].desc,
        range: [startIdx, endIdx]
      });
    }
  });
  
  if (sections.length === 0) {
    sections.push({
      id: 'grammar_vocabulary',
      name: "Phần ôn tập tổng hợp",
      desc: "Luyện thi trắc nghiệm tiếng Anh",
      range: [0, finalQuestions.length]
    });
  }
  
  return {
    title: aiResult.title || 'Đề ôn tập sinh bởi AI',
    subtitle: `Sinh bởi AI · Mục tiêu ${targetSchool} · ${new Date().toLocaleDateString('vi-VN')}`,
    duration: parseInt(duration) || 15,
    totalQuestions: finalQuestions.length,
    sections: sections,
    questions: finalQuestions
  };
}

/* ── Cloned Mock Exam Generator (Fallback Local Mode) ── */
function generateMockExam(fileName, questionCount, difficulty, duration, targetSchool) {
  // Pull standardized question banks from EXAM_DATABASE[1]
  const baseExam = window.EXAM_DATABASE[1] || { questions: [], sections: [] };
  
  const count = Math.min(parseInt(questionCount) || 10, baseExam.questions.length);
  const slicedQuestions = baseExam.questions.slice(0, count);
  
  const grouped = {};
  slicedQuestions.forEach(q => {
    const cat = q.category || 'grammar_vocabulary';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(q);
  });
  
  const finalQuestions = [];
  const sections = [];
  const categoriesOrder = ['phonetics', 'grammar_vocabulary', 'reading_comprehension', 'sentence_transformation', 'error_identification'];
  
  const categoryMeta = {
    phonetics: { name: "Phần I: PHÁT ÂM", desc: "Chọn từ có phần gạch chân phát âm KHÁC" },
    grammar_vocabulary: { name: "Phần II: NGỮ PHÁP & TỪ VỰNG", desc: "Chọn đáp án đúng nhất để hoàn thành câu" },
    reading_comprehension: { name: "Phần III: ĐỌC HIỂU", desc: "Đọc kỹ đoạn văn và chọn đáp án chính xác nhất" },
    sentence_transformation: { name: "Phần IV: BIẾN ĐỔI CÂU", desc: "Chọn câu viết lại có nghĩa không đổi hoặc điền từ thích hợp" },
    error_identification: { name: "Phần V: TÌM LỖI SAI", desc: "Chọn phần gạch chân có lỗi sai ngữ pháp hoặc chính tả" }
  };
  
  categoriesOrder.forEach(cat => {
    const list = grouped[cat];
    if (list && list.length > 0) {
      const startIdx = finalQuestions.length;
      list.forEach((q, idx) => {
        finalQuestions.push({
          ...q,
          id: finalQuestions.length + 1
        });
      });
      const endIdx = finalQuestions.length;
      
      sections.push({
        id: cat,
        name: categoryMeta[cat].name,
        desc: categoryMeta[cat].desc,
        range: [startIdx, endIdx]
      });
    }
  });
  
  const cleanName = fileName ? fileName.replace(/\.[^.]+$/, '') : 'Bài tập tự luyện';
  
  return {
    title: `Đề ôn tập: ${cleanName}`,
    subtitle: `Đề mô phỏng · Mục tiêu ${targetSchool} · ${new Date().toLocaleDateString('vi-VN')}`,
    duration: parseInt(duration) || 15,
    totalQuestions: finalQuestions.length,
    sections: sections,
    questions: finalQuestions
  };
}

/* ── Modal Dialog Controls ── */
function showModal(title, count, diff) {
  const modalDesc = document.getElementById('modalDesc');
  if (modalDesc) {
    const levelText = diff === 'easy' ? 'Nhận biết' : diff === 'hard' ? 'Khó / Chuyên' : 'Thông hiểu';
    modalDesc.textContent = `Đề thi "${title}" gồm ${count} câu hỏi ở mức độ "${levelText}" đã được lưu vào hệ thống của con.`;
  }
  document.getElementById('modalOverlay').style.display = 'grid';
}

function closeModal() {
  document.getElementById('modalOverlay').style.display = 'none';
}

function startQuiz() {
  closeModal();
  if (generatedExamId) {
    window.location.href = `exam.html?id=${generatedExamId}`;
  }
}

/* ── Exam Catalogue Renderer ── */
function renderExamsList() {
  const container = document.getElementById('examList');
  if (!container) return;
  container.innerHTML = '';
  
  loadExamsFromDatabase();
  
  Object.keys(window.EXAM_DATABASE).forEach((id, idx) => {
    const exam = window.EXAM_DATABASE[id];
    const isCustom = id.toString().startsWith('custom');
    
    // Sort difficulty rating from questions
    const diffLabel = exam.questions[0]?.difficulty || 'medium';
    const tagClass = diffLabel === 'easy' ? 'tag-easy' : diffLabel === 'hard' ? 'tag-hard' : 'tag-medium';
    const tagLabel = diffLabel === 'easy' ? 'Dễ' : diffLabel === 'hard' ? 'Khó' : 'Tr.Bình';
    
    let attemptsCount = 0;
    let maxScore = 0;
    if (window.DbService) {
      const attempts = window.DbService.getAttempts().filter(a => a.examId == id);
      attemptsCount = attempts.length;
      if (attemptsCount > 0) {
        maxScore = Math.max(...attempts.map(a => Number(a.score)));
      }
    }
    
    const card = document.createElement('div');
    card.className = `exam-card ${isCustom ? 'ai-generated-card' : ''}`;
    card.style.animationDelay = `${idx * 60}ms`;
    if (isCustom) {
      card.style.border = '2px dashed var(--em-500)';
      card.style.background = 'rgba(16,185,129,0.02)';
    }
    
    card.innerHTML = `
      <div class="exam-card-header" style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div class="exam-title" style="font-weight:600;font-size:0.95rem;color:var(--gray-900);line-height:1.3;">${escHtml(exam.title)}</div>
        <span style="font-size:1.1rem;margin-left:4px;">${isCustom ? '🤖' : '📘'}</span>
      </div>
      <p style="font-size:0.75rem;color:var(--gray-600);margin:4px 0 8px 0;line-height:1.2;">${escHtml(exam.subtitle || '')}</p>
      <div class="exam-meta" style="margin-bottom:10px;">
        <span class="exam-tag ${tagClass}">${tagLabel}</span>
        <span class="exam-tag tag-questions">${exam.questions.length} câu</span>
        <span class="exam-tag tag-date">${exam.duration} phút</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
        <div class="exam-score-bar" style="flex:1;height:6px;background:var(--gray-200);border-radius:3px;overflow:hidden;">
          <div class="exam-score-fill" style="width:${maxScore * 10}%;height:100%;background:var(--em-500);border-radius:3px;"></div>
        </div>
        <span style="font-size:.7rem;font-weight:700;color:var(--em-600)">Đỉnh: ${maxScore.toFixed(1)}đ</span>
      </div>
      <div class="exam-actions" style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;">
        <a class="exam-btn exam-btn-primary" href="exam.html?id=${id}" style="text-decoration:none;display:inline-flex;justify-content:center;align-items:center;font-size:0.8rem;padding:6px 12px;">
          ▶ Làm đề thi
        </a>
        <span style="font-size:0.7rem;color:var(--gray-600);font-weight:500;">Thi: ${attemptsCount} lần</span>
      </div>
    `;
    container.appendChild(card);
  });
}

function loadExamsFromDatabase() {
  try {
    const stored = localStorage.getItem('smartexam_custom_exams');
    if (stored && window.EXAM_DATABASE) {
      const custom = JSON.parse(stored);
      Object.assign(window.EXAM_DATABASE, custom);
    }
  } catch (e) {
    console.error('Lỗi khi tải đề tự sinh:', e);
  }
}

/* ── History Table View ── */
function renderHistoryTable() {
  const tbody = document.getElementById('history-table-body');
  if (!tbody) return;
  
  if (!window.DbService) return;
  const attempts = window.DbService.getAttempts();
  
  if (attempts.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;padding:40px;color:var(--gray-600);">Con chưa làm đề thi nào hết. Hãy nộp bài thi đầu tiên để lưu lịch sử nhé! 📚</td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = '';
  attempts.forEach(att => {
    const dateObj = new Date(att.date);
    const dateStr = dateObj.toLocaleDateString('vi-VN', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
    
    const minutes = Math.floor(att.timeSpent / 60);
    const seconds = att.timeSpent % 60;
    const timeUsedStr = `${minutes}p ${seconds}s`;
    
    const row = document.createElement('tr');
    
    let scoreColor = '#ef4444';
    if (att.score >= 9.0) scoreColor = '#10b981';
    else if (att.score >= 7.5) scoreColor = '#3b82f6';
    else if (att.score >= 5.0) scoreColor = '#f59e0b';
    
    row.innerHTML = `
      <td>${dateStr}</td>
      <td style="font-weight:600;color:var(--gray-800);">${escHtml(att.examTitle)}</td>
      <td><strong style="color:${scoreColor};font-size:1.1rem;">${Number(att.score).toFixed(1)}</strong> / 10đ</td>
      <td>${timeUsedStr}</td>
      <td><span class="exam-tag tag-questions" style="background:rgba(16,185,129,0.1);color:#10b981;">${att.correctCount} / ${att.totalQuestions} câu</span></td>
      <td>
        <a class="exam-btn exam-btn-primary" href="exam.html?id=${att.examId}" style="text-decoration:none;font-size:0.75rem;padding:4px 8px;display:inline-block;">
          Làm lại
        </a>
      </td>
    `;
    tbody.appendChild(row);
  });
}

/* ── Mistake Book (Sổ Tay Lỗi Sai) Renderer ── */
function renderMistakesList() {
  const container = document.getElementById('mistakes-list');
  if (!container) return;
  
  if (!window.DbService) return;
  const mistakes = window.DbService.getWrongQuestions();
  
  if (mistakes.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:60px;color:var(--gray-500);background:#fff;border-radius:16px;box-shadow:0 8px 30px rgba(0,0,0,0.02)">
        🦉 Sổ tay trống! Con làm bài cực đỉnh, chưa sai câu nào hoặc đã sửa hết lỗi. Hãy tiếp tục phát huy nhé! 🌟
      </div>
    `;
    return;
  }
  
  container.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  
  mistakes.forEach((q, idx) => {
    const card = document.createElement('div');
    card.className = 'mistake-question-card';
    card.style.animationDelay = `${idx * 50}ms`;
    card.style.background = '#fff';
    card.style.border = '1px solid var(--gray-200)';
    card.style.borderRadius = '16px';
    card.style.padding = '20px';
    card.style.marginBottom = '20px';
    card.style.boxShadow = '0 4px 20px rgba(0,0,0,0.01)';
    
    // Construct options grid
    let optionsHtml = '<div class="mistake-opts-grid" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:10px;margin:12px 0;">';
    q.options.forEach((opt, oIdx) => {
      const optLetter = letters[oIdx];
      let itemClass = '';
      let style = 'padding:10px 14px;border-radius:10px;border:1px solid var(--gray-200);font-size:0.85rem;font-weight:500;display:flex;align-items:center;gap:8px;';
      let icon = '';
      
      if (optLetter === q.correct_answer) {
        style += 'background:rgba(16,185,129,0.1);color:#047857;border-color:rgba(16,185,129,0.3);';
        icon = ' ✓';
      } else if (optLetter === q.selected_answer) {
        style += 'background:rgba(239,68,68,0.1);color:#b91c1c;border-color:rgba(239,68,68,0.3);';
        icon = ' ✗';
      }
      
      optionsHtml += `
        <div style="${style}">
          <span style="font-weight:bold;background:rgba(0,0,0,0.05);width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.75rem;">${optLetter}</span>
          <span>${escHtml(opt)}</span><strong>${icon}</strong>
        </div>
      `;
    });
    optionsHtml += '</div>';
    
    card.innerHTML = `
      <div class="mistake-header" style="display:flex;justify-content:space-between;margin-bottom:10px;">
        <span class="mistake-tag" style="background:var(--em-50);color:var(--em-700);font-size:0.75rem;font-weight:700;padding:4px 8px;border-radius:6px;">Chủ đề: ${escHtml(q.topic || 'Tổng quát')}</span>
        <span class="mistake-category" style="color:var(--gray-600);font-size:0.75rem;font-weight:600;">${escHtml(q.category === 'phonetics' ? 'Phát âm' : q.category === 'reading_comprehension' ? 'Đọc hiểu' : q.category === 'sentence_transformation' ? 'Biến đổi câu' : q.category === 'error_identification' ? 'Tìm lỗi sai' : 'Ngữ pháp & Từ vựng')}</span>
      </div>
      <div class="mistake-text" style="font-weight:600;font-size:0.95rem;color:var(--gray-900);line-height:1.4;">${q.question_text}</div>
      ${optionsHtml}
      <div class="mistake-footer" style="background:var(--gray-50);border-radius:12px;padding:12px 16px;margin-top:12px;">
        <div class="mistake-exp" style="font-size:0.8rem;color:var(--gray-700);line-height:1.4;">
          <strong>🦉 Lời khuyên của Thầy Cú:</strong> ${q.explanation}
        </div>
        <div class="mistake-actions" style="margin-top:12px;display:flex;justify-content:flex-end;gap:10px;">
          <button class="exam-btn exam-btn-ghost" onclick="removeMistake('${q.id}')" style="font-size:0.75rem;padding:6px 12px;color:#ef4444;border-color:rgba(239,68,68,0.2);background:transparent;">
            Xóa lỗi này
          </button>
          <button class="exam-btn exam-btn-primary" onclick="askAIChatForMistake(${idx})" style="font-size:0.75rem;padding:6px 12px;background:var(--em-500);color:#fff;">
            Hỏi Thầy Cú 🦉
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function removeMistake(id) {
  if (window.DbService.removeWrongQuestion(id)) {
    showToast('Đã xóa câu hỏi khỏi Sổ tay lỗi sai!', 'success');
    syncGamification();
    renderMistakesList();
  }
}

function clearAllMistakes() {
  if (confirm('Con có chắc muốn xóa toàn bộ câu hỏi ôn tập trong Sổ tay lỗi sai không?')) {
    localStorage.removeItem('smartexam_wrong_questions');
    showToast('Đã làm sạch Sổ tay lỗi sai!', 'success');
    syncGamification();
    renderMistakesList();
  }
}

function askAIChatForMistake(idx) {
  const mistakes = window.DbService.getWrongQuestions();
  const q = mistakes[idx];
  if (!q) return;
  
  initAIChatWithContext(
    q.question_text,
    q.options,
    q.selected_answer || 'Chưa chọn',
    q.correct_answer
  );
}

/* ── Learning Analytics (ApexCharts) Dashboard ── */
function renderDashboardCharts(analytics) {
  const totalTestsEl = document.getElementById('an-total-tests');
  if (totalTestsEl) totalTestsEl.textContent = analytics.totalTests;

  const avgScoreEl = document.getElementById('an-avg-score');
  if (avgScoreEl) avgScoreEl.textContent = `${analytics.averageScore}đ`;

  const avgTimeEl = document.getElementById('an-avg-time');
  if (avgTimeEl) avgTimeEl.textContent = `${analytics.averageTimeMinutes} phút`;

  const streakEl = document.getElementById('an-streak');
  if (streakEl) streakEl.textContent = `${analytics.streak} ngày`;

  // Render Strength & Weakness Lists
  renderAnalyticsLists(analytics);

  if (!window.ApexCharts) {
    console.warn('Không tìm thấy thư viện ApexCharts!');
    return;
  }

  // --- 1. Radar Skills Mastery Chart ---
  const radarOptions = {
    series: [{
      name: 'Tỷ lệ làm đúng',
      data: [
        analytics.categoryStats.phonetics.rate,
        analytics.categoryStats.grammar_vocabulary.rate,
        analytics.categoryStats.reading_comprehension.rate,
        analytics.categoryStats.sentence_transformation.rate,
        analytics.categoryStats.error_identification.rate
      ]
    }],
    chart: {
      height: 300,
      type: 'radar',
      toolbar: { show: false }
    },
    colors: ['#10b981'],
    stroke: { width: 2 },
    fill: { opacity: 0.25 },
    markers: { size: 4 },
    xaxis: {
      categories: ['Phát âm', 'Từ vựng & Ngữ pháp', 'Đọc hiểu', 'Biến đổi câu', 'Tìm lỗi sai'],
      labels: {
        style: {
          colors: ['#374151', '#374151', '#374151', '#374151', '#374151'],
          fontSize: '11px',
          fontFamily: 'Plus Jakarta Sans, sans-serif'
        }
      }
    },
    yaxis: {
      max: 100,
      tickAmount: 5,
      labels: {
        formatter: (v) => `${Math.round(v)}%`
      }
    }
  };

  if (radarChartInstance) {
    radarChartInstance.destroy();
  }
  
  const radarChartEl = document.getElementById('radar-skills-chart');
  if (radarChartEl) {
    radarChartEl.innerHTML = '';
    radarChartInstance = new ApexCharts(radarChartEl, radarOptions);
    radarChartInstance.render();
  }

  // --- 2. Line Score Progress Chart ---
  const scores = analytics.historyChartData.map(d => parseFloat(d.score));
  const labels = analytics.historyChartData.map(d => d.name);

  const lineOptions = {
    series: [{
      name: 'Điểm số làm bài',
      data: scores.length > 0 ? scores : [0]
    }],
    chart: {
      height: 300,
      type: 'line',
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    colors: ['#059669'],
    stroke: { curve: 'smooth', width: 3 },
    markers: { size: 5, hover: { size: 7 } },
    xaxis: {
      categories: labels.length > 0 ? labels : ['Chưa có dữ liệu'],
      labels: {
        style: {
          colors: '#4b5563',
          fontSize: '10px',
          fontFamily: 'Plus Jakarta Sans, sans-serif'
        }
      }
    },
    yaxis: {
      min: 0,
      max: 10,
      tickAmount: 5,
      labels: {
        formatter: (v) => `${v.toFixed(1)}đ`
      }
    },
    tooltip: {
      y: {
        formatter: (v) => `${v} / 10 điểm`
      }
    }
  };

  if (lineChartInstance) {
    lineChartInstance.destroy();
  }

  const lineChartEl = document.getElementById('line-score-chart');
  if (lineChartEl) {
    lineChartEl.innerHTML = '';
    lineChartInstance = new ApexCharts(lineChartEl, lineOptions);
    lineChartInstance.render();
  }
}

function renderAnalyticsLists(analytics) {
  const strengthList = document.getElementById('strength-list');
  const weaknessList = document.getElementById('weakness-list');
  
  if (!strengthList || !weaknessList) return;
  
  // Render Strengths list
  if (analytics.strengths && analytics.strengths.length > 0) {
    strengthList.innerHTML = '';
    analytics.strengths.forEach(s => {
      const li = document.createElement('li');
      li.style.color = '#047857';
      li.style.fontWeight = '500';
      li.style.fontSize = '0.85rem';
      li.style.marginBottom = '6px';
      li.innerHTML = `🌟 <strong>${escHtml(s.topic)}</strong> — Tỷ lệ làm đúng: <strong>${s.rate}%</strong>. Làm rất tốt con ơi!`;
      strengthList.appendChild(li);
    });
  } else {
    strengthList.innerHTML = `<li style="color:var(--gray-500);font-style:italic;font-size:0.85rem;">Con hãy làm ít nhất 3 đề thi (để Cú thu thập đủ 3 câu cho từng chuyên đề) để phân tích thế mạnh nhé! 🦉</li>`;
  }
  
  // Render Weaknesses list
  if (analytics.weaknesses && analytics.weaknesses.length > 0) {
    weaknessList.innerHTML = '';
    analytics.weaknesses.forEach(w => {
      const li = document.createElement('li');
      li.style.color = '#b91c1c';
      li.style.fontWeight = '500';
      li.style.fontSize = '0.85rem';
      li.style.marginBottom = '10px';
      li.innerHTML = `
        ⚠️ <strong>${escHtml(w.topic)}</strong> — Tỷ lệ đúng chỉ: <strong>${w.rate}%</strong>.
        <div style="font-size:0.75rem;color:var(--gray-600);font-weight:normal;margin-top:2px;">
          💡 <em>Lời khuyên:</em> Xem kỹ các câu sai phần này trong Sổ tay lỗi sai và nhấn "Hỏi Thầy Cú 🦉" nhé!
        </div>
      `;
      weaknessList.appendChild(li);
    });
  } else {
    weaknessList.innerHTML = `<li style="color:var(--gray-500);font-style:italic;font-size:0.85rem;">Hệ thống đang thu thập thêm dữ liệu để chẩn đoán các phần kiến thức hổng... 🦉</li>`;
  }
}

/* ── Toast Notifications ── */
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
  if (container) {
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      toast.style.transition = '.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

/* ── AI Tutor Chatbot Panel Logic (Dashboard Version) ── */
function toggleAIChat(isOpen) {
  const win = document.getElementById('aiTutorChatWindow');
  if (win) {
    if (isOpen) win.classList.add('open');
    else win.classList.remove('open');
  }
}

function initAIChatWithContext(qText, options, userAns, correctAns) {
  aiChatState.questionText = qText;
  aiChatState.options = options;
  aiChatState.selectedAnswer = userAns;
  aiChatState.correctAnswer = correctAns;
  aiChatState.history = [];
  
  toggleAIChat(true);
  
  const cleanQText = qText.replace(/<[^>]*>/g, '');
  
  // Add initial welcome to chat body
  const body = document.getElementById('aiChatBody');
  body.innerHTML = `
    <div class="ai-chat-msg tutor">
      <span class="ai-chat-sender">Cú Thông Thái</span>
      <div class="ai-chat-bubble">
        Chào con thân yêu! 🦉 Thầy Cú đang nghiên cứu kỹ câu hỏi này của con rồi. Hãy đợi thầy vài giây để thầy giải thích siêu tốc ngữ pháp nhé! ✨
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

  // Make direct API call
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
      
      const typing = document.getElementById('aiTypingIndicator');
      if (typing) typing.remove();
      
      appendChatBubble('tutor', explanation);
      aiChatState.history.push({ role: 'model', message: explanation });
    } catch (err) {
      console.error(err);
      const typing = document.getElementById('aiTypingIndicator');
      if (typing) typing.remove();
      appendChatBubble('tutor', 'Thầy Cú bị hắt xì hơi một cái nên chưa tập trung suy nghĩ được. Con hãy nhắn tin hỏi trực tiếp thầy nhé! 🦉❤️');
    }
  }, 300);
}

function appendChatBubble(role, text) {
  const body = document.getElementById('aiChatBody');
  const div = document.createElement('div');
  div.className = `ai-chat-msg ${role === 'tutor' ? 'tutor' : 'user'}`;
  
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
  
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/^\s*-\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.+<\/li>)/s, '<ul>$1</ul>');
  html = html.replace(/\n/g, '<br>');
  
  return html;
}

async function sendAIChatMessage() {
  const input = document.getElementById('aiChatInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  
  input.value = '';
  
  // Render user text bubble
  appendChatBubble('user', text);
  aiChatState.history.push({ role: 'user', message: text });
  
  // Show typing bubble
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
  
  // Ask tutor service
  try {
    const cleanQText = aiChatState.questionText.replace(/<[^>]*>/g, '');
    const response = await window.AiService.askAITutor(
      cleanQText,
      aiChatState.options,
      aiChatState.selectedAnswer,
      aiChatState.correctAnswer,
      aiChatState.history.slice(0, -1),
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
    appendChatBubble('tutor', 'Thầy Cú đang mải tìm kính lão một tí. Con hãy hỏi thầy lại nhé! 🦉❤️');
  }
}

/* ── Context-Adaptive Search Filtering ── */
function setupSearchFilter() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;
  
  searchInput.addEventListener('input', function () {
    const query = this.value.toLowerCase().trim();
    const activeView = getActiveView();
    
    if (activeView === 'materials') {
      const cards = document.querySelectorAll('#examList .exam-card');
      cards.forEach(card => {
        const title = card.querySelector('.exam-title').textContent.toLowerCase();
        if (title.includes(query)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    } else if (activeView === 'mistakes') {
      const cards = document.querySelectorAll('#mistakes-list .mistake-question-card');
      cards.forEach(card => {
        const text = card.querySelector('.mistake-text').textContent.toLowerCase();
        const tag = card.querySelector('.mistake-tag').textContent.toLowerCase();
        if (text.includes(query) || tag.includes(query)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    } else if (activeView === 'history') {
      const rows = document.querySelectorAll('#history-table-body tr');
      rows.forEach(row => {
        const cols = Array.from(row.querySelectorAll('td'));
        if (cols.length < 2) return;
        const title = cols[1].textContent.toLowerCase();
        if (title.includes(query)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    }
  });
}

function getActiveView() {
  const views = ['materials', 'history', 'analytics', 'mistakes', 'settings'];
  for (const v of views) {
    const el = document.getElementById(`view-${v}`);
    if (el && el.style.display !== 'none') {
      return v;
    }
  }
  return 'materials';
}

/* ── Initialization ── */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Merge standard catalog
  loadExamsFromDatabase();

  // 2. Render initial exams lists
  renderExamsList();

  // 3. Render gamification dashboard badge numbers
  syncGamification();

  // 4. Bind slider events
  updateSliderBackground(document.getElementById('q-count'));
  updateSliderBackground(document.getElementById('timer-range'));

  // 5. Initialize search logic
  setupSearchFilter();

  // Keyboard shortcut for quick search focus (Ctrl/Cmd + K)
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const input = document.getElementById('search-input');
      if (input) input.focus();
    }
  });

  // Welcome back notification toast
  const settings = window.DbService ? window.DbService.getSettings() : { userName: 'Học sinh' };
  setTimeout(() => {
    showToast(`Chào mừng con thân yêu <strong>${settings.userName}</strong> đã quay trở lại ôn luyện! 👋🦉`, 'info');
  }, 1000);
});
