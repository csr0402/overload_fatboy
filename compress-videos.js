/**
 * compress-videos.js
 * 批次壓縮影片腳本 - 使用 ffmpeg（需先安裝 ffmpeg）
 * 執行方式：node compress-videos.js
 *
 * 壓縮策略：
 *  - 編碼器：H.264 (libx264)，瀏覽器相容性最佳
 *  - CRF 18：視覺接近無損，幾乎看不出壓縮痕跡
 *  - preset slow：編碼較慢但畫質更好（比 fast 少 30%~40% 檔案大小）
 *  - 移除音軌：開場影片不需要聲音，省空間
 *  - faststart：讓瀏覽器邊下載邊播放
 */

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ── 設定 ──────────────────────────────────────────────────────────────────
const CRF = 28;           // 高速播放用：輕度終賣可接受，檔案小載入快
const PRESET = 'medium';  // 編碼速度/畫質平衡
const FPS = 24;           // 幀率：12.8x播放時需要快速解碼，24fps已足夠流暢
const MAX_WIDTH = 1920;   // 最大寬度（超過才縮小，不放大）

// 要壓縮的影片（原始檔 → 輸出檔）
// speed: 對應 index.html 裡的 playbackRate，在編碼時就加速，瀏覽器用 1x 播放
const VIDEOS = [
  {
    input:  'C:\\Users\\user\\Downloads\\溪湖火車.mp4',
    output: path.join(__dirname, 'images', '溪湖火車.mp4'),
    speed:  12.8,   // 對應 index.html videoXihu.playbackRate = 12.8
  },
  {
    input:  'C:\\Users\\user\\Downloads\\前鎮之星.mp4',
    output: path.join(__dirname, 'images', '前鎮之星.mp4'),
    speed:  8.0,    // 對應 index.html videoQianzhen.playbackRate = 8.0
  },
];
// ─────────────────────────────────────────────────────────────────────────

function checkFfmpeg() {
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function getFileSizeMB(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size / (1024 * 1024)).toFixed(2);
}

function getVideoDuration(filePath) {
  try {
    const result = execSync(
      `ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${filePath}"`,
      { encoding: 'utf8' }
    );
    const secs = parseFloat(result.trim());
    if (isNaN(secs)) return '未知';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  } catch {
    return '未知';
  }
}

function compressVideo({ input, output, speed = 1 }) {
  if (!fs.existsSync(input)) {
    console.log(`  ⚠️  找不到原始檔：${path.basename(input)}，跳過`);
    return;
  }

  const beforeMB = getFileSizeMB(input);
  const duration = getVideoDuration(input);
  console.log(`\n🎬 處理：${path.basename(input)}`);
  console.log(`   原始大小：${beforeMB} MB | 長度：${duration} | 加速倍率：${speed}x`);
  console.log(`   輸出至：${path.basename(output)}`);

  // 用 setpts 濃鏡直接在編碼時加速，瀏覽器就用正常 1x 播放
  const vf = `setpts=PTS/${speed},fps=${FPS},scale='min(${MAX_WIDTH}\\,iw)':-2`;

  const args = [
    '-i', input,
    '-c:v', 'libx264',
    '-crf', String(CRF),
    '-preset', PRESET,
    '-vf', vf,
    '-an',
    '-movflags', '+faststart',
    '-y',
    output,
  ];

  console.log(`   執行中... (${speed}x加速, CRF=${CRF}, ${FPS}fps)`);
  const start = Date.now();

  const result = spawnSync('ffmpeg', args, { stdio: ['ignore', 'ignore', 'pipe'] });

  if (result.status !== 0) {
    const errMsg = result.stderr ? result.stderr.toString().split('\n').slice(-5).join('\n') : '未知錯誤';
    console.error(`  ❌ 壓縮失敗：\n${errMsg}`);
    return;
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  const afterMB = getFileSizeMB(output);
  const saved = (((beforeMB - afterMB) / beforeMB) * 100).toFixed(0);
  console.log(`  ✅ 完成！${beforeMB} MB → ${afterMB} MB（節省 ${saved}%，耗時 ${elapsed}s）`);
}

function main() {
  console.log('🎬 影片高畫質壓縮工具\n');
  console.log(`📐 設定：CRF=${CRF} | preset=${PRESET} | 最大寬度=${MAX_WIDTH}px`);
  console.log('─'.repeat(50));

  // 確認 ffmpeg 已安裝
  if (!checkFfmpeg()) {
    console.error('\n❌ 找不到 ffmpeg！請先安裝：');
    console.error('   winget install Gyan.FFmpeg');
    console.error('   安裝後重開 PowerShell 再執行此腳本\n');
    process.exit(1);
  }

  console.log('✅ ffmpeg 已就緒\n');

  // 壓縮所有影片
  for (const video of VIDEOS) {
    compressVideo(video);
  }

  console.log('\n' + '─'.repeat(50));
  console.log('✨ 全部完成！');
  console.log('\n📝 接下來：');
  console.log('   確認壓縮後影片畫質 OK 後，將 index.html 中的影片路徑');
  console.log('   從 溪湖火車.mp4 → 溪湖火車_compressed.mp4');
  console.log('   從 前鎮之星.mp4 → 前鎮之星_compressed.mp4');
  console.log('   （或直接覆蓋原始檔）\n');
}

main();
