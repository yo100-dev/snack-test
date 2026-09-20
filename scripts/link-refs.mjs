/* 로컬 확인용: _refs 의 참고 이미지를 public/images/products 에 심볼릭 링크로 건다.
   .gitignore 로 배포에서 제외되며, npm run build 는 출처 없는 이미지를 막는다. */
import fs from 'node:fs';
import path from 'node:path';
const SRC = '_refs', DST = 'public/images/products';
fs.mkdirSync(DST, { recursive: true });
let n = 0;
for (const f of fs.existsSync(SRC) ? fs.readdirSync(SRC) : []) {
  if (!/\.(jpe?g|png|webp|avif)$/i.test(f)) continue;
  const to = path.join(DST, f);
  if (!fs.existsSync(to)) { fs.symlinkSync(path.resolve(SRC, f), to); n++; }
}
console.log(`· 참고 이미지 ${n}장 연결 (배포용 아님)`);
