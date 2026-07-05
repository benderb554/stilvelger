// ============================================================
// BRUKERKONTOER – innlogging og skysynkronisering (Firebase)
// Uten konto fungerer appen som før (alt lagres lokalt).
// Med konto synkes likes, outfits og kjønn til skyen, så alt
// følger deg på tvers av mobil og PC. Nye besøkende får
// registreringsskjermen automatisk (én gang).
// ============================================================

let fbAuth = null;
let fbDb = null;
let innloggetBruker = null;
let lagreTimer = null;
let brukerKjonn = null;    // "dame" | "mann" | "annet"
let valgtKjonn = null;     // valget i registreringsskjemaet
let kontoModus = "login";  // "login" | "signup"

const KJONN = { dame: "Dame", mann: "Mann", annet: "Annet / vil ikke oppgi" };

const kontoAktivert = (() => {
  try {
    if (typeof FIREBASE_CONFIG === "undefined" || FIREBASE_CONFIG.apiKey.includes("SETT-INN")) return false;
    firebase.initializeApp(FIREBASE_CONFIG);
    fbAuth = firebase.auth();
    fbDb = firebase.firestore();
    return true;
  } catch (e) {
    console.warn("Firebase kunne ikke starte:", e);
    return false;
  }
})();

// ---------- Skylagring ----------
// Kalles fra persist() i app.js hver gang noe endres.
function skyLagre() {
  if (!innloggetBruker) return;
  clearTimeout(lagreTimer); // samle raske endringer i én skriving
  lagreTimer = setTimeout(() => {
    fbDb.collection("users").doc(innloggetBruker.uid).set({
      likes: state.likes,
      dislikes: state.dislikes,
      savedOutfits: state.savedOutfits,
      kjonn: brukerKjonn || null,
      oppdatert: new Date().toISOString(),
    }).catch(e => console.warn("Skylagring feilet:", e));
  }, 800);
}

// Slå sammen lokale data med skydata (union, uten duplikater)
function slaaSammenLister(lokal, sky) {
  return [...new Set([...(sky || []), ...(lokal || [])])];
}

async function hentOgSlaaSammen(uid) {
  const doc = await fbDb.collection("users").doc(uid).get();
  const sky = doc.exists ? doc.data() : {};
  brukerKjonn = sky.kjonn || brukerKjonn;
  state.likes = slaaSammenLister(state.likes, sky.likes);
  state.dislikes = slaaSammenLister(state.dislikes, sky.dislikes)
    .filter(id => !state.likes.includes(id)); // en like vinner over en gammel nei
  const alleOutfits = [...(sky.savedOutfits || []), ...state.savedOutfits];
  const sett = new Set();
  state.savedOutfits = alleOutfits.filter(o => {
    const nokkel = JSON.stringify([o.items, o.occasion]);
    if (sett.has(nokkel)) return false;
    sett.add(nokkel);
    return true;
  });
  persist(); // lagrer lokalt og tilbake til skyen
}

function oppdaterAlt() {
  makeDeck();
  renderCard();
  renderProfil();
  renderFavoritter();
  fillBaseSelect();
}

// ---------- UI ----------
const kontoKnapp = document.getElementById("konto-knapp");
const kontoModal = document.getElementById("konto-modal");
const kontoBody = document.getElementById("konto-body");

const FEILMELDINGER = {
  "auth/email-already-in-use": "Det finnes allerede en bruker med denne e-posten. Prøv å logge inn i stedet.",
  "auth/invalid-email": "Det ser ikke ut som en gyldig e-postadresse.",
  "auth/missing-password": "Skriv inn et passord.",
  "auth/weak-password": "Passordet må ha minst 6 tegn.",
  "auth/invalid-credential": "Feil e-post eller passord.",
  "auth/wrong-password": "Feil passord.",
  "auth/user-not-found": "Fant ingen bruker med denne e-posten. Velg «Opprett bruker» for å registrere deg.",
  "auth/too-many-requests": "For mange forsøk – vent litt og prøv igjen.",
  "auth/network-request-failed": "Fikk ikke kontakt med serveren. Sjekk internettforbindelsen.",
};

function visKontoFeil(e) {
  const el = document.getElementById("konto-feil");
  if (el) el.textContent = FEILMELDINGER[e.code] || `Noe gikk galt (${e.code || e.message}).`;
}

function visKonto(modus) {
  kontoModus = modus;
  renderKonto();
  kontoModal.classList.remove("hidden");
  localStorage.setItem("stil_konto_vist", "1");
}

function lukkKonto() {
  kontoModal.classList.add("hidden");
}

// ---------- Felles skjemadeler ----------
function feltHTML(autocompletePassord) {
  return `
    <label class="konto-label" for="konto-epost">E-post</label>
    <input id="konto-epost" type="email" class="konto-input" placeholder="din@epost.no" autocomplete="email">
    <label class="konto-label" for="konto-passord">Passord</label>
    <input id="konto-passord" type="password" class="konto-input" placeholder="Minst 6 tegn" autocomplete="${autocompletePassord}">`;
}

function hentFelt() {
  return {
    epost: document.getElementById("konto-epost").value.trim(),
    passord: document.getElementById("konto-passord").value,
  };
}

function kobleEnterTilKnapp(knappId) {
  document.getElementById("konto-passord").addEventListener("keydown", e => {
    if (e.key === "Enter") document.getElementById(knappId).click();
  });
}

function renderKonto() {
  if (!kontoAktivert) {
    kontoBody.innerHTML = `
      <h2>Min bruker</h2>
      <p class="tom-melding">Kontofunksjonen er ikke aktivert ennå. Favorittene dine
      lagres trygt her i nettleseren i mellomtiden. 👍</p>`;
    return;
  }

  // ---------- Innlogget: profilsiden ----------
  if (innloggetBruker) {
    kontoBody.innerHTML = `
      <h2>Min bruker</h2>
      <p class="konto-epost">👤 ${innloggetBruker.email}</p>
      <p class="konto-info">✓ Favoritter og outfits synkroniseres automatisk.
      Logg inn på en annen enhet, så er alt der.</p>
      <label class="konto-label">Kjønn – styrer hvilke plagg du ser</label>
      <div class="chips" id="kjonn-chips-inne">
        ${Object.entries(KJONN).map(([key, navn]) =>
          `<button class="chip ${key === brukerKjonn ? "active" : ""}" data-kjonn="${key}">${navn}</button>`).join("")}
      </div>
      <button id="btn-loggut" class="primary-btn utlogging">Logg ut</button>`;
    document.getElementById("btn-loggut").addEventListener("click", () => fbAuth.signOut());
    kontoBody.querySelectorAll("#kjonn-chips-inne .chip").forEach(chip => {
      chip.addEventListener("click", () => {
        brukerKjonn = chip.dataset.kjonn;
        skyLagre();
        oppdaterAlt(); // katalogen filtreres på nytt
        renderKonto();
      });
    });
    return;
  }

  // ---------- Logg inn ----------
  if (kontoModus === "login") {
    kontoBody.innerHTML = `
      <h2>Logg inn</h2>
      <p class="konto-info">Velkommen tilbake! Favorittene dine venter.</p>
      ${feltHTML("current-password")}
      <p id="konto-feil" class="konto-feil"></p>
      <button id="btn-loggin" class="primary-btn">Logg inn</button>
      <button id="btn-til-signup" class="save-btn konto-bytt">Ny her? Opprett bruker</button>
      <button id="btn-uten" class="konto-uten">Fortsett uten bruker →</button>`;
    document.getElementById("btn-loggin").addEventListener("click", async () => {
      const { epost, passord } = hentFelt();
      try {
        await fbAuth.signInWithEmailAndPassword(epost, passord);
        lukkKonto();
      } catch (e) { visKontoFeil(e); }
    });
    document.getElementById("btn-til-signup").addEventListener("click", () => { kontoModus = "signup"; renderKonto(); });
    document.getElementById("btn-uten").addEventListener("click", lukkKonto);
    kobleEnterTilKnapp("btn-loggin");
    return;
  }

  // ---------- Opprett bruker ----------
  kontoBody.innerHTML = `
    <h2>Opprett bruker</h2>
    <p class="konto-info">Gratis – favorittene og outfitene dine følger deg
    på tvers av mobil og PC, og du får anbefalinger som passer deg.</p>
    ${feltHTML("new-password")}
    <label class="konto-label">Kjønn – for riktige klesanbefalinger</label>
    <div class="chips" id="kjonn-chips">
      ${Object.entries(KJONN).map(([key, navn]) =>
        `<button class="chip ${key === valgtKjonn ? "active" : ""}" data-kjonn="${key}">${navn}</button>`).join("")}
    </div>
    <p id="konto-feil" class="konto-feil"></p>
    <button id="btn-registrer" class="primary-btn">Opprett bruker ✨</button>
    <button id="btn-til-login" class="save-btn konto-bytt">Har du bruker fra før? Logg inn</button>
    <button id="btn-uten" class="konto-uten">Fortsett uten bruker →</button>`;

  kontoBody.querySelectorAll("#kjonn-chips .chip").forEach(chip => {
    chip.addEventListener("click", () => {
      valgtKjonn = chip.dataset.kjonn;
      kontoBody.querySelectorAll("#kjonn-chips .chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
    });
  });
  document.getElementById("btn-registrer").addEventListener("click", async () => {
    const { epost, passord } = hentFelt();
    if (!valgtKjonn) {
      document.getElementById("konto-feil").textContent = "Velg kjønn for å opprette bruker.";
      return;
    }
    try {
      brukerKjonn = valgtKjonn;
      await fbAuth.createUserWithEmailAndPassword(epost, passord);
      lukkKonto(); // kjønn og favoritter synkes automatisk ved innlogging
    } catch (e) { visKontoFeil(e); }
  });
  document.getElementById("btn-til-login").addEventListener("click", () => { kontoModus = "login"; renderKonto(); });
  document.getElementById("btn-uten").addEventListener("click", lukkKonto);
  kobleEnterTilKnapp("btn-registrer");
}

kontoKnapp.addEventListener("click", () => visKonto(innloggetBruker ? "login" : "login"));
document.getElementById("konto-close").addEventListener("click", lukkKonto);
kontoModal.addEventListener("click", e => {
  if (e.target.id === "konto-modal") lukkKonto();
});

// ---------- Reager på inn-/utlogging ----------
if (kontoAktivert) {
  let forsteSjekk = true;
  fbAuth.onAuthStateChanged(async bruker => {
    innloggetBruker = bruker;
    kontoKnapp.classList.toggle("innlogget", !!bruker);
    kontoKnapp.textContent = bruker ? "✓" : "👤";
    if (bruker) {
      try {
        await hentOgSlaaSammen(bruker.uid);
      } catch (e) {
        console.warn("Klarte ikke hente skydata:", e);
      }
      oppdaterAlt();
    } else {
      brukerKjonn = null; // utlogget: vis hele katalogen igjen
      oppdaterAlt();
    }
    if (!kontoModal.classList.contains("hidden")) renderKonto();

    // Returnerende besøkende uten bruker som aldri har sett
    // registreringsskjermen: vis den én gang.
    if (forsteSjekk) {
      forsteSjekk = false;
      if (!bruker && localStorage.getItem("stil_intro_sett") && !localStorage.getItem("stil_konto_vist")) {
        visKonto("signup");
      }
    }
  });

  // Helt nye besøkende: registreringsskjermen kommer rett etter velkomsten.
  const introStart = document.getElementById("intro-start");
  if (introStart) {
    introStart.addEventListener("click", () => {
      if (!innloggetBruker && !localStorage.getItem("stil_konto_vist")) {
        setTimeout(() => visKonto("signup"), 300);
      }
    });
  }
}
