# 0916 — DIC-1 Personal Page

一個現代化、高質感且具備完整功能的個人網站 (Personal Page)，建立於 Antigravity，並具備即時 JavaScript 時鐘、個人檔案、專業技能展示與專案作品庫。

## 網站特色 (Features)

1. **Profile (個人簡介)**:
   - 姓名展示與即時編輯功能（支援 LocalStorage 本地儲存）
   - 個人專屬 Avatar 頭像與呼吸燈狀態指示
   - 科系與專長標籤（資訊工程學系 • AIoT & 軟體開發）
   - 簡短自我介紹與社群連結
2. **Live Clock (即時時鐘)**:
   - 高精度即時 JavaScript 數位時鐘 (`HH : MM : SS`)，時間每秒自動動態刷新
   - 動態時段問候語（早安 / 午安 / 傍晚好 / 夜深了）
   - 12 小時制 (AM/PM) 與 24 小時制即時切換按鈕
   - 附帶同步指針式模擬時鐘視覺化 (Analog Clock)
   - 台灣標準時間時區 (GMT+8)、年度天數、年度週次顯示
   - 內建專注碼表計時器 (Stopwatch) 與一鍵複製時間戳記
3. **Skills (專業技能)**:
   - Python (進階機器學習與後端開發)
   - C / C++ (演算法與嵌入式系統)
   - Web Development (現代 HTML5, CSS3, JavaScript)
   - Machine Learning & AI (實務模型與視覺化)
   - IoT & Embedded Systems (物聯網微控制器與 MQTT)
   - Data Analysis (數據清洗與視覺化)
4. **Projects (作品專案)**:
   - **Personal Page & Real-Time Clock**: 本個人主頁專案
   - **Smart IoT Telemetry & Monitor Hub**: 物聯網感測與監控系統
5. **Personal Design (個人風格)**:
   - 毛玻璃擬態風格 (Glassmorphism) 與動態環境流體光暈
   - 4 款 Neon 霓虹主題切換 (Cyan, Violet, Emerald, Sunset)
   - 深色模式 (Dark Mode) 與淺色模式 (Light Mode) 無縫切換
   - 完整響應式設計 (RWD)，完美支援桌面與手機瀏覽

## 本地預覽 (Local Preview)

在專案目錄下使用 Python 啟動本地伺服器：
```bash
python -m http.server 8085
```
接著在瀏覽器打開：`http://localhost:8085`

## 檔案結構 (Project Structure)
- `index.html` - 網頁核心語意化架構
- `style.css` - 現代 Glassmorphism 設計系統與響應式排版
- `app.js` - 即時時鐘運算、動態問候、主題與姓名交互邏輯
- `README.md` - 專案詳細說明與作業交付文件
