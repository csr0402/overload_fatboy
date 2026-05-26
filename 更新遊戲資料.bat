@echo off
chcp 65001 > nul
echo 正在將 JSON 資料轉換為可讀取的 JS 格式...

node -e "const fs = require('fs'); const d = fs.readFileSync('dialogue.json', 'utf8'); fs.writeFileSync('dialogue.js', 'window.dialogueData = ' + d); const a = fs.readFileSync('attractions.json', 'utf8'); fs.writeFileSync('attractions.js', 'window.attractionsData = ' + a);"

echo.
echo 轉換完成！現在你編輯的 JSON 資料已經更新到遊戲中了。
echo 請重新整理瀏覽器頁面來查看最新結果。
echo.
pause
