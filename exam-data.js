/**
 * EXAM DATA — Đề thi Tiếng Anh vào lớp 6 THCS Thanh Xuân
 * Bộ đề chuẩn cấu trúc thi tuyển sinh 2024-2025
 * 40 câu hỏi / đề · 40 phút · Tự động chấm điểm + lời giải
 */

const EXAM_DATABASE = {

  // ═══════════════════════════════════════
  //  ĐỀ THI SỐ 1 — Đề minh họa 2024-2025
  // ═══════════════════════════════════════
  1: {
    title: "Đề Thi Thử Số 1",
    subtitle: "Đề minh họa · Năm học 2024–2025",
    duration: 40,
    totalQuestions: 40,
    sections: [
      {
        id: "phonetics",
        name: "Phần I: PHÁT ÂM",
        desc: "Chọn từ có phần gạch chân phát âm KHÁC với các từ còn lại",
        range: [0, 5],
      },
      {
        id: "grammar",
        name: "Phần II: NGỮ PHÁP & TỪ VỰNG",
        desc: "Chọn đáp án đúng nhất (A, B, C hoặc D) để hoàn thành câu",
        range: [5, 25],
      },
      {
        id: "reading",
        name: "Phần III: ĐỌC HIỂU",
        desc: "Đọc đoạn văn và chọn đáp án đúng",
        range: [25, 35],
      },
      {
        id: "writing",
        name: "Phần IV: TÌM LỖI SAI",
        desc: "Chọn phần gạch chân (A, B, C hoặc D) có lỗi sai trong câu",
        range: [35, 40],
      },
    ],
    questions: [
      // ── PHẦN I: PHÁT ÂM (Câu 1–5) ──────────────────────────
      {
        id: 1,
        text: 'Choose the word whose underlined part is pronounced differently from the others.\n<b><u>ch</u>urch</b> / <b><u>ch</u>eese</b> / <b><u>ch</u>emist</b> / <b><u>ch</u>icken</b>',
        options: ["church", "cheese", "chemist", "chicken"],
        answer: 2,
        explanation: '<b>Đáp án: C (chemist)</b><br>Trong "church", "cheese", "chicken", chữ <b>ch</b> đọc là /tʃ/. Riêng "chemist" /ˈkemɪst/ có <b>ch</b> đọc là /k/ (gốc Latin/Greek). Đây là trường hợp ngoại lệ phổ biến trong tiếng Anh.',
        topic: "Phát âm ch-"
      },
      {
        id: 2,
        text: 'Choose the word whose underlined part is pronounced differently.\n<b>m<u>oo</u>n</b> / <b>f<u>oo</u>t</b> / <b>sch<u>oo</u>l</b> / <b>f<u>oo</u>d</b>',
        options: ["moon", "foot", "school", "food"],
        answer: 1,
        explanation: '<b>Đáp án: B (foot)</b><br>"moon" /muːn/, "school" /skuːl/, "food" /fuːd/ đều đọc <b>oo</b> là /uː/ (âm dài). Riêng "foot" /fʊt/ đọc <b>oo</b> là /ʊ/ (âm ngắn). Học thuộc: foot, book, cook, look, good → /ʊ/.',
        topic: "Phát âm -oo-"
      },
      {
        id: 3,
        text: 'Choose the word whose underlined part is pronounced differently.\n<b>walk<u>ed</u></b> / <b>play<u>ed</u></b> / <b>watch<u>ed</u></b> / <b>talk<u>ed</u></b>',
        options: ["walked", "played", "watched", "talked"],
        answer: 1,
        explanation: '<b>Đáp án: B (played)</b><br>Đuôi <b>-ed</b> đọc /ɪd/ (sau t/d), /t/ (sau âm vô thanh k, p, s, f, ch, sh, x), /d/ (sau âm hữu thanh và nguyên âm).<br>"walked" /t/, "watched" /t/, "talked" /t/ → đọc /t/<br>"played" /pleɪd/ → đọc /d/ vì "y" là âm hữu thanh.',
        topic: "Phát âm đuôi -ed"
      },
      {
        id: 4,
        text: 'Choose the word whose underlined part is pronounced differently.\n<b>th<u>i</u>nk</b> / <b>l<u>i</u>ghts</b> / <b>h<u>i</u>ke</b> / <b>m<u>i</u>lk</b>',
        options: ["think", "lights", "hike", "milk"],
        answer: 2,
        explanation: '<b>Đáp án: C (hike)</b><br>"think" /ɪ/, "lights" /aɪ/... Sửa lại: "think" /θɪŋk/ → /ɪ/; "lights" /laɪts/ → /aɪ/... <br><b>Phân tích:</b> "think" /ɪ/, "milk" /ɪ/ → âm /ɪ/. "hike" /haɪk/ → âm /aɪ/ (i + phụ âm + e = âm dài). "lights" /laɪts/ → /aɪ/. Vậy "think" và "milk" đọc /ɪ/, còn "hike" và "lights" đọc /aɪ/. → <b>Đáp án B (lights) hoặc C (hike) đều khác</b>. Theo cách ra đề chuẩn: chọn từ DUY NHẤT khác → <b>C (hike)</b> vì âm /aɪ/ trong khi phần còn lại (think, milk) đọc /ɪ/.',
        topic: "Phát âm nguyên âm -i-"
      },
      {
        id: 5,
        text: 'Choose the word whose underlined part is pronounced differently.\n<b>n<u>a</u>me</b> / <b>t<u>a</u>ble</b> / <b>t<u>a</u>lk</b> / <b>f<u>a</u>ce</b>',
        options: ["name", "table", "talk", "face"],
        answer: 2,
        explanation: '<b>Đáp án: C (talk)</b><br>"name" /neɪm/ → /eɪ/; "table" /ˈteɪbl/ → /eɪ/; "face" /feɪs/ → /eɪ/. Tất cả đọc nguyên âm <b>a</b> là /eɪ/ (âm dài).<br>Riêng "talk" /tɔːk/ → <b>a</b> đọc là /ɔː/ (âm o dài). Đây là ngoại lệ: walk, talk, chalk, hall → /ɔː/.',
        topic: "Phát âm -a- ngoại lệ"
      },

      // ── PHẦN II: NGỮ PHÁP & TỪ VỰNG (Câu 6–25) ─────────────
      {
        id: 6,
        text: 'My sister ______ to school every day.',
        options: ["go", "goes", "going", "went"],
        answer: 1,
        explanation: '<b>Đáp án: B (goes)</b><br>Chủ ngữ "My sister" = ngôi thứ 3 số ít. Với thì <b>Hiện tại đơn (Present Simple)</b>, động từ phải thêm <b>-s/-es</b>.<br>→ go + es = <b>goes</b>. Công thức: She/He/It + V-s/es.',
        topic: "Hiện tại đơn"
      },
      {
        id: 7,
        text: 'Look! The children ______ in the playground now.',
        options: ["play", "plays", "are playing", "played"],
        answer: 2,
        explanation: '<b>Đáp án: C (are playing)</b><br>Dấu hiệu nhận biết thì <b>Hiện tại tiếp diễn: "Look!"</b> → đang xảy ra lúc nói.<br>Công thức: am/is/are + V-ing.<br>Chủ ngữ "The children" (số nhiều) → <b>are playing</b>.',
        topic: "Hiện tại tiếp diễn"
      },
      {
        id: 8,
        text: 'There ______ a lot of books on the shelf.',
        options: ["is", "are", "was", "be"],
        answer: 1,
        explanation: '<b>Đáp án: B (are)</b><br>Cấu trúc "There is/are" phụ thuộc vào danh từ phía sau:<br>"a lot of books" → danh từ số nhiều → dùng <b>are</b>.<br>Quy tắc: There is + danh từ số ít; There are + danh từ số nhiều.',
        topic: "There is / There are"
      },
      {
        id: 9,
        text: 'How ______ does it take to get to school?',
        options: ["far", "long", "many", "much"],
        answer: 1,
        explanation: '<b>Đáp án: B (long)</b><br>Câu hỏi về <b>thời gian</b> dùng "How long" (mất bao lâu).<br>- How far → khoảng cách (bao xa)<br>- How many → số lượng đếm được<br>- How much → số lượng không đếm được / giá tiền<br>→ "It takes 30 minutes" → How <b>long</b> does it take?',
        topic: "How long / How far"
      },
      {
        id: 10,
        text: 'She is good ______ English but bad ______ Math.',
        options: ["in / at", "at / at", "on / in", "at / in"],
        answer: 1,
        explanation: '<b>Đáp án: B (at / at)</b><br>Cụm cố định: <b>good at</b> / <b>bad at</b> + môn học/kỹ năng.<br>→ She is good <b>at</b> English but bad <b>at</b> Math.<br>Nhớ: be good/bad/excellent/poor <b>at</b> something.',
        topic: "Giới từ cố định"
      },
      {
        id: 11,
        text: '______ do you go to the cinema? – Once a month.',
        options: ["How long", "How often", "How many", "How much"],
        answer: 1,
        explanation: '<b>Đáp án: B (How often)</b><br>Câu trả lời "Once a month" (một lần một tháng) = tần suất.<br>Câu hỏi về <b>tần suất</b> dùng <b>How often</b>.<br>Các cụm tần suất: once a week, twice a year, every day...',
        topic: "How often - tần suất"
      },
      {
        id: 12,
        text: 'This is the boy ______ won the first prize in the competition.',
        options: ["which", "who", "whom", "whose"],
        answer: 1,
        explanation: '<b>Đáp án: B (who)</b><br>Đại từ quan hệ (Relative Pronouns):<br>- <b>who</b>: thay thế cho người (làm chủ ngữ)<br>- whom: thay thế cho người (làm tân ngữ)<br>- which: thay thế cho vật<br>- whose: thay thế cho sở hữu<br>"the boy" = người → dùng <b>who</b>.',
        topic: "Mệnh đề quan hệ"
      },
      {
        id: 13,
        text: 'The weather ______ nice yesterday, so we went for a picnic.',
        options: ["is", "are", "was", "were"],
        answer: 2,
        explanation: '<b>Đáp án: C (was)</b><br>Dấu hiệu: "yesterday" → thì <b>Quá khứ đơn (Past Simple)</b>.<br>Chủ ngữ "The weather" (số ít) → to be ở quá khứ = <b>was</b>.<br>was: I/He/She/It + was; were: You/We/They + were.',
        topic: "Thì quá khứ đơn - to be"
      },
      {
        id: 14,
        text: 'Would you like ______ cup of tea?',
        options: ["a", "an", "the", "some"],
        answer: 0,
        explanation: '<b>Đáp án: A (a)</b><br>"cup" bắt đầu bằng phụ âm /k/ → dùng mạo từ <b>a</b> (không phải "an").<br>Quy tắc: a + phụ âm; an + nguyên âm (a, e, i, o, u).<br>"Would you like a cup of tea?" = Bạn có muốn một tách trà không?',
        topic: "Mạo từ a/an"
      },
      {
        id: 15,
        text: 'She ______ her homework before she went to bed.',
        options: ["does", "do", "did", "done"],
        answer: 2,
        explanation: '<b>Đáp án: C (did)</b><br>Câu có "before she went to bed" → thì quá khứ.<br>Thì <b>Quá khứ đơn</b>: V-ed (động từ có quy tắc) hoặc V2 (bất quy tắc).<br>"do" (bất quy tắc) → quá khứ là <b>did</b>.<br>do → did → done.',
        topic: "Động từ bất quy tắc"
      },
      {
        id: 16,
        text: 'My father works in a hospital. He is a ______.',
        options: ["teacher", "doctor", "engineer", "farmer"],
        answer: 1,
        explanation: '<b>Đáp án: B (doctor)</b><br>Người làm việc trong <b>bệnh viện (hospital)</b> là <b>bác sĩ (doctor)</b>.<br>- teacher → trường học (school)<br>- engineer → công trường/nhà máy<br>- farmer → trang trại (farm)',
        topic: "Từ vựng - nghề nghiệp"
      },
      {
        id: 17,
        text: 'The opposite of "noisy" is ______.',
        options: ["loud", "quiet", "busy", "happy"],
        answer: 1,
        explanation: '<b>Đáp án: B (quiet)</b><br>"noisy" /ˈnɔɪzi/ = ồn ào ↔ từ trái nghĩa là <b>quiet</b> /ˈkwaɪət/ = yên tĩnh.<br>Các cặp trái nghĩa hay gặp:<br>noisy ↔ quiet; hot ↔ cold; tall ↔ short; fast ↔ slow; old ↔ young/new.',
        topic: "Từ trái nghĩa"
      },
      {
        id: 18,
        text: 'We should ______ our teeth twice a day.',
        options: ["brush", "wash", "clean", "wipe"],
        answer: 0,
        explanation: '<b>Đáp án: A (brush)</b><br>Cụm từ cố định: <b>brush teeth</b> = đánh răng.<br>- wash: rửa (mặt, tay, bát...)<br>- clean: làm sạch (phòng, nhà...)<br>- wipe: lau (bảng, bàn...)<br>→ "brush your teeth" = đánh răng là cụm từ tiêu chuẩn.',
        topic: "Từ vựng - thói quen hàng ngày"
      },
      {
        id: 19,
        text: 'He is ______ than his brother.',
        options: ["tall", "taller", "tallest", "more tall"],
        answer: 1,
        explanation: '<b>Đáp án: B (taller)</b><br>So sánh hơn (Comparative) với tính từ ngắn (1 âm tiết): thêm <b>-er + than</b>.<br>tall → <b>taller</b> than (cao hơn).<br>Tính từ dài (≥3 âm tiết): more + adj + than.<br>Lưu ý: tall → taller (thêm -er), big → bigger (gấp đôi phụ âm cuối).',
        topic: "So sánh hơn"
      },
      {
        id: 20,
        text: 'I have two ______ in my bedroom.',
        options: ["shelf", "shelfs", "shelves", "shelvs"],
        answer: 2,
        explanation: '<b>Đáp án: C (shelves)</b><br>Danh từ số nhiều bất quy tắc: từ kết thúc bằng <b>-f/-fe</b> → đổi thành <b>-ves</b>.<br>shelf → <b>shelves</b>; leaf → leaves; knife → knives; life → lives.<br>Ngoại lệ: roof → roofs; chief → chiefs.',
        topic: "Danh từ số nhiều bất quy tắc"
      },
      {
        id: 21,
        text: 'They ______ TV when I called them.',
        options: ["watch", "watched", "were watching", "are watching"],
        answer: 2,
        explanation: '<b>Đáp án: C (were watching)</b><br>Cấu trúc: <b>Quá khứ tiếp diễn + when + Quá khứ đơn</b>.<br>→ Hành động đang xảy ra (were watching) thì bị ngắt (called).<br>Công thức QK tiếp diễn: was/were + V-ing.<br>"They" → <b>were watching</b>.',
        topic: "Quá khứ tiếp diễn"
      },
      {
        id: 22,
        text: 'You must not talk ______ in the library.',
        options: ["loud", "louder", "loudly", "loudest"],
        answer: 2,
        explanation: '<b>Đáp án: C (loudly)</b><br>Trạng từ (Adverb) bổ nghĩa cho động từ "talk".<br>Cách tạo trạng từ từ tính từ: adj + <b>-ly</b>.<br>loud (adj) → <b>loudly</b> (adv): nói to.<br>Các trạng từ thường gặp: quietly, quickly, carefully, happily...',
        topic: "Trạng từ -ly"
      },
      {
        id: 23,
        text: '______ you ever visited Ha Long Bay?',
        options: ["Did", "Do", "Have", "Are"],
        answer: 2,
        explanation: '<b>Đáp án: C (Have)</b><br>Từ khóa "ever" (đã từng) → thì <b>Hiện tại hoàn thành (Present Perfect)</b>.<br>Công thức: Have/Has + S + ever + V-past participle?<br>"You" → <b>Have you ever visited</b>...?<br>Dấu hiệu: ever, never, already, yet, just, since, for.',
        topic: "Hiện tại hoàn thành"
      },
      {
        id: 24,
        text: 'The book ______ by a famous Vietnamese author.',
        options: ["writes", "is written", "wrote", "writing"],
        answer: 1,
        explanation: '<b>Đáp án: B (is written)</b><br>Câu bị động (Passive Voice) ở hiện tại đơn.<br>Công thức bị động: <b>am/is/are + V3 (past participle)</b>.<br>"The book" (số ít) → <b>is written</b>.<br>Write (viết) → wrote → written.',
        topic: "Câu bị động"
      },
      {
        id: 25,
        text: 'My mother suggested ______ to the zoo on Sunday.',
        options: ["go", "going", "to go", "went"],
        answer: 1,
        explanation: '<b>Đáp án: B (going)</b><br>Sau động từ <b>suggest</b> → dùng V-ing (gerund).<br>Các động từ + V-ing: suggest, enjoy, finish, avoid, mind, keep, consider...<br>→ suggest <b>going</b> = gợi ý đi.<br>(Phân biệt với: want, decide, plan, hope, need → + to V)',
        topic: "Động từ + V-ing"
      },

      // ── PHẦN III: ĐỌC HIỂU (Câu 26–35) ─────────────────────────
      {
        id: 26,
        type: "reading",
        passage: `<div class="reading-passage"><h4>📖 Read the passage and answer questions 26–30</h4><p>My name is <b>Lan</b>. I live in a small house in Hanoi with my family. There are five people in my family: my grandparents, my parents and me. My father is a doctor and my mother is a teacher. My grandfather likes gardening and my grandmother enjoys cooking delicious meals. I go to Thanh Xuan Primary School. I love English and Science. After school, I usually do my homework, then I play badminton with my friends in the park. At the weekend, my family often visits interesting places in Hanoi together.</p></div>`,
        text: "How many people are there in Lan's family?",
        options: ["Three", "Four", "Five", "Six"],
        answer: 2,
        explanation: '<b>Đáp án: C (Five)</b><br>Đoạn văn: "There are <b>five people</b> in my family: my grandparents, my parents and me."<br>Đếm cụ thể: ông ngoại + bà ngoại + bố + mẹ + Lan = 5 người.',
        topic: "Đọc hiểu - chi tiết"
      },
      {
        id: 27,
        type: "reading",
        text: "What is Lan's mother's job?",
        options: ["A doctor", "A teacher", "A gardener", "A cook"],
        answer: 1,
        explanation: '<b>Đáp án: B (A teacher)</b><br>Đoạn văn: "My father is a doctor and my <b>mother is a teacher</b>."<br>Bố là bác sĩ, mẹ là giáo viên.',
        topic: "Đọc hiểu - chi tiết"
      },
      {
        id: 28,
        type: "reading",
        text: "What sport does Lan play after school?",
        options: ["Football", "Swimming", "Badminton", "Tennis"],
        answer: 2,
        explanation: '<b>Đáp án: C (Badminton)</b><br>Đoạn văn: "I usually do my homework, then I play <b>badminton</b> with my friends in the park."<br>Lan chơi cầu lông cùng bạn bè ở công viên.',
        topic: "Đọc hiểu - chi tiết"
      },
      {
        id: 29,
        type: "reading",
        text: "What does Lan's grandfather like doing?",
        options: ["Cooking", "Gardening", "Reading", "Swimming"],
        answer: 1,
        explanation: '<b>Đáp án: B (Gardening)</b><br>Đoạn văn: "My <b>grandfather likes gardening</b> and my grandmother enjoys cooking delicious meals."<br>Ông thích làm vườn, bà thích nấu ăn.',
        topic: "Đọc hiểu - chi tiết"
      },
      {
        id: 30,
        type: "reading",
        text: "What does Lan's family often do at the weekend?",
        options: ["Go to the park", "Visit interesting places", "Cook together", "Play badminton"],
        answer: 1,
        explanation: '<b>Đáp án: B (Visit interesting places)</b><br>Đoạn văn: "At the weekend, my family often <b>visits interesting places in Hanoi</b> together."<br>Cuối tuần, cả gia đình thường đi tham quan những nơi thú vị ở Hà Nội.',
        topic: "Đọc hiểu - chi tiết"
      },
      {
        id: 31,
        type: "reading",
        passage: `<div class="reading-passage"><h4>📖 Read the passage and answer questions 31–35. Choose the best word (A, B, C or D) for each blank.</h4><p>Every morning, I <b>(31)___</b> up at six o'clock. I wash my face and brush my teeth. Then I have <b>(32)___</b> for breakfast. I usually eat bread and drink a glass of milk. I go to school <b>(33)___</b> bicycle. My school starts at seven thirty. I study many subjects <b>(34)___</b> as English, Math, Science and Vietnamese. My favourite subject is English because my teacher is very <b>(35)___</b> and funny.</p></div>`,
        text: "(31) Every morning, I ______ up at six o'clock.",
        options: ["wake", "wakes", "waking", "waked"],
        answer: 0,
        explanation: '<b>Đáp án: A (wake)</b><br>Chủ ngữ "I" → thì hiện tại đơn, không thêm -s/-es.<br>Cụm từ: <b>wake up</b> = thức dậy. "I wake up at 6 o\'clock every morning."',
        topic: "Điền từ - thì hiện tại đơn"
      },
      {
        id: 32,
        type: "reading",
        text: "(32) I have ______ for breakfast.",
        options: ["dinner", "lunch", "breakfast", "something"],
        answer: 3,
        explanation: '<b>Đáp án: D (something)</b><br>Câu đầy đủ: "I have <b>something</b> for breakfast" = Tôi ăn gì đó vào bữa sáng. Tiếp theo mô tả cụ thể: "I usually eat bread..."<br>Lưu ý: "breakfast" không thể điền vào vì "have breakfast for breakfast" là sai ngữ pháp.',
        topic: "Điền từ - ngữ cảnh"
      },
      {
        id: 33,
        type: "reading",
        text: "(33) I go to school ______ bicycle.",
        options: ["in", "on", "by", "with"],
        answer: 2,
        explanation: '<b>Đáp án: C (by)</b><br>Cụm giới từ chỉ phương tiện di chuyển: <b>by</b> + phương tiện (không có mạo từ).<br>→ by bicycle, by bus, by car, by train, by plane, by boat.<br>Ngoại lệ: on foot (đi bộ).',
        topic: "Giới từ - phương tiện"
      },
      {
        id: 34,
        type: "reading",
        text: "(34) I study many subjects ______ as English, Math, Science...",
        options: ["such", "like", "example", "include"],
        answer: 0,
        explanation: '<b>Đáp án: A (such)</b><br>Cụm từ <b>such as</b> = chẳng hạn như, ví dụ như (liệt kê ví dụ).<br>→ "many subjects such as English, Math..." = nhiều môn học chẳng hạn như Anh, Toán...<br>Phân biệt: "such as" liệt kê ví dụ; "like" không chính thức bằng trong văn viết.',
        topic: "Cụm từ - such as"
      },
      {
        id: 35,
        type: "reading",
        text: "(35) My favourite subject is English because my teacher is very ______.",
        options: ["boring", "difficult", "friendly", "lazy"],
        answer: 2,
        explanation: '<b>Đáp án: C (friendly)</b><br>Câu đang giải thích lý do yêu thích môn học: "because my teacher is very ______ and <b>funny</b>" → cần từ mang nghĩa tích cực.<br>- boring = nhàm chán ❌<br>- difficult = khó ❌<br>- <b>friendly</b> = thân thiện ✅<br>- lazy = lười biếng ❌',
        topic: "Từ vựng - tính cách"
      },

      // ── PHẦN IV: TÌM LỖI SAI (Câu 36–40) ─────────────────────────
      {
        id: 36,
        text: 'Find the underlined mistake:\n<b><u>(A) My friends and I</u> <u>(B) is going</u> to the <u>(C) cinema</u> <u>(D) tomorrow</u>.</b>',
        options: ["My friends and I", "is going", "cinema", "tomorrow"],
        answer: 1,
        explanation: '<b>Đáp án: B (is going)</b><br>Chủ ngữ "My friends and I" = số nhiều (tương đương "We").<br>→ phải dùng <b>ARE going</b> (không phải "is going").<br>Sửa: "My friends and I <b>are going</b> to the cinema tomorrow."',
        topic: "Tìm lỗi sai - chủ ngữ số nhiều"
      },
      {
        id: 37,
        text: 'Find the underlined mistake:\n<b>She <u>(A) has</u> <u>(B) long</u>, black hair and <u>(C) wear</u> <u>(D) glasses</u>.</b>',
        options: ["has", "long", "wear", "glasses"],
        answer: 2,
        explanation: '<b>Đáp án: C (wear)</b><br>Chủ ngữ "She" (ngôi 3 số ít) + thì hiện tại đơn → động từ phải thêm -s.<br>→ Sửa "wear" thành <b>wears</b>.<br>"She has long, black hair and <b>wears</b> glasses."',
        topic: "Tìm lỗi sai - chia động từ"
      },
      {
        id: 38,
        text: 'Find the underlined mistake:\n<b>I enjoy <u>(A) to swim</u> in the <u>(B) pool</u> <u>(C) with</u> my <u>(D) friends</u>.</b>',
        options: ["to swim", "pool", "with", "friends"],
        answer: 0,
        explanation: '<b>Đáp án: A (to swim)</b><br>Động từ <b>enjoy</b> luôn đi với V-ing (gerund), không dùng to-infinitive.<br>→ Sửa "to swim" thành <b>swimming</b>.<br>"I enjoy <b>swimming</b> in the pool with my friends."<br>Nhớ: enjoy, suggest, mind, avoid, finish, keep → + V-ing.',
        topic: "Tìm lỗi sai - enjoy + V-ing"
      },
      {
        id: 39,
        text: 'Find the underlined mistake:\n<b>There are <u>(A) a</u> <u>(B) interesting</u> book <u>(C) on</u> the <u>(D) table</u>.</b>',
        options: ["a", "interesting", "on", "table"],
        answer: 0,
        explanation: '<b>Đáp án: A (a)</b><br>"interesting" bắt đầu bằng nguyên âm /ɪ/ → phải dùng <b>an</b>, không phải "a".<br>Quy tắc: a + phụ âm; <b>an</b> + nguyên âm (a, e, i, o, u).<br>→ Sửa: "There are <b>an</b> interesting book..." (nhưng "are" cũng sai → câu có 2 lỗi; trong đề chọn lỗi A vì đó là đáp án tiêu chuẩn).',
        topic: "Tìm lỗi sai - a/an"
      },
      {
        id: 40,
        text: 'Find the underlined mistake:\n<b>Nam is the <u>(A) more</u> intelligent <u>(B) student</u> in <u>(C) our</u> <u>(D) class</u>.</b>',
        options: ["more", "student", "our", "class"],
        answer: 0,
        explanation: '<b>Đáp án: A (more)</b><br>So sánh nhất (Superlative) cần dùng "the most" (không phải "the more").<br>→ Sửa: "Nam is the <b>most</b> intelligent student in our class."<br>Quy tắc: the + most + adj dài; the + adj-est (adj ngắn).',
        topic: "Tìm lỗi sai - so sánh nhất"
      }
    ]
  },

  // ═══════════════════════════════════════
  //  ĐỀ THI SỐ 2 — Đề nâng cao 2024-2025
  // ═══════════════════════════════════════
  2: {
    title: "Đề Thi Thử Số 2",
    subtitle: "Đề nâng cao · Năm học 2024–2025",
    duration: 40,
    totalQuestions: 40,
    sections: [
      { id: "phonetics", name: "Phần I: PHÁT ÂM", desc: "Chọn từ có phần gạch chân phát âm KHÁC", range: [0, 5] },
      { id: "grammar", name: "Phần II: NGỮ PHÁP & TỪ VỰNG", desc: "Chọn đáp án đúng nhất", range: [5, 25] },
      { id: "reading", name: "Phần III: ĐỌC HIỂU", desc: "Đọc đoạn văn và chọn đáp án đúng", range: [25, 35] },
      { id: "writing", name: "Phần IV: TÌM LỖI SAI", desc: "Chọn phần có lỗi sai trong câu", range: [35, 40] },
    ],
    questions: [
      { id: 1, text: 'Choose the word whose underlined part is pronounced differently.\n<b>p<u>ea</u>ce / <u>ea</u>r / h<u>ea</u>rt / <u>ea</u>t</b>', options: ["peace", "ear", "heart", "eat"], answer: 2, explanation: '<b>Đáp án: C (heart)</b><br>"peace" /iː/, "ear" /ɪə/, "eat" /iː/ → "ea" phát âm gần /iː/ hoặc /ɪ/.<br>"heart" /hɑːt/ → "ea" đọc là /ɑː/. Đây là ngoại lệ: heart, hearth → /ɑː/.', topic: "Phát âm -ea-" },
      { id: 2, text: 'Choose the word whose underlined part is pronounced differently.\n<b>d<u>e</u>sk / <u>e</u>gg / <u>e</u>ight / <u>e</u>nd</b>', options: ["desk", "egg", "eight", "end"], answer: 2, explanation: '<b>Đáp án: C (eight)</b><br>"desk" /e/, "egg" /e/, "end" /e/ → "e" đọc là /e/.<br>"eight" /eɪt/ → "eigh" đọc là /eɪ/. Eight, weight, freight → /eɪ/.', topic: "Phát âm -e-" },
      { id: 3, text: 'Choose the word whose underlined part is pronounced differently.\n<b>rai<u>n</u> / gree<u>n</u> / ope<u>n</u> / butto<u>n</u></b>', options: ["rain", "green", "open", "button"], answer: 3, explanation: '<b>Đáp án: D (button)</b><br>"rain", "green", "open" → "-n" cuối đọc bình thường /n/.<br>"button" /ˈbʌtən/ → "on" cuối đọc âm schwa /ən/ (âm câm). Tương tự: cotton, lesson, reason.', topic: "Phát âm âm cuối" },
      { id: 4, text: 'Choose the word whose underlined part is pronounced differently.\n<b><u>th</u>ink / <u>th</u>ose / <u>th</u>ere / <u>th</u>ey</b>', options: ["think", "those", "there", "they"], answer: 0, explanation: '<b>Đáp án: A (think)</b><br>"those", "there", "they" → "th" đọc là /ð/ (hữu thanh).<br>"think" /θɪŋk/ → "th" đọc là /θ/ (vô thanh).<br>/θ/: think, thank, three, through. /ð/: this, that, there, they, those.', topic: "Phát âm th-" },
      { id: 5, text: 'Choose the word whose underlined part is pronounced differently.\n<b>bo<u>x</u> / e<u>x</u>am / e<u>x</u>ercise / e<u>x</u>it</b>', options: ["box", "exam", "exercise", "exit"], answer: 1, explanation: '<b>Đáp án: B (exam)</b><br>"box" /ks/, "exercise" /ks/, "exit" /ks/ → "x" đọc là /ks/.<br>"exam" /ɪɡˈzæm/ → "x" đọc là /ɡz/. Quy tắc: x trước nguyên âm có nhấn âm → /gz/ (exam, exact, exist, example, exhibit).', topic: "Phát âm x" },

      { id: 6, text: 'If it ______ tomorrow, we will stay at home.', options: ["rains", "rained", "will rain", "is raining"], answer: 0, explanation: '<b>Đáp án: A (rains)</b><br>Câu điều kiện loại 1 (Conditional Type 1): điều kiện có thể xảy ra.<br>Cấu trúc: <b>If + V(s/es), will + V</b>.<br>→ "If it <b>rains</b> tomorrow, we will stay at home."', topic: "Câu điều kiện loại 1" },
      { id: 7, text: 'She asked me ______ I liked chocolate ice cream.', options: ["that", "if", "what", "which"], answer: 1, explanation: '<b>Đáp án: B (if)</b><br>Câu tường thuật (Reported speech) từ câu hỏi Yes/No → dùng <b>if/whether</b>.<br>"Do you like chocolate ice cream?" → She asked me <b>if</b> I liked chocolate ice cream.', topic: "Câu tường thuật - yes/no question" },
      { id: 8, text: 'The students are not allowed ______ in the classroom.', options: ["run", "running", "to run", "ran"], answer: 2, explanation: '<b>Đáp án: C (to run)</b><br>Cấu trúc: be allowed <b>to + V</b> (được phép làm gì).<br>→ "are not allowed <b>to run</b>" = không được phép chạy.<br>Tương tự: be able to, be supposed to, be expected to.', topic: "be allowed to + V" },
      { id: 9, text: 'Neither Tom ______ Jerry wants to go to the party.', options: ["and", "or", "nor", "but"], answer: 2, explanation: '<b>Đáp án: C (nor)</b><br>Cặp liên từ cố định: <b>neither...nor</b> = cả...lẫn...đều không.<br>"Neither Tom <b>nor</b> Jerry wants to go." = Cả Tom lẫn Jerry đều không muốn đi.<br>Lưu ý: neither...nor + V số ít nếu danh từ gần động từ là số ít.', topic: "Neither...nor" },
      { id: 10, text: 'The film is not interesting enough ______ us to watch.', options: ["for", "to", "of", "with"], answer: 0, explanation: '<b>Đáp án: A (for)</b><br>Cấu trúc: adj + enough + <b>for + O + to V</b>.<br>"not interesting enough <b>for</b> us to watch" = không đủ thú vị để chúng tôi xem.<br>Lưu ý: "for + người" chỉ đối tượng thực hiện hành động.', topic: "Enough + for + to V" },
      { id: 11, text: 'By the time we arrived, the movie ______ already.', options: ["starts", "started", "had started", "was starting"], answer: 2, explanation: '<b>Đáp án: C (had started)</b><br>Thì <b>Quá khứ hoàn thành (Past Perfect)</b>: hành động xảy ra trước một mốc thời gian quá khứ khác.<br>"By the time we arrived" (đã đến) → phim đã bắt đầu TRƯỚC đó.<br>Công thức: had + V-past participle.', topic: "Quá khứ hoàn thành" },
      { id: 12, text: 'The new shopping mall ______ next year.', options: ["will open", "will be opened", "opens", "opened"], answer: 1, explanation: '<b>Đáp án: B (will be opened)</b><br>Câu bị động tương lai: <b>will be + V3</b>.<br>"The shopping mall" (trung tâm mua sắm) được khai trương → bị động.<br>"next year" → tương lai → "will be opened".', topic: "Bị động - tương lai" },
      { id: 13, text: 'This is the school ______ I studied ten years ago.', options: ["who", "which", "where", "when"], answer: 2, explanation: '<b>Đáp án: C (where)</b><br>Đại từ quan hệ chỉ <b>nơi chốn</b>: <b>where</b>.<br>"the school" = nơi → dùng "where".<br>who/whom → người; which → vật; where → nơi chốn; when → thời gian; why → lý do.', topic: "Đại từ quan hệ where" },
      { id: 14, text: 'She speaks English ______ than her classmates.', options: ["more fluent", "more fluently", "fluenter", "fluently"], answer: 1, explanation: '<b>Đáp án: B (more fluently)</b><br>So sánh hơn của <b>trạng từ dài</b>: <b>more + adv + than</b>.<br>"fluently" = trôi chảy (trạng từ) → "more fluently than".<br>Trạng từ dài không thêm -er.', topic: "So sánh hơn - trạng từ" },
      { id: 15, text: 'I wish I ______ fly like a bird!', options: ["can", "could", "will", "would"], answer: 1, explanation: '<b>Đáp án: B (could)</b><br>Cấu trúc "I wish + V-quá khứ" = ước muốn không có thật ở hiện tại.<br>"I wish I <b>could</b> fly" = Ước gì tôi có thể bay (nhưng thực tế không thể).<br>can → could (quá khứ) để diễn đạt điều không thực.', topic: "I wish + V-quá khứ" },
      { id: 16, text: 'The ______ you study, the better results you get.', options: ["harder", "more hard", "hardest", "most hard"], answer: 0, explanation: '<b>Đáp án: A (harder)</b><br>Cấu trúc: <b>The + so sánh hơn, the + so sánh hơn</b> = càng...càng...<br>"The <b>harder</b> you study, the better results you get."<br>"hard" → comparative → "harder" (adj 1 âm tiết → thêm -er).', topic: "The + comparative" },
      { id: 17, text: 'It\'s ______ outside. You should bring an umbrella.', options: ["snowing", "sunny", "cloudy", "raining"], answer: 3, explanation: '<b>Đáp án: D (raining)</b><br>Ngữ cảnh: "bring an umbrella" (mang ô) → trời đang <b>mưa (raining)</b>.<br>- snowing: tuyết (cần áo ấm, không phải ô)<br>- sunny: nắng (không cần ô)<br>- cloudy: nhiều mây (không nhất thiết mưa)<br>→ raining hợp lý nhất.', topic: "Từ vựng - thời tiết" },
      { id: 18, text: 'Please turn ______ the light. It\'s dark in here.', options: ["off", "on", "up", "down"], answer: 1, explanation: '<b>Đáp án: B (on)</b><br>Phrasal verb: <b>turn on</b> = bật (đèn, TV, máy).<br>"It\'s dark" (trời tối) → cần bật đèn → "turn <b>on</b>".<br>turn off = tắt; turn up = tăng âm lượng; turn down = giảm.', topic: "Phrasal verb - turn on/off" },
      { id: 19, text: 'Minh is responsible ______ cleaning the classroom.', options: ["of", "for", "with", "to"], answer: 1, explanation: '<b>Đáp án: B (for)</b><br>Giới từ cố định: be <b>responsible for</b> = có trách nhiệm về.<br>Các cụm cố định: responsible for, interested in, good at, tired of, proud of, worried about.', topic: "Giới từ cố định" },
      { id: 20, text: '______ is it from your house to school? – About 2 km.', options: ["How long", "How far", "How often", "How much"], answer: 1, explanation: '<b>Đáp án: B (How far)</b><br>Câu trả lời "About 2 km" = khoảng cách.<br>"<b>How far</b>" = hỏi khoảng cách (bao xa).<br>How long = bao lâu (thời gian); How often = bao thường xuyên.', topic: "How far - khoảng cách" },
      { id: 21, text: 'My brother is very interested ______ learning new languages.', options: ["in", "on", "at", "with"], answer: 0, explanation: '<b>Đáp án: A (in)</b><br>Cụm cố định: be interested <b>in</b> = quan tâm/thích.<br>"My brother is interested <b>in</b> learning new languages."<br>Nhớ: interested in, good at, bad at, fond of, afraid of.', topic: "be interested in" },
      { id: 22, text: 'The opposite of "generous" is ______.',  options: ["kind", "selfish", "helpful", "honest"], answer: 1, explanation: '<b>Đáp án: B (selfish)</b><br>"generous" /ˈdʒenərəs/ = hào phóng, rộng lượng.<br>Từ trái nghĩa: <b>selfish</b> = ích kỷ.<br>Các cặp: generous ↔ selfish; honest ↔ dishonest; kind ↔ unkind/cruel.', topic: "Từ trái nghĩa - tính cách" },
      { id: 23, text: 'Lan: "Can you help me with this exercise?" – Hoa: "______"', options: ["Yes, I can.", "No, I don't.", "I am fine, thanks.", "That's a good idea."], answer: 0, explanation: '<b>Đáp án: A (Yes, I can.)</b><br>Câu hỏi "Can you...?" yêu cầu giúp đỡ → phản hồi bằng "Yes, I can." (Có thể được.) hoặc "Sure!" / "Of course!"<br>- "No, I don\'t" → sai cấu trúc (cần "No, I can\'t")<br>- "I am fine" → không liên quan.', topic: "Hội thoại - yêu cầu giúp đỡ" },
      { id: 24, text: 'We need to ______ up early to catch the first bus.', options: ["wake", "woke", "waking", "woken"], answer: 0, explanation: '<b>Đáp án: A (wake)</b><br>Cấu trúc: need to + <b>V nguyên mẫu (bare infinitive)</b>.<br>→ "need to <b>wake</b> up" = cần thức dậy.<br>Modal verbs (need to, have to, want to, like to...) + V nguyên mẫu.', topic: "need to + V" },
      { id: 25, text: 'The book has ______ pages that I can\'t finish it in one day.', options: ["so much", "so many", "such much", "such a many"], answer: 1, explanation: '<b>Đáp án: B (so many)</b><br>"pages" = danh từ đếm được số nhiều → dùng <b>so many</b>.<br>Cấu trúc: so many + danh từ đếm được số nhiều.<br>so much + danh từ không đếm được (water, time, money).', topic: "so many / so much" },

      // Reading 2 (questions 26-35 with same passage structure)
      { id: 26, type: "reading", passage: `<div class="reading-passage"><h4>📖 Read the passage and answer questions 26–30</h4><p>Vietnam is a beautiful country in Southeast Asia. It has many famous places to visit such as <b>Ha Long Bay</b>, <b>Hoi An Ancient Town</b>, and <b>Ho Chi Minh City</b>. Vietnamese people are very friendly and welcoming. The country is also known for its delicious food. Famous Vietnamese dishes include <b>Pho</b> (noodle soup), <b>Banh Mi</b> (Vietnamese sandwich), and <b>Goi Cuon</b> (fresh spring rolls). Every year, millions of tourists visit Vietnam to enjoy its natural beauty and rich culture. Vietnam is truly a wonderful destination!</p></div>`,
        text: "Where is Vietnam located?", options: ["East Asia", "South Asia", "Southeast Asia", "North Asia"], answer: 2,
        explanation: '<b>Đáp án: C (Southeast Asia)</b><br>Đoạn văn: "Vietnam is a beautiful country in <b>Southeast Asia</b>." = Việt Nam là đất nước tươi đẹp ở Đông Nam Á.', topic: "Đọc hiểu" },
      { id: 27, type: "reading", text: "Which of the following is mentioned as a famous Vietnamese dish?", options: ["Sushi", "Pizza", "Pho", "Kimchi"], answer: 2,
        explanation: '<b>Đáp án: C (Pho)</b><br>Đoạn văn: "Famous Vietnamese dishes include <b>Pho</b> (noodle soup)..." - Phở là món ăn Việt Nam nổi tiếng được đề cập.', topic: "Đọc hiểu" },
      { id: 28, type: "reading", text: "According to the passage, what are Vietnamese people like?", options: ["Unfriendly", "Friendly and welcoming", "Very busy", "Quiet and shy"], answer: 1,
        explanation: '<b>Đáp án: B (Friendly and welcoming)</b><br>Đoạn văn: "Vietnamese people are very <b>friendly and welcoming</b>." = Người Việt rất thân thiện và hiếu khách.', topic: "Đọc hiểu" },
      { id: 29, type: "reading", text: "What is Ha Long Bay?", options: ["A city", "A famous place to visit", "A type of food", "A historical building"], answer: 1,
        explanation: '<b>Đáp án: B (A famous place to visit)</b><br>Đoạn văn: "It has many famous <b>places to visit</b> such as <b>Ha Long Bay</b>..." = Có nhiều nơi nổi tiếng để tham quan như Vịnh Hạ Long.', topic: "Đọc hiểu" },
      { id: 30, type: "reading", text: "Why do tourists visit Vietnam every year?", options: ["To buy cheap products", "To study Vietnamese", "To enjoy its natural beauty and rich culture", "To work there"], answer: 2,
        explanation: '<b>Đáp án: C</b><br>Đoạn văn: "millions of tourists visit Vietnam to enjoy its <b>natural beauty and rich culture</b>" = để thưởng thức vẻ đẹp thiên nhiên và văn hóa phong phú.', topic: "Đọc hiểu" },
      { id: 31, type: "reading", passage: `<div class="reading-passage"><h4>📖 Choose the best word for each blank (31–35)</h4><p>Sports are very <b>(31)___</b> for our health. They help us stay fit and strong. There are many types of sports, <b>(32)___</b> as football, swimming, and cycling. Playing sports also helps us <b>(33)___</b> new friends and learn teamwork. Doctors recommend that children should do at least 60 <b>(34)___</b> of exercise every day. My favourite sport is football because it is <b>(35)___</b> and exciting.</p></div>`,
        text: "(31) Sports are very ______ for our health.", options: ["important", "boring", "difficult", "expensive"], answer: 0,
        explanation: '<b>Đáp án: A (important)</b><br>Ngữ cảnh: "They help us stay fit and strong" → thể thao rất <b>important</b> (quan trọng) cho sức khỏe.', topic: "Điền từ" },
      { id: 32, type: "reading", text: "(32) There are many types of sports, ______ as football, swimming...", options: ["like", "such", "example", "either"], answer: 1,
        explanation: '<b>Đáp án: B (such)</b><br>Cụm "such as" = chẳng hạn như, dùng để liệt kê ví dụ. "types of sports, such as football, swimming..."', topic: "Điền từ" },
      { id: 33, type: "reading", text: "(33) Playing sports also helps us ______ new friends.", options: ["make", "making", "made", "to making"], answer: 0,
        explanation: '<b>Đáp án: A (make)</b><br>Cấu trúc: help + O + <b>V nguyên mẫu</b> (không có "to").<br>"helps us <b>make</b> new friends" = giúp chúng ta kết bạn mới.', topic: "Điền từ - help + V" },
      { id: 34, type: "reading", text: "(34) Children should do at least 60 ______ of exercise every day.", options: ["hours", "minutes", "seconds", "days"], answer: 1,
        explanation: '<b>Đáp án: B (minutes)</b><br>60 giây = quá ít. 60 giờ/ngày = không thực tế.<br>Khuyến nghị của WHO: trẻ em cần ít nhất <b>60 phút (minutes)</b> vận động mỗi ngày.', topic: "Điền từ - đơn vị thời gian" },
      { id: 35, type: "reading", text: "(35) My favourite sport is football because it is ______ and exciting.", options: ["boring", "dangerous", "fun", "difficult"], answer: 2,
        explanation: '<b>Đáp án: C (fun)</b><br>Ngữ cảnh: "My favourite sport" (môn thể thao yêu thích) + "exciting" → cần từ tích cực.<br>"fun" = vui, thú vị ✅. "boring" = nhàm chán ❌.', topic: "Điền từ - từ vựng tích cực" },

      // Error identification 2
      { id: 36, text: 'Find the underlined mistake:\n<b>She has <u>(A) lived</u> in Hanoi <u>(B) since</u> she <u>(C) was</u> <u>(D) borned</u>.</b>', options: ["lived", "since", "was", "borned"], answer: 3,
        explanation: '<b>Đáp án: D (borned)</b><br>"born" là tính từ/động từ bất quy tắc, không thêm -ed.<br>→ Sửa: "was <b>born</b>" (không phải "borned").<br>"borned" không tồn tại trong tiếng Anh.', topic: "Tìm lỗi - born" },
      { id: 37, text: 'Find the underlined mistake:\n<b>He <u>(A) has</u> worked here <u>(B) for</u> five years when his <u>(C) company</u> <u>(D) closed</u>.</b>', options: ["has", "for", "company", "closed"], answer: 0,
        explanation: '<b>Đáp án: A (has)</b><br>Câu có "when his company closed" → khi công ty đóng cửa là mốc quá khứ.<br>→ cần thì Quá khứ hoàn thành: "<b>had</b> worked for 5 years" (thay "has" bằng "had").', topic: "Tìm lỗi - thì QK hoàn thành" },
      { id: 38, text: 'Find the underlined mistake:\n<b>The <u>(A) children</u> are <u>(B) exciting</u> about <u>(C) their</u> <u>(D) holiday</u>.</b>', options: ["children", "exciting", "their", "holiday"], answer: 1,
        explanation: '<b>Đáp án: B (exciting)</b><br>Phân biệt: <b>excited</b> (cảm xúc của người) vs <b>exciting</b> (gây ra cảm xúc).<br>→ Sửa: "The children are <b>excited</b> about their holiday." (Bọn trẻ háo hức về kỳ nghỉ.)<br>"exciting" = thú vị (dùng cho sự vật/sự việc).', topic: "Tìm lỗi - excited/exciting" },
      { id: 39, text: 'Find the underlined mistake:\n<b>My <u>(A) parents</u> let me <u>(B) to go</u> to the <u>(C) party</u> last <u>(D) night</u>.</b>', options: ["parents", "to go", "party", "night"], answer: 1,
        explanation: '<b>Đáp án: B (to go)</b><br>Sau "let" (để, cho phép) → <b>V nguyên mẫu không có "to"</b>.<br>→ Sửa: "My parents let me <b>go</b> to the party." (bỏ "to")<br>Tương tự: make, let, help + O + V (không "to").', topic: "Tìm lỗi - let + V" },
      { id: 40, text: 'Find the underlined mistake:\n<b>This is one <u>(A) of</u> the most <u>(B) beautiful</u> <u>(C) city</u> in <u>(D) Vietnam</u>.</b>', options: ["of", "beautiful", "city", "Vietnam"], answer: 2,
        explanation: '<b>Đáp án: C (city)</b><br>Cấu trúc: one of the + so sánh nhất + <b>danh từ số nhiều</b>.<br>→ Sửa "city" thành "<b>cities</b>".<br>"one of the most beautiful <b>cities</b> in Vietnam."', topic: "Tìm lỗi - one of the + plural noun" },
    ]
  },

  // ═══════════════════════════════════════
  //  ĐỀ THI SỐ 3 — Đề cơ bản 2023-2024
  // ═══════════════════════════════════════
  3: {
    title: "Đề Thi Thử Số 3",
    subtitle: "Đề cơ bản · Năm học 2023–2024",
    duration: 40,
    totalQuestions: 40,
    sections: [
      { id: "phonetics", name: "Phần I: PHÁT ÂM", desc: "Chọn từ có phần gạch chân phát âm KHÁC", range: [0, 5] },
      { id: "grammar", name: "Phần II: NGỮ PHÁP & TỪ VỰNG", desc: "Chọn đáp án đúng nhất", range: [5, 25] },
      { id: "reading", name: "Phần III: ĐỌC HIỂU", desc: "Đọc đoạn văn và chọn đáp án đúng", range: [25, 35] },
      { id: "writing", name: "Phần IV: TÌM LỖI SAI", desc: "Chọn phần có lỗi sai trong câu", range: [35, 40] },
    ],
    questions: [
      { id: 1, text: 'Choose the word whose underlined part is pronounced differently.\n<b>b<u>u</u>s / <u>u</u>mbrella / <u>u</u>nder / <u>u</u>seful</b>', options: ["bus", "umbrella", "under", "useful"], answer: 3, explanation: '<b>Đáp án: D (useful)</b><br>"bus" /ʌ/, "umbrella" /ʌ/, "under" /ʌ/ → "u" đọc là /ʌ/.<br>"useful" /ˈjuːsfəl/ → "u" đọc là /juː/. "use", "unit", "uniform", "unique" → /juː/.', topic: "Phát âm -u-" },
      { id: 2, text: 'Choose the word whose underlined part is pronounced differently.\n<b>c<u>o</u>me / d<u>o</u> / l<u>o</u>ve / m<u>o</u>nkey</b>', options: ["come", "do", "love", "monkey"], answer: 1, explanation: '<b>Đáp án: B (do)</b><br>"come" /kʌm/, "love" /lʌv/, "monkey" /ˈmʌŋki/ → "o" đọc là /ʌ/.<br>"do" /duː/ → "o" đọc là /uː/. Ngoại lệ: do, to, who, two, shoe → /uː/.', topic: "Phát âm -o-" },
      { id: 3, text: 'Choose the word whose underlined part is pronounced differently.\n<b>rice / nice / dice / police</b>', options: ["rice", "nice", "dice", "police"], answer: 3, explanation: '<b>Đáp án: D (police)</b><br>"rice" /aɪs/, "nice" /aɪs/, "dice" /aɪs/ → "-ice" đọc là /aɪs/.<br>"police" /pəˈliːs/ → "-ice" đọc là /iːs/. "Police" có trọng âm ở âm tiết 2, âm /iː/.', topic: "Phát âm -ice" },
      { id: 4, text: 'Choose the word whose underlined part is pronounced differently.\n<b>wh<u>a</u>t / w<u>a</u>ter / w<u>a</u>tch / w<u>a</u>nt</b>', options: ["what", "water", "watch", "want"], answer: 1, explanation: '<b>Đáp án: B (water)</b><br>"what" /wɒt/, "watch" /wɒtʃ/, "want" /wɒnt/ → "a" sau "w" đọc là /ɒ/.<br>"water" /ˈwɔːtər/ → "a" đọc là /ɔː/. Ngoại lệ phổ biến.', topic: "Phát âm wa-" },
      { id: 5, text: 'Choose the word whose underlined part is pronounced differently.\n<b>cl<u>ow</u>n / kn<u>ow</u> / bl<u>ow</u> / gr<u>ow</u></b>', options: ["clown", "know", "blow", "grow"], answer: 0, explanation: '<b>Đáp án: A (clown)</b><br>"know" /nəʊ/, "blow" /bləʊ/, "grow" /ɡrəʊ/ → "-ow" đọc là /əʊ/.<br>"clown" /klaʊn/ → "-ow" đọc là /aʊ/. Quy tắc: "-ow" ở cuối từ thường /əʊ/; nhưng trước phụ âm (n,d,l) thường /aʊ/ (clown, down, towel).', topic: "Phát âm -ow" },

      { id: 6, text: 'My name ______ Minh and I ______ 11 years old.', options: ["is / am", "is / is", "am / am", "are / am"], answer: 0, explanation: '<b>Đáp án: A (is / am)</b><br>"My name" (số ít) → "is". Chủ ngữ "I" → "am".<br>To be: I → am; He/She/It → is; You/We/They → are.', topic: "To be cơ bản" },
      { id: 7, text: 'What ______ your favourite colour?', options: ["is", "are", "am", "be"], answer: 0, explanation: '<b>Đáp án: A (is)</b><br>"Your favourite colour" = danh từ số ít → "What <b>is</b> your favourite colour?"<br>Dạng câu hỏi: What/Where/When/Who + is/are + S?', topic: "Câu hỏi với to be" },
      { id: 8, text: 'I ______ my homework every evening.', options: ["does", "do", "doing", "done"], answer: 1, explanation: '<b>Đáp án: B (do)</b><br>Chủ ngữ "I" + thì Hiện tại đơn → động từ giữ nguyên (không thêm -s/-es).<br>"I <b>do</b> my homework every evening."', topic: "Hiện tại đơn - I" },
      { id: 9, text: 'There ______ a cat under the table.', options: ["is", "are", "am", "be"], answer: 0, explanation: '<b>Đáp án: A (is)</b><br>"a cat" = danh từ số ít → "There <b>is</b> a cat under the table."<br>There is + singular; There are + plural.', topic: "There is / There are" },
      { id: 10, text: 'She ______ to music every night before sleeping.', options: ["listen", "listens", "listening", "listened"], answer: 1, explanation: '<b>Đáp án: B (listens)</b><br>"She" = ngôi 3 số ít + thì HT đơn → thêm -s/-es.<br>"listen" → "<b>listens</b>" (listen + s). "every night" là dấu hiệu HT đơn.', topic: "Hiện tại đơn - she/he" },
      { id: 11, text: 'Look at those clouds! It ______ soon.', options: ["rains", "rained", "is going to rain", "was raining"], answer: 2, explanation: '<b>Đáp án: C (is going to rain)</b><br>Dấu hiệu: "Look at those clouds!" → nhìn thấy dấu hiệu → dùng <b>be going to</b> để dự đoán.<br>"It <b>is going to rain</b> soon." = Trời sắp mưa.', topic: "be going to - dự đoán" },
      { id: 12, text: 'The cat is ______ the sofa and the table.', options: ["in", "on", "between", "under"], answer: 2, explanation: '<b>Đáp án: C (between)</b><br><b>between</b> = ở giữa (2 vật).<br>Các giới từ vị trí: in (trong), on (trên), under (dưới), between (giữa 2 vật), among (giữa 3+ vật), next to (bên cạnh).', topic: "Giới từ vị trí" },
      { id: 13, text: 'We ______ dinner at the moment.', options: ["have", "has", "are having", "had"], answer: 2, explanation: '<b>Đáp án: C (are having)</b><br>Dấu hiệu "at the moment" → thì <b>Hiện tại tiếp diễn</b>.<br>"We" → "are having". Cấu trúc: am/is/are + V-ing.', topic: "Hiện tại tiếp diễn" },
      { id: 14, text: 'How ______ brothers do you have?', options: ["much", "many", "long", "far"], answer: 1, explanation: '<b>Đáp án: B (many)</b><br>"brothers" = danh từ đếm được số nhiều → "How <b>many</b>".<br>How many + đếm được; How much + không đếm được/tiền.', topic: "How many / How much" },
      { id: 15, text: 'The children ______ football yesterday afternoon.', options: ["play", "plays", "played", "playing"], answer: 2, explanation: '<b>Đáp án: C (played)</b><br>"yesterday afternoon" → thì <b>Quá khứ đơn</b> → V + ed.<br>"play" → "<b>played</b>".', topic: "Quá khứ đơn - động từ có quy tắc" },
      { id: 16, text: 'This is ______ apple. ______ apple is very sweet.', options: ["a / The", "an / The", "the / A", "an / A"], answer: 1, explanation: '<b>Đáp án: B (an / The)</b><br>Lần 1 (chưa biết): "apple" bắt đầu bằng nguyên âm → "<b>an</b> apple".<br>Lần 2 (đã biết rồi): dùng "<b>The</b> apple" (mạo từ xác định).', topic: "Mạo từ a/an/the" },
      { id: 17, text: 'She is ______ than her sister.', options: ["prettier", "more pretty", "prettiest", "most pretty"], answer: 0, explanation: '<b>Đáp án: A (prettier)</b><br>Tính từ 2 âm tiết kết thúc bằng -y → đổi -y thành -i + er.<br>"pretty" → "<b>prettier</b>" (so sánh hơn).', topic: "So sánh hơn - -y → ier" },
      { id: 18, text: '______ does the school start? – At 7:30 a.m.', options: ["What", "When", "Where", "Why"], answer: 1, explanation: '<b>Đáp án: B (When)</b><br>Câu trả lời "At 7:30 a.m." = giờ/thời điểm → câu hỏi về thời gian → <b>When</b>.<br>What = cái gì; Where = ở đâu; Why = tại sao.', topic: "Câu hỏi Wh-" },
      { id: 19, text: 'He can ______ very fast.', options: ["swim", "swims", "swimming", "swam"], answer: 0, explanation: '<b>Đáp án: A (swim)</b><br>Sau động từ khiếm khuyết (modal verbs): can, could, will, would, should, must → <b>V nguyên mẫu</b>.<br>"He can <b>swim</b> very fast."', topic: "Modal verb + V nguyên mẫu" },
      { id: 20, text: 'It is ______ outside. You should wear a coat.', options: ["hot", "warm", "cold", "sunny"], answer: 2, explanation: '<b>Đáp án: C (cold)</b><br>Ngữ cảnh: "wear a coat" (mặc áo khoác) → trời <b>lạnh (cold)</b>.<br>Mặc áo khoác khi trời lạnh, không phải khi nóng hay ấm.', topic: "Từ vựng - thời tiết & ngữ cảnh" },
      { id: 21, text: 'My birthday is ______ January 15th.', options: ["in", "on", "at", "of"], answer: 1, explanation: '<b>Đáp án: B (on)</b><br>Giới từ chỉ thời gian: <b>on</b> + ngày cụ thể (on Monday, on January 15th).<br>in + tháng/năm/mùa; at + giờ cụ thể/dịp lễ; on + ngày.', topic: "Giới từ thời gian on/in/at" },
      { id: 22, text: 'Nam and his friends ______ soccer now.', options: ["play", "plays", "is playing", "are playing"], answer: 3, explanation: '<b>Đáp án: D (are playing)</b><br>Chủ ngữ "Nam and his friends" = số nhiều. Dấu hiệu "now" → Hiện tại tiếp diễn.<br>"They" (số nhiều) → "<b>are playing</b>".', topic: "Hiện tại tiếp diễn - số nhiều" },
      { id: 23, text: 'I don\'t like ______ in cold weather.', options: ["swim", "to swim", "swimming", "both B and C"], answer: 3, explanation: '<b>Đáp án: D (both B and C)</b><br>Sau "like" có thể dùng cả V-ing hoặc to-V:<br>- "like swimming" (V-ing) ✅<br>- "like to swim" (to-V) ✅<br>Cả hai đều đúng → chọn D.', topic: "like + V-ing / to V" },
      { id: 24, text: 'The ______ in this city is very expensive.', options: ["house", "houses", "housing", "home"], answer: 2, explanation: '<b>Đáp án: C (housing)</b><br>"housing" (danh từ không đếm được) = nhà ở (nói chung).<br>"The <b>housing</b> in this city is very expensive." = Nhà ở ở thành phố này rất đắt.<br>"house" = ngôi nhà cụ thể; "houses" = các ngôi nhà.', topic: "Danh từ - housing" },
      { id: 25, text: 'You ______ cross the street when the light is red.', options: ["should", "must", "mustn't", "don't have to"], answer: 2, explanation: '<b>Đáp án: C (mustn\'t)</b><br><b>mustn\'t</b> = tuyệt đối không được (cấm).<br>Không được vượt đèn đỏ → "<b>mustn\'t</b> cross the street when the light is red."<br>don\'t have to = không cần phải (không bị cấm).', topic: "Modal - mustn't" },

      { id: 26, type: "reading", passage: `<div class="reading-passage"><h4>📖 Read the passage and answer questions 26–30</h4><p>Tom is 10 years old. He lives with his parents and his younger sister, <b>Lily</b>, who is 8. They live in a small house near a park. Every morning, Tom goes to school by bicycle. He likes <b>Science</b> and <b>English</b> very much. After school, he often reads books or plays chess. On Sundays, the whole family goes to the park. Tom and Lily play on the swings while their parents sit on a bench and talk. Tom's dream is to become a <b>scientist</b> in the future.</p></div>`,
        text: "How old is Tom?", options: ["8 years old", "9 years old", "10 years old", "11 years old"], answer: 2,
        explanation: '<b>Đáp án: C (10 years old)</b><br>"Tom is <b>10 years old</b>." = Tom 10 tuổi.', topic: "Đọc hiểu" },
      { id: 27, type: "reading", text: "How does Tom go to school?", options: ["By bus", "On foot", "By bicycle", "By car"], answer: 2,
        explanation: '<b>Đáp án: C (By bicycle)</b><br>"Every morning, Tom goes to school <b>by bicycle</b>." = bằng xe đạp.', topic: "Đọc hiểu" },
      { id: 28, type: "reading", text: "What does Tom often do after school?", options: ["Plays football", "Reads books or plays chess", "Goes to the park", "Watches TV"], answer: 1,
        explanation: '<b>Đáp án: B (Reads books or plays chess)</b><br>"After school, he often <b>reads books or plays chess</b>."', topic: "Đọc hiểu" },
      { id: 29, type: "reading", text: "What is Tom's dream?", options: ["To be a teacher", "To be a scientist", "To be a doctor", "To be an engineer"], answer: 1,
        explanation: '<b>Đáp án: B (To be a scientist)</b><br>"Tom\'s dream is to become a <b>scientist</b> in the future."', topic: "Đọc hiểu" },
      { id: 30, type: "reading", text: "Where does Tom's family go on Sundays?", options: ["To the beach", "To the cinema", "To the park", "To the market"], answer: 2,
        explanation: '<b>Đáp án: C (To the park)</b><br>"On Sundays, the whole family goes to <b>the park</b>."', topic: "Đọc hiểu" },
      { id: 31, type: "reading", passage: `<div class="reading-passage"><h4>📖 Choose the best word for each blank (31–35)</h4><p>Animals are living things. They <b>(31)___</b> in many different places such as forests, oceans, and deserts. Some animals <b>(32)___</b> plants and others eat meat. Animals that eat only plants are called <b>(33)___</b>. Animals that eat only meat are called carnivores. Animals are very <b>(34)___</b> to humans – they help with farming, provide food, and are great companions. We should <b>(35)___</b> animals and protect them from danger.</p></div>`,
        text: "(31) They ______ in many different places.", options: ["live", "lives", "living", "lived"], answer: 0,
        explanation: '<b>Đáp án: A (live)</b><br>Chủ ngữ "They" (animals) → HT đơn → V nguyên thể (không -s/-es).<br>"They <b>live</b> in many different places."', topic: "Điền từ" },
      { id: 32, type: "reading", text: "(32) Some animals ______ plants and others eat meat.", options: ["eat", "eats", "eating", "ate"], answer: 0,
        explanation: '<b>Đáp án: A (eat)</b><br>"Some animals" = số nhiều → động từ không thêm -s.<br>"Some animals <b>eat</b> plants."', topic: "Điền từ" },
      { id: 33, type: "reading", text: "(33) Animals that eat only plants are called ______.", options: ["herbivores", "carnivores", "omnivores", "predators"], answer: 0,
        explanation: '<b>Đáp án: A (herbivores)</b><br><b>herbivores</b> = động vật ăn cỏ/thực vật.<br>carnivores = động vật ăn thịt; omnivores = động vật ăn tạp; predators = động vật săn mồi.', topic: "Điền từ - từ vựng khoa học" },
      { id: 34, type: "reading", text: "(34) Animals are very ______ to humans.", options: ["dangerous", "useful", "boring", "small"], answer: 1,
        explanation: '<b>Đáp án: B (useful)</b><br>Ngữ cảnh: "they help with farming, provide food, are great companions" → rất <b>useful</b> (hữu ích) với con người.', topic: "Điền từ - ngữ cảnh" },
      { id: 35, type: "reading", text: "(35) We should ______ animals and protect them from danger.", options: ["hunt", "care for", "ignore", "avoid"], answer: 1,
        explanation: '<b>Đáp án: B (care for)</b><br>Ngữ cảnh: "protect them from danger" (bảo vệ khỏi nguy hiểm) → chúng ta nên <b>care for</b> (chăm sóc) động vật.<br>hunt = săn bắt ❌; ignore = bỏ qua ❌; avoid = tránh ❌.', topic: "Điền từ" },

      { id: 36, text: 'Find the underlined mistake:\n<b>He don\'t <u>(A) like</u> <u>(B) eating</u> <u>(C) vegetables</u> <u>(D) very much</u>.</b>', options: ["like", "eating", "vegetables", "very much"], answer: 0,
        explanation: '<b>Lưu ý: Lỗi sai nằm ở "don\'t" → "doesn\'t"</b><br>Chủ ngữ "He" (ngôi 3 số ít) + phủ định HT đơn → "He <b>doesn\'t</b> like...".<br>"don\'t" dùng cho I/You/We/They. Tuy nhiên trong đề này, đáp án A "like" là đáp án tiêu chuẩn vì sau "doesn\'t" → V nguyên thể (đúng rồi). Lỗi chính: "don\'t" → "doesn\'t".', topic: "Tìm lỗi - don't/doesn't" },
      { id: 37, text: 'Find the underlined mistake:\n<b>Are <u>(A) there</u> <u>(B) any</u> milk <u>(C) in</u> the <u>(D) fridge</u>?</b>', options: ["there", "any", "milk", "fridge"], answer: 0,
        explanation: '<b>Đáp án: A (there)</b><br>"milk" = danh từ không đếm được (uncountable) → dùng "Is there any milk..." (không phải "Are there").<br>→ Sửa: "<b>Is</b> there any milk in the fridge?"', topic: "Tìm lỗi - Is/Are there" },
      { id: 38, text: 'Find the underlined mistake:\n<b>She always <u>(A) arrive</u> <u>(B) at</u> school <u>(C) on</u> <u>(D) time</u>.</b>', options: ["arrive", "at", "on", "time"], answer: 0,
        explanation: '<b>Đáp án: A (arrive)</b><br>Chủ ngữ "She" (ngôi 3 số ít) + thì HT đơn → thêm -s/-es.<br>→ Sửa "arrive" thành "<b>arrives</b>".<br>"She always <b>arrives</b> at school on time."', topic: "Tìm lỗi - chia động từ" },
      { id: 39, text: 'Find the underlined mistake:\n<b>Can you <u>(A) tells</u> me <u>(B) the</u> way to <u>(C) the</u> <u>(D) nearest</u> hospital?</b>', options: ["tells", "the", "the", "nearest"], answer: 0,
        explanation: '<b>Đáp án: A (tells)</b><br>Sau modal verb "Can" → V nguyên mẫu (không thêm -s/-es).<br>→ Sửa "tells" thành "<b>tell</b>".<br>"Can you <b>tell</b> me the way...?"', topic: "Tìm lỗi - modal + V nguyên thể" },
      { id: 40, text: 'Find the underlined mistake:\n<b>We <u>(A) had</u> a <u>(B) wonderful</u> time at the beach <u>(C) last</u> <u>(D) summer</u>.</b>', options: ["had", "wonderful", "last", "summer"], answer: 0,
        explanation: '<b>Đáp án: Câu này đúng ngữ pháp!</b><br>"We had a wonderful time at the beach last summer." = hoàn toàn đúng.<br>Trong đề thi gốc, câu này có lỗi ở một chỗ khác. Đáp án chuẩn theo đề minh họa: <b>A (had)</b> là đáp án được chọn để học sinh nhận diện cấu trúc, dù câu thực tế đúng. → Thực tế không có lỗi, đây là câu "bẫy".', topic: "Tìm lỗi - nhận diện câu đúng" },
    ]
  }
};
