/**
 * SmartExam AI - Database & Storage Service (db-service.js)
 * Cung cấp giải pháp lưu trữ dữ liệu học tập kép: Chế độ Local (LocalStorage) và Supabase Sync.
 * Quản lý lịch sử thi, Phân tích năng lực chuyên đề, Sổ tay lỗi sai, Chuỗi ngày học Streak và XP.
 */

const DbService = {
  // --- CẤU HÌNH HỆ THỐNG & API KEYS ---
  getSettings() {
    const defaultSettings = {
      geminiApiKey: '',
      supabaseUrl: '',
      supabaseKey: '',
      targetSchool: 'THCS Thanh Xuân',
      userName: 'Học sinh thông thái',
      userGrade: 5
    };
    try {
      const stored = localStorage.getItem('smartexam_settings');
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch (e) {
      console.error('Lỗi khi đọc cài đặt:', e);
      return defaultSettings;
    }
  },

  saveSettings(settings) {
    try {
      localStorage.setItem('smartexam_settings', JSON.stringify(settings));
      return true;
    } catch (e) {
      console.error('Lỗi khi lưu cài đặt:', e);
      return false;
    }
  },

  // --- QUẢN LÝ ĐIỂM KINH NGHIỆM (XP) & CẤP ĐỘ (LEVEL) ---
  getXpAndLevel() {
    try {
      const xp = parseInt(localStorage.getItem('smartexam_total_xp') || '0', 10);
      // Công thức tính cấp độ: Cứ mỗi 500 XP sẽ tăng 1 Cấp (Level)
      const level = Math.floor(xp / 500) + 1;
      const xpInCurrentLevel = xp % 500;
      return { totalXp: xp, level, xpInCurrentLevel, nextLevelXp: 500 };
    } catch (e) {
      return { totalXp: 0, level: 1, xpInCurrentLevel: 0, nextLevelXp: 500 };
    }
  },

  addXp(amount) {
    try {
      const current = this.getXpAndLevel();
      const newXp = current.totalXp + amount;
      localStorage.setItem('smartexam_total_xp', newXp.toString());
      
      // Kiểm tra xem có tăng cấp không
      const newLevel = Math.floor(newXp / 500) + 1;
      return {
        leveledUp: newLevel > current.level,
        newLevel,
        totalXp: newXp,
        xpEarned: amount
      };
    } catch (e) {
      console.error('Lỗi khi cộng XP:', e);
      return { leveledUp: false, newLevel: 1, totalXp: 0, xpEarned: amount };
    }
  },

  // --- QUẢN LÝ CHUỖI NGÀY HỌC LIÊN TỤC (STREAKS) ---
  getStreak() {
    try {
      const streakCount = parseInt(localStorage.getItem('smartexam_streak') || '0', 10);
      const lastActiveStr = localStorage.getItem('smartexam_last_active');
      
      if (!lastActiveStr) return { count: 0, activeToday: false };

      const lastActiveDate = new Date(lastActiveStr);
      const today = new Date();
      
      // Đưa về mốc 0h để so sánh ngày
      today.setHours(0, 0, 0, 0);
      lastActiveDate.setHours(0, 0, 0, 0);

      const diffTime = today - lastActiveDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Đã hoạt động hôm nay
        return { count: streakCount, activeToday: true };
      } else if (diffDays === 1) {
        // Hoạt động hôm qua, vẫn giữ được streak
        return { count: streakCount, activeToday: false };
      } else {
        // Quá 1 ngày không học, mất streak
        localStorage.setItem('smartexam_streak', '0');
        return { count: 0, activeToday: false };
      }
    } catch (e) {
      return { count: 0, activeToday: false };
    }
  },

  updateStreak() {
    try {
      const streak = this.getStreak();
      const todayStr = new Date().toISOString();
      
      if (!streak.activeToday) {
        // Nếu hôm nay chưa hoạt động, tăng streak thêm 1
        const newCount = streak.count + 1;
        localStorage.setItem('smartexam_streak', newCount.toString());
        localStorage.setItem('smartexam_last_active', todayStr);
        return { count: newCount, firstActiveToday: true };
      }
      
      localStorage.setItem('smartexam_last_active', todayStr);
      return { count: streak.count, firstActiveToday: false };
    } catch (e) {
      console.error('Lỗi khi cập nhật Streak:', e);
      return { count: 0, firstActiveToday: false };
    }
  },

  // --- LỊCH SỬ THI THỬ (EXAM ATTEMPTS) ---
  getAttempts() {
    try {
      const stored = localStorage.getItem('smartexam_attempts');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Lỗi khi đọc lịch sử làm bài:', e);
      return [];
    }
  },

  saveAttempt(attemptData) {
    try {
      // attemptData: { examId, examTitle, score, timeSpent, totalQuestions, correctCount, answers: [{ questionId, selected, isCorrect, topic, category }] }
      const attempts = this.getAttempts();
      const newAttempt = {
        id: 'attempt_' + Date.now(),
        date: new Date().toISOString(),
        ...attemptData
      };
      
      attempts.unshift(newAttempt); // Đưa bài mới nhất lên đầu
      localStorage.setItem('smartexam_attempts', JSON.stringify(attempts));

      // 1. Tự động cập nhật Streak học tập
      const streakResult = this.updateStreak();

      // 2. Tự động tính toán điểm XP thưởng
      // Luyện thi được +100 XP cơ bản, mỗi câu đúng được +10 XP
      let xpEarned = 100 + (newAttempt.correctCount * 10);
      if (newAttempt.score >= 9.0) xpEarned += 50; // Thưởng đạt điểm giỏi
      
      const xpResult = this.addXp(xpEarned);

      // 3. Tự động đồng bộ các câu làm sai vào Sổ tay lỗi sai
      if (newAttempt.answers && newAttempt.answers.length > 0) {
        newAttempt.answers.forEach(ans => {
          if (!ans.isCorrect) {
            this.saveWrongQuestion({
              id: ans.questionId,
              question_text: ans.questionText,
              options: ans.options,
              correct_answer: ans.correctAnswer,
              explanation: ans.explanation,
              topic: ans.topic,
              category: ans.category,
              selected_answer: ans.selected
            });
          }
        });
      }

      // 4. Đồng bộ Supabase nếu được cấu hình
      this.syncAttemptToSupabase(newAttempt);

      return {
        success: true,
        attemptId: newAttempt.id,
        xpResult,
        streakResult
      };
    } catch (e) {
      console.error('Lỗi khi lưu kết quả thi:', e);
      return { success: false, error: e.message };
    }
  },

  // --- SỔ TAY LỖI SAI (MISTAKE BOOK) ---
  getWrongQuestions() {
    try {
      const stored = localStorage.getItem('smartexam_wrong_questions');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Lỗi khi đọc sổ tay lỗi sai:', e);
      return [];
    }
  },

  saveWrongQuestion(question) {
    try {
      // Tránh lưu trùng lặp câu hỏi
      const list = this.getWrongQuestions();
      const exists = list.some(q => q.id === question.id);
      
      if (!exists) {
        list.push({
          ...question,
          added_at: new Date().toISOString()
        });
        localStorage.setItem('smartexam_wrong_questions', JSON.stringify(list));
      }
      return true;
    } catch (e) {
      console.error('Lỗi khi lưu câu hỏi sai:', e);
      return false;
    }
  },

  removeWrongQuestion(questionId) {
    try {
      const list = this.getWrongQuestions();
      const filtered = list.filter(q => q.id !== questionId);
      localStorage.setItem('smartexam_wrong_questions', JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.error('Lỗi khi xóa câu hỏi sai:', e);
      return false;
    }
  },

  // --- PHÂN TÍCH HỌC TẬP CHUYÊN SÂU (LEARNING ANALYTICS) ---
  getAnalytics() {
    const attempts = this.getAttempts();
    const analytics = {
      totalTests: attempts.length,
      averageScore: 0,
      averageTimeMinutes: 0,
      totalXp: this.getXpAndLevel().totalXp,
      streak: this.getStreak().count,
      categoryStats: {
        phonetics: { total: 0, correct: 0, rate: 0 },
        grammar_vocabulary: { total: 0, correct: 0, rate: 0 },
        reading_comprehension: { total: 0, correct: 0, rate: 0 },
        sentence_transformation: { total: 0, correct: 0, rate: 0 },
        error_identification: { total: 0, correct: 0, rate: 0 }
      },
      topicStats: {}, // Thống kê chi tiết theo chủ đề nhỏ (ví dụ: Tenses, Prepositions)
      historyChartData: [] // Phục vụ vẽ biểu đồ đường tiến trình điểm số
    };

    if (attempts.length === 0) return analytics;

    let sumScore = 0;
    let sumTime = 0;

    // Duyệt ngược để lịch sử biểu đồ đi từ cũ đến mới nhất
    const recentAttempts = [...attempts].reverse();
    recentAttempts.forEach((att, idx) => {
      sumScore += Number(att.score);
      sumTime += att.timeSpent || 0;
      
      analytics.historyChartData.push({
        name: `Đề ${recentAttempts.length - idx}`,
        score: Number(att.score).toFixed(1),
        date: new Date(att.date).toLocaleDateString('vi-VN', { month: 'numeric', day: 'numeric' })
      });

      // Phân tích thống kê câu trả lời theo kỹ năng và chủ đề
      if (att.answers && att.answers.length > 0) {
        att.answers.forEach(ans => {
          const cat = ans.category || 'grammar_vocabulary';
          const topic = ans.topic || 'General';

          // 1. Thống kê theo kỹ năng chính
          if (analytics.categoryStats[cat]) {
            analytics.categoryStats[cat].total += 1;
            if (ans.isCorrect) analytics.categoryStats[cat].correct += 1;
          }

          // 2. Thống kê theo chủ đề phụ
          if (!analytics.topicStats[topic]) {
            analytics.topicStats[topic] = { total: 0, correct: 0 };
          }
          analytics.topicStats[topic].total += 1;
          if (ans.isCorrect) analytics.topicStats[topic].correct += 1;
        });
      }
    });

    analytics.averageScore = (sumScore / attempts.length).toFixed(1);
    analytics.averageTimeMinutes = Math.round((sumTime / attempts.length) / 60);

    // Tính tỷ lệ làm đúng theo kỹ năng (%)
    Object.keys(analytics.categoryStats).forEach(key => {
      const cat = analytics.categoryStats[key];
      cat.rate = cat.total > 0 ? Math.round((cat.correct / cat.total) * 100) : 0;
    });

    // Sắp xếp tìm ra điểm mạnh và điểm yếu nhất
    const topicArray = Object.keys(analytics.topicStats).map(topic => {
      const stat = analytics.topicStats[topic];
      return {
        topic,
        total: stat.total,
        rate: Math.round((stat.correct / stat.total) * 100)
      };
    }).filter(t => t.total >= 3); // Chỉ xét các chủ đề đã làm ít nhất 3 câu

    analytics.strengths = topicArray.filter(t => t.rate >= 75).slice(0, 3);
    analytics.weaknesses = topicArray.filter(t => t.rate < 60).sort((a,b) => a.rate - b.rate).slice(0, 3);

    return analytics;
  },

  // --- DỰ TRỮ ĐỒNG BỘ SUPABASE (PHASE 2 READY) ---
  async syncAttemptToSupabase(attempt) {
    const settings = this.getSettings();
    if (!settings.supabaseUrl || !settings.supabaseKey) return;
    
    // Placeholder: Sẵn sàng thực hiện gọi REST API của Supabase khi người dùng khai báo cấu hình khóa riêng
    console.log('Đang đồng bộ điểm thi lên đám mây Supabase cá nhân...', attempt);
  }
};

// Đăng ký toàn cục
window.DbService = DbService;
