// ============================================================
// STILVELGER – demodata og plagg-grafikk
// Farger, stiler og anledninger brukes av matche-motoren i app.js
// ============================================================

// ---------- Farger ----------
// neutral: passer til alt. pairsWith: farger den kler godt sammen med.
const COLORS = {
  sort:       { navn: "Sort",       hex: "#26262b", neutral: true,  pairsWith: [] },
  hvit:       { navn: "Hvit",       hex: "#f4f2ec", neutral: true,  pairsWith: [] },
  gra:        { navn: "Grå",        hex: "#9aa0a6", neutral: true,  pairsWith: [] },
  lysgra:     { navn: "Lysegrå",    hex: "#cfd3d8", neutral: true,  pairsWith: [] },
  beige:      { navn: "Beige",      hex: "#d9c7a7", neutral: true,  pairsWith: [] },
  marine:     { navn: "Marineblå",  hex: "#232f4b", neutral: true,  pairsWith: [] },
  denim:      { navn: "Denimblå",   hex: "#5b7aa1", neutral: true,  pairsWith: [] },
  brun:       { navn: "Brun",       hex: "#7a5c43", neutral: true,  pairsWith: [] },
  bla:        { navn: "Blå",        hex: "#3567b2", neutral: false, pairsWith: ["hvit","beige","gra","lysgra","marine","brun","denim","sort"] },
  lysbla:     { navn: "Lyseblå",    hex: "#8fb4dd", neutral: false, pairsWith: ["hvit","beige","marine","gra","brun","denim"] },
  gronn:      { navn: "Grønn",      hex: "#3e6b4f", neutral: false, pairsWith: ["hvit","beige","sort","brun","gra","denim"] },
  oliven:     { navn: "Oliven",     hex: "#6b6b3f", neutral: false, pairsWith: ["hvit","beige","sort","brun","denim"] },
  rod:        { navn: "Rød",        hex: "#b03a3a", neutral: false, pairsWith: ["hvit","sort","gra","marine","denim"] },
  burgunder:  { navn: "Burgunder",  hex: "#6e2b3a", neutral: false, pairsWith: ["hvit","sort","gra","marine","beige","denim"] },
  rosa:       { navn: "Rosa",       hex: "#d99baa", neutral: false, pairsWith: ["hvit","gra","marine","beige","denim"] },
  gul:        { navn: "Sennepsgul", hex: "#c9a13b", neutral: false, pairsWith: ["hvit","marine","gra","brun","denim"] },
};

// ---------- Stiler ----------
const STYLES = {
  casual:     "Casual",
  smart:      "Smart casual",
  street:     "Streetwear",
  klassisk:   "Klassisk",
  sporty:     "Sporty",
};

// ---------- Anledninger ----------
const OCCASIONS = {
  kompiser: { navn: "Ute med kompiser", emoji: "🍻" },
  fest:     { navn: "Fest",             emoji: "🎉" },
  jobb:     { navn: "Jobb",             emoji: "💼" },
  date:     { navn: "Date",             emoji: "🌹" },
  hverdag:  { navn: "Hverdag",          emoji: "☕" },
  aktiv:    { navn: "Aktiv/trening",    emoji: "🏃" },
};

// ---------- Butikker (ekte søkelenker) ----------
const STORES = {
  zalando: { navn: "Zalando", url: q => `https://www.zalando.no/sok/?q=${encodeURIComponent(q)}` },
  hm:      { navn: "H&M",     url: q => `https://www2.hm.com/no_no/search-results.html?q=${encodeURIComponent(q)}` },
  zara:    { navn: "Zara",    url: q => `https://www.zara.com/no/no/search?searchTerm=${encodeURIComponent(q)}` },
  weekday: { navn: "Weekday", url: q => `https://www.weekday.com/search?q=${encodeURIComponent(q)}` },
};

// ---------- Kategorier ----------
const CATEGORIES = {
  overdel:  "Overdel",
  underdel: "Underdel",
  kjole:    "Kjole",
  sko:      "Sko",
  yttertoy: "Yttertøy",
  tilbehor: "Tilbehør",
};

// ---------- Kjønn ----------
// Dameplagg har kjonn: "dame" på plagget. Plagg uten felt er unisex
// hvis id-en står i lista under, ellers herre.
const UNISEX_IDS = new Set([
  "o2","o3","o7","o11","o13","o16","o21","o22","o25",   // t-skjorter, hoodier, sweatshirts
  "u5","u7","u10","u11",                                 // jeans, joggebukser, shorts
  "s1","s4","s5","s7","s8","s11",                        // sneakers og løpesko
  "y2","y3","y5","y7","y10",                             // bomber, denim, parkas, dun, skall
  "t1","t5","t7","t9","t10",                             // caps, solbriller, sekk, lue
]);
function itemKjonn(item) {
  return item.kjonn || (UNISEX_IDS.has(item.id) ? "unisex" : "herre");
}

// ============================================================
// Katalog. Hvert plagg: kategori, type (styrer tegningen),
// farge, stiler, anledninger, pris, butikk og søkeord.
// ============================================================
const ITEMS = [
  // ---------- OVERDELER ----------
  { id: "o1",  navn: "Blå oxfordskjorte",        cat: "overdel", type: "skjorte", color: "bla",       styles: ["smart","klassisk"],  occ: ["kompiser","jobb","date","fest"], pris: 499,  store: "zalando", q: "blå oxford skjorte herre", img: "img/o1-bla-skjorte.jpg" },
  { id: "o2",  navn: "Hvit t-skjorte",            cat: "overdel", type: "tskjorte", color: "hvit",     styles: ["casual","street","sporty"], occ: ["kompiser","hverdag","aktiv","date"], pris: 149,  store: "hm", q: "hvit t-skjorte", img: "img/o2-hvit-tskjorte.jpg" },
  { id: "o3",  navn: "Sort hoodie",               cat: "overdel", type: "hoodie",  color: "sort",      styles: ["street","casual"],   occ: ["kompiser","hverdag"],            pris: 399,  store: "weekday", q: "sort hoodie" },
  { id: "o4",  navn: "Marineblå strikkegenser",   cat: "overdel", type: "genser",  color: "marine",    styles: ["smart","klassisk"],  occ: ["jobb","date","hverdag"],         pris: 599,  store: "zalando", q: "marineblå strikkegenser" },
  { id: "o5",  navn: "Lyseblå linskjorte",        cat: "overdel", type: "skjorte", color: "lysbla",    styles: ["smart","casual"],    occ: ["kompiser","date","fest"],        pris: 449,  store: "zara", q: "lyseblå linskjorte" },
  { id: "o6",  navn: "Burgunder pique",           cat: "overdel", type: "pique",   color: "burgunder", styles: ["smart","klassisk"],  occ: ["kompiser","jobb","date"],        pris: 349,  store: "zalando", q: "burgunder pique herre" },
  { id: "o7",  navn: "Grå sweatshirt",            cat: "overdel", type: "genser",  color: "gra",       styles: ["casual","sporty"],   occ: ["hverdag","kompiser","aktiv"],    pris: 299,  store: "hm", q: "grå sweatshirt" },
  { id: "o8",  navn: "Sort skjorte",              cat: "overdel", type: "skjorte", color: "sort",      styles: ["smart","street"],    occ: ["fest","date","kompiser"],        pris: 429,  store: "zara", q: "sort skjorte herre" },
  { id: "o9",  navn: "Grønn overshirt",           cat: "overdel", type: "overshirt", color: "gronn",   styles: ["casual","street"],   occ: ["kompiser","hverdag"],            pris: 549,  store: "weekday", q: "grønn overshirt" },
  { id: "o10", navn: "Hvit skjorte",              cat: "overdel", type: "skjorte", color: "hvit",      styles: ["klassisk","smart"],  occ: ["jobb","fest","date"],            pris: 399,  store: "hm", q: "hvit skjorte herre" },
  { id: "o11", navn: "Sennepsgul t-skjorte",      cat: "overdel", type: "tskjorte", color: "gul",      styles: ["street","casual"],   occ: ["hverdag","kompiser"],            pris: 179,  store: "weekday", q: "gul t-skjorte" },
  { id: "o12", navn: "Rosa skjorte",              cat: "overdel", type: "skjorte", color: "rosa",      styles: ["smart"],             occ: ["fest","date","jobb"],            pris: 459,  store: "zalando", q: "rosa skjorte herre" },
  { id: "o13", navn: "Sort t-skjorte",            cat: "overdel", type: "tskjorte", color: "sort",     styles: ["street","casual","sporty"], occ: ["kompiser","hverdag","fest","aktiv"], pris: 149, store: "hm", q: "sort t-skjorte", img: "img/o13-sort-tskjorte.jpg" },
  { id: "o14", navn: "Beige strikkegenser",       cat: "overdel", type: "genser",  color: "beige",     styles: ["smart","klassisk","casual"], occ: ["date","hverdag","jobb"],  pris: 549,  store: "zara", q: "beige strikkegenser" },
  { id: "o15", navn: "Rød rutete flanellskjorte", cat: "overdel", type: "skjorte", color: "rod",       styles: ["casual"],            occ: ["hverdag","kompiser"],            pris: 379,  store: "hm", q: "rød flanellskjorte" },
  { id: "o16", navn: "Teknisk treningstrøye",     cat: "overdel", type: "tskjorte", color: "gra",      styles: ["sporty"],            occ: ["aktiv"],                         pris: 249,  store: "zalando", q: "teknisk t-skjorte trening" },

  // ---------- UNDERDELER ----------
  { id: "u1",  navn: "Beige chinos",              cat: "underdel", type: "bukse",  color: "beige",     styles: ["smart","klassisk","casual"], occ: ["kompiser","jobb","date","fest"], pris: 449, store: "zalando", q: "beige chinos" },
  { id: "u2",  navn: "Mørk slim jeans",           cat: "underdel", type: "bukse",  color: "denim",     styles: ["casual","smart","street"], occ: ["kompiser","hverdag","date","fest"], pris: 599, store: "weekday", q: "mørk slim jeans", img: "img/u2-mork-jeans.jpg" },
  { id: "u3",  navn: "Sort bukse",                cat: "underdel", type: "bukse",  color: "sort",      styles: ["smart","street","klassisk"], occ: ["fest","jobb","date","kompiser"], pris: 499, store: "zara", q: "sort bukse herre" },
  { id: "u4",  navn: "Grå ullbukse",              cat: "underdel", type: "bukse",  color: "gra",       styles: ["klassisk","smart"],  occ: ["jobb","date"],                   pris: 699,  store: "zalando", q: "grå ullbukse herre" },
  { id: "u5",  navn: "Lys vintage-jeans",         cat: "underdel", type: "bukse",  color: "lysbla",    styles: ["street","casual"],   occ: ["hverdag","kompiser"],            pris: 549,  store: "weekday", q: "lys jeans loose fit", img: "img/u5-lys-jeans.jpg" },
  { id: "u6",  navn: "Marineblå chinos",          cat: "underdel", type: "bukse",  color: "marine",    styles: ["smart","klassisk"],  occ: ["jobb","date","kompiser"],        pris: 449,  store: "hm", q: "marineblå chinos" },
  { id: "u7",  navn: "Sorte joggebukser",         cat: "underdel", type: "joggebukse", color: "sort",  styles: ["sporty","street","casual"], occ: ["aktiv","hverdag"],         pris: 299,  store: "hm", q: "sort joggebukse" },
  { id: "u8",  navn: "Beige cargo-shorts",        cat: "underdel", type: "shorts", color: "beige",     styles: ["casual","street"],   occ: ["hverdag","kompiser"],            pris: 329,  store: "zara", q: "beige cargo shorts" },
  { id: "u9",  navn: "Oliven cargobukse",         cat: "underdel", type: "bukse",  color: "oliven",    styles: ["street","casual"],   occ: ["hverdag","kompiser"],            pris: 499,  store: "weekday", q: "oliven cargobukse" },
  { id: "u10", navn: "Treningsshorts",            cat: "underdel", type: "shorts", color: "sort",      styles: ["sporty"],            occ: ["aktiv"],                         pris: 199,  store: "hm", q: "treningsshorts herre" },

  // ---------- SKO ----------
  { id: "s1",  navn: "Hvite sneakers",            cat: "sko", type: "sneaker",     color: "hvit",      styles: ["casual","smart","street","sporty"], occ: ["kompiser","hverdag","date","fest","jobb"], pris: 899, store: "zalando", q: "hvite sneakers" },
  { id: "s2",  navn: "Brune semskede boots",      cat: "sko", type: "boots",       color: "brun",      styles: ["smart","klassisk","casual"], occ: ["date","jobb","kompiser","fest"], pris: 1199, store: "zalando", q: "brune semskede boots chukka", img: "img/s2-brune-boots.jpg" },
  { id: "s3",  navn: "Sorte chelsea boots",       cat: "sko", type: "boots",       color: "sort",      styles: ["smart","klassisk"],  occ: ["fest","jobb","date"],            pris: 1299, store: "zara", q: "sorte chelsea boots" },
  { id: "s4",  navn: "Retro joggesko",            cat: "sko", type: "sneaker",     color: "gra",       styles: ["street","casual","sporty"], occ: ["hverdag","kompiser","aktiv"], pris: 999, store: "zalando", q: "retro joggesko" },
  { id: "s5",  navn: "Sorte sneakers",            cat: "sko", type: "sneaker",     color: "sort",      styles: ["street","casual","sporty"], occ: ["kompiser","hverdag","fest","aktiv"], pris: 849, store: "hm", q: "sorte sneakers" },
  { id: "s6",  navn: "Brune loafers",             cat: "sko", type: "loafer",      color: "brun",      styles: ["klassisk","smart"],  occ: ["jobb","date","fest"],            pris: 1099, store: "zalando", q: "brune loafers" },
  { id: "s7",  navn: "Løpesko",                   cat: "sko", type: "sneaker",     color: "bla",       styles: ["sporty"],            occ: ["aktiv"],                         pris: 1299, store: "zalando", q: "løpesko herre" },

  // ---------- YTTERTØY ----------
  { id: "y1",  navn: "Beige trenchcoat",          cat: "yttertoy", type: "frakk",  color: "beige",     styles: ["klassisk","smart"],  occ: ["jobb","date"],                   pris: 1499, store: "zara", q: "beige trenchcoat" },
  { id: "y2",  navn: "Sort bomberjakke",          cat: "yttertoy", type: "jakke",  color: "sort",      styles: ["street","casual"],   occ: ["kompiser","fest","hverdag"],     pris: 799,  store: "weekday", q: "sort bomberjakke" },
  { id: "y3",  navn: "Denimjakke",                cat: "yttertoy", type: "jakke",  color: "denim",     styles: ["casual","street"],   occ: ["kompiser","hverdag"],            pris: 699,  store: "hm", q: "denimjakke herre" },
  { id: "y4",  navn: "Marineblå blazer",          cat: "yttertoy", type: "blazer", color: "marine",    styles: ["klassisk","smart"],  occ: ["jobb","fest","date"],            pris: 1299, store: "zalando", q: "marineblå blazer" },
  { id: "y5",  navn: "Grønn parkas",              cat: "yttertoy", type: "frakk",  color: "gronn",     styles: ["casual"],            occ: ["hverdag","kompiser"],            pris: 1199, store: "hm", q: "grønn parkas herre" },
  { id: "y6",  navn: "Grå ullfrakk",              cat: "yttertoy", type: "frakk",  color: "gra",       styles: ["klassisk","smart"],  occ: ["jobb","date","fest"],            pris: 1799, store: "zara", q: "grå ullfrakk herre" },

  // ---------- TILBEHØR ----------
  { id: "t1",  navn: "Sort caps",                 cat: "tilbehor", type: "caps",   color: "sort",      styles: ["street","casual","sporty"], occ: ["hverdag","kompiser","aktiv"], pris: 199, store: "weekday", q: "sort caps" },
  { id: "t2",  navn: "Brunt skinnbelte",          cat: "tilbehor", type: "belte",  color: "brun",      styles: ["klassisk","smart"],  occ: ["jobb","date","fest","kompiser"], pris: 299,  store: "zalando", q: "brunt skinnbelte" },
  { id: "t3",  navn: "Sølvklokke",                cat: "tilbehor", type: "klokke", color: "lysgra",    styles: ["klassisk","smart"],  occ: ["jobb","date","fest"],            pris: 1499, store: "zalando", q: "klokke sølv herre" },
  { id: "t4",  navn: "Sort belte",                cat: "tilbehor", type: "belte",  color: "sort",      styles: ["smart","street","klassisk"], occ: ["fest","jobb","kompiser"],  pris: 249,  store: "hm", q: "sort belte herre" },

  // ---------- FLERE OVERDELER ----------
  { id: "o17", navn: "Hvit pique",                 cat: "overdel", type: "pique",   color: "hvit",      styles: ["smart","klassisk"],  occ: ["kompiser","jobb","date"],        pris: 349,  store: "zalando", q: "hvit pique herre" },
  { id: "o18", navn: "Sort rullekragegenser",      cat: "overdel", type: "genser",  color: "sort",      styles: ["klassisk","smart"],  occ: ["jobb","date","fest"],            pris: 499,  store: "hm", q: "sort rullekragegenser" },
  { id: "o19", navn: "Grå strikkecardigan",        cat: "overdel", type: "genser",  color: "gra",       styles: ["smart","casual"],    occ: ["hverdag","jobb","date"],         pris: 649,  store: "zara", q: "grå cardigan herre" },
  { id: "o20", navn: "Marineblå hoodie",           cat: "overdel", type: "hoodie",  color: "marine",    styles: ["street","casual"],   occ: ["kompiser","hverdag"],            pris: 449,  store: "weekday", q: "marineblå hoodie" },
  { id: "o21", navn: "Lyseblå t-skjorte",          cat: "overdel", type: "tskjorte", color: "lysbla",   styles: ["casual","sporty"],   occ: ["hverdag","kompiser","aktiv"],    pris: 179,  store: "hm", q: "lyseblå t-skjorte" },
  { id: "o22", navn: "Oliven t-skjorte",           cat: "overdel", type: "tskjorte", color: "oliven",   styles: ["street","casual"],   occ: ["hverdag","kompiser"],            pris: 199,  store: "weekday", q: "oliven t-skjorte" },
  { id: "o23", navn: "Burgunder strikkegenser",    cat: "overdel", type: "genser",  color: "burgunder", styles: ["klassisk","smart"],  occ: ["date","jobb","fest"],            pris: 599,  store: "zalando", q: "burgunder strikkegenser" },
  { id: "o24", navn: "Denimskjorte",               cat: "overdel", type: "skjorte", color: "denim",     styles: ["casual"],            occ: ["kompiser","hverdag"],            pris: 499,  store: "zara", q: "denimskjorte herre" },
  { id: "o25", navn: "Hvit sweatshirt",            cat: "overdel", type: "genser",  color: "hvit",      styles: ["casual","sporty"],   occ: ["hverdag","kompiser"],            pris: 349,  store: "hm", q: "hvit sweatshirt", img: "img/o25-hvit-sweatshirt.jpg" },

  // ---------- FLERE UNDERDELER ----------
  { id: "u11", navn: "Grå joggebukse",             cat: "underdel", type: "joggebukse", color: "gra",   styles: ["sporty","casual"],   occ: ["aktiv","hverdag"],               pris: 299,  store: "hm", q: "grå joggebukse" },
  { id: "u12", navn: "Sorte cargobukser",          cat: "underdel", type: "bukse",  color: "sort",      styles: ["street"],            occ: ["kompiser","hverdag"],            pris: 549,  store: "weekday", q: "sorte cargobukser" },
  { id: "u13", navn: "Brun kordfløyelsbukse",      cat: "underdel", type: "bukse",  color: "brun",      styles: ["klassisk","casual"], occ: ["hverdag","jobb","date"],         pris: 599,  store: "zalando", q: "brun kordfløyelsbukse" },
  { id: "u14", navn: "Marineblå shorts",           cat: "underdel", type: "shorts", color: "marine",    styles: ["casual","smart"],    occ: ["hverdag","kompiser"],            pris: 299,  store: "hm", q: "marineblå shorts" },
  { id: "u15", navn: "Beige linbukse",             cat: "underdel", type: "bukse",  color: "beige",     styles: ["smart","casual"],    occ: ["date","fest","kompiser"],        pris: 499,  store: "zara", q: "beige linbukse herre" },
  { id: "u16", navn: "Lysegrå dressbukse",         cat: "underdel", type: "bukse",  color: "lysgra",    styles: ["klassisk","smart"],  occ: ["jobb","fest"],                   pris: 649,  store: "zalando", q: "lysegrå dressbukse" },

  // ---------- FLERE SKO ----------
  { id: "s8",  navn: "Hvite retro-tennissko",      cat: "sko", type: "sneaker",     color: "hvit",      styles: ["casual","klassisk"], occ: ["hverdag","kompiser","date"],     pris: 799,  store: "zalando", q: "hvite tennissko retro" },
  { id: "s9",  navn: "Sorte boots",                cat: "sko", type: "boots",       color: "sort",      styles: ["street","casual"],   occ: ["kompiser","hverdag","fest"],     pris: 1199, store: "weekday", q: "sorte boots herre" },
  { id: "s10", navn: "Brune semskede sneakers",    cat: "sko", type: "sneaker",     color: "brun",      styles: ["smart","casual"],    occ: ["kompiser","date","hverdag"],     pris: 949,  store: "zalando", q: "brune semskede sneakers" },
  { id: "s11", navn: "Grå løpesko",                cat: "sko", type: "sneaker",     color: "gra",       styles: ["sporty"],            occ: ["aktiv"],                         pris: 1099, store: "zalando", q: "grå løpesko" },

  // ---------- MER YTTERTØY ----------
  { id: "y7",  navn: "Sort dunjakke",              cat: "yttertoy", type: "jakke",  color: "sort",      styles: ["street","casual","sporty"], occ: ["hverdag","kompiser"],     pris: 999,  store: "hm", q: "sort dunjakke herre" },
  { id: "y8",  navn: "Sort skinnjakke",            cat: "yttertoy", type: "jakke",  color: "sort",      styles: ["casual","street","klassisk"], occ: ["kompiser","date","fest"],  pris: 1999, store: "zalando", q: "sort skinnjakke herre", img: "img/y8-sort-skinnjakke.jpg" },
  { id: "y11", navn: "Rustbrun bomberjakke",       cat: "yttertoy", type: "jakke",  color: "brun",      styles: ["casual","street"],   occ: ["kompiser","hverdag","fest"],     pris: 899,  store: "zalando", q: "brun bomberjakke herre", img: "img/y11-rustbrun-bomber.jpg" },
  { id: "y9",  navn: "Oliven bomberjakke",         cat: "yttertoy", type: "jakke",  color: "oliven",    styles: ["street","casual"],   occ: ["kompiser","hverdag","fest"],     pris: 849,  store: "weekday", q: "oliven bomberjakke" },
  { id: "y10", navn: "Sort skalljakke",            cat: "yttertoy", type: "jakke",  color: "sort",      styles: ["sporty","casual"],   occ: ["aktiv","hverdag"],               pris: 1299, store: "zalando", q: "sort skalljakke herre" },

  // ---------- MER TILBEHØR ----------
  { id: "t5",  navn: "Runde solbriller",           cat: "tilbehor", type: "solbriller", color: "sort",  styles: ["street","smart"],    occ: ["kompiser","fest","date","hverdag"], pris: 299, store: "zara", q: "runde solbriller", img: "img/t5-runde-solbriller.jpg" },
  { id: "t10", navn: "Grå caps",                   cat: "tilbehor", type: "caps",   color: "gra",       styles: ["street","casual","sporty"], occ: ["hverdag","kompiser","aktiv"], pris: 249, store: "zalando", q: "grå caps", img: "img/t10-gra-caps.jpg" },
  { id: "t6",  navn: "Beige skjerf",               cat: "tilbehor", type: "skjerf", color: "beige",     styles: ["klassisk","smart"],  occ: ["jobb","date","hverdag"],         pris: 349,  store: "hm", q: "beige skjerf" },
  { id: "t7",  navn: "Sort ryggsekk",              cat: "tilbehor", type: "sekk",   color: "sort",      styles: ["street","sporty","casual"], occ: ["hverdag","aktiv"],        pris: 699,  store: "zalando", q: "sort ryggsekk" },
  { id: "t8",  navn: "Klokke med skinnrem",        cat: "tilbehor", type: "klokke", color: "brun",      styles: ["klassisk"],          occ: ["jobb","date","fest"],            pris: 1799, store: "zalando", q: "klokke skinnrem herre" },
  { id: "t9",  navn: "Sort lue",                   cat: "tilbehor", type: "lue",    color: "sort",      styles: ["street","casual"],   occ: ["hverdag","kompiser"],            pris: 199,  store: "weekday", q: "sort lue beanie" },

  // ================== DAMEKATALOG ==================
  // ---------- Overdeler ----------
  { id: "d1",  navn: "Hvit bluse",                 cat: "overdel", type: "bluse",   color: "hvit",      kjonn: "dame", styles: ["smart","klassisk"],  occ: ["jobb","date","fest"],           pris: 449,  store: "zalando", q: "hvit bluse dame" },
  { id: "d2",  navn: "Sort topp",                  cat: "overdel", type: "topp",    color: "sort",      kjonn: "dame", styles: ["street","smart"],    occ: ["fest","date","kompiser"],       pris: 199,  store: "hm", q: "sort topp dame" },
  { id: "d3",  navn: "Rosa strikkegenser",         cat: "overdel", type: "genser",  color: "rosa",      kjonn: "dame", styles: ["smart","casual"],    occ: ["hverdag","date","jobb"],        pris: 499,  store: "zalando", q: "rosa strikkegenser dame" },
  { id: "d4",  navn: "Beige cardigan",             cat: "overdel", type: "genser",  color: "beige",     kjonn: "dame", styles: ["casual","klassisk"], occ: ["hverdag","jobb","date"],        pris: 549,  store: "zara", q: "beige cardigan dame" },
  { id: "d5",  navn: "Lyseblå skjorte",            cat: "overdel", type: "skjorte", color: "lysbla",    kjonn: "dame", styles: ["smart","klassisk"],  occ: ["jobb","date","kompiser"],       pris: 499,  store: "zalando", q: "lyseblå skjorte dame" },
  { id: "d6",  navn: "Burgunder sateng-topp",      cat: "overdel", type: "topp",    color: "burgunder", kjonn: "dame", styles: ["smart"],             occ: ["fest","date"],                  pris: 249,  store: "hm", q: "burgunder topp dame" },

  // ---------- Kjoler ----------
  { id: "d8",  navn: "Sort minikjole",             cat: "kjole",   type: "kjole",   color: "sort",      kjonn: "dame", styles: ["smart","street"],    occ: ["fest","date"],                  pris: 599,  store: "zara", q: "sort minikjole" },
  { id: "d9",  navn: "Rosa sommerkjole",           cat: "kjole",   type: "kjole",   color: "rosa",      kjonn: "dame", styles: ["casual","smart"],    occ: ["date","hverdag","fest"],        pris: 549,  store: "hm", q: "rosa sommerkjole" },
  { id: "d10", navn: "Marineblå midikjole",        cat: "kjole",   type: "kjole",   color: "marine",    kjonn: "dame", styles: ["klassisk","smart"],  occ: ["jobb","date","fest"],           pris: 799,  store: "zalando", q: "marineblå midikjole" },
  { id: "d23", navn: "Rød kjole",                  cat: "kjole",   type: "kjole",   color: "rod",       kjonn: "dame", styles: ["smart"],             occ: ["fest","date"],                  pris: 699,  store: "zara", q: "rød kjole" },
  { id: "d24", navn: "Grå strikkekjole",           cat: "kjole",   type: "kjole",   color: "gra",       kjonn: "dame", styles: ["casual","klassisk"], occ: ["hverdag","jobb","date"],        pris: 649,  store: "hm", q: "grå strikkekjole" },

  // ---------- Underdeler ----------
  { id: "d11", navn: "Sort skjørt",                cat: "underdel", type: "skjort", color: "sort",      kjonn: "dame", styles: ["smart","street"],    occ: ["fest","date","jobb"],           pris: 399,  store: "hm", q: "sort skjørt" },
  { id: "d12", navn: "Beige plissert skjørt",      cat: "underdel", type: "skjort", color: "beige",     kjonn: "dame", styles: ["klassisk","smart"],  occ: ["jobb","date"],                  pris: 499,  store: "zalando", q: "beige plissert skjørt" },
  { id: "d13", navn: "Vintage-jeans med høyt liv", cat: "underdel", type: "bukse",  color: "denim",     kjonn: "dame", styles: ["casual","street"],   occ: ["hverdag","kompiser","date"],    pris: 599,  store: "weekday", q: "high waist jeans dame" },
  { id: "d14", navn: "Sorte leggings",             cat: "underdel", type: "joggebukse", color: "sort",  kjonn: "dame", styles: ["sporty","casual"],   occ: ["aktiv","hverdag"],              pris: 249,  store: "hm", q: "sorte leggings" },
  { id: "d15", navn: "Hvit linbukse",              cat: "underdel", type: "bukse",  color: "hvit",      kjonn: "dame", styles: ["smart"],             occ: ["date","fest","kompiser"],       pris: 549,  store: "zara", q: "hvit linbukse dame" },

  // ---------- Sko ----------
  { id: "d16", navn: "Sorte pumps",                cat: "sko",     type: "pumps",   color: "sort",      kjonn: "dame", styles: ["klassisk","smart"],  occ: ["fest","jobb","date"],           pris: 899,  store: "zalando", q: "sorte pumps" },
  { id: "d17", navn: "Beige ballerinasko",         cat: "sko",     type: "pumps",   color: "beige",     kjonn: "dame", styles: ["klassisk","smart"],  occ: ["jobb","date","hverdag"],        pris: 599,  store: "zalando", q: "beige ballerinasko" },
  { id: "d18", navn: "Brune høye støvletter",      cat: "sko",     type: "boots",   color: "brun",      kjonn: "dame", styles: ["klassisk","smart"],  occ: ["jobb","date","fest"],           pris: 1399, store: "zalando", q: "brune støvletter dame" },

  // ---------- Yttertøy ----------
  { id: "d19", navn: "Beige kåpe",                 cat: "yttertoy", type: "frakk",  color: "beige",     kjonn: "dame", styles: ["klassisk","smart"],  occ: ["jobb","date"],                  pris: 1599, store: "zara", q: "beige kåpe" },
  { id: "d20", navn: "Sort blazer",                cat: "yttertoy", type: "blazer", color: "sort",      kjonn: "dame", styles: ["smart","klassisk"],  occ: ["jobb","fest","date"],           pris: 999,  store: "hm", q: "sort blazer dame" },

  // ---------- Tilbehør ----------
  { id: "d21", navn: "Sort håndveske",             cat: "tilbehor", type: "veske",  color: "sort",      kjonn: "dame", styles: ["smart","klassisk"],  occ: ["fest","jobb","date"],           pris: 799,  store: "zalando", q: "sort håndveske" },
  { id: "d22", navn: "Beige skulderveske",         cat: "tilbehor", type: "veske",  color: "beige",     kjonn: "dame", styles: ["smart","casual"],    occ: ["hverdag","date","kompiser"],    pris: 599,  store: "hm", q: "beige skulderveske" },
];

// ============================================================
// Plagg-grafikk: enkle SVG-tegninger farget etter plaggets farge
// ============================================================

// Gjør en hex-farge mørkere (til detaljer/kontur)
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amt));
  const b = Math.max(0, Math.min(255, (n & 0xff) + amt));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function garmentSVG(type, hex) {
  const d = shade(hex, -35);   // mørkere detaljfarge
  const l = shade(hex, 30);    // lysere detalj
  const bodies = {
    skjorte: `
      <path d="M30 22 L42 16 L50 22 L58 16 L70 22 L82 34 L74 44 L70 40 L70 84 L30 84 L30 40 L26 44 L18 34 Z" fill="${hex}" stroke="${d}" stroke-width="2"/>
      <path d="M42 16 L50 26 L58 16 L54 20 L50 30 L46 20 Z" fill="${d}"/>
      <line x1="50" y1="30" x2="50" y2="82" stroke="${d}" stroke-width="1.5"/>
      <circle cx="50" cy="40" r="1.4" fill="${d}"/><circle cx="50" cy="50" r="1.4" fill="${d}"/>
      <circle cx="50" cy="60" r="1.4" fill="${d}"/><circle cx="50" cy="70" r="1.4" fill="${d}"/>`,
    tskjorte: `
      <path d="M32 20 L44 15 Q50 20 56 15 L68 20 L80 32 L72 42 L68 38 L68 84 L32 84 L32 38 L28 42 L20 32 Z" fill="${hex}" stroke="${d}" stroke-width="2"/>
      <path d="M44 15 Q50 24 56 15" fill="none" stroke="${d}" stroke-width="2"/>`,
    pique: `
      <path d="M32 20 L44 15 L50 22 L56 15 L68 20 L80 32 L72 42 L68 38 L68 84 L32 84 L32 38 L28 42 L20 32 Z" fill="${hex}" stroke="${d}" stroke-width="2"/>
      <path d="M44 15 L47 19 L50 30 L53 19 L56 15 L52 17 L50 22 L48 17 Z" fill="${d}"/>
      <circle cx="50" cy="34" r="1.2" fill="${d}"/><circle cx="50" cy="27" r="1.2" fill="${d}"/>`,
    genser: `
      <path d="M32 22 L44 16 Q50 21 56 16 L68 22 L80 34 L72 44 L68 40 L68 80 L32 80 L32 40 L28 44 L20 34 Z" fill="${hex}" stroke="${d}" stroke-width="2"/>
      <path d="M44 16 Q50 25 56 16" fill="none" stroke="${d}" stroke-width="3"/>
      <rect x="32" y="78" width="36" height="6" fill="${d}" opacity="0.5"/>
      <line x1="36" y1="79" x2="36" y2="84" stroke="${d}" stroke-width="1"/>
      <line x1="44" y1="79" x2="44" y2="84" stroke="${d}" stroke-width="1"/>
      <line x1="52" y1="79" x2="52" y2="84" stroke="${d}" stroke-width="1"/>
      <line x1="60" y1="79" x2="60" y2="84" stroke="${d}" stroke-width="1"/>`,
    hoodie: `
      <path d="M32 24 L42 18 L58 18 L68 24 L80 36 L72 46 L68 42 L68 84 L32 84 L32 42 L28 46 L20 36 Z" fill="${hex}" stroke="${d}" stroke-width="2"/>
      <path d="M42 18 Q50 8 58 18 Q54 26 50 26 Q46 26 42 18 Z" fill="${l}" stroke="${d}" stroke-width="2"/>
      <line x1="47" y1="26" x2="46" y2="38" stroke="${d}" stroke-width="1.5"/>
      <line x1="53" y1="26" x2="54" y2="38" stroke="${d}" stroke-width="1.5"/>
      <path d="M38 66 L62 66 L60 80 L40 80 Z" fill="${l}" opacity="0.6" stroke="${d}" stroke-width="1.5"/>`,
    overshirt: `
      <path d="M30 22 L42 16 L50 24 L58 16 L70 22 L82 34 L74 44 L70 40 L70 84 L30 84 L30 40 L26 44 L18 34 Z" fill="${hex}" stroke="${d}" stroke-width="2"/>
      <path d="M42 16 L50 26 L58 16 L54 20 L50 30 L46 20 Z" fill="${d}"/>
      <line x1="50" y1="30" x2="50" y2="82" stroke="${d}" stroke-width="2"/>
      <rect x="35" y="46" width="10" height="10" fill="none" stroke="${d}" stroke-width="1.5"/>
      <rect x="55" y="46" width="10" height="10" fill="none" stroke="${d}" stroke-width="1.5"/>`,
    bukse: `
      <path d="M34 16 L66 16 L68 30 L70 84 L56 84 L52 40 L48 40 L44 84 L30 84 L32 30 Z" fill="${hex}" stroke="${d}" stroke-width="2"/>
      <rect x="34" y="16" width="32" height="6" fill="${d}" opacity="0.4"/>
      <line x1="50" y1="24" x2="50" y2="38" stroke="${d}" stroke-width="1.5"/>`,
    joggebukse: `
      <path d="M34 16 L66 16 L68 30 L68 82 L56 82 L53 40 L47 40 L44 82 L32 82 Z" fill="${hex}" stroke="${d}" stroke-width="2"/>
      <rect x="34" y="16" width="32" height="6" fill="${l}" opacity="0.7"/>
      <path d="M40 19 Q50 23 60 19" fill="none" stroke="${d}" stroke-width="1.5"/>
      <rect x="32" y="78" width="12" height="5" fill="${d}" opacity="0.5"/>
      <rect x="56" y="78" width="12" height="5" fill="${d}" opacity="0.5"/>`,
    shorts: `
      <path d="M32 26 L68 26 L72 62 L54 62 L50 42 L46 62 L28 62 Z" fill="${hex}" stroke="${d}" stroke-width="2"/>
      <rect x="32" y="26" width="36" height="6" fill="${d}" opacity="0.4"/>`,
    sneaker: `
      <path d="M18 62 Q18 52 26 50 L44 46 Q50 45 54 49 L64 58 Q74 60 80 64 Q84 66 83 70 L82 74 L18 74 Z" fill="${hex}" stroke="${d}" stroke-width="2"/>
      <path d="M16 74 L84 74 L83 79 Q60 83 30 81 Q18 80 16 76 Z" fill="${l}" stroke="${d}" stroke-width="1.5"/>
      <line x1="34" y1="52" x2="42" y2="58" stroke="${d}" stroke-width="1.5"/>
      <line x1="30" y1="55" x2="38" y2="61" stroke="${d}" stroke-width="1.5"/>`,
    boots: `
      <path d="M30 24 L54 24 L54 52 Q66 54 76 62 Q82 66 81 71 L80 76 L26 76 L28 50 Z" fill="${hex}" stroke="${d}" stroke-width="2"/>
      <path d="M24 76 L82 76 L81 81 Q55 85 32 82 Q24 81 24 78 Z" fill="${shade(hex,-60)}" stroke="${d}" stroke-width="1.5"/>
      <path d="M30 30 L54 30" stroke="${d}" stroke-width="1.5"/>`,
    loafer: `
      <path d="M20 62 Q22 54 32 52 L48 49 Q54 48 58 52 L68 60 Q78 62 82 66 Q85 68 84 72 L83 75 L20 75 Z" fill="${hex}" stroke="${d}" stroke-width="2"/>
      <path d="M40 54 Q48 50 56 55 L52 60 Q46 57 42 59 Z" fill="${d}" opacity="0.6"/>
      <path d="M18 75 L84 75 L83 79 Q55 82 30 80 Q19 79 18 77 Z" fill="${shade(hex,-60)}"/>`,
    frakk: `
      <path d="M32 18 L44 14 L50 22 L56 14 L68 18 L78 30 L72 40 L68 36 L68 88 L52 88 L52 50 L48 50 L48 88 L32 88 L32 36 L28 40 L22 30 Z" fill="${hex}" stroke="${d}" stroke-width="2"/>
      <path d="M44 14 L50 24 L56 14" fill="none" stroke="${d}" stroke-width="2"/>
      <line x1="50" y1="26" x2="50" y2="48" stroke="${d}" stroke-width="1.5"/>
      <path d="M34 52 L46 52" stroke="${d}" stroke-width="1.5"/>
      <path d="M54 52 L66 52" stroke="${d}" stroke-width="1.5"/>`,
    jakke: `
      <path d="M30 22 L42 16 L50 24 L58 16 L70 22 L80 34 L73 43 L68 39 L68 80 L32 80 L32 39 L27 43 L20 34 Z" fill="${hex}" stroke="${d}" stroke-width="2"/>
      <path d="M42 16 L50 26 L58 16" fill="none" stroke="${d}" stroke-width="2"/>
      <line x1="50" y1="26" x2="50" y2="78" stroke="${d}" stroke-width="2.5"/>
      <rect x="32" y="76" width="36" height="6" fill="${d}" opacity="0.5"/>
      <path d="M36 48 L44 48 L44 58 L36 58 Z" fill="none" stroke="${d}" stroke-width="1.5"/>
      <path d="M56 48 L64 48 L64 58 L56 58 Z" fill="none" stroke="${d}" stroke-width="1.5"/>`,
    blazer: `
      <path d="M32 20 L44 14 L50 30 L56 14 L68 20 L78 32 L72 42 L68 38 L68 84 L52 84 L52 60 L48 60 L48 84 L32 84 L32 38 L28 42 L22 32 Z" fill="${hex}" stroke="${d}" stroke-width="2"/>
      <path d="M44 14 L50 30 L44 40 L40 24 Z" fill="${d}" opacity="0.55"/>
      <path d="M56 14 L50 30 L56 40 L60 24 Z" fill="${d}" opacity="0.55"/>
      <circle cx="50" cy="48" r="1.5" fill="${d}"/><circle cx="50" cy="56" r="1.5" fill="${d}"/>
      <path d="M36 56 L44 56" stroke="${d}" stroke-width="1.5"/>`,
    caps: `
      <path d="M26 56 Q26 32 50 32 Q74 32 74 56 L74 60 L26 60 Z" fill="${hex}" stroke="${d}" stroke-width="2"/>
      <path d="M24 60 L76 60 Q88 60 90 66 Q90 69 86 69 L28 66 Q24 65 24 62 Z" fill="${d}"/>
      <path d="M50 32 L50 58" stroke="${d}" stroke-width="1.5"/>
      <circle cx="50" cy="32" r="2.5" fill="${d}"/>`,
    belte: `
      <path d="M14 44 L86 44 L86 58 L14 58 Z" fill="${hex}" stroke="${d}" stroke-width="2" rx="4"/>
      <rect x="40" y="40" width="16" height="22" fill="none" stroke="${l}" stroke-width="3.5" rx="3"/>
      <line x1="48" y1="44" x2="48" y2="58" stroke="${l}" stroke-width="2.5"/>
      <circle cx="26" cy="51" r="1.6" fill="${d}"/><circle cx="33" cy="51" r="1.6" fill="${d}"/>`,
    bluse: `
      <path d="M33 20 L44 14 Q50 20 56 14 L67 20 L78 33 L71 42 L67 38 L69 82 Q60 87 50 87 Q40 87 31 82 L33 38 L29 42 L22 33 Z" fill="${hex}" stroke="${d}" stroke-width="2"/>
      <path d="M44 14 Q50 23 56 14" fill="none" stroke="${d}" stroke-width="2"/>
      <path d="M50 23 L50 34" stroke="${d}" stroke-width="1.5"/>
      <circle cx="50" cy="28" r="1.2" fill="${d}"/><circle cx="50" cy="33" r="1.2" fill="${d}"/>
      <path d="M36 78 Q50 84 64 78" fill="none" stroke="${d}" stroke-width="1.5" opacity="0.6"/>`,
    topp: `
      <path d="M38 16 L42 14 Q44 30 50 30 Q56 30 58 14 L62 16 L66 26 L64 84 Q50 88 36 84 L34 26 Z" fill="${hex}" stroke="${d}" stroke-width="2"/>
      <path d="M42 14 Q44 30 50 30 Q56 30 58 14" fill="none" stroke="${d}" stroke-width="2"/>
      <path d="M38 76 Q50 80 62 76" fill="none" stroke="${d}" stroke-width="1.2" opacity="0.5"/>`,
    kjole: `
      <path d="M38 14 L44 12 Q46 24 50 24 Q54 24 56 12 L62 14 L66 26 L62 48 L72 86 Q50 93 28 86 L38 48 L34 26 Z" fill="${hex}" stroke="${d}" stroke-width="2"/>
      <path d="M44 12 Q46 24 50 24 Q54 24 56 12" fill="none" stroke="${d}" stroke-width="2"/>
      <path d="M38 48 L62 48" stroke="${d}" stroke-width="1.5" opacity="0.7"/>
      <path d="M44 52 L40 84" stroke="${d}" stroke-width="1" opacity="0.4"/>
      <path d="M56 52 L60 84" stroke="${d}" stroke-width="1" opacity="0.4"/>
      <path d="M50 52 L50 86" stroke="${d}" stroke-width="1" opacity="0.4"/>`,
    skjort: `
      <path d="M36 24 L64 24 L66 32 L74 76 Q50 83 26 76 L34 32 Z" fill="${hex}" stroke="${d}" stroke-width="2"/>
      <rect x="35" y="24" width="30" height="7" fill="${d}" opacity="0.4"/>
      <path d="M42 33 L37 74" stroke="${d}" stroke-width="1" opacity="0.4"/>
      <path d="M50 33 L50 78" stroke="${d}" stroke-width="1" opacity="0.4"/>
      <path d="M58 33 L63 74" stroke="${d}" stroke-width="1" opacity="0.4"/>`,
    pumps: `
      <path d="M20 58 Q30 44 44 46 Q60 48 70 56 Q80 60 82 66 L82 70 L72 70 Q62 62 50 62 L34 68 L20 68 Z" fill="${hex}" stroke="${d}" stroke-width="2"/>
      <path d="M74 70 L78 88 L84 88 L82 68 Z" fill="${d}"/>
      <path d="M20 68 L34 68 L32 72 L20 72 Z" fill="${shade(hex,-60)}"/>
      <path d="M30 52 Q38 48 46 50" fill="none" stroke="${l}" stroke-width="1.5" opacity="0.8"/>`,
    veske: `
      <path d="M36 34 Q36 18 50 18 Q64 18 64 34" fill="none" stroke="${d}" stroke-width="3.5"/>
      <path d="M26 36 L74 36 L78 76 Q78 82 70 82 L30 82 Q22 82 22 76 Z" fill="${hex}" stroke="${d}" stroke-width="2"/>
      <path d="M26 48 L74 48" stroke="${d}" stroke-width="1.5" opacity="0.6"/>
      <rect x="44" y="42" width="12" height="10" rx="2" fill="${l}" stroke="${d}" stroke-width="1.5"/>`,
    solbriller: `
      <rect x="16" y="41" width="28" height="19" rx="9" fill="${hex}" stroke="${d}" stroke-width="2"/>
      <rect x="56" y="41" width="28" height="19" rx="9" fill="${hex}" stroke="${d}" stroke-width="2"/>
      <path d="M44 46 Q50 41 56 46" fill="none" stroke="${d}" stroke-width="2.5"/>
      <path d="M16 46 L7 42" stroke="${d}" stroke-width="2.5"/>
      <path d="M84 46 L93 42" stroke="${d}" stroke-width="2.5"/>
      <path d="M22 46 Q26 44 30 46" fill="none" stroke="${l}" stroke-width="1.5" opacity="0.8"/>
      <path d="M62 46 Q66 44 70 46" fill="none" stroke="${l}" stroke-width="1.5" opacity="0.8"/>`,
    skjerf: `
      <path d="M34 22 Q50 12 66 22 Q76 30 71 43 Q62 53 50 50 Q38 53 29 43 Q24 30 34 22 Z" fill="${hex}" stroke="${d}" stroke-width="2"/>
      <path d="M40 48 L36 84 L48 84 L50 53 Z" fill="${hex}" stroke="${d}" stroke-width="2"/>
      <path d="M60 48 L64 80 L52 80 L50 53 Z" fill="${l}" stroke="${d}" stroke-width="2"/>
      <line x1="38" y1="84" x2="38" y2="90" stroke="${d}" stroke-width="1.5"/>
      <line x1="42" y1="84" x2="42" y2="90" stroke="${d}" stroke-width="1.5"/>
      <line x1="46" y1="84" x2="46" y2="90" stroke="${d}" stroke-width="1.5"/>
      <path d="M34 30 Q50 38 66 30" fill="none" stroke="${d}" stroke-width="1.5" opacity="0.6"/>`,
    sekk: `
      <path d="M40 22 Q50 12 60 22" fill="none" stroke="${d}" stroke-width="4"/>
      <rect x="26" y="22" width="48" height="60" rx="14" fill="${hex}" stroke="${d}" stroke-width="2"/>
      <rect x="34" y="52" width="32" height="24" rx="8" fill="${l}" opacity="0.55" stroke="${d}" stroke-width="1.5"/>
      <line x1="50" y1="52" x2="50" y2="76" stroke="${d}" stroke-width="1.5"/>
      <path d="M26 40 L74 40" stroke="${d}" stroke-width="1.5" opacity="0.7"/>
      <rect x="45" y="34" width="10" height="8" rx="2" fill="${d}"/>`,
    lue: `
      <path d="M27 56 Q27 28 50 28 Q73 28 73 56 L73 60 L27 60 Z" fill="${hex}" stroke="${d}" stroke-width="2"/>
      <rect x="24" y="58" width="52" height="13" rx="5" fill="${l}" stroke="${d}" stroke-width="2"/>
      <line x1="32" y1="59" x2="32" y2="70" stroke="${d}" stroke-width="1.2" opacity="0.7"/>
      <line x1="40" y1="59" x2="40" y2="70" stroke="${d}" stroke-width="1.2" opacity="0.7"/>
      <line x1="48" y1="59" x2="48" y2="70" stroke="${d}" stroke-width="1.2" opacity="0.7"/>
      <line x1="56" y1="59" x2="56" y2="70" stroke="${d}" stroke-width="1.2" opacity="0.7"/>
      <line x1="64" y1="59" x2="64" y2="70" stroke="${d}" stroke-width="1.2" opacity="0.7"/>
      <path d="M40 34 Q50 40 60 34" fill="none" stroke="${d}" stroke-width="1.2" opacity="0.5"/>`,
    klokke: `
      <rect x="42" y="10" width="16" height="24" fill="${shade(hex,-50)}" rx="3"/>
      <rect x="42" y="66" width="16" height="24" fill="${shade(hex,-50)}" rx="3"/>
      <circle cx="50" cy="50" r="20" fill="${hex}" stroke="${shade(hex,-70)}" stroke-width="3"/>
      <circle cx="50" cy="50" r="15" fill="${l}"/>
      <line x1="50" y1="50" x2="50" y2="40" stroke="${shade(hex,-80)}" stroke-width="2"/>
      <line x1="50" y1="50" x2="58" y2="52" stroke="${shade(hex,-80)}" stroke-width="2"/>`,
  };
  const body = bodies[type] || bodies.tskjorte;
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
}
