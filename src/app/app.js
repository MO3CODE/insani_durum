'use strict';

// ============================================================
// Data: languages, governorates, wording
// ============================================================

const LANGS = ['ar', 'tr', 'en'];
const NEEDS = ['food', 'shelter', 'cash', 'nfi'];
// Colour of each "needs rate" card, alternating like the original design.
const NEED_TONE = { food: 'blue', shelter: 'red', cash: 'blue', nfi: 'red' };
const TONES = { blue: ['#1D6C8C', '#0E2A46'], red: ['#D0243F', '#7A1428'] };

const GOVS = [
  { id: 'sanaa-city', ar: 'أمانة العاصمة', tr: 'Sana (Başkent)', en: "Sana'a City" },
  { id: 'sanaa', ar: 'صنعاء', tr: 'Sana', en: "Sana'a" },
  { id: 'aden', ar: 'عدن', tr: 'Aden', en: 'Aden' },
  { id: 'taiz', ar: 'تعز', tr: 'Taiz', en: 'Taiz' },
  { id: 'hodeidah', ar: 'الحديدة', tr: 'Hudeyde', en: 'Hodeidah' },
  { id: 'marib', ar: 'مأرب', tr: 'Marib', en: 'Marib' },
  { id: 'hadramawt', ar: 'حضرموت', tr: 'Hadramut', en: 'Hadramawt' },
  { id: 'abyan', ar: 'أبين', tr: 'Ebyen', en: 'Abyan' },
  { id: 'lahij', ar: 'لحج', tr: 'Lahic', en: 'Lahj' },
  { id: 'mahrah', ar: 'المهرة', tr: 'Mehre', en: 'Al Mahrah' },
  { id: 'dhale', ar: 'الضالع', tr: 'Dali', en: "Ad Dali'" },
  { id: 'shabwah', ar: 'شبوة', tr: 'Şebve', en: 'Shabwah' },
  { id: 'ibb', ar: 'إب', tr: 'İbb', en: 'Ibb' },
  { id: 'dhamar', ar: 'ذمار', tr: 'Zemar', en: 'Dhamar' },
  { id: 'bayda', ar: 'البيضاء', tr: 'Beyda', en: 'Al Bayda' },
  { id: 'hajjah', ar: 'حجة', tr: 'Hacce', en: 'Hajjah' },
  { id: 'saada', ar: 'صعدة', tr: 'Saada', en: "Sa'dah" },
  { id: 'jawf', ar: 'الجوف', tr: 'Cevf', en: 'Al Jawf' },
  { id: 'amran', ar: 'عمران', tr: 'Amran', en: 'Amran' },
  { id: 'mahwit', ar: 'المحويت', tr: 'Mahvit', en: 'Al Mahwit' },
  { id: 'raymah', ar: 'ريمة', tr: 'Reyme', en: 'Raymah' },
  { id: 'socotra', ar: 'سقطرى', tr: 'Sokotra', en: 'Socotra' },
];
const GOV_BY_ID = Object.fromEntries(GOVS.map((g) => [g.id, g]));

const MONTHS = {
  ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  tr: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

const T = {
  ar: {
    langName: 'العربية',
    title: 'التقرير الإنساني للنزوح', titleSize: 38,
    storyTitle: 'التقرير الإنساني<br>للنزوح في اليمن',
    country: 'اليمن', listSep: '، ',
    govCount: (n) => `${n} ${n <= 10 ? 'محافظات' : 'محافظة'}`,
    totalLabel: 'إجمالي الأفراد النازحين', totalUnit: 'فرد نازح',
    familiesLabel: 'الأسر النازحة', familiesUnit: 'أسرة', familiesShort: 'أسرة نازحة',
    perFamily: 'فرد في كل أسرة',
    govLabel: 'محافظات النزوح',
    need: {
      food: { pre: 'يحتاجون إلى', item: 'المساعدات الغذائية', short: 'بحاجة لمساعدات غذائية' },
      shelter: { pre: 'يحتاجون إلى', item: 'المأوى', short: 'بحاجة إلى مأوى' },
      cash: { pre: 'يحتاجون إلى', item: 'الدعم النقدي', short: 'بحاجة لدعم نقدي' },
      nfi: { pre: 'يحتاجون إلى', item: 'المواد غير الغذائية', short: 'بحاجة لمواد غير غذائية' },
    },
    areasTitle: 'أبرز مجالات الاحتياج العاجل',
    areas: [
      ['tent', 'المأوى والإيواء', 'مأوى طارئ ومستلزمات أساسية'],
      ['bowl-food', 'الأغذية', 'سلال غذائية عاجلة وأدوات مطبخ'],
      ['drop', 'المياه والنظافة', 'مياه شرب آمنة ومستلزمات نظافة'],
      ['first-aid-kit', 'الصحة والحماية', 'رعاية طبية وأدوية ودعم نفسي'],
    ],
    source: 'المصدر: الوحدة التنفيذية لإدارة مخيمات النازحين · وزارة التخطيط والتعاون الدولي',
    sourceShort: 'المصدر: الوحدة التنفيذية لإدارة مخيمات النازحين',
    support: 'ساهم في الإغاثة',
    file: 'الوضع الإنساني - اليمن',
    fileSuffix: { a4: '', post: ' - منشور', story: ' - ستوري' },
  },
  tr: {
    langName: 'Türkçe',
    title: 'Yerinden Edilme İnsani Durum Raporu', titleSize: 35,
    storyTitle: 'Yemen Yerinden Edilme<br>İnsani Durum Raporu',
    country: 'Yemen', listSep: ', ',
    govCount: (n) => `${n} il`,
    totalLabel: 'Yerinden edilen kişi', totalUnit: 'kişi',
    familiesLabel: 'Yerinden edilen aile', familiesUnit: 'aile', familiesShort: 'yerinden edilen aile',
    perFamily: 'aile başına kişi',
    govLabel: 'Etkilenen il',
    need: {
      food: { item: 'Gıda yardımına', post: 'ihtiyaç duyuyor', short: 'gıda yardımı ihtiyacı' },
      shelter: { item: 'Barınağa', post: 'ihtiyaç duyuyor', short: 'barınak ihtiyacı' },
      cash: { item: 'Nakdi desteğe', post: 'ihtiyaç duyuyor', short: 'nakdi destek ihtiyacı' },
      nfi: { item: 'Gıda dışı malzemeye', post: 'ihtiyaç duyuyor', short: 'gıda dışı malzeme ihtiyacı' },
    },
    areasTitle: 'Acil ihtiyaç alanları',
    areas: [
      ['tent', 'Barınma', 'Acil barınak ve temel malzeme'],
      ['bowl-food', 'Gıda', 'Gıda kolisi ve mutfak gereci'],
      ['drop', 'Su ve Hijyen', 'İçme suyu ve hijyen malzemesi'],
      ['first-aid-kit', 'Sağlık', 'Tıbbi bakım ve psikososyal destek'],
    ],
    source: 'Kaynak: Yerinden Edilmiş Kişiler Kamplarını Yönetme Yürütme Birimi · Planlama ve Uluslararası İşbirliği Bakanlığı',
    sourceShort: 'Kaynak: YEK Kampları Yönetme Yürütme Birimi',
    support: 'Yardıma destek olun',
    file: 'İnsani Durum - Yemen',
    fileSuffix: { a4: '', post: ' - Gönderi', story: ' - Hikaye' },
  },
  en: {
    langName: 'English',
    title: 'Humanitarian Displacement Report', titleSize: 35,
    storyTitle: 'Yemen Humanitarian<br>Displacement Report',
    country: 'Yemen', listSep: ', ',
    govCount: (n) => `${n} governorates`,
    totalLabel: 'Displaced people', totalUnit: 'people',
    familiesLabel: 'Displaced families', familiesUnit: 'families', familiesShort: 'displaced families',
    perFamily: 'people per family',
    govLabel: 'Affected governorates',
    need: {
      food: { pre: 'Need', item: 'food assistance', short: 'need food assistance' },
      shelter: { pre: 'Need', item: 'shelter', short: 'need shelter' },
      cash: { pre: 'Need', item: 'cash assistance', short: 'need cash assistance' },
      nfi: { pre: 'Need', item: 'non-food items', short: 'need non-food items' },
    },
    areasTitle: 'Urgent Needs Areas',
    areas: [
      ['tent', 'Shelter', 'Emergency shelter and essential supplies'],
      ['bowl-food', 'Food', 'Emergency food parcels and kitchen supplies'],
      ['drop', 'Water &amp; Hygiene', 'Safe drinking water and hygiene supplies'],
      ['first-aid-kit', 'Health', 'Medical care, medicine and psychosocial support'],
    ],
    source: 'Source: Executive Unit for IDP Camps Management · Ministry of Planning and International Cooperation',
    sourceShort: 'Source: Executive Unit for IDP Camps Management',
    support: 'Support the relief effort',
    file: 'Humanitarian Situation - Yemen',
    fileSuffix: { a4: '', post: ' - Post', story: ' - Story' },
  },
};

const FORMATS = {
  a4: { label: 'A4', scale: 3 },
  post: { label: 'منشور 4:5', scale: 2.5 },   // 432×540 → 1080×1350
  story: { label: 'ستوري 9:16', scale: 1920 / 720 }, // 405×720 → 1080×1920
};

// ============================================================
// Formatting helpers
// ============================================================

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function fmtNum(lang, n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'tr' ? '.' : ',');
}

function fmtPct(lang, n) {
  if (lang === 'tr') return '%' + n;
  if (lang === 'ar') return n + ' %';
  return n + '%';
}

function parseDate(s) {
  const [y, m, d] = s.split('-').map(Number);
  return { y, m, d };
}

function pad2(n) { return String(n).padStart(2, '0'); }

function fmtRange(lang, start, end) {
  const a = parseDate(start), b = parseDate(end), M = MONTHS[lang];
  if (start === end) return `${pad2(a.d)} ${M[a.m - 1]} ${a.y}`;
  if (a.y === b.y && a.m === b.m) return `${pad2(a.d)} – ${pad2(b.d)} ${M[b.m - 1]} ${b.y}`;
  if (a.y === b.y) return `${pad2(a.d)} ${M[a.m - 1]} – ${pad2(b.d)} ${M[b.m - 1]} ${b.y}`;
  return `${pad2(a.d)} ${M[a.m - 1]} ${a.y} – ${pad2(b.d)} ${M[b.m - 1]} ${b.y}`;
}

function addDays(iso, days) {
  const { y, m, d } = parseDate(iso);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return `${dt.getUTCFullYear()}-${pad2(dt.getUTCMonth() + 1)}-${pad2(dt.getUTCDate())}`;
}

function govName(id, lang) {
  return GOV_BY_ID[id] ? GOV_BY_ID[id][lang] : id;
}

function subtitle(lang, r) {
  const t = T[lang], n = r.governorates.length;
  if (!n) return t.country;
  if (n > 3) return `${t.country} · ${t.govCount(n)}`;
  return `${t.country} · ${r.governorates.map((g) => govName(g, lang)).join(t.listSep)}`;
}

function fileBase(lang, r, format) {
  const name = `${T[lang].file} ${fmtRange(lang, r.start, r.end)}${T[lang].fileSuffix[format]}`;
  return name.replace(/[\/\\:*?"<>|]/g, '-');
}

function icon(name, color, size) {
  return (ICONS[name] || '')
    .replace('<svg ', `<svg width="${size}" height="${size}" `)
    .replace(/currentColor/g, color);
}

// Reads a number typed with Western or Arabic-Indic digits, ignoring
// thousands separators. Returns null when nothing usable was typed.
function readInt(s) {
  const digits = String(s)
    .replace(/[٠-٩]/g, (c) => String(c.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (c) => String(c.charCodeAt(0) - 0x06F0))
    .replace(/[^\d]/g, '');
  return digits ? parseInt(digits, 10) : null;
}

// ============================================================
// Poster templates
// ============================================================

function needsTitle(lang, r) {
  return (r.needsTitle && r.needsTitle[lang]) || '';
}

function posterA4(lang, r) {
  const t = T[lang], rtl = lang === 'ar', align = rtl ? 'right' : 'left';
  const n = r.governorates.length;
  const govList = r.governorates.map((g) => govName(g, lang).replace(/ /g, '\u00a0')).join('\u00a0· ');
  const govFont = n <= 3 ? 19 : n <= 6 ? 16 : 13.5;
  const govLines = n <= 3 ? 2 : 3;
  const totalDigits = fmtNum(lang, r.total).length;
  const totalFont = totalDigits <= 7 ? 96 : totalDigits <= 9 ? 78 : 64;
  // Average household size, worked out from the two numbers already on the page.
  const perFamily = r.families > 0 ? (r.total / r.families).toFixed(1).replace('.', lang === 'tr' ? ',' : '.') : '';

  const logo = `<div style="background:#FFFFFF;border-radius:14px;padding:8px 11px;flex:0 0 auto"><img src="${LOGO_URI}" alt="Güzel Eser" style="display:block;width:74px;height:auto"></div>`;
  const org = `<div style="font-size:18px;font-weight:600;letter-spacing:2px;color:#EBC9CF;text-align:left">GÜZEL ESER İNSANİ YARDIM DERNEĞİ</div>`;
  const date = `<div style="font-size:21px;font-weight:700;background:#9C1C33;border-radius:999px;padding:6px 20px;white-space:nowrap">${esc(fmtRange(lang, r.start, r.end))}</div>`;
  const sub = `<div style="font-size:19px;color:#E4E0DC">${esc(subtitle(lang, r))}</div>`;
  const dot = `<div style="width:6px;height:6px;border-radius:50%;background:#EBC9CF;flex:0 0 auto"></div>`;
  const metaRow = rtl
    ? `<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:14px">${sub}${dot}${date}</div>`
    : `<div style="display:flex;align-items:center;gap:12px;margin-top:14px">${date}${dot}${sub}</div>`;
  const heading = (text) => {
    const h = `<div style="font-size:26px;font-weight:700">${text}</div>`;
    const bar = `<div style="width:38px;height:4px;border-radius:2px;background:#9C1C33;flex:0 0 auto"></div>`;
    return `<div style="display:flex;justify-content:flex-start;align-items:center;gap:12px;margin-bottom:10px">${rtl ? h + bar : bar + h}</div>`;
  };
  const statIcon = (name, box, size, radius) =>
    `<div style="width:${box}px;height:${box}px;border-radius:${radius}px;background:rgba(235,201,207,0.16);display:flex;align-items:center;justify-content:center;flex:0 0 auto">${icon(name, '#EBC9CF', size)}</div>`;

  const needCards = NEEDS.map((k) => {
    const [c1, c2] = TONES[NEED_TONE[k]];
    const w = t.need[k];
    return `<div style="min-width:0">
      <div style="position:relative;background:linear-gradient(160deg,${c1} 0%,${c2} 100%);border-radius:14px;padding:13px 8px 12px;text-align:center;box-shadow:0 8px 18px rgba(0,0,0,0.28)">
        <div style="font-size:42px;font-weight:700;line-height:1;letter-spacing:-1px;white-space:nowrap">${fmtPct(lang, r.needs[k])}</div>
        <div style="position:absolute;bottom:-13px;${rtl ? 'right' : 'left'}:22px;width:0;height:0;border-left:12px solid transparent;border-right:12px solid transparent;border-top:14px solid ${c2}"></div>
      </div>
      <div style="margin-top:18px;text-align:${align};padding:0 4px;line-height:1.28">
        ${w.pre ? `<div style="font-size:16px;color:#E4E0DC">${w.pre}</div>` : ''}
        <div style="font-size:18px;font-weight:700">${w.item}</div>
        ${w.post ? `<div style="font-size:16px;color:#E4E0DC">${w.post}</div>` : ''}
      </div>
    </div>`;
  }).join('');

  // Turkish and English run longer than Arabic: slightly smaller text keeps
  // the A4 page from overflowing.
  const long = lang !== 'ar';
  const areaCards = t.areas.map(([ic, name, desc]) => `
    <div style="background:rgba(255,255,255,0.1);border-radius:18px;padding:10px 11px;text-align:center">
      <div style="width:40px;height:40px;margin:0 auto;border-radius:13px;background:rgba(255,255,255,0.14);display:flex;align-items:center;justify-content:center">${icon(ic, '#FFFFFF', 24)}</div>
      <div style="font-size:${long ? 20 : 21}px;font-weight:700;margin-top:7px;line-height:1.3">${name}</div>
      <div style="font-size:${long ? 16 : 18}px;line-height:1.4;color:#E4E0DC;margin-top:2px">${desc}</div>
    </div>`).join('');

  return `<section class="poster poster-a4" dir="${rtl ? 'rtl' : 'ltr'}" lang="${lang}">
  <div style="position:relative;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:22px 44px 0">${rtl ? logo + org : org + logo}</div>

  <div style="position:relative;padding:18px 44px 0;text-align:${align}">
    <div style="font-size:${t.titleSize}px;font-weight:700;line-height:1.12">${t.title}</div>
    ${metaRow}
  </div>

  <div style="position:relative;padding:18px 44px 0;display:grid;grid-template-columns:1.5fr 1fr;gap:16px">
    <div style="background:rgba(0,0,0,0.38);border:1px solid rgba(255,255,255,0.22);border-radius:22px;padding:14px 20px;text-align:${align};display:flex;flex-direction:column">
      <div style="display:flex;justify-content:flex-start;align-items:center;gap:12px">
        ${statIcon('users-three', 44, 26, 14)}
        <div style="font-size:22px;font-weight:700;color:#EBC9CF">${t.totalLabel}</div>
      </div>
      <div style="flex:1;display:flex;flex-direction:column;justify-content:center">
        <div style="font-size:${totalFont}px;font-weight:700;line-height:1;letter-spacing:-2px;white-space:nowrap">${fmtNum(lang, r.total)}</div>
        <div style="font-size:26px;font-weight:600;color:#E4E0DC">${t.totalUnit}</div>
      </div>
      ${perFamily ? `<div style="border-top:1px solid rgba(255,255,255,0.18);padding-top:10px;margin-top:6px">
        <div style="font-size:26px;font-weight:700;line-height:1.1">≈ ${perFamily}</div>
        <div style="font-size:16px;color:#E4E0DC">${t.perFamily}</div>
      </div>` : ''}
    </div>
    <div style="display:flex;flex-direction:column;gap:12px">
      <div style="flex:1;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.22);border-radius:20px;padding:10px 18px;text-align:${align};display:flex;flex-direction:column;justify-content:center">
        <div style="display:flex;justify-content:flex-start;align-items:center;gap:10px">
          ${statIcon('house-line', 36, 22, 12)}
          <div style="font-size:${t.familiesLabel.length > 18 ? 18 : 20}px;font-weight:700;color:#EBC9CF">${t.familiesLabel}</div>
        </div>
        <div style="font-size:40px;font-weight:700;line-height:1.05;margin-top:2px">${fmtNum(lang, r.families)}</div>
        <div style="font-size:19px;color:#E4E0DC">${t.familiesUnit}</div>
      </div>
      <div style="flex:1;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.22);border-radius:20px;padding:10px 18px;text-align:${align};display:flex;flex-direction:column;justify-content:center">
        <div style="display:flex;justify-content:flex-start;align-items:center;gap:10px">
          ${statIcon('map-pin', 36, 22, 12)}
          <div style="font-size:${t.govLabel.length > 18 ? 18 : 20}px;font-weight:700;color:#EBC9CF">${t.govLabel}</div>
        </div>
        <div style="font-size:40px;font-weight:700;line-height:1.05;margin-top:2px">${n}</div>
        <div style="font-size:${govFont}px;line-height:1.35;color:#E4E0DC;overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:${govLines};-webkit-box-orient:vertical;overflow:hidden">${esc(govList)}</div>
      </div>
    </div>
  </div>

  <div style="position:relative;padding:18px 44px 0;text-align:${align}">
    ${heading(esc(needsTitle(lang, r)))}
    <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px">${needCards}</div>
  </div>

  <div style="position:relative;padding:18px 44px 0;text-align:${align}">
    ${heading(t.areasTitle)}
    <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px">${areaCards}</div>
  </div>

  <div style="position:relative;margin-top:auto;padding:12px 44px 18px;text-align:${align}">
    <div style="background:rgba(0,0,0,0.34);border:1px solid rgba(255,255,255,0.18);border-radius:18px;padding:${long ? '12px 18px' : '14px 20px'};font-size:${long ? 16 : 18}px;line-height:1.5;color:#E4E0DC">${t.source}</div>
  </div>
</section>`;
}

function socialHead(rtl) {
  const logo = `<div style="background:#fff;border-radius:10px;padding:5px 7px;flex:0 0 auto"><img src="${LOGO_URI}" alt="Güzel Eser" style="width:46px;height:auto;display:block"></div>`;
  const org = `<div style="font-size:10px;letter-spacing:1.5px;color:#EBC9CF;font-weight:600">GÜZEL ESER İNSANİ YARDIM DERNEĞİ</div>`;
  return `<div style="display:flex;justify-content:space-between;align-items:center;gap:10px">${rtl ? logo + org : org + logo}</div>`;
}

function needTile(lang, r, k, big) {
  const [c1, c2] = TONES[NEED_TONE[k]];
  return `<div style="background:linear-gradient(160deg,${c1} 0%,${c2} 100%);border-radius:${big ? 16 : 14}px;padding:${big ? '12px 10px' : '9px 6px'};text-align:center;min-width:0">
    <div style="font-size:${big ? 32 : 24}px;font-weight:700;line-height:1.1;white-space:nowrap">${fmtPct(lang, r.needs[k])}</div>
    <div style="font-size:${big ? 13.5 : 11.5}px;line-height:1.3;color:#fff;opacity:.92;margin-top:2px">${T[lang].need[k].short}</div>
  </div>`;
}

function posterPost(lang, r) {
  const t = T[lang], rtl = lang === 'ar', align = rtl ? 'right' : 'left';
  const date = `<span style="background:#9C1C33;border-radius:999px;padding:4px 12px;font-size:13.5px;font-weight:700;white-space:nowrap">${esc(fmtRange(lang, r.start, r.end))}</span>`;
  const sub = `<span style="font-size:14px;color:#E4E0DC">${esc(subtitle(lang, r))}</span>`;
  return `<section class="poster poster-post" dir="${rtl ? 'rtl' : 'ltr'}" lang="${lang}" style="text-align:${align}">
    ${socialHead(rtl)}
    <div style="font-size:${rtl ? 27 : 24}px;font-weight:700;margin-top:18px;line-height:1.2">${t.title}</div>
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:8px">${rtl ? sub + date : date + sub}</div>
    <div style="margin-top:${rtl ? 24 : 16}px">
      <div style="font-size:17px;color:#EBC9CF;font-weight:700">${t.totalLabel}</div>
      <div style="font-size:80px;font-weight:700;line-height:1;letter-spacing:-2px">${fmtNum(lang, r.total)}</div>
      <div style="font-size:16px;color:#E4E0DC;margin-top:4px">${t.totalUnit} · ${fmtNum(lang, r.families)} ${t.familiesUnit}</div>
    </div>
    <div style="margin-top:${rtl ? 24 : 16}px;font-size:16px;font-weight:700">${esc(needsTitle(lang, r))}</div>
    <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin-top:10px">
      ${NEEDS.map((k) => needTile(lang, r, k, false)).join('')}
    </div>
    <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center;gap:10px;font-size:12px;color:#E4E0DC">
      <span>${t.sourceShort}</span><b style="color:#fff;direction:ltr">${SITE_LABEL}</b>
    </div>
  </section>`;
}

function posterStory(lang, r) {
  const t = T[lang], rtl = lang === 'ar', align = rtl ? 'right' : 'left';
  const qr = QR_SVG
    ? `<div style="width:62px;height:62px;flex:0 0 auto">${QR_SVG}</div>`
    : '';
  return `<section class="poster poster-story" dir="${rtl ? 'rtl' : 'ltr'}" lang="${lang}" style="text-align:${align}">
    ${socialHead(rtl)}
    <div style="font-size:${rtl ? 29 : 27}px;font-weight:700;margin-top:24px;line-height:1.2">${t.storyTitle}</div>
    <div style="margin-top:12px"><span style="background:#9C1C33;border-radius:999px;padding:5px 14px;font-size:14px;font-weight:700;white-space:nowrap">${esc(fmtRange(lang, r.start, r.end))}</span></div>
    <div style="margin-top:22px;text-align:center">
      <div style="font-size:17px;color:#EBC9CF;font-weight:700">${t.totalLabel}</div>
      <div style="font-size:84px;font-weight:700;line-height:1;letter-spacing:-2px">${fmtNum(lang, r.total)}</div>
      <div style="font-size:18px;color:#E4E0DC;margin-top:4px">${t.totalUnit} · ${fmtNum(lang, r.families)} ${t.familiesUnit}</div>
      <div style="font-size:14px;color:#E4E0DC;margin-top:2px">${esc(subtitle(lang, r))}</div>
    </div>
    <div style="margin-top:18px;font-size:17px;font-weight:700">${esc(needsTitle(lang, r))}</div>
    <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:8px">
      ${NEEDS.map((k) => needTile(lang, r, k, true)).join('')}
    </div>
    <div style="margin-top:auto;background:#fff;color:#0E2A46;border-radius:16px;padding:12px 14px;display:flex;align-items:center;gap:12px">
      ${qr}<div><div style="font-weight:700;font-size:16px">${t.support}</div><div style="font-size:13px;direction:ltr;text-align:${align}">${SITE_LABEL}</div></div>
    </div>
  </section>`;
}

function posterHTML(format, lang, r) {
  if (format === 'post') return posterPost(lang, r);
  if (format === 'story') return posterStory(lang, r);
  return posterA4(lang, r);
}

// ============================================================
// State, local cache, server sync
// ============================================================

const CACHE_KEY = 'insani-durum:reports-v2';
const EDIT_PASSWORD_KEY = 'guzel-eser-poster-edit-password';
const IS_FILE = location.protocol === 'file:';

const state = {
  reports: [],
  currentId: null,
  lang: 'ar',
  format: 'a4',
  view: 'poster',
  draft: null,       // the report being edited in the panel
  draftIsNew: false,
  pending: [],       // saves/deletes not yet confirmed by the server
};

function lsGet(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
function lsSet(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }
function lsDel(key) { try { localStorage.removeItem(key); } catch (e) {} }

function sortReports(list) {
  return list.slice().sort((a, b) => (a.start < b.start ? 1 : -1));
}

function saveCache() {
  lsSet(CACHE_KEY, JSON.stringify({ reports: state.reports, pending: state.pending }));
}

function loadCache() {
  try {
    const c = JSON.parse(lsGet(CACHE_KEY) || 'null');
    if (c && Array.isArray(c.reports) && c.reports.length) return c;
  } catch (e) {}
  return null;
}

function currentReport() {
  return state.reports.find((r) => r.id === state.currentId) || state.reports[0] || null;
}

function shownReport() {
  return state.draft || currentReport();
}

function setSync(kind, text, retry) {
  const el = document.getElementById('sync-status');
  el.className = 'sync ' + (kind || '');
  el.textContent = text || '';
  if (retry) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = 'إعادة المحاولة';
    b.onclick = () => flushPending(true);
    el.appendChild(b);
  }
}

let warnedOnce = false;
function warnLoudly(msg) {
  if (warnedOnce) return;
  warnedOnce = true;
  setTimeout(() => alert(msg), 50);
}

async function fetchShared() {
  if (IS_FILE) {
    setSync('busy', 'نسخة محلية — بدون اتصال بالخادم');
    return;
  }
  if (state.pending.length || state.draft) return;
  try {
    const res = await fetch('/api/data', { cache: 'no-store' });
    if (!res.ok) throw new Error(String(res.status));
    const json = await res.json();
    if (state.pending.length || state.draft) return; // changed while we waited
    if (Array.isArray(json.reports) && json.reports.length) {
      state.reports = sortReports(json.reports);
      if (!state.reports.some((r) => r.id === state.currentId)) state.currentId = state.reports[0].id;
      saveCache();
      renderAll();
    }
    setSync('ok', '● محفوظ لدى الجميع');
  } catch (e) {
    setSync('err', 'تعذّر جلب البيانات المشتركة — ما تراه قد يكون نسخة هذا الجهاز');
  }
}

async function postOp(op, interactive) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Edit-Password': lsGet(EDIT_PASSWORD_KEY) || '' },
      body: JSON.stringify(op),
    });
    if (res.status === 401) {
      // A wrong password cached in this browser would make every later save
      // fail the same way: drop it and ask again.
      lsDel(EDIT_PASSWORD_KEY);
      if (!interactive || attempt === 3) return { auth: true };
      const pw = prompt(attempt === 0 ? 'كلمة مرور التعديل المشترك:' : 'كلمة المرور غير صحيحة. حاول مرة أخرى:');
      if (!pw) return { auth: true };
      lsSet(EDIT_PASSWORD_KEY, pw);
      continue;
    }
    if (!res.ok) return { failed: true };
    return { json: await res.json() };
  }
  return { auth: true };
}

// Sends queued saves/deletes in order. The local copy is already updated, so
// a failure leaves the change visible on this device and says so loudly.
async function flushPending(interactive) {
  if (IS_FILE) {
    setSync('err', 'نسخة محلية — التعديل محفوظ في هذا الجهاز فقط');
    return;
  }
  while (state.pending.length) {
    setSync('busy', 'جارٍ الحفظ للجميع…');
    let out;
    try {
      out = await postOp(state.pending[0], interactive);
    } catch (e) {
      out = { failed: true };
    }
    if (!out.json) {
      const why = out.auth ? 'كلمة مرور التعديل غير صحيحة أو لم تُدخل' : 'تعذّر الاتصال بالخادم';
      setSync('err', `لم يُحفظ للجميع (${why}) — محفوظ في هذا الجهاز فقط`, true);
      if (interactive) warnLoudly(`لم يُحفظ للجميع: ${why}. التعديل محفوظ في هذا المتصفح فقط ولن يظهر لغيرك حتى تضغط «إعادة المحاولة».`);
      return;
    }
    state.pending.shift();
    if (!state.pending.length && Array.isArray(out.json.reports)) {
      state.reports = sortReports(out.json.reports);
      if (!state.reports.some((r) => r.id === state.currentId) && state.reports[0]) state.currentId = state.reports[0].id;
    }
    saveCache();
  }
  warnedOnce = false;
  setSync('ok', '● محفوظ لدى الجميع');
  renderAll();
}

// ============================================================
// Rendering
// ============================================================

const $ = (sel) => document.querySelector(sel);

function renderToolbar() {
  const r = shownReport();
  const latest = state.reports[0];
  const dateBtn = $('#date-btn');
  dateBtn.innerHTML = r
    ? `${esc(fmtRange('ar', r.start, r.end))} ▾${state.draft && state.draftIsNew ? '<span class="tag">جديد</span>' : latest && r.id !== latest.id ? '<span class="tag">أرشيف</span>' : ''}`
    : 'لا توجد تقارير ▾';

  $('#lang-tabs').innerHTML = [...LANGS, 'all'].map((l) =>
    `<button type="button" role="tab" data-lang="${l}" aria-selected="${state.lang === l}">${l === 'all' ? 'الكل' : T[l].langName}</button>`).join('');
  $('#format-tabs').innerHTML = Object.entries(FORMATS).map(([k, f]) =>
    `<button type="button" role="tab" data-format="${k}" aria-selected="${state.format === k}">${f.label}</button>`).join('');
  $('#format-tabs').hidden = state.view === 'archive';
}

function renderStage() {
  const stage = $('#stage');
  const r = shownReport();
  stage.hidden = state.view !== 'poster';
  if (state.view !== 'poster') return;
  if (!r) {
    stage.innerHTML = '<div style="color:#9fb0c3;padding:40px">لا توجد تقارير بعد. اضغط «تعديل البيانات» لإنشاء أول تقرير.</div>';
    return;
  }
  const langs = state.lang === 'all' ? LANGS : [state.lang];
  stage.classList.toggle('stack', state.format === 'a4');
  stage.innerHTML = langs.map((l) => `<div><div class="fit">${posterHTML(state.format, l, r)}</div>${state.lang === 'all' ? `<div class="fit-label">${T[l].langName}</div>` : ''}</div>`).join('');
  fitAll();
}

function fitAll() {
  const stage = $('#stage');
  const stageAvail = stage.clientWidth - 24;
  const sideBySide = state.format !== 'a4' && state.lang === 'all';
  document.querySelectorAll('.fit').forEach((fit) => {
    const poster = fit.firstElementChild;
    const w = poster.offsetWidth, h = poster.offsetHeight;
    let avail;
    if (fit.closest('.thumb')) {
      avail = fit.closest('.thumb').clientWidth;
    } else {
      avail = sideBySide && stageAvail > 3 * w ? w : stageAvail;
    }
    const s = Math.min(1, avail / w);
    poster.style.transform = `scale(${s})`;
    fit.style.width = w * s + 'px';
    fit.style.height = h * s + 'px';
  });
}

function renderArchive() {
  const box = $('#archive');
  box.hidden = state.view !== 'archive';
  if (state.view !== 'archive') return;
  const lang = state.lang === 'all' ? 'ar' : state.lang;
  const cur = currentReport();
  const cards = state.reports.map((r) => `
    <div class="card ${cur && r.id === cur.id ? 'current' : ''}">
      ${cur && r.id === cur.id ? '<div class="badge">المعروض</div>' : ''}
      <div class="thumb" data-open="${r.id}"><div class="fit">${posterA4(lang, r)}</div></div>
      <div class="cd">${esc(fmtRange('ar', r.start, r.end))}</div>
      <div class="cs">${fmtNum('ar', r.total)} نازح · ${fmtNum('ar', r.families)} أسرة</div>
      <div class="cb">
        <button class="btn" type="button" data-open="${r.id}">فتح</button>
        <button class="btn ghost" type="button" data-download="${r.id}">⤓ تنزيل</button>
      </div>
    </div>`).join('');
  box.innerHTML = `
    <div class="archive-head">
      <div><h2>أرشيف التقارير</h2><div class="sub">${state.reports.length} ${state.reports.length === 1 ? 'تقرير' : 'تقارير'} · كل أسبوع محفوظ كتقرير مستقل</div></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn ghost" type="button" id="archive-back">عودة للتقرير</button>
        <button class="btn accent" type="button" id="new-week">+ تقرير الأسبوع الجديد</button>
      </div>
    </div>
    <div class="archive-grid">${cards}</div>`;
  fitAll();
}

function renderAll() {
  renderToolbar();
  renderStage();
  renderArchive();
}

// ============================================================
// Edit panel
// ============================================================

function cloneReport(r) {
  return JSON.parse(JSON.stringify(r));
}

function blankReport() {
  const today = new Date();
  const iso = `${today.getFullYear()}-${pad2(today.getMonth() + 1)}-${pad2(today.getDate())}`;
  return {
    id: iso, start: iso, end: addDays(iso, 4), total: 0, families: 0, governorates: [],
    needsTitle: { ar: 'معدل النزوح', tr: 'Yerinden Edilme Oranı', en: 'Displacement Rate' },
    needs: { food: 0, shelter: 0, cash: 0, nfi: 0 },
  };
}

function openPanel(isNew) {
  const base = currentReport();
  if (isNew) {
    const latest = state.reports[0];
    state.draft = latest ? cloneReport(latest) : blankReport();
    if (latest) {
      state.draft.start = addDays(latest.start, 7);
      state.draft.end = addDays(latest.end, 7);
    }
    state.draft.id = state.draft.start;
  } else {
    state.draft = base ? cloneReport(base) : blankReport();
    isNew = !base;
  }
  state.draftIsNew = isNew;
  state.view = 'poster';
  document.body.classList.add('panel-open');
  renderPanel();
  renderAll();
}

function closePanel() {
  state.draft = null;
  state.draftIsNew = false;
  document.body.classList.remove('panel-open');
  $('#panel').hidden = true;
  renderAll();
}

function triple(fn) {
  return LANGS.map((l) => `<span><b>${l === 'ar' ? 'ع' : l.toUpperCase()}</b> ${esc(fn(l))}</span>`).join('');
}

function renderPanel() {
  const d = state.draft;
  const p = $('#panel');
  p.hidden = false;
  const govOptions = GOVS.filter((g) => !d.governorates.includes(g.id))
    .map((g) => `<option value="${g.id}">${g.ar}</option>`).join('');
  p.innerHTML = `
    <button class="btn ghost close" type="button" id="panel-close" aria-label="إغلاق">✕</button>
    <h2>${state.draftIsNew ? 'تقرير أسبوع جديد' : 'بيانات التقرير'}</h2>
    <div class="lead">تكتبها مرة واحدة ← تظهر في العربية والتركية والإنجليزية تلقائياً بالتنسيق الصحيح لكل لغة. المعاينة تتحدّث أثناء الكتابة.</div>
    <div class="err-msg" id="panel-err" hidden></div>

    <div class="field">
      <div class="flabel">فترة التقرير</div>
      <div class="row2">
        <input class="inp" type="date" id="f-start" value="${d.start}" aria-label="من">
        <input class="inp" type="date" id="f-end" value="${d.end}" aria-label="إلى">
      </div>
      <div class="triple" id="p-date"></div>
    </div>

    <div class="field">
      <div class="row2">
        <div><label for="f-total">إجمالي النازحين</label><input class="inp" id="f-total" inputmode="numeric" autocomplete="off" value="${d.total}"></div>
        <div><label for="f-families">عدد الأسر</label><input class="inp" id="f-families" inputmode="numeric" autocomplete="off" value="${d.families}"></div>
      </div>
      <div class="triple" id="p-nums"></div>
    </div>

    <div class="field">
      <div class="flabel">محافظات النزوح</div>
      <div class="chips" id="f-govs">
        ${d.governorates.map((g) => `<span class="chip">${esc(govName(g, 'ar'))}<button type="button" data-remove-gov="${g}" aria-label="إزالة">✕</button></span>`).join('')}
        ${govOptions ? `<select class="sel" id="f-add-gov" aria-label="إضافة محافظة"><option value="">+ إضافة محافظة</option>${govOptions}</select>` : ''}
      </div>
      <div class="hint">العدد (${d.governorates.length}) يُحسب تلقائياً، والأسماء تُترجم: ${esc(d.governorates.map((g) => govName(g, 'tr')).join(' · ') || '—')}</div>
    </div>

    <div class="field">
      <label for="f-title-ar">عنوان قسم النسب</label>
      <input class="inp small" id="f-title-ar" value="${esc(d.needsTitle.ar)}" maxlength="80">
      <details class="tr-titles">
        <summary>الترجمة: ${esc(d.needsTitle.tr)} · ${esc(d.needsTitle.en)}</summary>
        <input class="inp small" id="f-title-tr" dir="ltr" value="${esc(d.needsTitle.tr)}" maxlength="80" aria-label="Türkçe">
        <input class="inp small" id="f-title-en" dir="ltr" value="${esc(d.needsTitle.en)}" maxlength="80" aria-label="English">
      </details>
    </div>

    <div class="field">
      <div class="flabel">النسب (٪)</div>
      <div class="row4">
        ${NEEDS.map((k) => `<label class="need-inp"><span>${T.ar.need[k].item}</span><input id="f-need-${k}" inputmode="numeric" autocomplete="off" value="${d.needs[k]}" aria-label="${T.ar.need[k].item}"></label>`).join('')}
      </div>
    </div>

    <div class="panel-actions">
      <button class="btn accent" type="button" id="panel-save">حفظ ونشر للجميع</button>
      <button class="btn ghost" type="button" id="panel-cancel">إلغاء</button>
    </div>
    <div class="panel-foot">
      <button class="linkish" type="button" id="panel-password">كلمة مرور التعديل</button>
      ${state.draftIsNew ? '' : '<button class="linkish danger" type="button" id="panel-delete">حذف هذا التقرير</button>'}
    </div>`;
  updatePreviews();
}

function updatePreviews() {
  const d = state.draft;
  const pd = $('#p-date'), pn = $('#p-nums');
  if (pd) pd.innerHTML = d.start && d.end && d.end >= d.start ? triple((l) => fmtRange(l, d.start, d.end)) : '';
  if (pn) pn.innerHTML = triple((l) => `${fmtNum(l, d.total)} · ${fmtNum(l, d.families)}`);
}

let previewTimer = null;
function schedulePreview() {
  clearTimeout(previewTimer);
  previewTimer = setTimeout(() => { renderToolbar(); renderStage(); }, 60);
}

function onPanelInput(e) {
  const d = state.draft;
  const id = e.target.id;
  if (id === 'f-start') {
    d.start = e.target.value;
    if (d.start && (!d.end || d.end < d.start)) {
      d.end = addDays(d.start, 4);
      $('#f-end').value = d.end;
    }
  } else if (id === 'f-end') {
    d.end = e.target.value;
  } else if (id === 'f-total' || id === 'f-families') {
    const v = readInt(e.target.value);
    d[id === 'f-total' ? 'total' : 'families'] = v === null ? 0 : v;
  } else if (id.startsWith('f-title-')) {
    d.needsTitle[id.slice(8)] = e.target.value;
  } else if (id.startsWith('f-need-')) {
    const v = readInt(e.target.value);
    d.needs[id.slice(7)] = v === null ? 0 : Math.min(100, v);
  } else {
    return;
  }
  updatePreviews();
  schedulePreview();
}

function validateDraft(d) {
  if (!d.start || !d.end) return 'اختر تاريخ البداية والنهاية.';
  if (d.end < d.start) return 'تاريخ النهاية قبل تاريخ البداية.';
  if (!LANGS.every((l) => d.needsTitle[l].trim())) return 'اكتب عنوان قسم النسب في اللغات الثلاث.';
  if (NEEDS.some((k) => d.needs[k] > 100)) return 'النسبة لا تتجاوز 100.';
  const clash = state.reports.find((r) => r.id === d.start && (state.draftIsNew || r.id !== state.currentId));
  if (clash) return 'يوجد تقرير آخر يبدأ بنفس التاريخ — افتحه من الأرشيف وعدّله بدلاً من ذلك.';
  return null;
}

function savePanel() {
  const d = state.draft;
  const err = validateDraft(d);
  const box = $('#panel-err');
  if (err) {
    box.textContent = err;
    box.hidden = false;
    return;
  }
  const previousId = state.draftIsNew ? null : state.currentId;
  const report = cloneReport(d);
  report.id = report.start;
  report.needsTitle = { ar: d.needsTitle.ar.trim(), tr: d.needsTitle.tr.trim(), en: d.needsTitle.en.trim() };
  report.updatedAt = new Date().toISOString();
  state.reports = sortReports([report, ...state.reports.filter((r) => r.id !== report.id && r.id !== previousId)]);
  state.currentId = report.id;
  state.pending.push({ action: 'save', report, previousId });
  saveCache();
  closePanel();
  flushPending(true);
}

function deleteCurrent() {
  const r = currentReport();
  if (!r) return;
  if (!confirm(`حذف تقرير ${fmtRange('ar', r.start, r.end)} نهائياً لدى الجميع؟`)) return;
  state.reports = state.reports.filter((x) => x.id !== r.id);
  state.currentId = state.reports[0] ? state.reports[0].id : null;
  state.pending.push({ action: 'delete', id: r.id });
  saveCache();
  closePanel();
  flushPending(true);
}

function changePassword() {
  const pw = prompt('كلمة مرور التعديل المشترك (اتركها فارغة لمسحها):', lsGet(EDIT_PASSWORD_KEY) || '');
  if (pw === null) return;
  if (pw) lsSet(EDIT_PASSWORD_KEY, pw); else lsDel(EDIT_PASSWORD_KEY);
  warnedOnce = false;
  setSync('busy', pw ? 'تم حفظ كلمة المرور في هذا المتصفح' : 'تم مسح كلمة المرور');
}

// ============================================================
// Export: PNG, ZIP, PDF
// ============================================================

function busy(on, text) {
  $('#busy').hidden = !on;
  if (text) $('#busy-text').textContent = text;
  document.querySelectorAll('.topbar button').forEach((b) => { b.disabled = on; });
}

async function renderCanvas(format, lang, r, scale) {
  const host = $('#render-host');
  host.innerHTML = posterHTML(format, lang, r);
  const el = host.firstElementChild;
  if (document.fonts && document.fonts.ready) await document.fonts.ready;
  await Promise.all([...el.querySelectorAll('img')].map((img) => (img.decode ? img.decode().catch(() => {}) : null)));
  try {
    return await html2canvas(el, { scale, useCORS: true, backgroundColor: '#0b1420', logging: false });
  } finally {
    host.innerHTML = '';
  }
}

async function renderPng(format, lang, r) {
  const canvas = await renderCanvas(format, lang, r, FORMATS[format].scale);
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}

// A minimal PDF: one A4 page per image, each page a full-bleed JPEG.
// Built here rather than through the browser's print dialog, because phone
// browsers print without background colours and images (the page came out
// blank and transparent), whatever the page's CSS asks for.
function buildPdf(images) {
  const enc = new TextEncoder();
  const parts = [];
  const offsets = [];
  let length = 0;
  const push = (d) => {
    const bytes = typeof d === 'string' ? enc.encode(d) : d;
    parts.push(bytes);
    length += bytes.length;
  };
  const obj = (id, write) => {
    offsets[id] = length;
    push(`${id} 0 obj\n`);
    write();
    push('\nendobj\n');
  };
  const W = 595.28, H = 841.89; // A4 in points
  push('%PDF-1.4\n%\u00e2\u00e3\u00cf\u00d3\n');
  obj(1, () => push('<< /Type /Catalog /Pages 2 0 R >>'));
  obj(2, () => push(`<< /Type /Pages /Kids [${images.map((_, i) => `${3 + 3 * i} 0 R`).join(' ')}] /Count ${images.length} >>`));
  images.forEach((img, i) => {
    const page = 3 + 3 * i, content = page + 1, image = page + 2;
    const draw = `q ${W} 0 0 ${H} 0 0 cm /Im0 Do Q`;
    obj(page, () => push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /XObject << /Im0 ${image} 0 R >> >> /Contents ${content} 0 R >>`));
    obj(content, () => push(`<< /Length ${draw.length} >>\nstream\n${draw}\nendstream`));
    obj(image, () => {
      push(`<< /Type /XObject /Subtype /Image /Width ${img.width} /Height ${img.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${img.bytes.length} >>\nstream\n`);
      push(img.bytes);
      push('\nendstream');
    });
  });
  const count = 3 + 3 * images.length;
  const xref = length;
  push(`xref\n0 ${count}\n0000000000 65535 f \n${offsets.slice(1).map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('')}`);
  push(`trailer\n<< /Size ${count} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  return new Blob(parts, { type: 'application/pdf' });
}

function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

async function exportImages(formats, langs, r, zipName) {
  const r0 = r || shownReport();
  if (!r0) return;
  const jobs = [];
  formats.forEach((f) => langs.forEach((l) => jobs.push([f, l])));
  try {
    if (jobs.length === 1) {
      busy(true, 'جارٍ تجهيز الصورة…');
      const [f, l] = jobs[0];
      downloadBlob(await renderPng(f, l, r0), fileBase(l, r0, f) + '.png');
      return;
    }
    const files = {};
    for (let i = 0; i < jobs.length; i++) {
      const [f, l] = jobs[i];
      busy(true, `جارٍ تجهيز الصور… ${i + 1} من ${jobs.length}`);
      const blob = await renderPng(f, l, r0);
      files[fileBase(l, r0, f) + '.png'] = new Uint8Array(await blob.arrayBuffer());
    }
    busy(true, 'جارٍ ضغط الملف…');
    const zipped = fflate.zipSync(files, { level: 0 });
    downloadBlob(new Blob([zipped], { type: 'application/zip' }), zipName + '.zip');
  } catch (e) {
    alert('تعذّر إنشاء الصورة: ' + (e && e.message ? e.message : e));
  } finally {
    busy(false);
  }
}

async function exportPdf(langs) {
  const r = shownReport();
  if (!r) return;
  try {
    const images = [];
    for (let i = 0; i < langs.length; i++) {
      busy(true, langs.length > 1 ? `جارٍ تجهيز ملف PDF… ${i + 1} من ${langs.length}` : 'جارٍ تجهيز ملف PDF…');
      const canvas = await renderCanvas('a4', langs[i], r, 2.5);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9));
      images.push({ bytes: new Uint8Array(await blob.arrayBuffer()), width: canvas.width, height: canvas.height });
    }
    const name = langs.length === 1 ? fileBase(langs[0], r, 'a4') : `Güzel Eser - ${fmtRange('en', r.start, r.end)}`;
    downloadBlob(buildPdf(images), name + '.pdf');
  } catch (e) {
    alert('تعذّر إنشاء ملف PDF: ' + (e && e.message ? e.message : e));
  } finally {
    busy(false);
  }
}

function renderExportMenu() {
  const langs = state.lang === 'all' ? LANGS : [state.lang];
  const which = state.lang === 'all' ? 'اللغات الثلاث' : T[state.lang].langName;
  const many = langs.length > 1 ? ' · ملف ZIP' : '';
  $('#export-menu').innerHTML = `
    <button type="button" data-export="pdf"><span class="mi">📄</span><span><div class="mt">ملف PDF</div><div class="ms">A4 للطباعة والإرسال · ${which}</div></span></button>
    <button type="button" data-export="a4"><span class="mi">🖼</span><span><div class="mt">صورة PNG</div><div class="ms">A4 للواتساب والإيميل · ${which}${many}</div></span></button>
    <button type="button" data-export="post"><span class="mi">▣</span><span><div class="mt">منشور إنستغرام / فيسبوك</div><div class="ms">1080×1350 (4:5) · ${which}${many}</div></span></button>
    <button type="button" data-export="story"><span class="mi">▯</span><span><div class="mt">ستوري</div><div class="ms">1080×1920 (9:16) · ${which}${many}</div></span></button>
    <hr>
    <button type="button" data-export="all"><span class="mi">🗂</span><span><div class="mt">تنزيل الكل</div><div class="ms">3 لغات × 3 مقاسات · ملف ZIP واحد</div></span></button>`;
}

function toggleMenu(open) {
  const menu = $('#export-menu');
  const willOpen = open === undefined ? menu.hidden : open;
  if (willOpen) renderExportMenu();
  menu.hidden = !willOpen;
  $('#export-btn').setAttribute('aria-expanded', String(willOpen));
}

function runExport(kind) {
  toggleMenu(false);
  const r = shownReport();
  if (!r) return;
  const langs = state.lang === 'all' ? LANGS : [state.lang];
  const zipName = `Güzel Eser - ${fmtRange('en', r.start, r.end)}`;
  if (kind === 'pdf') exportPdf(langs);
  else if (kind === 'all') exportImages(Object.keys(FORMATS), LANGS, r, zipName);
  else exportImages([kind], langs, r, zipName + ' - ' + kind);
}

// ============================================================
// Wiring
// ============================================================

function wire() {
  $('#lang-tabs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-lang]');
    if (!b) return;
    state.lang = b.dataset.lang;
    renderAll();
  });
  $('#format-tabs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-format]');
    if (!b) return;
    state.format = b.dataset.format;
    renderAll();
  });
  $('#date-btn').addEventListener('click', () => {
    if (state.draft) return; // finish or cancel the edit first
    state.view = state.view === 'archive' ? 'poster' : 'archive';
    renderAll();
  });
  $('#edit-btn').addEventListener('click', () => {
    if (state.draft) return;
    openPanel(false);
  });
  $('#export-btn').addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });
  $('#export-menu').addEventListener('click', (e) => {
    const b = e.target.closest('[data-export]');
    if (b) runExport(b.dataset.export);
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.menu-wrap')) toggleMenu(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    toggleMenu(false);
    if (state.draft) closePanel();
    else if (state.view === 'archive') { state.view = 'poster'; renderAll(); }
  });

  $('#archive').addEventListener('click', (e) => {
    const open = e.target.closest('[data-open]');
    const dl = e.target.closest('[data-download]');
    if (open) {
      state.currentId = open.dataset.open;
      state.view = 'poster';
      renderAll();
      window.scrollTo(0, 0);
    } else if (dl) {
      const r = state.reports.find((x) => x.id === dl.dataset.download);
      const langs = state.lang === 'all' ? LANGS : [state.lang];
      exportImages(['a4'], langs, r, `Güzel Eser - ${fmtRange('en', r.start, r.end)}`);
    } else if (e.target.id === 'archive-back') {
      state.view = 'poster';
      renderAll();
    } else if (e.target.id === 'new-week') {
      openPanel(true);
    }
  });

  const panel = $('#panel');
  panel.addEventListener('input', onPanelInput);
  panel.addEventListener('change', (e) => {
    if (e.target.id === 'f-add-gov' && e.target.value) {
      state.draft.governorates.push(e.target.value);
      renderPanel();
      schedulePreview();
    }
  });
  panel.addEventListener('click', (e) => {
    const rm = e.target.closest('[data-remove-gov]');
    if (rm) {
      state.draft.governorates = state.draft.governorates.filter((g) => g !== rm.dataset.removeGov);
      renderPanel();
      schedulePreview();
      return;
    }
    const id = e.target.id;
    if (id === 'panel-save') savePanel();
    else if (id === 'panel-cancel' || id === 'panel-close') closePanel();
    else if (id === 'panel-delete') deleteCurrent();
    else if (id === 'panel-password') changePassword();
  });

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fitAll, 100);
  });
  // An open page picks up other people's saves without a manual reload.
  setInterval(fetchShared, 30000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) fetchShared(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);
}

function init() {
  const cache = loadCache();
  state.reports = sortReports(cache ? cache.reports : SEED.reports || []);
  state.pending = cache && Array.isArray(cache.pending) ? cache.pending : [];
  state.currentId = state.reports[0] ? state.reports[0].id : null;
  wire();
  renderAll();
  if (state.pending.length) {
    // Edits from an earlier visit never reached the server: try again quietly.
    flushPending(false);
  } else {
    fetchShared();
  }
}

init();
