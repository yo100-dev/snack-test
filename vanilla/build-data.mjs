// products.json · guides.json · 이미지 목록 → data.js
// 브라우저에서 file:// 로 열어도 되도록 JSON을 전역 변수로 감싼다.
// 데이터나 사진을 바꾼 뒤: node vanilla/build-data.mjs
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const products = JSON.parse(readFileSync(join(root, 'src/data/products.json'), 'utf8'));
const guides = JSON.parse(readFileSync(join(root, 'src/data/guides.json'), 'utf8'));

// 사진 우선순위: vanilla/images (배포용, 출처 확인됨) → ../_refs (크롤링 참고용, 로컬 전용)
const EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
const images = {};
for (const [dir, prefix, ref] of [[join(here, 'images'), 'images/', false], [join(root, '_refs'), '../_refs/', true]]) {
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir)) {
    const ext = extname(f).toLowerCase();
    if (!EXTS.includes(ext)) continue;
    const slug = basename(f, extname(f));
    if (!images[slug]) images[slug] = { src: prefix + f, ref };
  }
}

const out = `// 자동 생성 파일. 직접 고치지 말고 src/data/*.json 을 고친 뒤 build-data.mjs 를 실행한다.
window.SNACKS = ${JSON.stringify(products)};
window.GUIDES = ${JSON.stringify(guides)};
window.IMAGES = ${JSON.stringify(images)};
`;
writeFileSync(join(here, 'data.js'), out);
const refs = Object.values(images).filter((i) => i.ref).length;
console.log(`data.js: products ${products.length}, guides ${guides.length}, images ${Object.keys(images).length} (refs ${refs})`);
