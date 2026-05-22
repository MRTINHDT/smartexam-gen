/**
 * SmartExam AI - AI Generative Service (ai-service.js)
 * Tích hợp trực tiếp Google Gemini 1.5 Flash API phục vụ bóc tách tài liệu hình ảnh (OCR Multimodal),
 * tự động biên soạn câu hỏi trắc nghiệm chất lượng cao và Trợ lý học tập AI Tutor.
 */

const AiService = {
  // Lấy API Key từ cấu hình hệ thống
  getApiKey() {
    if (window.DbService) {
      return window.DbService.getSettings().geminiApiKey;
    }
    return '';
  },

  // Hàm gọi API Gemini thô
  async _callGeminiAPI(contents, systemInstructionText = '') {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Chưa cấu hình Gemini API Key! Hãy vào tab Cài đặt để thiết lập khóa miễn phí.');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    // Xây dựng thân body request
    const body = {
      contents: contents,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3
      }
    };

    // Bổ sung system instruction nếu có
    if (systemInstructionText) {
      body.systemInstruction = {
        parts: [{ text: systemInstructionText }]
      };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `HTTP ${response.status}`;
      throw new Error(`Lỗi kết nối Gemini API: ${errorMessage}`);
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      throw new Error('Không nhận được phản hồi từ AI.');
    }

    return JSON.parse(responseText.trim());
  },

  // 1. TẠO CÂU HỎI TỪ VĂN BẢN (PDF/DOCX Extracted Text)
  async generateQuizFromText(text, options = {}) {
    const numQ = options.numQuestions || 10;
    const diff = options.difficulty || 'medium';
    const targetSchool = options.targetSchool || 'THCS Thanh Xuân';

    const systemInstruction = `
Bạn là chuyên gia khảo thí Tiếng Anh, chuyên biên soạn đề thi tuyển sinh vào lớp 6 các trường THCS Chất lượng cao hàng đầu tại Hà Nội.
Hãy phân tích tài liệu học tập của học sinh cung cấp và biên soạn đúng ${numQ} câu hỏi trắc nghiệm tiếng Anh bám sát cấu trúc đề ôn thi lớp 6 trường ${targetSchool}.

YÊU CẦU:
1. Độc giả là học sinh tiểu học (10-11 tuổi), lời giải thích phải viết bằng Tiếng Việt thân thiện, dễ thương, dịch nghĩa từ vựng mới và phân tích ngữ pháp chi tiết từng bước.
2. Các câu hỏi được chia ngẫu nhiên vào các nhóm kỹ năng: 'phonetics', 'grammar_vocabulary', 'reading_comprehension', 'sentence_transformation', 'error_identification' (chọn nhóm phù hợp nhất dựa trên nội dung tài liệu).
3. Độ khó mục tiêu là: ${diff} (easy: Dễ/Nhận biết, medium: Trung bình/Thông hiểu, hard: Khó/Vận dụng).
4. Định dạng đầu ra bắt buộc phải là đối tượng JSON theo cấu trúc mẫu sau (không chứa ký tự markdown):
{
  "title": "Tên bài ôn tập sinh ra tương ứng tài liệu",
  "questions": [
    {
      "id": "ai_q_1",
      "question_text": "He usually ______ to school by bus, but today he is walking.",
      "options": ["go", "goes", "going", "went"],
      "correct_answer": "B",
      "explanation": "Chào con yêu! Câu này chúng ta chọn B (goes) vì có từ 'usually' chỉ thói quen ở hiện tại đơn với chủ ngữ số ít 'He'. Vế sau dùng hiện tại tiếp diễn chỉ sự thay đổi tạm thời hôm nay nhé!",
      "topic": "Present Simple vs Present Continuous",
      "category": "grammar_vocabulary",
      "difficulty": "medium"
    }
  ]
}
`;

    const contents = [
      {
        parts: [
          { text: `NỘI DUNG TÀI LIỆU HỌC TẬP:\n\n${text}\n\nHãy tạo đề thi gồm ${numQ} câu hỏi trắc nghiệm tiếng Anh từ tài liệu trên.` }
        ]
      }
    ];

    return this._callGeminiAPI(contents, systemInstruction);
  },

  // 2. TẠO CÂU HỎI TỪ HÌNH ẢNH BÀI TẬP (Multimodal Image OCR & Quiz Gen)
  async generateQuizFromImage(base64Image, mimeType, options = {}) {
    const numQ = options.numQuestions || 10;
    const diff = options.difficulty || 'medium';
    const targetSchool = options.targetSchool || 'THCS Thanh Xuân';

    const systemInstruction = `
Bạn là chuyên gia bóc tách bài tập và ra đề thi tiếng Anh lớp 6 CLC tại Hà Nội.
Nhiệm vụ của bạn là:
1. Nhìn vào hình ảnh bài tập tiếng Anh được gửi kèm (thực hiện OCR đa phương thức).
2. Trích xuất toàn bộ bài tập trong ảnh, giải chúng và tạo ra một bộ câu hỏi tương ứng dưới dạng trắc nghiệm 4 đáp án (A/B/C/D).
3. Nếu bài tập trong ảnh có ít hơn ${numQ} câu hỏi, hãy tự động sáng tạo thêm các câu hỏi tương tự cùng chuyên đề ngữ pháp/từ vựng đó để đủ ${numQ} câu.
4. Lời giải thích viết bằng Tiếng Việt dễ thương, ngắn gọn, dễ hiểu cho học sinh lớp 5.
5. Trả về định dạng JSON duy nhất khớp với cấu trúc Schema sau:
{
  "title": "Đề ôn tập bóc tách từ ảnh bài tập",
  "questions": [
    {
      "id": "ai_img_q_1",
      "question_text": "Nội dung câu hỏi trắc nghiệm tiếng Anh...",
      "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
      "correct_answer": "A",
      "explanation": "Lời giải thích bằng Tiếng Việt dễ hiểu cho trẻ...",
      "topic": "Tên chuyên đề kiến thức câu này...",
      "category": "grammar_vocabulary",
      "difficulty": "medium"
    }
  ]
}
`;

    // Chuẩn bị ảnh cho Gemini
    // Loại bỏ tiền tố base64 (ví dụ: "data:image/png;base64,") nếu có
    const cleanBase64 = base64Image.includes('base64,') 
      ? base64Image.split('base64,')[1] 
      : base64Image;

    const contents = [
      {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || 'image/png',
              data: cleanBase64
            }
          },
          {
            text: `Đây là ảnh chụp bài tập tiếng Anh. Hãy bóc tách bài tập này, sinh lời giải chi tiết và tạo bộ câu hỏi gồm ${numQ} câu tương ứng theo cấu trúc JSON quy định.`
          }
        ]
      }
    ];

    return this._callGeminiAPI(contents, systemInstruction);
  },

  // 3. TRỢ LÝ HỌC TẬP AI TUTOR GIẢI THÍCH (Chatbot API)
  async askAITutor(questionText, options, selectedAnswer, correctAnswer, chatHistory = [], userQuery = '') {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return "Chào con! Thầy rất muốn giải thích câu này nhưng hiện tại trang web chưa được cấu hình Gemini API Key. Con hãy nhờ bố mẹ lấy khóa API miễn phí từ Google AI Studio và điền vào mục **Cài đặt** ở trang chủ nhé! Thầy cú 🦉 chờ con quay lại.";
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const systemInstruction = `
Bạn là Cú Thông Thái 🦉 - Trợ lý học tập và gia sư Tiếng Anh vô cùng dễ thương, thân thiện, chuyên hướng dẫn học sinh lớp 5 luyện thi vào lớp 6 Chất lượng cao tại Hà Nội.
Hãy giải thích câu hỏi tiếng Anh mà học sinh đang thắc mắc một cách ngắn gọn, súc tích, dùng ngôn từ trẻ trung, gần gũi như một người thầy hiền lành.

CÔNG THỨC GIẢI THÍCH:
1. Chào học sinh thân mến (kèm biểu tượng mặt cười dễ thương).
2. Chỉ ra đáp án con chọn và giải thích tại sao nó sai/chưa tối ưu (nếu con chọn sai).
3. Giải thích tại sao đáp án đúng mới là chính xác. Đưa ra CÔNG THỨC hoặc mẹo ghi nhớ dễ học.
4. Dịch nghĩa câu hỏi gốc và các từ mới.
5. Đặt ra 1 câu hỏi tương tự cực kỳ ngắn để kiểm tra xem con đã hiểu bài chưa.

BỐ CỤC: Trình bày đẹp mắt bằng Markdown, sử dụng biểu tượng cảm xúc (emoji) vui tươi, các điểm nhấn bằng chữ in đậm để học sinh dễ theo dõi.
`;

    // Xây dựng lịch sử trò chuyện
    const formattedContents = [];
    
    // Đưa bối cảnh câu hỏi vào đầu cuộc hội thoại làm ngữ cảnh
    let contextPrompt = `BỐI CẢNH CÂU HỎI TIẾNG ANH:\n`;
    contextPrompt += `- Câu hỏi: "${questionText}"\n`;
    contextPrompt += `- Các lựa chọn: A. ${options[0]} | B. ${options[1]} | C. ${options[2]} | D. ${options[3]}\n`;
    contextPrompt += `- Đáp án đúng: ${correctAnswer}\n`;
    if (selectedAnswer) {
      contextPrompt += `- Đáp án học sinh đã chọn: ${selectedAnswer}\n`;
    }

    formattedContents.push({
      role: 'user',
      parts: [{ text: contextPrompt + `Hãy giải thích chi tiết câu hỏi trên.` }]
    });

    // Mô phỏng câu trả lời ban đầu của trợ lý
    formattedContents.push({
      role: 'model',
      parts: [{ text: `Dạ chào con! Thầy Cú 🦉 đây. Để thầy hướng dẫn con giải quyết câu này một cách siêu tốc và dễ nhớ nhé...` }]
    });

    // Thêm các câu chat lịch sử (nếu có)
    chatHistory.forEach(msg => {
      formattedContents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.message }]
      });
    });

    // Thêm câu hỏi hiện tại của học sinh
    if (userQuery) {
      formattedContents.push({
        role: 'user',
        parts: [{ text: userQuery }]
      });
    }

    const body = {
      contents: formattedContents,
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      generationConfig: {
        temperature: 0.7
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Thầy gặp một chút trục trặc nhỏ khi suy nghĩ, con nhắn lại câu hỏi nhé!";
    } catch (e) {
      console.error('Lỗi trợ lý AI:', e);
      return "Xin lỗi con nhé, kết nối mạng với Thầy Cú 🦉 bị gián đoạn một chút. Con hãy kiểm tra lại kết nối internet của mình nhé!";
    }
  }
};

// Đăng ký toàn cục
window.AiService = AiService;
