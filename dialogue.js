window.dialogueData = [
  {
    "id": "start",
    "speaker": "旁白",
    "text": "在一個普通的下午，{player}只是旅行路過，突然被兩位少女捲入了爭吵",
    "xiSprite": "idle",
    "qianSprite": "idle"
  },
  {
    "id": "intro_xi",
    "speaker": "溪湖醬",
    "text": "嗨！{player}！要不要來溪湖鎮走走？這裡有最溫暖的鄉土風情、香噴噴的羊肉爐，還有全台僅存的糖鐵蒸汽火車喔！",
    "xiSprite": "active-talk",
    "qianSprite": "dim"
  },
  {
    "id": "intro_qian",
    "speaker": "前鎮醬",
    "text": "切，大老遠出門旅行，當然要來我們前鎮區啊！高聳的高雄總圖、夢幻的高雄之眼摩天輪，還有最先進的輕軌捷運，這才是頂級享受！",
    "xiSprite": "dim",
    "qianSprite": "active-talk"
  },
  {
    "id": "intro_duel",
    "speaker": "旁白",
    "text": "兩位性格與風格截然不同的少女，希望你做出抉擇。對決正式開始！接下來將有 20 題的考驗，有些是想了解你的喜好，有些是考驗你對他們的了解。",
    "xiSprite": "idle",
    "qianSprite": "idle"
  },

  {
    "id": "q1_pref_xi",
    "speaker": "溪湖醬",
    "text": "第一題！美食對決！我們溪湖有頂級羊肉爐，絕對滿足你的味蕾！",
    "xiSprite": "active-talk",
    "qianSprite": "dim"
  },
  {
    "id": "q1_pref_qian",
    "speaker": "前鎮醬",
    "text": "哼，我們前鎮擁有全台最大的前鎮漁港，現撈的生猛海鮮才是極致饗宴！",
    "xiSprite": "dim",
    "qianSprite": "active-talk"
  },
  {
    "id": "q1_pref_choice",
    "speaker": "決策時間",
    "text": "你的胃更嚮往哪一邊？",
    "xiSprite": "idle",
    "qianSprite": "idle",
    "choices": [
      { "text": "溪湖羊肉爐", "points": { "xihu": 10, "qianzhen": -5 }, "next": "q1_xi_quiz" },
      { "text": "前鎮生猛海鮮", "points": { "xihu": -5, "qianzhen": 10 }, "next": "q1_xi_quiz" },
      { "text": "異鄉軒加價不加量的黃金炒飯", "points": { "xihu": -10, "qianzhen": -10 }, "next": "q1_xi_quiz" }
    ]
  },

  {
    "id": "q1_xi_quiz",
    "speaker": "溪湖醬",
    "text": "嘿嘿，順便考考你！溪湖鎮最著名的水果特產，被譽為「黑紫色的寶石」是什麼呢？",
    "xiSprite": "active-talk",
    "qianSprite": "dim",
    "choices": [
      { "text": "巨峰葡萄", "points": { "xihu": 5, "qianzhen": 0 }, "next": "q2_pref_xi" },
      { "text": "大湖草莓", "points": { "xihu": -10, "qianzhen": 0 }, "next": "q2_pref_xi" },
      { "text": "金鑽鳳梨", "points": { "xihu": -10, "qianzhen": 0 }, "next": "q2_pref_xi" },
      { "text": "愛文芒果", "points": { "xihu": -10, "qianzhen": 0 }, "next": "q2_pref_xi" }
    ]
  },

  {
    "id": "q2_pref_xi",
    "speaker": "前鎮醬",
    "text": "接下來是交通方面，我們有除了有輕軌，還有捷運！而溪湖是大家說的\"交通沙漠\"，這題我贏定了!哈哈哈",
    "xiSprite": "dim",
    "qianSprite": "active-talk"
  },
  {
    "id": "q2_pref_qian",
    "speaker": "溪湖醬",
    "text": "哼，選舉快到了，候選人都在喊\"捷運到溪湖\"，溪湖很快就會有捷運了!",
    "xiSprite": "active-talk",
    "qianSprite": "dim"
  },
  {
    "id": "q2_pref_choice",
    "speaker": "決策時間",
    "text": "你渴望哪種移動方式？",
    "xiSprite": "idle",
    "qianSprite": "idle",
    "choices": [
      { "text": "捷運到溪湖!", "points": { "xihu": 10, "qianzhen": -5 }, "next": "q1_qian_quiz" },
      { "text": "搭乘現代輕軌悠遊港都", "points": { "xihu": -5, "qianzhen": 10 }, "next": "q1_qian_quiz" },
      { "text": "我的私人火箭", "points": { "xihu": -10, "qianzhen": -10 }, "next": "q1_qian_quiz" },
    ]
  },

  {
    "id": "q1_qian_quiz",
    "speaker": "前鎮醬",
    "text": "換我出題了！前鎮區擁有一座全台灣漁獲量最大、最重要的遠洋漁港，它的名字是？",
    "xiSprite": "dim",
    "qianSprite": "active-talk",
    "choices": [
      { "text": "前鎮漁港", "points": { "xihu": 0, "qianzhen": 5 }, "next": "q3_pref_xi" },
      { "text": "梧棲漁港", "points": { "xihu": 0, "qianzhen": -10 }, "next": "q3_pref_xi" },
      { "text": "東港漁港", "points": { "xihu": 0, "qianzhen": -10 }, "next": "q3_pref_xi" },
      { "text": "東石漁港", "points": { "xihu": 0, "qianzhen": -10 }, "next": "q3_pref_xi" }
    ]
  },

  {
    "id": "q3_pref_xi",
    "speaker": "溪湖醬",
    "text": "想買東西？當然要去傳統市場跟老街啊！感受最真實的人情味與熱情的叫賣聲！",
    "xiSprite": "active-talk",
    "qianSprite": "dim"
  },
  {
    "id": "q3_pref_qian",
    "speaker": "前鎮醬",
    "text": "SKM Park 和夢時代購物中心才是王道！各大國際精品與舒適的購物環境任你挑選！",
    "xiSprite": "dim",
    "qianSprite": "active-talk"
  },
  {
    "id": "q3_pref_choice",
    "speaker": "決策時間",
    "text": "你的購物偏好是？",
    "xiSprite": "idle",
    "qianSprite": "idle",
    "choices": [
      { "text": "充滿人情味的傳統市場", "points": { "xihu": 10, "qianzhen": -5 }, "next": "q2_xi_quiz" },
      { "text": "舒適高檔的大型購物中心", "points": { "xihu": -5, "qianzhen": 10 }, "next": "q2_xi_quiz" },
      { "text": "美國街邊零元購", "points": { "xihu": -10, "qianzhen": -10 }, "next": "q2_xi_quiz" },
    ]
  },

  {
    "id": "q2_xi_quiz",
    "speaker": "溪湖醬",
    "text": "那麼，溪湖糖廠以前用來運送甘蔗，現在變成超受歡迎的觀光用途火車，它叫做什麼？",
    "xiSprite": "active-talk",
    "qianSprite": "dim",
    "choices": [
      { "text": "復興號", "points": { "xihu": -10, "qianzhen": 0 }, "next": "q4_pref_xi" },
      { "text": "五分車", "points": { "xihu": 5, "qianzhen": 0 }, "next": "q4_pref_xi" },
      { "text": "森林小火車", "points": { "xihu": -10, "qianzhen": 0 }, "next": "q4_pref_xi" },
      { "text": "湯瑪士小火車", "points": { "xihu": -10, "qianzhen": 0 }, "next": "q4_pref_xi" },
    ]
  },

  {
    "id": "q4_pref_xi",
    "speaker": "溪湖醬",
    "text": "住宿的話，選擇被稻田環繞的安靜民宿吧。晚上聽著蛙鳴蟲叫入睡，遠離一切煩惱。",
    "xiSprite": "active-talk",
    "qianSprite": "dim"
  },
  {
    "id": "q4_pref_qian",
    "speaker": "前鎮醬",
    "text": "出來玩當然要住有著高空無敵海景的高級飯店！看著底下的城市霓虹入睡才夠浪漫！",
    "xiSprite": "dim",
    "qianSprite": "active-talk"
  },
  {
    "id": "q4_pref_choice",
    "speaker": "決策時間",
    "text": "今晚你想在哪裡落腳？",
    "xiSprite": "idle",
    "qianSprite": "idle",
    "choices": [
      { "text": "寧靜且親近自然的田園民宿", "points": { "xihu": 10, "qianzhen": -5 }, "next": "q2_qian_quiz" },
      { "text": "奢華且視野極佳的都會飯店", "points": { "xihu": -5, "qianzhen": 10 }, "next": "q2_qian_quiz" },
      { "text": "嘉大昆蟲館", "points": { "xihu": -10, "qianzhen": -10 }, "next": "q2_qian_quiz" },
    ]
  },

  {
    "id": "q2_qian_quiz",
    "speaker": "前鎮醬 ",
    "text": "我的問題來囉！位於前鎮區的夢時代購物中心，屋頂上有一座非常有名的觀景設施，請問是？",
    "xiSprite": "dim",
    "qianSprite": "active-talk",
    "choices": [
      { "text": "空中旋轉餐廳", "points": { "xihu": 0, "qianzhen": -10 }, "next": "q5_pref_xi" },
      { "text": "高雄迪士尼樂園", "points": { "xihu": 0, "qianzhen": -10 }, "next": "q5_pref_xi" },
      { "text": "高雄之眼摩天輪", "points": { "xihu": 0, "qianzhen": 5 }, "next": "q5_pref_xi" },
      { "text": "高雄愛情摩天輪", "points": { "xihu": 0, "qianzhen": -10 }, "next": "q5_pref_xi" },
    ]
  },

  {
    "id": "q5_pref_xi",
    "speaker": "溪湖醬",
    "text": "休閒活動最推薦去沐卉農場親近自然，或者親自體驗採摘葡萄的農家樂趣！",
    "xiSprite": "active-talk",
    "qianSprite": "dim"
  },
  {
    "id": "q5_pref_qian",
    "speaker": "前鎮醬",
    "text": "不如來高雄展覽館看國際大展，或是去高雄市立圖書館總館享受充滿設計感的藝文氣息！",
    "xiSprite": "dim",
    "qianSprite": "active-talk"
  },
  {
    "id": "q5_pref_choice",
    "speaker": "決策時間",
    "text": "理想的午後時光是？",
    "xiSprite": "idle",
    "qianSprite": "idle",
    "choices": [
      { "text": "親自手作、體驗農村生態", "points": { "xihu": 10, "qianzhen": -5 }, "next": "q3_xi_quiz" },
      { "text": "吹冷氣看展覽、享受藝文", "points": { "xihu": -5, "qianzhen": 10 }, "next": "q3_xi_quiz" },
      { "text": "午後時光?你說的是...(消音)(沒有接廣告)", "points": { "xihu": -10, "qianzhen": -10 }, "next": "q3_xi_quiz" }
    ]
  },

  {
    "id": "q3_xi_quiz",
    "speaker": "溪湖醬",
    "text": "溪湖鎮在彰化縣的地理位置非常特別，你知道它在哪裡嗎？",
    "xiSprite": "active-talk",
    "qianSprite": "dim",
    "choices": [
      { "text": "濱海的最西端", "points": { "xihu": -10, "qianzhen": 0 }, "next": "q6_pref_xi" },
      { "text": "最高的八卦山脈", "points": { "xihu": -10, "qianzhen": 0 }, "next": "q6_pref_xi" },
      { "text": "彰化平原的幾何中心", "points": { "xihu": 5, "qianzhen": 0 }, "next": "q6_pref_xi" },
      { "text": "一個鳥不生蛋的地方", "points": { "xihu": -10, "qianzhen": 0 }, "next": "q6_pref_xi" }
    ]
  },

  {
    "id": "q6_pref_xi",
    "speaker": "溪湖醬",
    "text": "這裡有百年的糖廠文化，古老的煙囪與斑駁的磚牆，每一處都寫滿了台灣早期的甜蜜歷史！",
    "xiSprite": "active-talk",
    "qianSprite": "dim"
  },
  {
    "id": "q6_pref_qian",
    "speaker": "前鎮醬",
    "text": "從重工業轉型到高科技會展產業，亞洲新灣區是見證台灣經濟奇蹟與現代化轉型的縮影！",
    "xiSprite": "dim",
    "qianSprite": "active-talk"
  },
  {
    "id": "q6_pref_choice",
    "speaker": "決策時間",
    "text": "你對哪種歷史脈絡更有興趣？",
    "xiSprite": "idle",
    "qianSprite": "idle",
    "choices": [
      { "text": "充滿懷舊氣息的糖業歷史", "points": { "xihu": 10, "qianzhen": -5 }, "next": "q3_qian_quiz" },
      { "text": "見證都市轉型的現代化發展", "points": { "xihu": -5, "qianzhen": 10 }, "next": "q3_qian_quiz" },
      { "text": "比爾蓋茲被告的故事", "points": { "xihu": -10, "qianzhen": -10 }, "next": "q3_qian_quiz" }
    ]
  },

  {
    "id": "q3_qian_quiz",
    "speaker": "前鎮醬",
    "text": "行駛在前鎮區，有著超美綠色草皮軌道，且不需要架設高架橋的現代交通工具是？",
    "xiSprite": "dim",
    "qianSprite": "active-talk",
    "choices": [
      { "text": "高雄環狀輕軌", "points": { "xihu": 0, "qianzhen": 5 }, "next": "q7_pref_xi" },
      { "text": "地下捷運", "points": { "xihu": 0, "qianzhen": -10 }, "next": "q7_pref_xi" },
      { "text": "高空纜車", "points": { "xihu": 0, "qianzhen": -10 }, "next": "q7_pref_xi" },
      { "text": "愛情摩天輪", "points": { "xihu": 0, "qianzhen": -10 }, "next": "q7_pref_xi" },

    ]
  },

  {
    "id": "q7_pref_xi",
    "speaker": "溪湖醬",
    "text": "站在彰化平原中心，看著一望無際的綠色稻浪與藍天白雲，這種開闊感是最療癒的！",
    "xiSprite": "active-talk",
    "qianSprite": "dim"
  },
  {
    "id": "q7_pref_qian",
    "speaker": "前鎮醬",
    "text": "摩天大樓林立的天際線，加上高雄港的無敵海景與大船入港，這才是極致的視覺震撼！",
    "xiSprite": "dim",
    "qianSprite": "active-talk"
  },
  {
    "id": "q7_pref_choice",
    "speaker": "決策時間",
    "text": "哪一種風景最能打動你？",
    "xiSprite": "idle",
    "qianSprite": "idle",
    "choices": [
      { "text": "一望無際的平原與自然田野", "points": { "xihu": 10, "qianzhen": -5 }, "next": "q4_xi_quiz" },
      { "text": "壯觀的都會天際線與海港", "points": { "xihu": -5, "qianzhen": 10 }, "next": "q4_xi_quiz" },
      { "text": "你這背景太假了", "points": { "xihu": -10, "qianzhen": -10 }, "next": "q4_xi_quiz" }

    ]
  },

  {
    "id": "q4_xi_quiz",
    "speaker": "溪湖醬",
    "text": "這題送分題！到了冬天，大家來溪湖一定、一定要吃的滋補鍋物是什麼？",
    "xiSprite": "active-talk",
    "qianSprite": "dim",
    "choices": [
      { "text": "溪湖羊肉爐", "points": { "xihu": 5, "qianzhen": 0 }, "next": "q8_pref_xi" },
      { "text": "新竹米粉", "points": { "xihu": -10, "qianzhen": 0 }, "next": "q8_pref_xi" },
      { "text": "嘉義火雞肉飯", "points": { "xihu": -10, "qianzhen": 0 }, "next": "q8_pref_xi" },
      { "text": "台南牛肉湯", "points": { "xihu": -10, "qianzhen": -10 }, "next": "q8_pref_xi" }
    ]
  },

  {
    "id": "q8_pref_xi",
    "speaker": "溪湖醬",
    "text": "回家前帶些古早味的糖廠枝仔冰跟新鮮農產品，長輩收到保證笑得合不攏嘴！",
    "xiSprite": "active-talk",
    "qianSprite": "dim"
  },
  {
    "id": "q8_pref_qian",
    "speaker": "前鎮醬",
    "text": "在百貨公司挑選包裝精緻的法式甜點或精品特產，送禮才夠有面子！",
    "xiSprite": "dim",
    "qianSprite": "active-talk"
  },
  {
    "id": "q8_pref_choice",
    "speaker": "決策時間",
    "text": "你會選擇什麼樣的伴手禮？",
    "xiSprite": "idle",
    "qianSprite": "idle",
    "choices": [
      { "text": "充滿誠意的新鮮特產", "points": { "xihu": 10, "qianzhen": -5 }, "next": "q4_qian_quiz" },
      { "text": "精緻高質感的伴手禮", "points": { "xihu": -5, "qianzhen": 10 }, "next": "q4_qian_quiz" },
      { "text": "50萬馬克的麵包", "points": { "xihu": -10, "qianzhen": -10 }, "next": "q4_qian_quiz" },
    ]
  },

  {
    "id": "q4_qian_quiz",
    "speaker": "前鎮醬",
    "text": "前鎮區近年來積極轉型，包含了高雄展覽館、總圖書館等重大建設的核心區域稱為什麼？",
    "xiSprite": "dim",
    "qianSprite": "active-talk",
    "choices": [
      { "text": "亞洲新灣區", "points": { "xihu": 0, "qianzhen": 5 }, "next": "q9_pref_xi" },
      { "text": "信義計畫區", "points": { "xihu": 0, "qianzhen": -10 }, "next": "q9_pref_xi" },
      { "text": "水湳經貿園區", "points": { "xihu": 0, "qianzhen": -10 }, "next": "q9_pref_xi" },
      { "text": "緬北詐騙中心", "points": { "xihu": 0, "qianzhen": 0 }, "next": "q9_pref_xi" }

    ]
  },

  {
    "id": "q9_pref_xi",
    "speaker": "溪湖醬",
    "text": "我們有最熱鬧的宮廟慶典與陣頭，體驗最道地、最澎湃的台灣民俗生命力！",
    "xiSprite": "active-talk",
    "qianSprite": "dim"
  },
  {
    "id": "q9_pref_qian",
    "speaker": "前鎮醬",
    "text": "來夢時代參加萬人跨年晚會跟浪漫的煙火秀，感受不夜城的時尚狂歡！",
    "xiSprite": "dim",
    "qianSprite": "active-talk"
  },
  {
    "id": "q9_pref_choice",
    "speaker": "決策時間",
    "text": "你比較喜歡哪種熱鬧氛圍？",
    "xiSprite": "idle",
    "qianSprite": "idle",
    "choices": [
      { "text": "傳統道地的民俗宮廟慶典", "points": { "xihu": 10, "qianzhen": -5 }, "next": "q5_xi_quiz" },
      { "text": "萬人狂歡的現代大型演唱會", "points": { "xihu": -5, "qianzhen": 10 }, "next": "q5_xi_quiz" },
      { "text": "晚上一個人自己看鬼片", "points": { "xihu": -10, "qianzhen": -10 }, "next": "q5_xi_quiz" }
    ]
  },

  {
    "id": "q5_xi_quiz",
    "speaker": "溪湖醬",
    "text": "你知道溪湖早期的發展歷史與哪一個產業的關係最密切？",
    "xiSprite": "active-talk",
    "qianSprite": "dim",
    "choices": [
      { "text": "半導體產業", "points": { "xihu": -10, "qianzhen": 0 }, "next": "q10_pref_xi" },
      { "text": "採礦業", "points": { "xihu": -10, "qianzhen": 0 }, "next": "q10_pref_xi" },
      { "text": "製糖業", "points": { "xihu": 5, "qianzhen": 0 }, "next": "q10_pref_xi" },
      { "text": "讀大葉，好就業", "points": { "xihu": -10, "qianzhen": -10 }, "next": "q10_pref_xi" }
    ]
  },

  {
    "id": "q10_pref_xi",
    "speaker": "溪湖醬",
    "text": "旅行就是要放慢腳步，沒有目的地漫步在鄉間小路，讓身心靈徹底深呼吸。",
    "xiSprite": "active-talk",
    "qianSprite": "dim"
  },
  {
    "id": "q10_pref_qian",
    "speaker": "前鎮醬",
    "text": "行程當然要排滿滿！打卡各大知名景點、購物血拼，把每一分鐘都過得超充實！",
    "xiSprite": "dim",
    "qianSprite": "active-talk"
  },
  {
    "id": "q10_pref_choice",
    "speaker": "決策時間",
    "text": "你的旅行步調是？",
    "xiSprite": "idle",
    "qianSprite": "idle",
    "choices": [
      { "text": "隨遇而安的慢活旅行", "points": { "xihu": 10, "qianzhen": -5 }, "next": "q5_qian_quiz" },
      { "text": "充實高效的打卡踩點", "points": { "xihu": -5, "qianzhen": 10 }, "next": "q5_qian_quiz" },
      { "text": "我睡覺", "points": { "xihu": -10, "qianzhen": -10 }, "next": "q5_qian_quiz" }
    ]
  },

  {
    "id": "q5_qian_quiz",
    "speaker": "前鎮醬",
    "text": "最後一題大魔王！位於中山路與凱旋路交叉口，有著優美弧線設計的「前鎮之星」是一座什麼建築？",
    "xiSprite": "dim",
    "qianSprite": "active-talk",
    "choices": [
      { "text": "多功能自行車橋", "points": { "xihu": 0, "qianzhen": 5 }, "next": "result_tally" },
      { "text": "大型購物商場", "points": { "xihu": 0, "qianzhen": -10 }, "next": "result_tally" },
      { "text": "室內體育場", "points": { "xihu": 0, "qianzhen": -10 }, "next": "result_tally" },
      { "text": "高達101層樓的大樓", "points": { "xihu": 0, "qianzhen": -10 }, "next": "result_tally" }
    ]
  },

  {
    "id": "result_tally",
    "speaker": "旁白",
    "text": "全數 20 題測驗結束！少女們緊張地看著你手中的計分板，你的終極分數將決定你今晚的命運...",
    "xiSprite": "idle",
    "qianSprite": "idle",
    "isTally": true
  },
  {
    "id": "ending_zero",
    "speaker": "系統",
    "text": "你的選擇徹底激怒了她，四周的空氣瞬間降溫。你感覺到一股極度危險的殺氣... 準備進入戰鬥模式！",
    "xiSprite": "dim-sad",
    "qianSprite": "dim-sad",
    "isBattleTrigger": true
  },
  {
    "id": "ending_100_xihu",
    "speaker": "溪湖醬 (小溪)",
    "text": "哇！！！你對溪湖的熱愛居然爆表了！！這根本是命中注定的靈魂伴侶！不要管報告了，我們現在就立刻去田野裡約會吧！💖",
    "xiSprite": "active-talk",
    "qianSprite": "dim-sad",
    "isEnding": true
  },
  {
    "id": "ending_100_qianzhen",
    "speaker": "前鎮醬 (小前)",
    "text": "天啊！！你的品味跟對都會的熱愛簡直突破天際！！你就是我要找的那個人！今晚整座亞洲新灣區都是我們的舞台！💖",
    "xiSprite": "dim-sad",
    "qianSprite": "active-talk",
    "isEnding": true
  }
]
