/* K-Snack Basak (vanilla) — 해시 라우팅 한 페이지 앱
   #/            홈 (히어로 · 맛 고르기 · 사용법 · 가이드 · 전체 과자)
   #/snack/slug  제품 상세
   #/guides      가이드 목록
   #/guide/slug  가이드
   #/list        내 쇼핑 목록 */
(function () {
  'use strict';

  const SITE_NAME = 'K-Snack Basak'; // 사이트 이름. 바꾸면 로고·제목·푸터에 전부 반영된다
  // localStorage 키(snackdex.*)는 이미 저장된 목록이 사라지지 않게 옛 이름 그대로 둔다

  const SNACKS = window.SNACKS || [];
  const GUIDES = window.GUIDES || [];
  const IMAGES = window.IMAGES || {};
  const bySlug = Object.fromEntries(SNACKS.map((s) => [s.slug, s]));
  const LANGS = ['en', 'ja', 'ko'];
  const LANG_NAMES = { en: 'English', ja: '日本語', ko: '한국어' };

  /* ── 화면 문구: 한국을 여행 중인 사람이 매장에서 쓰는 걸 기준으로 ── */
  const UI = {
    en: {
      eyebrow: 'Korean snack guide for travelers',
      heroTitleA: 'Explore Korean snacks,', heroTitleB: 'the easy way.',
      heroDesc: 'Find the flavor you want, see exactly which bag to grab, and save a list you can open right in the mart.',
      browse: 'Find my flavor', guides: 'Guides', home: 'Home', seeAll: 'See all',
      statSnacks: 'snacks & noodles', statTypes: 'types', statLangs: 'languages',
      moodLabel: 'Flavor finder', moodTitle: 'What are you craving?', moodDesc: "Tap one and we'll line up the bags.",
      mood_choco: 'Chocolate & cakes', mood_ramen: 'Instant noodles', mood_chips: 'Potato chips',
      mood_hot: 'Spicy', mood_mild: 'Not spicy', mood_gift: 'Gifts to bring home',
      stepsLabel: 'How it works',
      step1T: 'Pick a flavor', step1D: 'Chocolate, noodles, nothing spicy — start from what you feel like eating.',
      step2T: 'Match the bag', step2D: 'Photos and shelf tips show exactly which package to grab.',
      step3T: 'Save & check off', step3D: 'Build a list before the mart, then tick items off in the aisle.',
      labelGuides: 'Guides', labelGuide: 'Guide', guidesTitle: 'Not sure what to buy?', picks: 'picks', read: 'Read',
      labelShelf: 'All snacks', allTitle: 'Find the flavor you want',
      searchPlaceholder: 'Search a snack, brand, or flavor', all: 'All', results: 'snacks',
      noResults: 'No snacks match that yet. Try another flavor.', clear: 'Clear filters',
      optMild: 'Not spicy', optHot: 'Spicy', optWrapped: 'Individually wrapped', optGift: 'Good for gifts',
      myList: 'My list', listTitle: 'Shopping list', save: 'Save to list', saved: 'Saved', remove: 'Remove',
      back: 'Back', backToAll: 'All snacks',
      listIntro: 'Open this page in the mart. Your list stays on this phone — no sign-up needed. Tick items off as you shop.',
      listEmpty: 'Your list is empty. Tap the bookmark on any snack you want to find in the store.',
      listProgress: 'in your basket', listBrowse: 'Find snacks',
      taste: 'What it tastes like', texture: 'Texture', whoFor: 'Who it is for',
      findIt: 'How to spot it on the shelf', variants: 'Flavors and versions', facts: 'At a glance',
      brand: 'Brand', price: 'Typical mart price', koreanName: 'Korean name',
      wrapped: 'Individually wrapped', gift: 'Good to hand out', spice: 'Spice level',
      allergens: 'Contains', diet: 'Dietary notes', yes: 'Yes', no: 'No', unknown: 'Checking',
      porkFree: 'No pork', beefFree: 'No beef', vegetarian: 'Vegetarian',
      unverified: 'Unverified', heads: 'Heads up',
      draftTitle: 'Ingredient info is a draft',
      draftWarning: 'Ingredient and dietary information here has not been checked against the current package. Always read the label on the product you are holding.',
      incompleteTitle: "We're still filling this one in",
      incompleteDesc: 'Taste notes, price and ingredients are not confirmed yet. Please check the package in store.',
      related: 'On the same shelf', various: 'Various makers',
      refPhoto: 'Reference photo', photoPending: 'Photo coming',
      ctaTitle: 'Heading to the mart? Make your list first.',
      ctaDesc: 'Save the snacks you want, then open the list in the aisle and tick them off.',
      ctaBtn: 'Open my list', consoleNext: 'Next snack', consoleOpen: 'Open',
      footNote: 'Prices are rough large-mart ranges. Ingredient notes are unverified drafts — always check the package.',
      footPhotos: 'Product photos in this draft build are manufacturer reference images.',
      notFound: "We couldn't find that page.", language: 'Language',
      nameNote: '“Basak” (바삭) is the Korean word for that crispy crunch.',
    },
    ja: {
      eyebrow: '旅行者のための韓国お菓子ガイド',
      heroTitleA: '韓国のお菓子を、', heroTitleB: 'もっと気軽に探そう。',
      heroDesc: '食べたい味を見つけて、どの袋を取ればいいかを確認。買い物リストはマートでそのまま開けます。',
      browse: '食べたい味を探す', guides: 'ガイド', home: 'ホーム', seeAll: 'すべて見る',
      statSnacks: 'お菓子・麺', statTypes: '種類', statLangs: '言語',
      moodLabel: '味で探す', moodTitle: '今日は何の気分？', moodDesc: 'タップすると、合うお菓子が並びます。',
      mood_choco: 'チョコ・ケーキ', mood_ramen: 'インスタント麺', mood_chips: 'ポテトチップス',
      mood_hot: '辛いもの', mood_mild: '辛くないもの', mood_gift: 'お土産向き',
      stepsLabel: '使い方',
      step1T: '味を選ぶ', step1D: 'チョコ、麺、辛くないもの。食べたい気分から探せます。',
      step2T: '袋を確かめる', step2D: '写真と売り場での見つけ方で、どの袋を取ればいいか分かります。',
      step3T: '保存してチェック', step3D: 'マートに行く前にリストを作って、売り場でチェック。',
      labelGuides: 'ガイド', labelGuide: 'ガイド', guidesTitle: '何を買うか迷ったら', picks: '品', read: '読む',
      labelShelf: 'すべてのお菓子', allTitle: '食べたい味を見つけよう',
      searchPlaceholder: 'お菓子・メーカー・味で検索', all: 'すべて', results: '件',
      noResults: '条件に合うお菓子がありません。別の味も試してみてください。', clear: '条件をリセット',
      optMild: '辛くない', optHot: '辛い', optWrapped: '個包装', optGift: 'お土産向き',
      myList: 'マイリスト', listTitle: '買い物リスト', save: 'リストに保存', saved: '保存済み', remove: '削除',
      back: '戻る', backToAll: 'お菓子一覧',
      listIntro: 'このページをマートで開いてください。リストはこの端末にだけ保存され、登録は不要です。買ったらチェック。',
      listEmpty: 'リストは空です。売り場で探したいお菓子のブックマークを押してください。',
      listProgress: 'カゴに入れた', listBrowse: 'お菓子を探す',
      taste: 'どんな味か', texture: '食感', whoFor: 'こんな人に',
      findIt: '売り場での見つけ方', variants: '味・バリエーション', facts: '基本情報',
      brand: 'メーカー', price: 'マートでの目安価格', koreanName: '韓国語名',
      wrapped: '個包装', gift: 'ばらまき向き', spice: '辛さ',
      allergens: '含まれるもの', diet: '食事制限メモ', yes: 'あり', no: 'なし', unknown: '確認中',
      porkFree: '豚肉不使用', beefFree: '牛肉不使用', vegetarian: 'ベジタリアン対応',
      unverified: '未確認', heads: 'ご注意',
      draftTitle: '原材料情報は下書きです',
      draftWarning: 'ここに記載の原材料・食事制限情報は、現行パッケージとの照合が済んでいません。必ず手元の商品のラベルをご確認ください。',
      incompleteTitle: '情報を準備中です',
      incompleteDesc: '味・価格・原材料はまだ確認できていません。店頭でパッケージを確認してください。',
      related: '同じ棚にあるもの', various: '複数メーカー',
      refPhoto: '参考写真', photoPending: '写真準備中',
      ctaTitle: 'マートに行く前に、リストを作っておこう',
      ctaDesc: '欲しいお菓子を保存して、売り場でリストを開いてチェック。',
      ctaBtn: 'マイリストを開く', consoleNext: '次のお菓子', consoleOpen: '開く',
      footNote: '価格は大型マートでのおおよその目安です。原材料メモは未確認の下書きなので、必ずパッケージを確認してください。',
      footPhotos: '下書き版のため、商品写真はメーカーサイトの参考画像を使用しています。',
      notFound: 'ページが見つかりません。', language: '言語',
      nameNote: '「Basak（바삭）」は、韓国語で「サクッ」という食感のこと。',
    },
    ko: {
      eyebrow: '여행자를 위한 한국 과자 가이드',
      heroTitleA: '한국 과자,', heroTitleB: '편하게 둘러보세요.',
      heroDesc: '원하는 맛을 찾고, 어떤 봉지를 집으면 되는지 확인하세요. 목록에 담아두면 마트에서 바로 열 수 있어요.',
      browse: '원하는 맛 찾기', guides: '가이드', home: '홈', seeAll: '전체 보기',
      statSnacks: '과자·라면', statTypes: '종류', statLangs: '언어',
      moodLabel: '맛으로 찾기', moodTitle: '오늘은 어떤 맛이 당기세요?', moodDesc: '누르면 맞는 과자만 모아서 보여드려요.',
      mood_choco: '초코·케이크', mood_ramen: '라면', mood_chips: '감자칩',
      mood_hot: '매운 맛', mood_mild: '안 매운 맛', mood_gift: '선물용',
      stepsLabel: '이렇게 써요',
      step1T: '맛 고르기', step1D: '초코, 라면, 안 매운 것. 먹고 싶은 맛부터 찾아보세요.',
      step2T: '봉지 확인', step2D: '사진과 매대에서 찾는 법으로 어떤 포장을 집을지 알려드려요.',
      step3T: '담고 체크', step3D: '마트 가기 전에 목록을 만들고, 매대에서 하나씩 체크하세요.',
      labelGuides: '가이드', labelGuide: '가이드', guidesTitle: '뭘 살지 고민된다면', picks: '개', read: '읽기',
      labelShelf: '전체 과자', allTitle: '원하는 맛을 찾아보세요',
      searchPlaceholder: '과자 이름, 브랜드, 맛으로 검색', all: '전체', results: '개',
      noResults: '조건에 맞는 과자가 없어요. 다른 맛도 골라보세요.', clear: '필터 초기화',
      optMild: '안 매운', optHot: '매운', optWrapped: '낱개 포장', optGift: '선물용',
      myList: '내 목록', listTitle: '쇼핑 목록', save: '목록에 담기', saved: '담았어요', remove: '빼기',
      back: '뒤로', backToAll: '전체 과자',
      listIntro: '마트에서 이 페이지를 여세요. 목록은 이 폰에만 저장되고 가입은 필요 없어요. 산 건 체크하세요.',
      listEmpty: '목록이 비어 있어요. 매장에서 찾을 과자의 북마크를 눌러 담으세요.',
      listProgress: '장바구니에 담음', listBrowse: '과자 찾으러 가기',
      taste: '맛', texture: '식감', whoFor: '이런 사람에게',
      findIt: '매대에서 찾는 법', variants: '맛·버전', facts: '기본 정보',
      brand: '브랜드', price: '마트 가격(대략)', koreanName: '한국어 이름',
      wrapped: '낱개 포장', gift: '나눠주기 좋음', spice: '매운 정도',
      allergens: '알레르기 성분', diet: '식이 참고', yes: '예', no: '아니요', unknown: '확인 중',
      porkFree: '돼지고기 없음', beefFree: '소고기 없음', vegetarian: '채식 가능',
      unverified: '미확인', heads: '주의',
      draftTitle: '성분 정보는 초안이에요',
      draftWarning: '원재료·식이 정보를 현행 포장과 대조하지 않았어요. 반드시 손에 든 제품의 라벨을 확인하세요.',
      incompleteTitle: '정보를 채우는 중이에요',
      incompleteDesc: '맛·가격·성분은 아직 확인 전이에요. 매장에서 포장을 확인하세요.',
      related: '같은 매대의 과자', various: '여러 제조사',
      refPhoto: '참고 사진', photoPending: '사진 준비 중',
      ctaTitle: '마트 가기 전에 목록부터 만들어요',
      ctaDesc: '사고 싶은 과자를 담아두고, 매대에서 목록을 열어 하나씩 체크하세요.',
      ctaBtn: '내 목록 열기', consoleNext: '다음 과자', consoleOpen: '열기',
      footNote: '가격은 대형마트 기준 대략값이에요. 성분 메모는 확인 전 초안이니 반드시 포장을 확인하세요.',
      footPhotos: '초안 단계라 제품 사진은 제조사 사이트의 참고 이미지를 쓰고 있어요.',
      notFound: '없는 페이지예요.', language: '언어',
      nameNote: '바삭(Basak), 한국 과자를 한입 베어 물 때 나는 그 소리.',
    },
  };

  const CATEGORIES = {
    chips: { en: 'Potato chips', ja: 'ポテトチップス', ko: '감자칩' },
    'corn-snack': { en: 'Puffed & corn', ja: 'コーン系スナック', ko: '옥수수·뻥튀기 스낵' },
    biscuit: { en: 'Biscuits', ja: 'ビスケット', ko: '비스킷' },
    choco: { en: 'Chocolate & cakes', ja: 'チョコ・ケーキ', ko: '초코·케이크' },
    candy: { en: 'Candy', ja: 'キャンディ', ko: '캔디' },
    traditional: { en: 'Traditional', ja: '伝統菓子', ko: '전통 과자' },
    ramen: { en: 'Instant noodles', ja: 'インスタント麺', ko: '라면' },
  };

  const ALLERGENS = {
    wheat: { en: 'Wheat / gluten', ja: '小麦', ko: '밀' }, milk: { en: 'Milk', ja: '乳', ko: '우유' },
    egg: { en: 'Egg', ja: '卵', ko: '달걀' }, soy: { en: 'Soy', ja: '大豆', ko: '대두' },
    peanut: { en: 'Peanut', ja: '落花生', ko: '땅콩' }, shrimp: { en: 'Shrimp', ja: 'えび', ko: '새우' },
    sesame: { en: 'Sesame', ja: 'ごま', ko: '참깨' }, corn: { en: 'Corn', ja: 'とうもろこし', ko: '옥수수' },
    beef: { en: 'Beef', ja: '牛肉', ko: '쇠고기' },
  };

  /* 기분별 타일. 전부 데이터에 있는 값(종류·매운 정도·선물용)으로만 거른다 */
  const MOODS = [
    { key: 'choco', emoji: '🍫', cls: 'cat-choco', set: { cat: 'choco' } },
    { key: 'ramen', emoji: '🍜', cls: 'cat-ramen', set: { cat: 'ramen' } },
    { key: 'chips', emoji: '🥔', cls: 'cat-chips', set: { cat: 'chips' } },
    { key: 'hot', emoji: '🌶️', cls: 'mood-hot', set: { hot: true } },
    { key: 'mild', emoji: '🙂', cls: 'mood-mild', set: { mild: true } },
    { key: 'gift', emoji: '🎁', cls: 'mood-gift', set: { gift: true } },
  ];

  /* ── 상태 ── */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* 저장 불가 환경 */ } },
  };
  const detectLang = () => {
    const n = (navigator.language || '').toLowerCase();
    return n.startsWith('ko') ? 'ko' : n.startsWith('ja') ? 'ja' : 'en';
  };
  let lang = store.get('snackdex.lang', detectLang());
  if (!LANGS.includes(lang)) lang = 'en';
  let list = store.get('snackdex.list', []).filter((s) => bySlug[s]);
  let got = store.get('snackdex.got', []).filter((s) => bySlug[s]);
  const EMPTY_FILTER = { q: '', cat: 'all', mild: false, hot: false, wrapped: false, gift: false };
  const filter = { ...EMPTY_FILTER };
  let consoleIdx = 0;

  const t = (k) => UI[lang][k] ?? UI.en[k] ?? k;
  const tx = (s) => ({ ...s.i18n.en, ...(s.i18n[lang] || {}) });
  const gx = (g) => g.i18n[lang] || g.i18n.en;
  const heroTitle = () => `${t('heroTitleA')} ${t('heroTitleB')}`;
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const count = (n, key) => (lang === 'en' ? `${n} ${t(key)}` : `${n}${t(key)}`);
  const num = (n) => n.toLocaleString('en-US');
  const hasPrice = (s) => Array.isArray(s.priceKRW) && s.priceKRW.length === 2;
  const priceText = (s) => (!hasPrice(s) ? t('unknown')
    : lang === 'ko' ? `${num(s.priceKRW[0])}–${num(s.priceKRW[1])}원`
    : `₩${num(s.priceKRW[0])}–${num(s.priceKRW[1])}`);
  const yesNo = (v) => (v === true ? t('yes') : v === false ? t('no') : t('unknown'));
  const brandName = (s) => s.brand[lang] || s.brand.en || t('various');
  const catName = (c) => CATEGORIES[c]?.[lang] || CATEGORIES[c]?.en || c;
  const subline = (s) => (lang === 'ko' ? `${brandName(s)} · ${catName(s.category)}` : `${s.ko} · ${brandName(s)}`);
  const isIncomplete = (s) => s.status === 'incomplete';
  const cmdName = SITE_NAME.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const $app = document.getElementById('app');

  const I = {
    save: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5"/></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  };
  const LOGO_MARK = '<span class="logo-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';
  const logoName = () => esc(SITE_NAME).replace(/(\S+)$/, '<em>$1</em>'); // 마지막 단어만 노랑

  /* ── 조각 ── */
  function plate(s, opts = {}) {
    const img = IMAGES[s.slug];
    const cls = `plate cat-${s.category}${opts.wide ? ' plate-wide' : ''}`;
    if (img) {
      return `<div class="${cls}"><img src="${esc(img.src)}" alt="${opts.alt ? esc(tx(s).name) : ''}" loading="lazy" decoding="async">${img.ref && opts.note ? `<span class="ref">${t('refPhoto')}</span>` : ''}</div>`;
    }
    return `<div class="${cls}"><span class="ph">${esc(s.ko)}${opts.note ? `<small>${t('photoPending')}</small>` : ''}</span></div>`;
  }

  function saveBtn(slug) {
    const on = list.includes(slug);
    return `<button class="save" type="button" data-save="${slug}" aria-pressed="${on}" aria-label="${esc(on ? t('saved') : t('save'))}">${I.save}</button>`;
  }

  function spiceBadge(s) {
    if (typeof s.spicy !== 'number') return '';
    if (s.spicy >= 3) return `<span class="badge badge-hot">🌶 ${s.spicy}/5</span>`;
    if (s.spicy > 0) return `<span class="badge">🌶 ${s.spicy}/5</span>`;
    return `<span class="badge">${t('optMild')}</span>`;
  }

  function productCard(s) {
    return `<article class="p-card">
      <a href="#/snack/${s.slug}">
        ${plate(s)}
        <div class="p-body">
          <h3>${esc(tx(s).name)}</h3>
          <p class="p-sub">${esc(subline(s))}</p>
          <div class="p-meta">${spiceBadge(s)}${s.individuallyWrapped === true ? `<span class="badge">${t('optWrapped')}</span>` : ''}</div>
        </div>
      </a>
      ${saveBtn(s.slug)}
    </article>`;
  }

  function guideCard(g, i) {
    const gi = gx(g);
    const thumbs = g.picks.slice(0, 4).map((p) => (bySlug[p.slug] ? plate(bySlug[p.slug]) : '')).join('');
    return `<a class="g-card" href="#/guide/${g.slug}">
      <span class="caption-up">${t('labelGuide')} ${String(i + 1).padStart(2, '0')}</span>
      <h3>${esc(gi.title)}</h3>
      <p>${esc(gi.short)}</p>
      <div class="g-thumbs">${thumbs}</div>
      <div class="g-foot"><span>${count(g.picks.length, 'picks')}</span><span>${t('read')} →</span></div>
    </a>`;
  }

  function consoleCard() {
    const s = SNACKS[consoleIdx % SNACKS.length];
    if (!s) return '';
    const x = tx(s);
    return `<div class="console" id="console">
      <div class="console-bar"><i></i><i></i><i></i><span class="title">shelf-finder</span>
        <button type="button" class="icon-btn" data-next aria-label="${esc(t('consoleNext'))}">${I.next}</button>
      </div>
      <div class="console-body" aria-live="polite">
        <div class="c-cmd"><span class="c-prompt">$</span> ${cmdName} find <span class="c-str">"${esc(s.ko)}"</span> <span class="c-cmt">--lang ${lang}</span></div>
        <a class="c-product" href="#/snack/${s.slug}">${plate(s)}<span><b>${esc(x.name)}</b><span>${esc(brandName(s))} · ${esc(catName(s.category))}</span></span></a>
        <dl class="kv">
          <dt>spicy</dt><dd>${s.spicy ?? '?'}/5</dd>
          <dt>price</dt><dd>${esc(priceText(s))}</dd>
          <dt>wrapped</dt><dd>${s.individuallyWrapped ?? '?'}</dd>
        </dl>
        <p class="c-find"><span class="c-cmt">// ${esc(t('findIt'))}</span>${esc(x.findIt)}</p>
      </div>
      <div class="console-status"><span class="dot"></span>${SNACKS.length} snacks · ${LANGS.map((l) => l.toUpperCase()).join('/')}<a href="#/snack/${s.slug}">${t('consoleOpen')} →</a></div>
    </div>`;
  }

  function ctaBand() {
    return `<section class="band-cta"><div class="wrap"><div class="cta">
      <div><h2>${t('ctaTitle')}</h2><p>${t('ctaDesc')}</p></div>
      <a class="btn btn-dark" href="#/list">${I.save}<span>${t('ctaBtn')}</span><span class="count" data-list-count>${list.length || ''}</span></a>
    </div></div></section>`;
  }

  /* ── 필터 ── */
  const filtering = () => Object.keys(EMPTY_FILTER).some((k) => filter[k] !== EMPTY_FILTER[k]);

  function matches(s, f = filter) {
    if (f.cat !== 'all' && s.category !== f.cat) return false;
    if (f.mild && s.spicy !== 0) return false;
    if (f.hot && !(s.spicy >= 2)) return false;
    if (f.wrapped && s.individuallyWrapped !== true) return false;
    if (f.gift && s.giftFriendly !== true) return false;
    const q = f.q.trim().toLowerCase();
    if (!q) return true;
    const hay = [s.ko, s.brand.ko, s.brand.en, s.brand.ja,
      ...Object.values(s.i18n).flatMap((v) => [v.name, v.tagline, v.taste]),
      ...s.variants.flatMap((v) => [v.ko, v.label, v.labelKo])].filter(Boolean).join(' ').toLowerCase();
    return hay.includes(q);
  }

  function renderGrid() {
    const grid = document.getElementById('grid');
    if (!grid) return;
    const items = SNACKS.filter((s) => matches(s));
    grid.innerHTML = items.length ? items.map(productCard).join('') : `<p class="empty">${t('noResults')}</p>`;
    document.getElementById('count').textContent = count(items.length, 'results');
    document.querySelector('[data-clear]').hidden = !filtering();
  }

  function syncFilterUI() {
    const q = document.getElementById('q');
    if (q) q.value = filter.q;
    document.querySelectorAll('[data-f]').forEach((b) => {
      const key = b.dataset.f;
      b.setAttribute('aria-pressed', String(key.startsWith('cat:') ? filter.cat === key.slice(4) : !!filter[key]));
    });
    renderGrid();
  }

  /* ── 화면 ── */
  function viewHome() {
    const cats = Object.keys(CATEGORIES).filter((c) => SNACKS.some((s) => s.category === c));
    const tab = (key, label) => `<button type="button" class="tab${key === 'all' ? '' : ` cat-${key}`}" data-f="cat:${key}" aria-pressed="${filter.cat === key}">${key === 'all' ? '' : '<span class="dot"></span>'}${esc(label)}</button>`;
    const toggle = (key) => `<button type="button" class="toggle" data-f="${key}" aria-pressed="${filter[key]}"><span class="tick"></span>${esc(t('opt' + key[0].toUpperCase() + key.slice(1)))}</button>`;
    const moods = MOODS.map((m) => {
      const n = SNACKS.filter((s) => matches(s, { ...EMPTY_FILTER, ...m.set })).length;
      return `<button type="button" class="mood ${m.cls}" data-mood="${m.key}"><span class="emoji" aria-hidden="true">${m.emoji}</span><b>${t('mood_' + m.key)}</b><span class="count">${n}</span></button>`;
    }).join('');
    const names = SNACKS.map((s) => `<span>${esc(s.ko)}</span>`).join('');
    const steps = [1, 2, 3].map((n) => `<div class="step"><span class="n">${n}</span><h3>${t(`step${n}T`)}</h3><p>${t(`step${n}D`)}</p></div>`).join('');

    return `<div class="view">
      <section class="hero"><div class="wrap hero-grid">
        <div>
          <span class="badge badge-yellow">${t('eyebrow')}</span>
          <h1 class="display-xl">${t('heroTitleA')} <mark>${t('heroTitleB')}</mark></h1>
          <p class="hero-lead">${t('heroDesc')}</p>
          <div class="hero-actions">
            <button type="button" class="btn btn-primary" data-scroll="moods">${t('browse')}${I.arrow}</button>
            <a class="btn btn-secondary" href="#/guides">${t('guides')}</a>
          </div>
          <div class="stats">
            <div class="stat"><b>${SNACKS.length}</b><span>${t('statSnacks')}</span></div>
            <div class="stat"><b>${cats.length}</b><span>${t('statTypes')}</span></div>
            <div class="stat"><b>${LANGS.length}</b><span>${t('statLangs')}</span></div>
          </div>
        </div>
        <div class="hero-console">${consoleCard()}</div>
      </div></section>

      <div class="marquee" aria-hidden="true"><div class="marquee-track">${names}${names}</div></div>

      <section class="band" id="moods"><div class="wrap">
        <div class="sec-head"><div><span class="caption-up">${t('moodLabel')}</span><h2 class="display-md">${t('moodTitle')}</h2><p>${t('moodDesc')}</p></div></div>
        <div class="moods">${moods}</div>
      </div></section>

      <section class="band band-paper"><div class="wrap">
        <div class="sec-head"><div><span class="caption-up">${t('stepsLabel')}</span></div></div>
        <div class="snap snap-steps">${steps}</div>
      </div></section>

      <section class="band"><div class="wrap">
        <div class="sec-head">
          <div><span class="caption-up">${t('labelGuides')}</span><h2 class="display-md">${t('guidesTitle')}</h2></div>
          <a class="more" href="#/guides">${t('seeAll')} →</a>
        </div>
        <div class="snap to-grid">${GUIDES.map(guideCard).join('')}</div>
      </div></section>

      <section class="band band-paper" id="shelf"><div class="wrap">
        <div class="sec-head"><div><span class="caption-up">${t('labelShelf')}</span><h2 class="display-md">${t('allTitle')}</h2></div></div>
        <div class="filters">
          <label class="search">${I.search}<input id="q" type="search" enterkeyhint="search" autocomplete="off" placeholder="${esc(t('searchPlaceholder'))}" value="${esc(filter.q)}" aria-label="${esc(t('searchPlaceholder'))}"></label>
          <div class="tabs" role="group">${tab('all', t('all'))}${cats.map((c) => tab(c, catName(c))).join('')}</div>
          <div class="toggles" role="group">${toggle('mild')}${toggle('hot')}${toggle('wrapped')}${toggle('gift')}</div>
        </div>
        <div class="result-row"><span id="count"></span><button type="button" class="linkbtn" data-clear hidden>${t('clear')}</button></div>
        <div class="grid" id="grid"></div>
        <p class="draft-line">${t('draftTitle')} — ${t('draftWarning')}</p>
      </div></section>

      <div class="band"></div>
      ${ctaBand()}
    </div>`;
  }

  function viewSnack(slug) {
    const s = bySlug[slug];
    if (!s) return viewMissing();
    const x = tx(s);
    const on = list.includes(slug);
    const unknownAllergens = s.allergens?.status === 'unknown';
    const draft = s.allergens?.status !== 'verified' || s.diet?.status !== 'verified';
    const badge = draft ? `<span class="badge badge-outline">${t('unverified')}</span>` : '';
    const allergens = unknownAllergens || !s.allergens
      ? `<span class="badge badge-off">${t('unknown')}</span>`
      : s.allergens.contains.map((a) => `<span class="badge">${esc(ALLERGENS[a]?.[lang] || a)}</span>`).join('');
    const diet = ['porkFree', 'beefFree', 'vegetarian'].map((k) => {
      const v = s.diet?.[k];
      return `<span class="badge${v === true ? '' : ' badge-off'}">${v === true ? '✓' : v === false ? '✕' : '?'} ${t(k)}</span>`;
    }).join('');
    const variants = s.variants.map((v) => {
      const label = lang === 'ko' ? v.labelKo : v.label;
      return `<div><b>${esc(v.ko)}</b>${label ? `<span>${esc(label)}</span>` : ''}</div>`;
    }).join('');
    const textCard = (key) => (x[key] ? `<div class="card text-card"><h2 class="caption-up">${t(key)}</h2><p>${esc(x[key])}</p></div>` : '');
    const related = SNACKS.filter((o) => o.category === s.category && o.slug !== slug).slice(0, 4);
    const saveLabel = on ? t('saved') : t('save');

    return `<div class="view">
      <div class="wrap">
        <a class="crumb" href="#/" data-back>${I.back}${t('backToAll')}</a>
        <div class="detail">
          <div class="detail-media"><div class="card card-tight">${plate(s, { wide: true, note: true, alt: true })}</div></div>
          <div class="d-col">
            <div class="card d-head">
              <span class="caption-up">${esc(catName(s.category))} · ${esc(brandName(s))}</span>
              <h1 class="display-sm">${esc(x.name)}</h1>
              ${lang !== 'ko' ? `<p class="d-ko">${esc(s.ko)}</p>` : ''}
              ${x.tagline ? `<p class="d-tagline">${esc(x.tagline)}</p>` : ''}
              <div class="d-stats">
                <div><b>${esc(priceText(s))}</b><span>${t('price')}</span></div>
                <div><b>${s.spicy ?? '?'}<small>/5</small></b><span>${t('spice')}</span></div>
              </div>
              <button type="button" class="btn btn-primary d-save" data-save="${slug}" aria-pressed="${on}">${I.save}<span>${saveLabel}</span></button>
            </div>

            ${x.findIt ? `<div class="find-card"><h2 class="caption-up">${t('findIt')}</h2><p>${esc(x.findIt)}</p></div>` : ''}
            ${isIncomplete(s) ? `<div class="card note-card"><h2 class="caption-up">${t('incompleteTitle')}</h2><p>${t('incompleteDesc')}</p></div>` : ''}
            ${x.warning ? `<div class="card warn-card"><h2 class="caption-up">⚠ ${t('heads')}</h2><p>${esc(x.warning)}</p></div>` : ''}

            ${textCard('taste')}${textCard('texture')}${textCard('whoFor')}

            ${variants ? `<div class="card"><h2 class="caption-up">${t('variants')}</h2><div class="variant-list">${variants}</div></div>` : ''}

            <div class="card"><h2 class="caption-up">${t('facts')}</h2>
              <dl class="facts">
                <div><dt>${t('koreanName')}</dt><dd>${esc(s.ko)}</dd></div>
                <div><dt>${t('brand')}</dt><dd>${esc(brandName(s))}</dd></div>
                <div><dt>${t('wrapped')}</dt><dd>${yesNo(s.individuallyWrapped)}</dd></div>
                <div><dt>${t('gift')}</dt><dd>${yesNo(s.giftFriendly)}</dd></div>
                <div><dt>${t('allergens')}${badge}</dt><dd class="chips-inline">${allergens}</dd></div>
                <div><dt>${t('diet')}${badge}</dt><dd class="chips-inline">${diet}</dd></div>
              </dl>
            </div>
            ${draft ? `<div class="card draft-card"><h2 class="caption-up">${t('draftTitle')}</h2><p>${t('draftWarning')}</p></div>` : ''}
          </div>
        </div>
      </div>

      ${related.length ? `<section class="band"><div class="wrap">
        <div class="sec-head"><div><span class="caption-up">${esc(catName(s.category))}</span><h2 class="display-md">${t('related')}</h2></div></div>
        <div class="snap snap-products">${related.map(productCard).join('')}</div>
      </div></section>` : ''}

      ${ctaBand()}

      <div class="actionbar">
        <a class="icon-btn" href="#/" data-back aria-label="${esc(t('back'))}">${I.back}</a>
        <button type="button" class="btn btn-primary" data-save="${slug}" aria-pressed="${on}">${I.save}<span>${saveLabel}</span></button>
      </div>
    </div>`;
  }

  function viewGuides() {
    return `<div class="view">
      <div class="wrap">
        <header class="page-head"><span class="caption-up">${t('labelGuides')}</span><h1 class="display-md">${t('guidesTitle')}</h1></header>
        <div class="guide-grid">${GUIDES.map(guideCard).join('')}</div>
      </div>
      <div class="band"></div>
      ${ctaBand()}
    </div>`;
  }

  function viewGuide(slug) {
    const g = GUIDES.find((x) => x.slug === slug);
    if (!g) return viewMissing();
    const gi = gx(g);
    const picks = g.picks.map((p, i) => {
      const s = bySlug[p.slug];
      if (!s) return '';
      return `<a class="pick" href="#/snack/${s.slug}">
        <span class="num">${i + 1}</span>
        ${plate(s)}
        <span><h3>${esc(tx(s).name)}</h3><p>${esc(p.why[lang] || p.why.en)}</p></span>
      </a>`;
    }).join('');
    return `<div class="view">
      <div class="wrap narrow">
        <a class="crumb" href="#/guides">${I.back}${t('guides')}</a>
        <header class="page-head"><span class="caption-up">${count(g.picks.length, 'picks')}</span><h1 class="display-md">${esc(gi.title)}</h1><p>${esc(gi.lede)}</p></header>
        <div class="picks">${picks}</div>
        <div class="card outro"><p>${esc(gi.outro)}</p></div>
      </div>
      <div class="band"></div>
      ${ctaBand()}
    </div>`;
  }

  function viewList() {
    const items = list.map((s) => bySlug[s]).filter(Boolean);
    const done = items.filter((s) => got.includes(s.slug)).length;
    const rows = items.map((s) => {
      const isGot = got.includes(s.slug);
      return `<div class="row${isGot ? ' got' : ''}">
        <input class="check" type="checkbox" data-got="${s.slug}" ${isGot ? 'checked' : ''} aria-label="${esc(tx(s).name)}">
        <a href="#/snack/${s.slug}" tabindex="-1">${plate(s)}</a>
        <a class="info" href="#/snack/${s.slug}"><b>${esc(tx(s).name)}</b><span>${esc(tx(s).findIt || s.ko)}</span></a>
        <button type="button" class="icon-btn icon-ghost" data-remove="${s.slug}" aria-label="${esc(t('remove'))}">${I.x}</button>
      </div>`;
    }).join('');
    return `<div class="view">
      <div class="wrap narrow">
        <header class="page-head">
          <span class="caption-up">${t('myList')}</span>
          <h1 class="display-md">${t('listTitle')}</h1>
          <p>${t('listIntro')}</p>
          ${items.length ? `<div class="progress"><b id="done">${done}</b><span>/ ${items.length} · ${t('listProgress')}</span></div>` : ''}
        </header>
        ${items.length ? `<div class="rows">${rows}</div>`
          : `<div class="card empty-card"><p>${t('listEmpty')}</p><a class="btn btn-primary" href="#/">${t('listBrowse')}${I.arrow}</a></div>`}
      </div>
      <div class="band"></div>
    </div>`;
  }

  function viewMissing() {
    return `<div class="view"><div class="wrap narrow"><div class="page-head"><div class="card empty-card"><p>${t('notFound')}</p><a class="btn btn-primary" href="#/">${t('backToAll')}</a></div></div></div></div>`;
  }

  function footer() {
    return `<div class="wrap">
      <div class="foot-grid">
        <div class="foot-brand">
          <a class="logo" href="#/">${LOGO_MARK}<span>${logoName()}</span></a>
          <p class="name-note">${t('nameNote')}</p>
          <p>${heroTitle()}</p>
          <p>${t('footNote')}</p>
        </div>
        <div><h4 class="caption-up">${t('guides')}</h4><ul>${GUIDES.map((g) => `<li><a href="#/guide/${g.slug}">${esc(gx(g).title)}</a></li>`).join('')}</ul></div>
        <div><h4 class="caption-up">${t('language')}</h4><ul>${LANGS.map((l) => `<li><button type="button" class="linkbtn-plain" data-lang="${l}">${LANG_NAMES[l]}</button></li>`).join('')}</ul></div>
      </div>
      <p class="fine">${t('footPhotos')}</p>
    </div>`;
  }

  /* ── 라우터 ── */
  function parseRoute() {
    const [, route = '', slug = ''] = location.hash.replace(/^#\/?/, '/').split('/');
    return { route, slug: decodeURIComponent(slug) };
  }

  function render() {
    const { route, slug } = parseRoute();
    const views = { snack: () => viewSnack(slug), guide: () => viewGuide(slug), guides: viewGuides, list: viewList };
    const known = Object.prototype.hasOwnProperty.call(views, route);
    $app.innerHTML = known ? views[route]() : viewHome();
    document.body.dataset.route = known ? route : 'home';
    document.getElementById('footer').innerHTML = footer();
    renderGrid();
    syncChrome();

    const guide = route === 'guide' ? GUIDES.find((g) => g.slug === slug) : null;
    const title = route === 'snack' && bySlug[slug] ? tx(bySlug[slug]).name
      : guide ? gx(guide).title
      : route === 'guides' ? t('guides')
      : route === 'list' ? t('myList') : '';
    document.title = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — ${heroTitle()}`;
  }

  function syncChrome() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    document.querySelectorAll('[data-t]').forEach((el) => { el.textContent = t(el.dataset.t); });
    document.querySelectorAll('[data-site-name]').forEach((el) => { el.innerHTML = logoName(); });
    document.querySelectorAll('[data-list-count]').forEach((el) => { el.textContent = list.length ? String(list.length) : ''; });
    const { route } = parseRoute();
    const tab = route === 'guide' || route === 'guides' ? 'guides' : route === 'list' ? 'list' : 'home';
    document.querySelectorAll('.tabbar a').forEach((a) => {
      if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }

  /* ── 이벤트 ── */
  const smooth = () => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');

  function toggleSave(slug) {
    list = list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
    store.set('snackdex.list', list);
    const on = list.includes(slug);
    document.querySelectorAll(`[data-save="${slug}"]`).forEach((b) => {
      b.setAttribute('aria-pressed', String(on));
      const label = b.querySelector('span');
      if (label) label.textContent = on ? t('saved') : t('save');
      if (b.classList.contains('save')) {
        b.setAttribute('aria-label', on ? t('saved') : t('save'));
        b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
      }
    });
    syncChrome();
  }

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-lang],[data-save],[data-remove],[data-f],[data-mood],[data-clear],[data-next],[data-scroll],[data-back]');
    if (!el) return;

    if (el.dataset.lang) {
      lang = el.dataset.lang; store.set('snackdex.lang', lang);
      const y = window.scrollY; render(); window.scrollTo(0, y);
    } else if (el.dataset.save) {
      e.preventDefault(); toggleSave(el.dataset.save);
    } else if (el.dataset.remove) {
      toggleSave(el.dataset.remove); got = got.filter((s) => s !== el.dataset.remove); store.set('snackdex.got', got); render();
    } else if (el.dataset.mood) {
      const mood = MOODS.find((m) => m.key === el.dataset.mood);
      Object.assign(filter, EMPTY_FILTER, mood.set);
      syncFilterUI();
      document.getElementById('shelf')?.scrollIntoView({ behavior: smooth(), block: 'start' });
    } else if (el.dataset.f) {
      const key = el.dataset.f;
      if (key.startsWith('cat:')) {
        filter.cat = key.slice(4);
        el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      } else {
        filter[key] = !filter[key];
        if (key === 'mild' && filter.mild) filter.hot = false;
        if (key === 'hot' && filter.hot) filter.mild = false;
      }
      syncFilterUI();
    } else if (el.hasAttribute('data-clear')) {
      Object.assign(filter, EMPTY_FILTER);
      syncFilterUI();
    } else if (el.hasAttribute('data-next')) {
      consoleIdx = (consoleIdx + 1) % SNACKS.length;
      document.getElementById('console').outerHTML = consoleCard();
    } else if (el.dataset.scroll) {
      document.getElementById(el.dataset.scroll)?.scrollIntoView({ behavior: smooth(), block: 'start' });
    } else if (el.hasAttribute('data-back') && history.length > 1) {
      e.preventDefault(); history.back();
    }
  });

  document.addEventListener('input', (e) => {
    if (e.target.id === 'q') { filter.q = e.target.value; renderGrid(); }
  });

  document.addEventListener('change', (e) => {
    const c = e.target.closest('[data-got]');
    if (!c) return;
    const slug = c.dataset.got;
    got = c.checked ? [...new Set([...got, slug])] : got.filter((s) => s !== slug);
    store.set('snackdex.got', got);
    c.closest('.row').classList.toggle('got', c.checked);
    const done = document.getElementById('done');
    if (done) done.textContent = String(list.filter((s) => got.includes(s)).length);
  });

  window.addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); });
  render();
})();
