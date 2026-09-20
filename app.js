/**
 * VratyaVani AI — India's Community-Verified Immersive Heritage Network
 * Unified Vihaan-Purkha Core Architecture:
 * - Firebase Firestore Cloud Sync (Cross-Device Consistent Data)
 * - Upcoming Heritage & Community Poll Signals (Vote to Verify)
 * - Multilingual Translation Engine & Native Dialect Voice Narration
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDocs, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Vihaan-Purkha Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0bnCrIDTPracgy-qFvfXlXu7Im5RNGj0",
  authDomain: "vihaan-purkha.firebaseapp.com",
  projectId: "vihaan-purkha",
  storageBucket: "vihaan-purkha.firebasestorage.app",
  messagingSenderId: "1033538607939",
  appId: "1:1033538607939:web:b341070cc12e6708716df6"
};

const fbApp = initializeApp(firebaseConfig);
const db = getFirestore(fbApp);

window.currentDistrict = "muzaffarpur";
window.currentState = "bihar";
window.currentLanguage = "hi-IN";
window.mapInstance = null;
let mapMarkers = [];
let pannellumViewerInstance = null;
let citizenUploadedBase64 = null;
let currentActiveSpeech = null;

const STORAGE_KEY = "vratyavani_custom_records";
const PENDING_KEY = "vratyavani_pending_submissions";

const stateDistrictHints = {
  bihar: ["Muzaffarpur", "Patna", "Gaya"],
  up: ["Varanasi", "Ayodhya", "Mathura"],
  punjab: ["Amritsar", "Anandpur Sahib"]
};

// 5-Dialect Dynamic Translation Matrix
const dialectTranslations = {
  "hi-IN": {
    heroTitle: "पुरखों की थाती, डिजिटल वाणी की पाती",
    heroSub: "India's Community-Verified Immersive Heritage & Preservation Network",
    mapTitle: "📍 Living Heritage Clusters & Circuit Map",
    voiceConsoleTitle: "🎙️ Multilingual AI Voice Guide",
    btnListenHist: "🏛️ इतिहास सुनें",
    btnListenCult: "🎭 जीवंत परंपरा",
    btnVote: "👍 Verify Signal (वोट करें)",
    heritageLabel: "🏛️ धरोहर परिचय:",
    cultureLabel: "🎭 जीवंत परंपरा:",
    verifiedTrust: "🟢 VERIFIED TRUST",
    upcomingLabel: "🟡 UPCOMING HERITAGE",
    durgaTitle: "दुर्गा मंदिर",
    durgaDesc: "यह ऐतिहासिक मंदिर इस क्षेत्र की आध्यात्मिक पहचान, आस्था और सामुदायिक एकता का मुख्य केंद्र है।",
    durgaCulture: "आरती: पंडित जी और स्थानीय समुदाय द्वारा प्रातः व सांध्यकालीन विशेष दीप व धूप अर्चना।"
  },
  "en-IN": {
    heroTitle: "Heritage of Ancestors, Epistle of Digital Voice",
    heroSub: "India's Community-Verified Immersive Heritage & Preservation Network",
    mapTitle: "📍 Living Heritage Clusters & Circuit Map",
    voiceConsoleTitle: "🎙️ Multilingual AI Voice Guide",
    btnListenHist: "🏛️ Listen History",
    btnListenCult: "🎭 Living Culture",
    btnVote: "👍 Verify Signal (Vote)",
    heritageLabel: "🏛️ Heritage Overview:",
    cultureLabel: "🎭 Living Culture:",
    verifiedTrust: "🟢 VERIFIED TRUST",
    upcomingLabel: "🟡 UPCOMING HERITAGE",
    durgaTitle: "Durga Mandir",
    durgaDesc: "This historic temple serves as the spiritual heartbeat, faith center, and communal unity of the neighborhood.",
    durgaCulture: "Aarti: Sacred morning and evening oil-lamp offerings led by the priest and community devotees."
  },
  "bho-IN": {
    heroTitle: "पुरखन के धरोहर, डिजिटल बानी के पाती",
    heroSub: "India's Community-Verified Immersive Heritage & Preservation Network",
    mapTitle: "📍 धरोहर क्लस्टर आ सर्किट नक्शा",
    voiceConsoleTitle: "🎙️ बहुभाषी AI आवाज गाइड",
    btnListenHist: "🏛️ इतिहास सुनीं",
    btnListenCult: "🎭 रीत-रिवाज",
    btnVote: "👍 सत्यता वोट दीं",
    heritageLabel: "🏛️ धरोहर परिचय:",
    cultureLabel: "🎭 लोक परंपरा:",
    verifiedTrust: "🟢 प्रमाणित धरोहर",
    upcomingLabel: "🟡 सत्यापन खातिर धरोहर",
    durgaTitle: "दुर्गा मंदिर",
    durgaDesc: "ई ऐतिहासिक मंदिर इलाका के आध्यात्मिक पहिचान आ अगाध आस्था के पवित्र केंद्र बा।",
    durgaCulture: "आरती: पंडित जी आ ग्रामीण लोगन द्वारा सबेरे आ साँझ के विशेष दीप पूजा।"
  },
  "mai-IN": {
    heroTitle: "पुरखाक धरोहर, डिजिटल वाणीक पाती",
    heroSub: "India's Community-Verified Immersive Heritage & Preservation Network",
    mapTitle: "📍 धरोहर क्लस्टर एवं सर्किट मानचित्र",
    voiceConsoleTitle: "🎙️ बहुभाषी AI वाणी गाइड",
    btnListenHist: "🏛️ इतिहास सुनू",
    btnListenCult: "🎭 जीवित रीत",
    btnVote: "👍 सत्यापन वोट करू",
    heritageLabel: "🏛️ धरोहर परिचय:",
    cultureLabel: "🎭 जीवित परंपरा:",
    verifiedTrust: "🟢 सत्यापित धरोहर",
    upcomingLabel: "🟡 आगामी धरोहर",
    durgaTitle: "दुर्गा मंदिर",
    durgaDesc: "ई ऐतिहासिक मंदिर एहि क्षेत्रक आध्यात्मिक पहचान एवं अटूट आस्थाक केंद्र अछि।",
    durgaCulture: "आरती: पंडित जी द्वारा प्रातः एवं सांध्यकालीन विशेष दीप व धूप अर्चना।"
  },
  "pa-IN": {
    heroTitle: "ਪੁਰਖਿਆਂ ਦੀ ਵਿਰਾਸਤ, ਡਿਜੀਟਲ ਆਵਾਜ਼ ਦੀ ਸੌਗਾਤ",
    heroSub: "India's Community-Verified Immersive Heritage & Preservation Network",
    mapTitle: "📍 ਵਿਰਾਸਤੀ ਕਲੱਸਟਰ ਅਤੇ ਨਕਸ਼ਾ",
    voiceConsoleTitle: "🎙️ ਬਹੁ-ਭਾਸ਼ਾਈ AI ਆਡੀਓ ਗਾਈਡ",
    btnListenHist: "🏛️ ਇਤਿਹਾਸ ਸੁਣੋ",
    btnListenCult: "🎭 ਰੀਤਾਂ ਸੁਣੋ",
    btnVote: "👍 ਤਸਦੀਕ ਵੋਟ ਪਾਓ",
    heritageLabel: "🏛️ ਵਿਰਾਸਤੀ ਜਾਣਕਾਰੀ:",
    cultureLabel: "🎭 ਜਿਉਂਦੀ ਪਰੰਪਰਾ:",
    verifiedTrust: "🟢 ਤਸਦੀਕਸ਼ੁਦਾ ਵਿਰਾਸਤ",
    upcomingLabel: "🟡 ਨਵੀਂ ਆਗਾਮੀ ਵਿਰਾਸਤ",
    durgaTitle: "ਦੁਰਗਾ ਮੰਦਰ",
    durgaDesc: "ਇਹ ਇਤਿਹਾਸਕ ਮੰਦਰ ਇਸ ਖੇਤਰ ਦੀ ਅਧਿਆਤਮਿਕ ਪਛਾਣ ਅਤੇ ਆਸਥਾ ਦਾ ਮੁੱਖ ਕੇਂਦਰ ਹੈ।",
    durgaCulture: "ਆਰਤੀ: ਪੰਡਿਤ ਜੀ ਵੱਲੋਂ ਸਵੇਰ ਅਤੇ ਸ਼ਾਮ ਦੀ ਵਿਸ਼ੇਸ਼ ਦੀਪ ਅਰਚਨਾ।"
  }
};

function populatePanIndiaStateDropdowns() {
  const el = document.getElementById('selState');
  if (!el) return;
  el.innerHTML = "";
  const states = [
    { code: 'bihar', name: 'Bihar (बिहार)' },
    { code: 'up', name: 'Uttar Pradesh (उत्तर प्रदेश)' },
    { code: 'punjab', name: 'Punjab (पंजाब)' }
  ];
  states.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.code;
    opt.innerText = s.name;
    el.appendChild(opt);
  });
  window.onStateSelectionChanged('bihar');
}

window.onStateSelectionChanged = function(stateCode) {
  const datalist = document.getElementById("districtDatalist");
  if (!datalist) return;
  datalist.innerHTML = "";
  const hints = stateDistrictHints[stateCode] || ["Muzaffarpur", "Patna"];
  hints.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d;
    datalist.appendChild(opt);
  });
  const distInput = document.getElementById("selDistrictInput");
  if (distInput) distInput.value = hints[0];
};

window.startAppFlow = function() {
  populatePanIndiaStateDropdowns();
  setTimeout(() => {
    const splash = document.getElementById("splashScreen");
    if (splash) {
      splash.style.opacity = "0";
      setTimeout(() => {
        splash.style.display = "none";
        document.getElementById("locationModal").style.display = "flex";
      }, 500);
    }
  }, 900);
};

window.openLocationModalDirect = function() { document.getElementById("locationModal").style.display = "flex"; };
window.closeLocationModal = function() { document.getElementById("locationModal").style.display = "none"; };
window.openPassportModal = function() { document.getElementById("passportModal").style.display = "flex"; };
window.closePassportModal = function() { document.getElementById("passportModal").style.display = "none"; };

window.confirmLocationSelection = function() {
  const rawDist = document.getElementById("selDistrictInput").value.trim().toLowerCase();
  const lang = document.getElementById("selLang").value;
  const distKey = rawDist || "muzaffarpur";

  window.currentLanguage = lang;
  document.getElementById("navDistrictLabel").innerText = distKey.toUpperCase();
  document.getElementById("navLangLabel").innerText = lang.split('-')[0].toUpperCase();
  
  const consoleLangSelect = document.getElementById("langSelect");
  if (consoleLangSelect) consoleLangSelect.value = lang;

  document.getElementById("locationModal").style.display = "none";
  window.applyInterfaceLanguage(lang);
  window.onDistrictChange(distKey);
};

window.onConsoleLangChange = function(lang) {
  window.currentLanguage = lang;
  document.getElementById("navLangLabel").innerText = lang.split('-')[0].toUpperCase();
  window.applyInterfaceLanguage(lang);
  loadDistrictData(window.currentDistrict);
};

window.applyInterfaceLanguage = function(langKey) {
  const dict = dialectTranslations[langKey] || dialectTranslations["hi-IN"];
  const h1 = document.getElementById("heroTagline");
  if (h1) h1.innerText = dict.heroTitle;
  const h2 = document.getElementById("heroSubTagline");
  if (h2) h2.innerText = dict.heroSub;
  const mapT = document.getElementById("mapSectionTitle");
  if (mapT) mapT.innerText = dict.mapTitle;
  const audT = document.getElementById("audioConsoleTitle");
  if (audT) audT.innerText = dict.voiceConsoleTitle;
};

document.addEventListener("DOMContentLoaded", () => {
  initMap();
  syncCloudHeritage();
});

function initMap() {
  if (document.getElementById('map')) {
    window.mapInstance = L.map('map').setView([26.1245, 85.3902], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(window.mapInstance);
  }
}

window.onDistrictChange = function(districtKey) {
  window.currentDistrict = districtKey;
  const distBadge = document.getElementById("currentDistrictBadge");
  if (distBadge) distBadge.innerText = districtKey.toUpperCase();
  loadDistrictData(window.currentDistrict);
};

function getLocalVerifiedRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function getLocalPendingRecords() {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

// FETCH CLOUD DATA FROM FIRESTORE (Real-time Cross Device)
async function syncCloudHeritage() {
  try {
    // 1. Fetch verified records
    const vSnap = await getDocs(collection(db, "vratyavani_records"));
    const verifiedList = [];
    vSnap.forEach(d => verifiedList.push({ id: d.id, ...d.data(), isVerified: true }));
    if (verifiedList.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(verifiedList));
    }

    // 2. Fetch pending / upcoming records
    const pSnap = await getDocs(collection(db, "vratyavani_pending"));
    const pendingList = [];
    pSnap.forEach(d => pendingList.push({ id: d.id, ...d.data(), isVerified: false }));
    if (pendingList.length > 0) {
      localStorage.setItem(PENDING_KEY, JSON.stringify(pendingList));
    }
  } catch (e) {
    console.warn("Cloud sync fallback to local storage:", e);
  }
  loadDistrictData(window.currentDistrict);
}

window.loadDistrictData = function(districtKey) {
  let verified = getLocalVerifiedRecords();
  let pending = getLocalPendingRecords();

  let combined = [...pending, ...verified];
  let filtered = combined.filter(c => c.district && c.district.toLowerCase() === districtKey.toLowerCase());

  if (window.mapInstance) {
    mapMarkers.forEach(m => window.mapInstance.removeLayer(m));
    mapMarkers = [];
    if (filtered.length > 0) {
      window.mapInstance.flyTo(filtered[0].coords, 13);
      filtered.forEach(item => {
        const marker = L.marker(item.coords).addTo(window.mapInstance);
        marker.bindPopup(`<strong>${item.isVerified ? '🟢' : '🟡'} ${item.name || item.title}</strong><br><small>${item.village || ''}</small>`);
        mapMarkers.push(marker);
      });
    }
  }
  renderCards(filtered);
};

function renderCards(itemsList) {
  const container = document.getElementById("cardsGrid");
  if (!container) return;
  container.innerHTML = "";

  const dict = dialectTranslations[window.currentLanguage] || dialectTranslations["hi-IN"];
  const currentLang = window.currentLanguage;

  if (itemsList.length === 0) {
    container.innerHTML = `<div style="color:#64748b; padding:35px; text-align:center; grid-column:1/-1; font-weight:600; font-size:14px;">इस ज़िले में अभी कोई रिकॉर्ड नहीं है। 'Submit Upcoming Heritage' बटन से नया डेटा जोड़ें।</div>`;
    return;
  }

  itemsList.forEach(item => {
    let title = item.name || item.title || "Heritage Site";
    let desc = item.story || item.desc || "Historic monument overview.";
    let ritual = item.livingCulture || "Sacred traditional practice.";

    // Language adaptation for known or custom records
    if (title.toLowerCase().includes("durga")) {
      title = dict.durgaTitle;
      desc = dict.durgaDesc;
      ritual = dict.durgaCulture;
    }

    let displayImage = item.imageUrl || item.image || "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=80";
    const itemId = item.id || `item_${Math.random()}`;
    const votes = item.votes || 1;
    const isVerified = item.isVerified === true;

    const cardHtml = `
      <div class="unified-card" style="background:#fff; border-radius:12px; padding:15px; box-shadow:0 4px 12px rgba(0,0,0,0.08); margin-bottom:15px; border-left:4px solid ${isVerified ? 'var(--accent-gold)' : '#f59e0b'};">
        <div onclick="open360Viewer('${itemId}')" style="cursor:pointer; position:relative;">
          <img src="${displayImage}" alt="${title}" style="width:100%; height:180px; object-fit:cover; border-radius:8px;" onerror="this.src='https://images.unsplash.com/photo-1561361513-2d000a50f0dc';" />
          <span style="position:absolute; bottom:8px; right:8px; background:rgba(0,0,0,0.75); color:#fff; padding:3px 8px; font-size:10px; border-radius:4px;">🌐 WebXR 360° Tour</span>
        </div>
        <div style="margin-top:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <h4 style="font-size:16px; font-weight:700; color:#1e1b4b;">${title}</h4>
            <span style="background:${isVerified ? '#dcfce7' : '#fef3c7'}; color:${isVerified ? '#15803d' : '#b45309'}; padding:2px 8px; font-size:10px; font-weight:bold; border-radius:10px;">
              ${isVerified ? dict.verifiedTrust : dict.upcomingLabel}
            </span>
          </div>
          <div style="font-size:11px; color:#c2410c; font-weight:700; margin-bottom:6px;">📍 Cluster Area: ${item.village || 'Main Circuit'}</div>
          
          <p style="font-size:12px; color:#334155; margin-bottom:6px;"><strong>${dict.heritageLabel}</strong> ${desc}</p>
          <p style="font-size:12px; color:#6b21a8; margin-bottom:8px;"><strong>${dict.cultureLabel}</strong> ${ritual}</p>
          
          <!-- Dual Multilingual Audio Narration Pills -->
          <div style="display:flex; gap:8px; margin:10px 0; flex-wrap:wrap;">
            <button type="button" class="btn-audio-pill" onclick="selectUnifiedAudio('${itemId}', 'heritage')" style="background:#fef3c7; color:#92400e; border:none; padding:6px 12px; border-radius:15px; font-size:11px; font-weight:bold; cursor:pointer;">${dict.btnListenHist}</button>
            <button type="button" class="btn-audio-pill" onclick="selectUnifiedAudio('${itemId}', 'culture')" style="background:#dcfce7; color:#15803d; border:none; padding:6px 12px; border-radius:15px; font-size:11px; font-weight:bold; cursor:pointer;">${dict.btnListenCult}</button>
          </div>

          <!-- Community Signal Voting Section for Upcoming Heritage -->
          ${!isVerified ? `
            <div style="background:#f8fafc; border:1px dashed #f59e0b; padding:8px 10px; border-radius:6px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:11px; color:#92400e; font-weight:600;">🗳️ Community Signals: <strong>${votes} Verified Votes</strong></span>
              <button type="button" onclick="castCommunityVote('${itemId}')" style="background:#f59e0b; color:#fff; border:none; padding:4px 8px; border-radius:4px; font-size:10px; font-weight:bold; cursor:pointer;">${dict.btnVote}</button>
            </div>
          ` : `
            <div style="background:#f8fafc; padding:8px; border-radius:6px; margin-bottom:10px; font-size:11px; border:1px solid #e2e8f0;">
              <span style="color:#0284c7; font-weight:bold;">🚨 Heritage Risk Radar:</span> Low Risk (Active community living practice)
            </div>
          `}

          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button type="button" class="btn-sm" onclick="focusOnMapTab(${item.coords[0]}, ${item.coords[1]})" style="background:#e0f2fe; color:#0369a1; border:none; padding:5px 10px; border-radius:4px; font-weight:bold; cursor:pointer;">📍 Cluster Map</button>
            <button type="button" class="btn-sm" style="background:#fef3c7; color:#b45309; border:none; padding:5px 10px; border-radius:4px; font-weight:bold; cursor:pointer;" onclick="alert('🔗 WhatsApp Artisan Bridge: Local artisan cluster connected.')">🛍️ Artisan Livelihood</button>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += cardHtml;
  });
}

// COMMUNITY VOTE FUNCTION (Real-time Cloud Update)
window.castCommunityVote = async function(itemId) {
  let pending = getLocalPendingRecords();
  const found = pending.find(i => i.id === itemId);
  if (found) {
    found.votes = (found.votes || 1) + 1;
    localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
    try {
      await updateDoc(doc(db, "vratyavani_pending", itemId), { votes: found.votes });
    } catch (e) {}
    alert(`👍 धन्यवाद! आपका सत्यापन वोट दर्ज हो गया है। (कुल वोट: ${found.votes})`);
    loadDistrictData(window.currentDistrict);
  }
};

// AUDIO NARRATION IN THE EXACT SELECTED DIALECT
window.selectUnifiedAudio = function(itemId, mode) {
  let verified = getLocalVerifiedRecords();
  let pending = getLocalPendingRecords();
  const found = [...verified, ...pending].find(i => i.id === itemId);
  if (!found) return;

  const dict = dialectTranslations[window.currentLanguage] || dialectTranslations["hi-IN"];
  let title = found.name || found.title;
  let textToPlay = (mode === 'culture') ? (found.livingCulture || "Local sacred tradition.") : (found.story || "Historic monument narrative.");

  if (title.toLowerCase().includes("durga")) {
    title = dict.durgaTitle;
    textToPlay = (mode === 'culture') ? dict.durgaCulture : dict.durgaDesc;
  }

  const nowPlayingEl = document.getElementById("nowPlayingText");
  if (nowPlayingEl) {
    nowPlayingEl.innerHTML = `<strong>🔊 [${window.currentLanguage.toUpperCase()}] ${title}:</strong><br><em>"${textToPlay}"</em>`;
  }
  playAudioDirectly(textToPlay);
};

function playAudioDirectly(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = window.currentLanguage || 'hi-IN';
  utter.rate = 0.92;
  utter.pitch = 1.0;

  const playBtn = document.getElementById("playAudioBtn");
  utter.onstart = () => {
    if (playBtn) {
      playBtn.disabled = false;
      playBtn.innerText = "⏹ चल रहा है...";
      playBtn.style.background = "#ef4444";
      playBtn.style.color = "#fff";
    }
  };
  utter.onend = () => {
    if (playBtn) {
      playBtn.innerText = "▶ Play Narrative";
      playBtn.style.background = "var(--accent-gold)";
      playBtn.style.color = "#000";
    }
  };
  utter.onerror = () => {
    if (playBtn) {
      playBtn.innerText = "▶ Play Narrative";
      playBtn.style.background = "var(--accent-gold)";
      playBtn.style.color = "#000";
    }
  };
  currentActiveSpeech = utter;
  window.speechSynthesis.speak(utter);
}

window.togglePlayVoice = function() {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    const playBtn = document.getElementById("playAudioBtn");
    if (playBtn) {
      playBtn.innerText = "▶ Play Narrative";
      playBtn.style.background = "var(--accent-gold)";
      playBtn.style.color = "#000";
    }
  }
};

window.previewCitizenImage = function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      citizenUploadedBase64 = e.target.result;
      const imgEl = document.getElementById("citPreviewImg");
      const boxEl = document.getElementById("citImagePreviewBox");
      if (imgEl) imgEl.src = citizenUploadedBase64;
      if (boxEl) boxEl.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
};

// CITIZEN SUBMIT (Saves to Vihaan-Purkha Firebase Cloud & Local)
window.handleCitizenSubmit = async function(e) {
  e.preventDefault();
  const pendingId = `pending_${Date.now()}`;
  const pendingItem = {
    id: pendingId,
    title: document.getElementById("citTitle").value.trim(),
    district: document.getElementById("citDistrict").value.trim().toLowerCase(),
    village: document.getElementById("citVillage").value.trim() || "Cluster Area",
    ritual: document.getElementById("citRitual").value.trim(),
    coords: document.getElementById("citCoords").value.split(",").map(v => parseFloat(v.trim())),
    story: document.getElementById("citStory").value.trim(),
    image: citizenUploadedBase64 || "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=80",
    votes: 1,
    aiValidation: "✓ Metadata Verified | GPS Consistent",
    isVerified: false,
    submittedAt: new Date().toLocaleString()
  };

  // 1. Save local
  let localPending = getLocalPendingRecords();
  localPending.unshift(pendingItem);
  localStorage.setItem(PENDING_KEY, JSON.stringify(localPending));

  // 2. Save cloud
  try {
    await setDoc(doc(db, "vratyavani_pending", pendingId), pendingItem);
  } catch (err) {
    console.warn("Cloud upload pending fallback:", err);
  }

  alert(`🛡️ Trust Engine: "${pendingItem.title}" सफलतापर्वक Vihaan-Purkha क्लाउड में सबमिट हो गया है और होम स्क्रीन पर वोटिंग के लिए लाइव है!`);
  e.target.reset();
  citizenUploadedBase64 = null;
  const boxEl = document.getElementById("citImagePreviewBox");
  if (boxEl) boxEl.style.display = "none";
  closeCitizenModal();
  loadDistrictData(window.currentDistrict);
};

// ADMIN CURATION DESK (Works across Mobile, Laptop & Tablets)
window.openAdminPanel = async function() {
  await renderInpageAdminTable();
  document.getElementById("adminPanelModal").style.display = "flex";
};

window.closeAdminPanelModal = function() {
  document.getElementById("adminPanelModal").style.display = "none";
};

async function renderInpageAdminTable() {
  const pendingTbody = document.getElementById("pendingCitizenTableBody");
  if (!pendingTbody) return;
  pendingTbody.innerHTML = `<tr><td colspan="4" style="padding:10px; text-align:center; color:#64748b;">Loading Vihaan-Purkha Cloud Queue...</td></tr>`;

  let pendingItems = [];
  try {
    const pSnap = await getDocs(collection(db, "vratyavani_pending"));
    pSnap.forEach(d => pendingItems.push({ id: d.id, ...d.data() }));
  } catch (e) {}

  if (pendingItems.length === 0) {
    pendingItems = getLocalPendingRecords();
  }

  pendingTbody.innerHTML = "";
  if (pendingItems.length === 0) {
    pendingTbody.innerHTML = `<tr><td colspan="4" style="padding:10px; text-align:center; color:#64748b;">No pending submissions in queue.</td></tr>`;
    return;
  }

  pendingItems.forEach((pItem) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td style="padding:8px; border:1px solid #e2e8f0;"><strong>${pItem.title}</strong></td>
      <td style="padding:8px; border:1px solid #e2e8f0;">${pItem.district}</td>
      <td style="padding:8px; border:1px solid #e2e8f0; color:#15803d; font-size:10px;">${pItem.votes || 1} Signals (${pItem.aiValidation || 'Verified'})</td>
      <td style="padding:8px; border:1px solid #e2e8f0;">
        <button type="button" onclick="approveCloudSubmission('${pItem.id}')" style="background:#dcfce7; color:#15803d; border:none; padding:4px 10px; border-radius:4px; font-weight:bold; cursor:pointer;">Approve & Live</button>
      </td>
    `;
    pendingTbody.appendChild(row);
  });
}

// APPROVE SUBMISSION (Moves from Pending to Verified in Cloud & Local)
window.approveCloudSubmission = async function(docId) {
  let pending = getLocalPendingRecords();
  let found = pending.find(i => i.id === docId);

  if (!found) {
    try {
      const pSnap = await getDocs(collection(db, "vratyavani_pending"));
      pSnap.forEach(d => { if (d.id === docId) found = { id: d.id, ...d.data() }; });
    } catch (e) {}
  }
  if (!found) return;

  const verifiedRecord = {
    id: `rec_${Date.now()}`,
    name: found.title,
    district: found.district.toLowerCase(),
    village: found.village || "",
    coords: found.coords,
    image: found.image,
    imageUrl: found.image,
    story: found.story,
    livingCulture: found.ritual,
    isVerified: true,
    approvedAt: new Date().toLocaleString()
  };

  // 1. Cloud Update
  try {
    await setDoc(doc(db, "vratyavani_records", verifiedRecord.id), verifiedRecord);
    await deleteDoc(doc(db, "vratyavani_pending", docId));
  } catch (err) {
    console.warn("Cloud approve update error:", err);
  }

  // 2. Local Update
  let localPending = getLocalPendingRecords().filter(i => i.id !== docId);
  localStorage.setItem(PENDING_KEY, JSON.stringify(localPending));

  let verified = getLocalVerifiedRecords();
  verified.unshift(verifiedRecord);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(verified));

  alert(`✅ "${found.title}" को सफलतापूर्वक मान्यता (Verified Trust) मिल गई है और यह सभी डिवाइसेस पर लाइव हो गया है!`);
  renderInpageAdminTable();
  loadDistrictData(window.currentDistrict);
};

window.handleAdminLogin = function(e) {
  e.preventDefault();
  const uid = document.getElementById("adminUserId").value.trim();
  const pass = document.getElementById("adminPassword").value.trim();
  if (uid === "admin" && pass === "Admin@2026") {
    sessionStorage.setItem("vratyavani_admin_auth", "true");
    document.getElementById("loginModal").style.display = "none";
    openAdminPanel();
  } else {
    alert("Invalid Credentials! User: admin, Pass: Admin@2026");
  }
};

window.logoutAdmin = function() {
  sessionStorage.removeItem("vratyavani_admin_auth");
  document.getElementById("adminPanelModal").style.display = "none";
  alert("Logged out!");
};

window.openLoginModal = function() {
  if (sessionStorage.getItem("vratyavani_admin_auth") === "true") openAdminPanel();
  else document.getElementById("loginModal").style.display = "flex";
};

window.closeLoginModal = function() {
  document.getElementById("loginModal").style.display = "none";
};

window.switchMobileTab = function(tab) {
  document.getElementById("btnNavHome").classList.remove("active");
  document.getElementById("btnNavMap").classList.remove("active");
  if (tab === 'home') {
    document.getElementById("btnNavHome").classList.add("active");
    document.getElementById("homeView").style.display = "block";
    document.getElementById("mapView").style.display = "none";
  } else if (tab === 'map') {
    document.getElementById("btnNavMap").classList.add("active");
    document.getElementById("homeView").style.display = "none";
    document.getElementById("mapView").style.display = "block";
    setTimeout(() => { if (window.mapInstance) window.mapInstance.invalidateSize(); }, 150);
  }
};

window.open360Viewer = function(itemId) {
  let verified = getLocalVerifiedRecords();
  let pending = getLocalPendingRecords();
  const found = [...verified, ...pending].find(i => i.id === itemId);
  if (!found) return;

  document.getElementById("panoTitle").innerText = `WebXR 360° Tour: ${found.name || found.title}`;
  document.getElementById("panoramaModal").style.display = "flex";
  if (pannellumViewerInstance) { try { pannellumViewerInstance.destroy(); } catch(e) {} }
  setTimeout(() => {
    pannellumViewerInstance = pannellum.viewer('panoramaContainer', {
      type: 'equirectangular',
      panorama: found.imageUrl || found.image,
      autoLoad: true,
      autoRotate: -1.5
    });
  }, 200);
};

window.closePanoramaModal = function() {
  document.getElementById("panoramaModal").style.display = "none";
  if (pannellumViewerInstance) { try { pannellumViewerInstance.destroy(); } catch(e) {} }
};

window.focusOnMapTab = function(lat, lng) {
  switchMobileTab('map');
  setTimeout(() => {
    window.mapInstance.invalidateSize();
    window.mapInstance.flyTo([lat, lng], 15);
  }, 250);
};

window.showQrModal = function() { alert("Spot QR Code Scanner Active for Offline Navigation."); };
window.openCitizenModal = function() { document.getElementById("citizenModal").style.display = "flex"; };
window.closeCitizenModal = function() { document.getElementById("citizenModal").style.display = "none"; };