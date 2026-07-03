// ============================================================
// BRUKERKONTOER – innlogging og skysynkronisering (Firebase)
// Uten konto fungerer appen som før (alt lagres lokalt).
// Med konto synkes likes og outfits til skyen, så de følger
// deg på tvers av mobil og PC.
// ============================================================

let fbAuth = null;
let fbDb = null;
let innloggetBruker = null;
let lagreTimer = null;

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
  "auth/weak-password": "Passordet må ha minst 6 tegn.",
  "auth/invalid-credential": "Feil e-post eller passord.",
  "auth/wrong-password": "Feil passord.",
  "auth/user-not-found": "Fant ingen bruker med denne e-posten. Trykk «Opprett bruker» for å registrere deg.",
  "auth/too-many-requests": "For mange forsøk – vent litt og prøv igjen.",
  "auth/network-request-failed": "Fikk ikke kontakt med serveren. Sjekk internettforbindelsen.",
};

function visKontoFeil(e) {
  const el = document.getElementById("konto-feil");
  if (el) el.textContent = FEILMELDINGER[e.code] || `Noe gikk galt (${e.code || e.message}).`;
}

function renderKonto() {
  if (!kontoAktivert) {
    kontoBody.innerHTML = `
      <h2>Min bruker</h2>
      <p class="tom-melding">Kontofunksjonen er ikke aktivert ennå. Favorittene dine
      lagres trygt her i nettleseren i mellomtiden. 👍</p>`;
    return;
  }
  if (innloggetBruker) {
    kontoBody.innerHTML = `
      <h2>Min bruker</h2>
      <p class="konto-epost">👤 ${innloggetBruker.email}</p>
      <p class="konto-info">✓ Favoritter og outfits synkroniseres automatisk.
      Logg inn på en annen enhet, så er alt der.</p>
      <button id="btn-loggut" class="primary-btn utlogging">Logg ut</button>`;
    document.getElementById("btn-loggut").addEventListener("click", () => fbAuth.signOut());
  } else {
    kontoBody.innerHTML = `
      <h2>Logg inn eller opprett bruker</h2>
      <p class="konto-info">Med en bruker følger favorittene og outfitene dine
      med på tvers av mobil og PC – helt gratis.</p>
      <label class="konto-label" for="konto-epost">E-post</label>
      <input id="konto-epost" type="email" class="konto-input" placeholder="din@epost.no" autocomplete="email">
      <label class="konto-label" for="konto-passord">Passord</label>
      <input id="konto-passord" type="password" class="konto-input" placeholder="Minst 6 tegn" autocomplete="current-password">
      <p id="konto-feil" class="konto-feil"></p>
      <button id="btn-loggin" class="primary-btn">Logg inn</button>
      <button id="btn-registrer" class="save-btn konto-registrer">Ny her? Opprett bruker</button>`;

    const hentFelt = () => ({
      epost: document.getElementById("konto-epost").value.trim(),
      passord: document.getElementById("konto-passord").value,
    });
    document.getElementById("btn-loggin").addEventListener("click", async () => {
      const { epost, passord } = hentFelt();
      try { await fbAuth.signInWithEmailAndPassword(epost, passord); } catch (e) { visKontoFeil(e); }
    });
    document.getElementById("btn-registrer").addEventListener("click", async () => {
      const { epost, passord } = hentFelt();
      try { await fbAuth.createUserWithEmailAndPassword(epost, passord); } catch (e) { visKontoFeil(e); }
    });
    document.getElementById("konto-passord").addEventListener("keydown", e => {
      if (e.key === "Enter") document.getElementById("btn-loggin").click();
    });
  }
}

kontoKnapp.addEventListener("click", () => {
  renderKonto();
  kontoModal.classList.remove("hidden");
});
document.getElementById("konto-close").addEventListener("click", () => kontoModal.classList.add("hidden"));
kontoModal.addEventListener("click", e => {
  if (e.target.id === "konto-modal") kontoModal.classList.add("hidden");
});

// ---------- Reager på inn-/utlogging ----------
if (kontoAktivert) {
  fbAuth.onAuthStateChanged(async bruker => {
    innloggetBruker = bruker;
    kontoKnapp.classList.toggle("innlogget", !!bruker);
    kontoKnapp.textContent = bruker ? "✓" : "👤";
    if (bruker) {
      try {
        await hentOgSlaaSammen(bruker.uid);
        oppdaterAlt();
      } catch (e) {
        console.warn("Klarte ikke hente skydata:", e);
      }
    }
    renderKonto(); // oppdater modalen hvis den er åpen
  });
}
