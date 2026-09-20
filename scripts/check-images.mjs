/* 배포 전 이미지 게이트.
   public/images/products/ 에 들어간 사진은 실제로 사이트에 배포된다.
   각 사진마다 같은 이름의 .credit.txt (출처/촬영자/사용근거) 가 있어야 통과.
   직접 찍은 사진이면 "own photo, <날짜>" 한 줄이면 된다. */
import fs from 'node:fs';
import path from 'node:path';

const DIR = 'public/images/products';
const EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

if (!fs.existsSync(DIR)) { console.log('· 이미지 없음 — 플레이스홀더로 빌드'); process.exit(0); }

const missing = [];
let n = 0;
for (const f of fs.readdirSync(DIR)) {
  const ext = path.extname(f).toLowerCase();
  if (!EXTS.includes(ext)) continue;
  n++;
  const credit = path.join(DIR, path.basename(f, ext) + '.credit.txt');
  if (!fs.existsSync(credit) || !fs.readFileSync(credit, 'utf8').trim()) missing.push(f);
}

console.log(`· 배포 이미지 ${n}장`);
if (missing.length) {
  console.error('\n⚠︎  출처 파일이 없는 이미지가 있다. 이대로 배포하면 저작권 문제가 생긴다:\n');
  for (const f of missing) console.error(`   ${f}  →  ${path.basename(f, path.extname(f))}.credit.txt 를 만들어라`);
  console.error('\n   직접 찍은 사진이면 파일에 "own photo, 2026-09-10" 한 줄만 넣으면 통과한다.');
  console.error('   크롤링해온 참고용 이미지는 public/ 이 아니라 _refs/ 에 둔다 (빌드에 안 들어감).\n');
  process.exit(1);
}
console.log('· 출처 확인 완료');
