// ============================================================
// STILVELGER – applogikk
// 1. Sveip/lik plagg  -> bygger stilprofil
// 2. Outfit-bygger    -> plagg + anledning = komplette antrekk
// 3. Finn lignende    -> lignende plagg med kjøpslenker
// Likes og lagrede outfits huskes i localStorage.
// ============================================================

// Produkter fra ekte butikk-feeder (katalog.js, generert av import-feed.py)
// legges til i katalogen hvis fila finnes.
if (typeof FEED_ITEMS !== "undefined" && Array.isArray(FEED_ITEMS)) {
  ITEMS.push(...FEED_ITEMS);
}

// ---------- Tilstand ----------
const state = {
  likes: JSON.parse(localStorage.getItem("stil_likes") || "[]"),
  dislikes: JSON.parse(localStorage.getItem("stil_dislikes") || "[]"),
  savedOutfits: JSON.parse(localStorage.getItem("stil_outfits") || "[]"),
  deck: [],          // rekkefølgen på kort i utforsk-fanen
  deckIndex: 0,
  occasion: "kompiser",
};

function persist() {
  localStorage.setItem("stil_likes", JSON.stringify(state.likes));
  localStorage.setItem("stil_dislikes", JSON.stringify(state.dislikes));
  localStorage.setItem("stil_outfits", JSON.stringify(state.savedOutfits));
}

const byId = id => ITEMS.find(i => i.id === id);
const nok = n => `${n.toLocaleString("no-NO")} kr`;

// Viser ekte bilde hvis plagget har et (item.img), ellers tegningen.
// Feiler bildet (slettet fil, død lenke), fjernes det og tegningen vises.
function garmentHTML(item) {
  const svg = garmentSVG(item.type, COLORS[item.color].hex);
  const foto = item.img
    ? `<img class="garment-foto" src="${item.img}" alt="${item.navn}" loading="lazy" onerror="this.remove()">`
    : "";
  return `<span class="foto-wrap">${foto}${svg}</span>`;
}
// Feed-produkter har egen kjøpslenke (item.url) og butikknavn (item.butikk).
// Demoplagg bruker søkelenker fra STORES.
const storeName = item => item.butikk || (STORES[item.store] ? STORES[item.store].navn : "nettbutikk");
const storeUrl = item => item.url || STORES[item.store].url(item.q);
function storeLink(item) {
  return `<a class="buy-link" href="${storeUrl(item)}" target="_blank" rel="noopener">Kjøp hos ${storeName(item)} →</a>`;
}

// ============================================================
// STILPROFIL – teller stil-tags fra likte (og trekker litt for mislikte)
// ============================================================
function styleProfile() {
  const score = {};
  Object.keys(STYLES).forEach(s => score[s] = 0);
  state.likes.forEach(id => byId(id)?.styles.forEach(s => score[s] += 2));
  state.dislikes.forEach(id => byId(id)?.styles.forEach(s => score[s] -= 0.5));
  return score;
}

function profileWeight(item) {
  const prof = styleProfile();
  return item.styles.reduce((sum, s) => sum + (prof[s] || 0), 0) / item.styles.length;
}

// ============================================================
// FARGEMATCHING
// ============================================================
function colorsMatch(a, b) {
  if (a === b) return true;
  const ca = COLORS[a], cb = COLORS[b];
  if (ca.neutral || cb.neutral) return true;
  return ca.pairsWith.includes(b) || cb.pairsWith.includes(a);
}

// ============================================================
// LIGNENDE PLAGG – samme kategori, poeng for delte stiler/farge/type
// ============================================================
function similarItems(item, max = 5) {
  return ITEMS
    .filter(i => i.id !== item.id && i.cat === item.cat)
    .map(i => {
      let score = 0;
      i.styles.forEach(s => { if (item.styles.includes(s)) score += 2; });
      if (i.type === item.type) score += 3;
      if (i.color === item.color) score += 3;
      else if (colorsMatch(i.color, item.color)) score += 1;
      i.occ.forEach(o => { if (item.occ.includes(o)) score += 0.5; });
      return { item: i, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map(r => r.item);
}

// ============================================================
// OUTFIT-MOTOR
// Gitt basisplagg + anledning: fyll resten av antrekket med plagg som
// passer anledningen, fargene og stilprofilen din.
// ============================================================
function scoreCandidate(cand, chosen, occasion) {
  if (!cand.occ.includes(occasion)) return -Infinity;
  let score = 0;
  for (const c of chosen) {
    if (!colorsMatch(cand.color, c.color)) return -Infinity;
    cand.styles.forEach(s => { if (c.styles.includes(s)) score += 1.5; });
  }
  score += profileWeight(cand);              // din smak teller med
  if (COLORS[cand.color].neutral) score += 0.5; // nøytrale farger er trygge
  score += Math.random() * 1.5;              // litt variasjon
  return score;
}

function pickForSlot(cat, chosen, occasion, exclude) {
  const cands = ITEMS
    .filter(i => i.cat === cat && !exclude.has(i.id))
    .map(i => ({ item: i, score: scoreCandidate(i, chosen, occasion) }))
    .filter(r => r.score > -Infinity)
    .sort((a, b) => b.score - a.score);
  return cands.length ? cands[0].item : null;
}

function buildOutfit(base, occasion, exclude) {
  const chosen = [base];
  const slots = ["overdel", "underdel", "sko"].filter(c => c !== base.cat);
  for (const slot of slots) {
    const pick = pickForSlot(slot, chosen, occasion, exclude);
    if (!pick) return null; // fant ikke noe som passer
    chosen.push(pick);
    exclude.add(pick.id);
  }
  // Yttertøy og tilbehør er valgfritt krydder
  for (const extraCat of ["yttertoy", "tilbehor"]) {
    if (base.cat === extraCat) continue;
    const pick = pickForSlot(extraCat, chosen, occasion, exclude);
    if (pick) { chosen.push(pick); exclude.add(pick.id); }
  }
  return chosen;
}

function buildOutfits(base, occasion, antall = 3) {
  const outfits = [];
  const exclude = new Set([base.id]);
  for (let i = 0; i < antall; i++) {
    const outfit = buildOutfit(base, occasion, exclude);
    if (outfit) outfits.push(outfit);
  }
  return outfits;
}

// ============================================================
// UI: FANER
// ============================================================
document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
    if (btn.dataset.tab === "favoritter") renderFavoritter();
    if (btn.dataset.tab === "outfits") fillBaseSelect();
  });
});

// ============================================================
// UI: UTFORSK / SVEIP
// ============================================================
function makeDeck() {
  const seen = new Set([...state.likes, ...state.dislikes]);
  const unseen = ITEMS.filter(i => !seen.has(i.id));
  const rest = ITEMS.filter(i => seen.has(i.id));
  // usette først (tilfeldig rekkefølge), så resten
  state.deck = [...unseen.sort(() => Math.random() - 0.5), ...rest.sort(() => Math.random() - 0.5)];
  state.deckIndex = 0;
}

function currentCard() { return state.deck[state.deckIndex % state.deck.length]; }

function renderCard() {
  const item = currentCard();
  const card = document.getElementById("swipe-card");
  card.className = "swipe-card";
  card.style.transform = "";
  card.style.setProperty("--like-op", 0);
  card.style.setProperty("--nei-op", 0);
  card.innerHTML = `
    <div class="stempel liker">LIKER</div>
    <div class="stempel nei">NEI</div>
    <div class="garment">${garmentHTML(item)}</div>
    <h3>${item.navn}</h3>
    <div class="meta">${CATEGORIES[item.cat]} · ${COLORS[item.color].navn}</div>
    <div class="price">${nok(item.pris)} · ${storeName(item)}</div>
    <div class="tag-row">${item.styles.map(s => `<span class="tag">${STYLES[s]}</span>`).join("")}</div>
  `;
}

function swipe(liked) {
  if (swipeLaas) return; // ikke sveip mens forrige kort flyr ut
  swipeLaas = true;
  const item = currentCard();
  state.likes = state.likes.filter(id => id !== item.id);
  state.dislikes = state.dislikes.filter(id => id !== item.id);
  (liked ? state.likes : state.dislikes).push(item.id);
  persist();

  const card = document.getElementById("swipe-card");
  card.style.transform = ""; // slipp drag-posisjonen så utflyvningen tar over
  card.classList.add(liked ? "fly-right" : "fly-left");
  setTimeout(() => {
    state.deckIndex++;
    renderCard();
    renderProfil();
    swipeLaas = false;
  }, 260);
}

let swipeLaas = false; // hindrer dobbeltsveip mens kortet animeres ut

document.getElementById("btn-ja").addEventListener("click", () => swipe(true));
document.getElementById("btn-nei").addEventListener("click", () => swipe(false));

// ---------- Dra kortet med finger eller mus (Tinder-stil) ----------
const kortEl = document.getElementById("swipe-card");
const SVEIPTERSKEL = 90; // piksler før draget teller som et valg
let drag = null;

kortEl.addEventListener("pointerdown", e => {
  if (swipeLaas) return;
  drag = { startX: e.clientX, dx: 0 };
  try { kortEl.setPointerCapture(e.pointerId); } catch (_) { /* ikke støttet overalt */ }
  kortEl.classList.add("dragging");
});

kortEl.addEventListener("pointermove", e => {
  if (!drag) return;
  drag.dx = e.clientX - drag.startX;
  kortEl.style.transform = `translateX(${drag.dx}px) rotate(${drag.dx / 18}deg)`;
  kortEl.style.setProperty("--like-op", Math.min(Math.max(drag.dx / SVEIPTERSKEL, 0), 1));
  kortEl.style.setProperty("--nei-op", Math.min(Math.max(-drag.dx / SVEIPTERSKEL, 0), 1));
});

function avsluttDrag() {
  if (!drag) return;
  const dx = drag.dx;
  drag = null;
  kortEl.classList.remove("dragging");
  if (dx > SVEIPTERSKEL) {
    swipe(true);
  } else if (dx < -SVEIPTERSKEL) {
    swipe(false);
  } else {
    // ikke langt nok – kortet glir tilbake på plass
    kortEl.style.transform = "";
    kortEl.style.setProperty("--like-op", 0);
    kortEl.style.setProperty("--nei-op", 0);
  }
}
kortEl.addEventListener("pointerup", avsluttDrag);
kortEl.addEventListener("pointercancel", avsluttDrag);
document.addEventListener("keydown", e => {
  if (!document.getElementById("tab-utforsk").classList.contains("active")) return;
  if (e.key === "ArrowRight") swipe(true);
  if (e.key === "ArrowLeft") swipe(false);
});

function renderProfil() {
  const el = document.getElementById("stilprofil");
  if (state.likes.length < 3) {
    el.innerHTML = `<p class="tom-melding" style="text-align:center">Lik minst 3 plagg, så viser vi stilprofilen din 👀</p>`;
    return;
  }
  const prof = styleProfile();
  const maks = Math.max(...Object.values(prof), 1);
  const rader = Object.entries(prof)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([key, v]) => `
      <div class="style-bar">
        <div class="label"><span>${STYLES[key]}</span><span>${Math.round((v / maks) * 100)}%</span></div>
        <div class="track"><div class="fill" style="width:${(v / maks) * 100}%"></div></div>
      </div>`).join("");
  el.innerHTML = `
    <div class="profil-card">
      <h3>🎯 Din stilprofil <span style="color:var(--muted);font-weight:400;font-size:0.85rem">(${state.likes.length} likte plagg)</span></h3>
      ${rader}
    </div>`;
}

// ============================================================
// UI: OUTFIT-BYGGER
// ============================================================
function fillBaseSelect() {
  const sel = document.getElementById("base-select");
  const forrige = sel.value;
  const likte = state.likes.map(byId).filter(Boolean);
  const andre = ITEMS.filter(i => !state.likes.includes(i.id));
  let html = "";
  if (likte.length) {
    html += `<optgroup label="❤️ Plagg du har likt">` +
      likte.map(i => `<option value="${i.id}">${i.navn} (${CATEGORIES[i.cat]})</option>`).join("") +
      `</optgroup>`;
  }
  html += `<optgroup label="Alle plagg">` +
    andre.map(i => `<option value="${i.id}">${i.navn} (${CATEGORIES[i.cat]})</option>`).join("") +
    `</optgroup>`;
  sel.innerHTML = html;
  if (forrige && byId(forrige)) sel.value = forrige;
}

function renderOccasionChips() {
  const wrap = document.getElementById("occasion-chips");
  wrap.innerHTML = Object.entries(OCCASIONS).map(([key, o]) =>
    `<button class="chip ${key === state.occasion ? "active" : ""}" data-occ="${key}">${o.emoji} ${o.navn}</button>`
  ).join("");
  wrap.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      state.occasion = chip.dataset.occ;
      renderOccasionChips();
    });
  });
}

document.getElementById("btn-lag-outfits").addEventListener("click", () => {
  const base = byId(document.getElementById("base-select").value);
  const occasion = state.occasion;
  const results = document.getElementById("outfit-results");

  if (!base.occ.includes(occasion)) {
    results.innerHTML = `<div class="card"><p class="tom-melding">Hmm – <strong>${base.navn}</strong> passer ikke helt til «${OCCASIONS[occasion].navn}». Prøv et annet plagg eller en annen anledning! 🙈</p></div>`;
    return;
  }

  const outfits = buildOutfits(base, occasion, 3);
  if (!outfits.length) {
    results.innerHTML = `<div class="card"><p class="tom-melding">Fant ikke nok plagg som matcher. Prøv en annen kombinasjon!</p></div>`;
    return;
  }

  const titler = ["Anbefalt for deg", "Alternativ 1", "Alternativ 2"];
  results.innerHTML = outfits.map((outfit, idx) => {
    const total = outfit.reduce((s, i) => s + i.pris, 0);
    return `
      <div class="outfit-card">
        <h3>${titler[idx] || `Alternativ ${idx}`}</h3>
        <div class="outfit-sub">${OCCASIONS[occasion].emoji} ${OCCASIONS[occasion].navn} · bygget rundt ${base.navn.toLowerCase()}</div>
        <div class="outfit-lay">
          ${outfit.map(i => `
            <div class="outfit-piece">
              ${garmentHTML(i)}
              <div class="navn">${i.navn}</div>
            </div>`).join("")}
        </div>
        <div class="outfit-items">
          ${outfit.map(i => `
            <div class="outfit-item-row">
              <div class="venstre">
                <div>${i.navn} ${i.id === base.id ? "⭐" : ""}</div>
                <div class="butikk">${nok(i.pris)} · ${storeName(i)}</div>
              </div>
              ${storeLink(i)}
            </div>`).join("")}
        </div>
        <div class="outfit-footer">
          <span class="total">Totalt: ${nok(total)}</span>
          <button class="save-btn" data-outfit='${JSON.stringify(outfit.map(i => i.id))}' data-occ="${occasion}">💾 Lagre outfit</button>
        </div>
      </div>`;
  }).join("");

  results.querySelectorAll(".save-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      state.savedOutfits.push({
        items: JSON.parse(btn.dataset.outfit),
        occasion: btn.dataset.occ,
        dato: new Date().toISOString().slice(0, 10),
      });
      persist();
      btn.textContent = "✓ Lagret!";
      btn.classList.add("saved");
      btn.disabled = true;
    });
  });
});

// ============================================================
// UI: FAVORITTER
// ============================================================
function renderFavoritter() {
  const grid = document.getElementById("fav-items");
  const likte = state.likes.map(byId).filter(Boolean);
  grid.innerHTML = likte.length
    ? likte.map(i => `
        <div class="item-card">
          <div class="garment-mini">${garmentHTML(i)}</div>
          <div class="navn">${i.navn}</div>
          <div class="pris">${nok(i.pris)} · ${storeName(i)}</div>
          <div class="knapper">
            <button class="small-btn" data-lignende="${i.id}">🔍 Finn lignende</button>
            <a class="small-btn" style="text-decoration:none" href="${storeUrl(i)}" target="_blank" rel="noopener">🛒 Kjøp</a>
            <button class="small-btn slett" data-fjern="${i.id}">Fjern</button>
          </div>
        </div>`).join("")
    : `<p class="tom-melding">Ingen likte plagg ennå – gå til ✨ Utforsk og lik noen!</p>`;

  grid.querySelectorAll("[data-lignende]").forEach(b =>
    b.addEventListener("click", () => showSimilar(b.dataset.lignende)));
  grid.querySelectorAll("[data-fjern]").forEach(b =>
    b.addEventListener("click", () => {
      state.likes = state.likes.filter(id => id !== b.dataset.fjern);
      persist();
      renderFavoritter();
      renderProfil();
    }));

  // Lagrede outfits
  const so = document.getElementById("saved-outfits");
  so.innerHTML = state.savedOutfits.length
    ? state.savedOutfits.map((o, idx) => {
        const items = o.items.map(byId).filter(Boolean);
        const total = items.reduce((s, i) => s + i.pris, 0);
        return `
          <div class="outfit-card">
            <h3>${OCCASIONS[o.occasion].emoji} ${OCCASIONS[o.occasion].navn}</h3>
            <div class="outfit-sub">Lagret ${o.dato} · ${nok(total)}</div>
            <div class="outfit-lay">
              ${items.map(i => `
                <div class="outfit-piece">
                  ${garmentSVG(i.type, COLORS[i.color].hex)}
                  <div class="navn">${i.navn}</div>
                </div>`).join("")}
            </div>
            <div class="outfit-footer">
              <span></span>
              <button class="save-btn" data-slett-outfit="${idx}">🗑 Slett</button>
            </div>
          </div>`;
      }).join("")
    : `<p class="tom-melding">Ingen lagrede outfits ennå – lag noen i 🧥 Outfits-fanen!</p>`;

  so.querySelectorAll("[data-slett-outfit]").forEach(b =>
    b.addEventListener("click", () => {
      state.savedOutfits.splice(Number(b.dataset.slettOutfit), 1);
      persist();
      renderFavoritter();
    }));
}

// ============================================================
// UI: MODAL – LIGNENDE PLAGG
// ============================================================
function showSimilar(itemId) {
  const item = byId(itemId);
  const lignende = similarItems(item);
  document.getElementById("modal-body").innerHTML = `
    <h2 style="margin-bottom:4px">Lignende «${item.navn}»</h2>
    <p style="color:var(--muted);font-size:0.85rem;margin-bottom:12px">Basert på type, farge og stil</p>
    ${lignende.map(i => `
      <div class="lignende-rad">
        <div class="mini-tile">${garmentHTML(i)}</div>
        <div class="info">
          <div class="navn">${i.navn}</div>
          <div class="detalj">${COLORS[i.color].navn} · ${i.styles.map(s => STYLES[s]).join(", ")} · ${nok(i.pris)}</div>
        </div>
        ${storeLink(i)}
      </div>`).join("")}
  `;
  document.getElementById("modal").classList.remove("hidden");
}

document.getElementById("modal-close").addEventListener("click", () =>
  document.getElementById("modal").classList.add("hidden"));
document.getElementById("modal").addEventListener("click", e => {
  if (e.target.id === "modal") document.getElementById("modal").classList.add("hidden");
});

// ============================================================
// VELKOMSTSKJERM – vises kun første gang
// ============================================================
if (!localStorage.getItem("stil_intro_sett")) {
  document.getElementById("intro").classList.remove("hidden");
}
document.getElementById("intro-start").addEventListener("click", () => {
  localStorage.setItem("stil_intro_sett", "1");
  document.getElementById("intro").classList.add("hidden");
});

// ============================================================
// START
// ============================================================
makeDeck();
renderCard();
renderProfil();
renderOccasionChips();
fillBaseSelect();
