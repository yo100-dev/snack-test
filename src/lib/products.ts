import fs from 'node:fs';
import path from 'node:path';
import raw from '../data/products.json';
import type { Lang } from '../i18n/ui';

export interface Product {
  slug: string;
  ko: string;
  brand: { ko: string | null; en: string | null; ja: string | null };
  category: string;
  priceKRW: [number, number];
  individuallyWrapped: boolean;
  giftFriendly: boolean;
  spicy: number;
  allergens: { status: 'draft' | 'verified'; contains: string[] };
  diet: { status: 'draft' | 'verified'; porkFree: boolean; beefFree: boolean; vegetarian: boolean };
  variants: { ko: string; label: string }[];
  i18n: Record<string, {
    name: string; tagline: string; taste: string; texture: string;
    whoFor: string; findIt: string; warning?: string;
  }>;
}

// status: 'incomplete' 인 제품(가격·맛 등 확인 전)은 Astro 빌드에서 뺀다. vanilla 버전에만 보인다.
export const products = (raw as unknown as (Product & { status?: string })[])
  .filter((p) => p.status !== 'incomplete') as Product[];

/* ── 이미지 ────────────────────────────────
   public/images/products/<slug>.(jpg|jpeg|png|webp) 가 있으면 그 경로를,
   없으면 null 을 돌려준다. null 이면 화면에 플레이스홀더가 뜬다.
   → 사진을 파일명만 맞춰서 넣으면 코드 수정 없이 자동으로 붙는다. */
const IMG_DIR = path.resolve('public/images/products');
const EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

let cache: Map<string, string> | null = null;
function index() {
  if (cache) return cache;
  cache = new Map();
  if (fs.existsSync(IMG_DIR)) {
    for (const f of fs.readdirSync(IMG_DIR)) {
      const ext = path.extname(f).toLowerCase();
      if (EXTS.includes(ext)) cache.set(path.basename(f, ext), `/images/products/${f}`);
    }
  }
  return cache;
}

export function imageFor(slug: string): string | null {
  return index().get(slug) ?? null;
}

export function priceLabel(p: Product) {
  return `₩${p.priceKRW[0].toLocaleString()}–${p.priceKRW[1].toLocaleString()}`;
}

export function nameFor(p: Product, lang: Lang) {
  return p.i18n[lang]?.name ?? p.i18n.en.name;
}

export function copyFor(p: Product, lang: Lang) {
  return p.i18n[lang] ?? p.i18n.en;
}

/** 클라이언트 필터가 쓰는 데이터. data-* 속성 하나에 실어보낸다. */
export function filterPayload(p: Product, lang: Lang) {
  return {
    c: p.category,
    a: p.allergens.contains,
    pf: p.diet.porkFree,
    bf: p.diet.beefFree,
    vg: p.diet.vegetarian,
    w: p.individuallyWrapped,
    g: p.giftFriendly,
    s: p.spicy,
    q: [nameFor(p, lang), p.ko, p.brand[lang] ?? '', p.brand.en ?? '',
        ...p.variants.map((v) => `${v.ko} ${v.label}`)].join(' ').toLowerCase(),
  };
}
