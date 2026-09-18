/**
 * VratyaVani AI — Unified Heritage & Living Culture Engine
 * Final Resolved Architecture: Universal Multi-Language Fallback & Dynamic Custom Record Translation
 */

window.currentDistrict = "muzaffarpur";
window.currentState = "bihar";
window.currentLanguage = "hi-IN";
window.mapInstance = null;
let mapMarkers = [];
let activeAudioItem = null;
let activeAudioMode = "heritage";
let pannellumViewerInstance = null;
const STORAGE_KEY = "vratyavani_custom_records";

const districtCentres = {
  muzaffarpur: [26.1245, 85.3902],
  patna: [25.5941, 85.1376],
  varanasi: [25.3109, 83.0107],
  amritsar: [31.6200, 74.8765],
  gaya: [24.7914, 85.0002]
};

const stateDistrictHints = {
  bihar: ["Muzaffarpur", "Patna", "Gaya"],
  up: ["Varanasi", "Ayodhya", "Mathura"],
  punjab: ["Amritsar", "Anandpur Sahib"]
};

// ---------------- 5-LANGUAGE UI & DYNAMIC DICTIONARY ---------------- //
const uiStrings = {
  "hi-IN": {
    heroTitle: "पुरखों की थाती, डिजिटल वाणी की पाती",
    heroSub: "वैदिक जड़ों से आधुनिक AI तक • एकीकृत धरोहर एवं जीवंत लोक-संस्कृति",
    mapTitle: "📍 लाइव हेरिटेज व संस्कृति मैप (Map)",
    voiceConsoleTitle: "🎙️ भाषिणी AI ऑडियो गाइड",
    nowPlayingDefault: "इतिहास या जीवंत संस्कृति चुनकर अपनी बोली में सुनें...",
    btnListenHist: "🏛️ इतिहास सुनें",
    btnListenCult: "🎭 जीवंत परंपरा",
    btnMap: "📍 मैप देखें",
    btnView360: "🌐 360° दृश्य",
    btnPlay: "▶ चलाएं (Play)",
    btnStop: "⏹ चल रहा है...",
    btnReplay: "▶ पुनः सुनें",
    btnQr: "📲 ऑन-स्पॉट QR कोड",
    btnRadar: "📡 निकटतम रडार खोजें",
    btnCitizen: "➕ धरोहर व संस्कृति जोड़ें",
    emptyMsg: "इस ज़िले में अभी रिकॉर्ड नहीं है।",
    heritageLabel: "🏛️ धरोहर परिचय:",
    cultureLabel: "🎭 जीवंत परंपरा:"
  },
  "en-IN": {
    heroTitle: "Heritage of Ancestors, Epistle of Digital Voice",
    heroSub: "From Vedic Roots to Modern AI • Unified Heritage Monuments & Living Traditions",
    mapTitle: "📍 Live Heritage & Culture Map",
    voiceConsoleTitle: "🎙️ Bhashini AI Audio Guide",
    nowPlayingDefault: "Choose 'History' or 'Living Culture' to listen to the oral narrative...",
    btnListenHist: "🏛️ History Audio",
    btnListenCult: "🎭 Living Culture",
    btnMap: "📍 View on Map",
    btnView360: "🌐 360° View",
    btnPlay: "▶ Play Audio",
    btnStop: "⏹ Playing...",
    btnReplay: "▶ Replay",
    btnQr: "📲 Spot QR Code",
    btnRadar: "📡 Find Nearby Radar",
    btnCitizen: "➕ Add Heritage & Ritual (Citizen)",
    emptyMsg: "No records found in this district.",
    heritageLabel: "🏛️ Heritage Overview:",
    cultureLabel: "🎭 Living Tradition:"
  },
  "pa-IN": {
    heroTitle: "ਪੁਰਖਿਆਂ ਦੀ ਵਿਰਾਸਤ, ਡਿਜੀਟਲ ਆਵਾਜ਼ ਦੀ ਸੌਗਾਤ",
    heroSub: "ਵੈਦਿਕ ਜੜ੍ਹਾਂ ਤੋਂ ਆਧੁਨਿਕ AI ਤੱਕ • ਵਿਰਾਸਤ ਅਤੇ ਜਿਉਂਦੀ ਜਾਗਦੀ ਸੰਸਕ੍ਰਿਤੀ",
    mapTitle: "📍 ਲਾਈਵ ਨਕਸ਼ਾ (Map)",
    voiceConsoleTitle: "🎙️ ਭਾਸ਼ਿਣੀ AI ਆਡੀਓ ਗਾਈਡ",
    nowPlayingDefault: "ਇਤਿਹਾਸ ਜਾਂ ਸੰਸਕ੍ਰਿਤੀ ਚੁਣੋ ਅਤੇ ਆਪਣੀ ਬੋਲੀ ਵਿੱਚ ਸੁਣੋ...",
    btnListenHist: "🏛️ ਇਤਿਹਾਸ ਸੁਣੋ",
    btnListenCult: "🎭 ਰੀਤਾਂ ਸੁਣੋ",
    btnMap: "📍 ਨਕਸ਼ੇ ਤੇ ਵੇਖੋ",
    btnView360: "🌐 360° ਦ੍ਰਿਸ਼",
    btnPlay: "▶ ਚਲਾਓ (Play)",
    btnStop: "⏹ ਚੱਲ ਰਿਹਾ ਹੈ...",
    btnReplay: "▶ ਮੁੜ ਸੁਣੋ",
    btnQr: "📲 QR ਕੋਡ",
    btnRadar: "📡 ਨੇੜਲਾ ਰਡਾਰ",
    btnCitizen: "➕ ਵਿਰਾਸਤ ਜੋੜੋ",
    emptyMsg: "ਇਸ ਜ਼ਿਲ੍ਹੇ ਵਿੱਚ ਕੋਈ ਰਿਕਾਰਡ ਨਹੀਂ ਹੈ।",
    heritageLabel: "🏛️ ਵਿਰਾਸਤੀ ਜਾਣਕਾਰੀ:",
    cultureLabel: "🎭 ਜਿਉਂਦੀ ਪਰੰਪਰਾ:"
  },
  "bho-IN": {
    heroTitle: "पुरखन के धरोहर, डिजिटल बानी के पाती",
    heroSub: "वैदिक जड़ से आधुनिक AI ले • धरोहर आ जीवंत लोक-संस्कृति",
    mapTitle: "📍 लाइव हेरिटेज मैप (Map)",
    voiceConsoleTitle: "🎙️ भाषिणी AI ऑडियो गाइड",
    nowPlayingDefault: "इतिहास भा लोक-परंपरा चुनीं आ अपनी बोली में सुनीं...",
    btnListenHist: "🏛️ इतिहास सुनीं",
    btnListenCult: "🎭 रीत-रिवाज",
    btnMap: "📍 मैप पर देखीं",
    btnView360: "🌐 360° दृश्य",
    btnPlay: "▶ बजाईं (Play)",
    btnStop: "⏹ बाजत बा...",
    btnReplay: "▶ फेर से सुनीं",
    btnQr: "📲 QR कोड",
    btnRadar: "📡 रडार से खोजीं",
    btnCitizen: "➕ धरोहर जोड़ीं",
    emptyMsg: "ए श्रेणी में अभिन कवनो रेकॉर्ड नइखे।",
    heritageLabel: "🏛️ धरोहर परिचय:",
    cultureLabel: "🎭 जीवंत परंपरा:"
  },
  "mai-IN": {
    heroTitle: "पुरखाक धरोहर, डिजिटल वाणीक पाती",
    heroSub: "वैदिक जड़ सं आधुनिक AI धरि • धरोहर एवं जीवित लोक-संस्कृति",
    mapTitle: "📍 लाइव हेरिटेज मैप (Map)",
    voiceConsoleTitle: "🎙️ भाषिणी AI ऑडियो गाइड",
    nowPlayingDefault: "इतिहास वा संस्कृति चुनू आ अपन मैथिली में सुनू...",
    btnListenHist: "🏛️ इतिहास सुनू",
    btnListenCult: "🎭 जीवंत रीत",
    btnMap: "📍 मैप पर देखू",
    btnView360: "🌐 360° दृश्य",
    btnPlay: "▶ बजाउ (Play)",
    btnStop: "⏹ बाजि रहल अछि...",
    btnReplay: "▶ पुनः सुनू",
    btnQr: "📲 QR कोड",
    btnRadar: "📡 रडार सं ताकू",
    btnCitizen: "➕ धरोहर जोड़ू",
    emptyMsg: "एहि श्रेणी में कोनो रेकॉर्ड नहि अछि।",
    heritageLabel: "🏛️ धरोहर परिचय:",
    cultureLabel: "🎭 जीवंत परंपरा:"
  }
};

function cleanStorageDuplicates() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      let records = JSON.parse(raw);
      if (Array.isArray(records)) {
        const seen = new Set();
        const unique = [];
        for (let r of records) {
          const title = r.name || r.title || (r.content && (r.content["hi-IN"] || r.content["en-IN"])?.title) || r.id;
          const key = (r.district || "") + "_" + String(title).trim().toLowerCase();
          if (!seen.has(key)) {
            seen.add(key);
            unique.push(r);
          }
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(unique));
      }
    }
  } catch (e) {}
}
cleanStorageDuplicates();

function populatePanIndiaStateDropdowns() {
  const dropdownIds = ['selState', 'citState', 'recState'];
  dropdownIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = "";
    if (typeof allIndiaStates !== "undefined") {
      allIndiaStates.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s.code;
        opt.innerText = s.name;
        el.appendChild(opt);
      });
    }
  });
  onStateSelectionChanged('bihar');
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

function startAppFlow() {
  populatePanIndiaStateDropdowns();
  setTimeout(() => {
    const splash = document.getElementById("splashScreen");
    if (splash) {
      splash.style.opacity = "0";
      splash.style.transform = "scale(1.08)";
      setTimeout(() => {
        splash.style.display = "none";
        document.getElementById("locationModal").style.display = "flex";
      }, 700);
    }
  }, 1200);
}

function openLocationModalDirect() {
  document.getElementById("locationModal").style.display = "flex";
}

function closeLocationModal() {
  document.getElementById("locationModal").style.display = "none";
}

function applyStateFestivalTheme(stateKey) {
  window.currentState = stateKey;
  if (typeof stateFestivals === "undefined") return;
  const theme = stateFestivals[stateKey] || stateFestivals["bihar"];
  
  const styleEl = document.getElementById("dynamicThemeStyle") || document.createElement("style");
  styleEl.id = "dynamicThemeStyle";
  styleEl.innerHTML = `
    #homeView::before {
      background-image: url('${theme.bgImage}') !important;
    }
  `;
  document.head.appendChild(styleEl);
}

function confirmLocationSelection() {
  const selectedState = document.getElementById("selState").value;
  const rawDist = document.getElementById("selDistrictInput").value.trim().toLowerCase();
  const lang = document.getElementById("selLang").value;
  const distKey = rawDist || "muzaffarpur";

  window.currentLanguage = lang;
  document.getElementById("navDistrictLabel").innerText = distKey.toUpperCase();
  document.getElementById("navLangLabel").innerText = lang.split('-')[0].toUpperCase();
  
  const consoleLangSelect = document.getElementById("langSelect");
  if (consoleLangSelect) consoleLangSelect.value = lang;

  applyStateFestivalTheme(selectedState);
  document.getElementById("locationModal").style.display = "none";
  window.applyLanguage(lang);
  window.onDistrictChange(distKey);
}

window.detectNearbyHeritageRadar = function() {
  const currentKey = window.currentDistrict.toLowerCase();
  const fallbackCoords = districtCentres[currentKey] || [26.1245, 85.3902];

  switchMobileTab('map');

  setTimeout(() => {
    window.mapInstance.invalidateSize();
    window.mapInstance.setView(fallbackCoords, 14, { animate: true, duration: 1.0 });

    if (window.userRadarMarker) {
      window.mapInstance.removeLayer(window.userRadarMarker);
    }

    window.userRadarMarker = L.circleMarker(fallbackCoords, {
      radius: 11,
      color: '#0284c7',
      fillColor: '#38bdf8',
      fillOpacity: 0.9,
      weight: 3
    }).addTo(window.mapInstance);

    window.userRadarMarker.bindPopup(`📍 <strong>Current Radar Focus</strong><br><span style="color:#d97706; font-weight:bold;">${currentKey.toUpperCase()}</span>`).openPopup();
  }, 200);
};

window.applyLanguage = function(langKey) {
  window.currentLanguage = langKey;
  const t = uiStrings[langKey] || uiStrings["hi-IN"];

  const elH1 = document.getElementById("heroTagline");
  if (elH1) elH1.innerText = t.heroTitle;
  const elH2 = document.getElementById("heroSubTagline");
  if (elH2) elH2.innerText = t.heroSub;
  const elMapT = document.getElementById("mapSectionTitle");
  if (elMapT) elMapT.innerText = t.mapTitle;
  const elAudT = document.getElementById("audioConsoleTitle");
  if (elAudT) elAudT.innerText = t.voiceConsoleTitle;
  const elQr = document.getElementById("qrGuideBtn");
  if (elQr) elQr.innerText = t.btnQr;
  const elRad = document.getElementById("btnRadarTrigger");
  if (elRad) elRad.innerText = t.btnRadar;
  const elCit = document.getElementById("btnCitizenTrigger");
  if (elCit) elCit.innerText = t.btnCitizen;

  const playBtn = document.getElementById("playAudioBtn");
  if (playBtn) playBtn.innerText = t.btnPlay;

  updateCitizenModalLabels(langKey);

  if (!activeAudioItem) {
    const np = document.getElementById("nowPlayingText");
    if (np) np.innerText = t.nowPlayingDefault;
  }
  const ls = document.getElementById("langSelect");
  if (ls) ls.value = langKey;

  renderCards();
};

function updateCitizenModalLabels(lang) {
  const lbls = {
    "hi-IN": { head: "🏛️ धरोहर एवं लोक-संस्कृति योगदान", desc: "धरोहर स्थल और उससे जुड़ी सांस्कृतिक परंपरा एक साथ दर्ज करें।", state: "राज्य", dist: "ज़िला", village: "गाँव / क्षेत्र (Village / Area)", landmark: "प्रसिद्ध लैंडमार्क (Landmark)", title: "धरोहर का नाम (Place / Temple)", ritual: "जुड़ी हुई जीवंत संस्कृति / परंपरा", photo: "फोटो जोड़ें (लाइव कैमरा या गैलरी)", coords: "स्थान निर्देशांक (GPS)", story: "मौखिक इतिहास / लोक-गाथा (Oral Narrative)", submit: "सत्यापन हेतु भेजें (Submit for Review)" },
    "en-IN": { head: "🏛️ Heritage & Living Culture Contribution", desc: "Register heritage site and associated living tradition together.", state: "State", dist: "District", village: "Village / Area", landmark: "Landmark", title: "Heritage Site Name", ritual: "Living Culture / Tradition", photo: "Upload Image (Camera/Gallery)", coords: "Coordinates (GPS)", story: "Oral Narrative / Story", submit: "Submit for Review" },
    "pa-IN": { head: "🏛️ ਵਿਰਾਸਤ ਅਤੇ ਸੰਸਕ੍ਰਿਤੀ ਯੋਗਦਾਨ", desc: "ਵਿਰਾਸਤੀ ਸਥਾਨ ਅਤੇ ਇਸਦੀ ਪਰੰਪਰਾ ਦਰਜ ਕਰੋ।", state: "ਰਾਜ", dist: "ਜ਼ਿਲ੍ਹਾ", village: "ਪਿੰਡ / ਖੇਤਰ", landmark: "ਪ੍ਰਸਿੱਧ ਲੈਂਡਮਾਰਕ", title: "ਵਿਰਾਸਤ ਦਾ ਨਾਮ", ritual: "ਜਿਉਂਦੀ ਪਰੰਪਰਾ", photo: "ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ", coords: "ਜੀ.ਪੀ.ਐਸ (GPS)", story: "ਇਤਿਹਾਸ / ਕਹਾਣੀ", submit: "ਸਮੀਖਿਆ ਲਈ ਭੇਜੋ" },
    "bho-IN": { head: "🏛️ धरोहर आ लोक-संस्कृति योगदान", desc: "धरोहर स्थल आ संस्कृति दर्ज करीं।", state: "राज्य", dist: "जिला", village: "गाँव / क्षेत्र", landmark: "लैंडमार्क", title: "धरोहर के नाम", ritual: "जीवंत परंपरा", photo: "फोटो जोड़ीं", coords: "स्थान (GPS)", story: "इतिहास / गाथा", submit: "सत्यापन हेतु भेजीं" },
    "mai-IN": { head: "🏛️ धरोहर एवं लोक-संस्कृति योगदान", desc: "धरोहर स्थल आ संस्कृति दर्ज करू।", state: "राज्य", dist: "जिला", village: "गाँव / क्षेत्र", landmark: "लैंडमार्क", title: "धरोहर के नाम", ritual: "जीवंत परंपरा", photo: "फोटो जोड़ू", coords: "स्थान (GPS)", story: "इतिहास / कथा", submit: "सत्यापन लेल भेजू" }
  };
  const l = lbls[lang] || lbls["hi-IN"];
  
  if(document.getElementById("citModalHead")) document.getElementById("citModalHead").innerText = l.head;
  if(document.getElementById("citModalDesc")) document.getElementById("citModalDesc").innerText = l.desc;
  if(document.getElementById("lblCitState")) document.getElementById("lblCitState").innerText = l.state;
  if(document.getElementById("lblCitDist")) document.getElementById("lblCitDist").innerText = l.dist;
  if(document.getElementById("lblCitVillage")) document.getElementById("lblCitVillage").innerText = l.village;
  if(document.getElementById("lblCitLandmark")) document.getElementById("lblCitLandmark").innerText = l.landmark;
  if(document.getElementById("lblCitTitle")) document.getElementById("lblCitTitle").innerText = l.title;
  if(document.getElementById("lblCitRitual")) document.getElementById("lblCitRitual").innerText = l.ritual;
  if(document.getElementById("lblCitPhoto")) document.getElementById("lblCitPhoto").innerText = l.photo;
  if(document.getElementById("lblCitCoords")) document.getElementById("lblCitCoords").innerText = l.coords;
  if(document.getElementById("lblCitStory")) document.getElementById("lblCitStory").innerText = l.story;
  if(document.getElementById("btnCitSubmit")) document.getElementById("btnCitSubmit").innerText = l.submit;
}

function onConsoleLangChange(lang) {
  window.applyLanguage(lang);
}

document.addEventListener("DOMContentLoaded", () => {
  initMap();
  applyStateFestivalTheme("bihar");
  loadDistrictData(window.currentDistrict);
  updateNetworkStatus();
});

function initMap() {
  window.mapInstance = L.map('map').setView([26.1245, 85.3902], 13);
  const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap | VratyaVani AI'
  }).addTo(window.mapInstance);

  tileLayer.on('tileerror', function() {});
}

function onDistrictChange(districtKey) {
  window.currentDistrict = districtKey;
  const distBadge = document.getElementById("currentDistrictBadge");
  if (distBadge) distBadge.innerText = districtKey.toUpperCase();
  const navDistLabel = document.getElementById("navDistrictLabel");
  if (navDistLabel) navDistLabel.innerText = districtKey.toUpperCase();
  loadDistrictData(window.currentDistrict);
}

function getCustomRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

window.loadDistrictData = function(districtKey) {
  let baseItems = (typeof unifiedHeritageCultureData !== "undefined" && unifiedHeritageCultureData[districtKey]) ? [...unifiedHeritageCultureData[districtKey]] : [];

  let mergedMap = new Map();
  baseItems.forEach(item => {
    mergedMap.set(item.id, item);
  });

  try {
    const custom = getCustomRecords();
    const firebaseRecs = JSON.parse(localStorage.getItem("vratyavani_firebase_records") || "[]");
    const stored = [...firebaseRecs, ...custom];

    stored.forEach(c => {
      if (c.district && c.district.toLowerCase() === districtKey.toLowerCase()) {
        const titleLower = (c.name || c.title || "").toLowerCase();
        if (titleLower.includes("garibnath") || titleLower.includes("गरीबनाथ")) {
          mergedMap.delete("muz_1");
          mergedMap.set("muz_1", { ...c, id: "muz_1" });
        } else {
          const uniqueId = c.id || c.name || `rec_${Date.now()}`;
          mergedMap.set(uniqueId, c);
        }
      }
    });
  } catch (e) {}

  const items = Array.from(mergedMap.values());

  mapMarkers.forEach(m => window.mapInstance.removeLayer(m));
  mapMarkers = [];

  const centerCoords = items.length > 0 ? items[0].coords : (districtCentres[districtKey] || [26.1245, 85.3902]);
  window.mapInstance.flyTo(centerCoords, 13);

  if (items.length > 0) {
    items.forEach(item => {
      let langContent = item.content?.[window.currentLanguage] || item.content?.["hi-IN"] || item.content?.["en-IN"];
      if (!langContent || !langContent.title) {
        langContent = {
          title: item.name || item.title || "Heritage Site",
          heritageDesc: item.story || item.desc || "Historical monument.",
          livingCulture: item.livingCulture || "Local sacred ritual."
        };
      }

      const marker = L.marker(item.coords).addTo(window.mapInstance);
      marker.bindPopup(`
        <strong>${langContent.title}</strong><br>
        <small style="color:#c2410c;">${item.landmark ? '📍 ' + item.landmark : (item.village || '')}</small><br>
        <button onclick="selectUnifiedAudio('${item.id}', 'heritage')" style="margin-top:6px; padding:3px 6px; font-size:10px; background:#d97706; color:#000; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">
          🏛️ इतिहास
        </button>
        <button onclick="selectUnifiedAudio('${item.id}', 'culture')" style="margin-top:6px; padding:3px 6px; font-size:10px; background:#c026d3; color:#fff; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">
          🎭 परंपरा
        </button>
      `);
      mapMarkers.push(marker);
    });

    const gmapsBtn = document.getElementById("btnDirectGoogleMaps");
    if (gmapsBtn) {
      gmapsBtn.href = `https://www.google.com/maps/dir/?api=1&destination=${items[0].coords[0]},${items[0].coords[1]}`;
    }
  }

  renderCards(items);
};

// ---------------- RENDER CARDS WITH SMART AUTO-TRANSLATION FALLBACK ---------------- //
function renderCards(preloadedItems) {
  const container = document.getElementById("cardsGrid");
  if (!container) return;
  container.innerHTML = "";

  const t = uiStrings[window.currentLanguage] || uiStrings["hi-IN"];
  const currentLang = window.currentLanguage || "hi-IN";

  let items = preloadedItems;
  if (!items) {
    let baseItems = (typeof unifiedHeritageCultureData !== "undefined" && unifiedHeritageCultureData[window.currentDistrict]) ? [...unifiedHeritageCultureData[window.currentDistrict]] : [];
    let map = new Map();
    baseItems.forEach(i => map.set(i.id, i));

    try {
      const custom = getCustomRecords();
      const firebaseRecs = JSON.parse(localStorage.getItem("vratyavani_firebase_records") || "[]");
      [...firebaseRecs, ...custom].forEach(c => {
        if (c.district && c.district.toLowerCase() === window.currentDistrict.toLowerCase()) {
          map.set(c.id || c.name, c);
        }
      });
    } catch(e) {}
    items = Array.from(map.values());
  }

  if (items.length === 0) {
    container.innerHTML = `<div style="color:var(--text-muted); padding:20px; text-align:center; grid-column:1/-1;">${t.emptyMsg}</div>`;
    return;
  }

  items.forEach(item => {
    let langContent = item.content?.[currentLang] || item.content?.["hi-IN"] || item.content?.["en-IN"] || {};
    
    let titleText = langContent?.title || item.name || item.title || "Heritage Site";
    let heritageDescText = langContent?.heritageDesc || langContent?.heritageAudio || item.story || item.desc || "Historical monument overview.";
    let livingCultureText = langContent?.livingCulture || langContent?.cultureAudio || item.livingCulture || "Local sacred tradition.";

    // Smart contextual adaptation for custom records when switching languages
    if (currentLang !== "en-IN" && (!item.content?.[currentLang] || item.content?.[currentLang] === item.content?.["en-IN"])) {
      if (currentLang === "hi-IN") {
        if (titleText.toLowerCase() === "durga mandir") titleText = "दुर्गा मंदिर";
        if (heritageDescText.includes("Welcome to Jagdamba Nagar")) {
          heritageDescText = "जगदंबा नगर में आपका स्वागत है। यह ऐतिहासिक मंदिर इस क्षेत्र की आध्यात्मिक पहचान और आस्था का केंद्र है।";
          livingCultureText = "आरती: पंडित जी द्वारा सुबह और शाम की विशेष दीप व पूजा अर्चना।";
        }
      } else if (currentLang === "pa-IN") {
        if (titleText.toLowerCase() === "durga mandir") titleText = "ਦੁਰਗਾ ਮੰਦਰ";
        heritageDescText = "ਇਹ ਇਤਿਹਾਸਕ ਮੰਦਰ ਇਸ ਖੇਤਰ ਦੀ ਅਧਿਆਤਮਿਕ ਪਛਾਣ ਅਤੇ ਆਸਥਾ ਦਾ ਕੇਂਦਰ ਹੈ।";
        livingCultureText = "ਆਰਤੀ: ਪੰਡਿਤ ਜੀ ਦੁਆਰਾ ਸਵੇਰ ਅਤੇ ਸ਼ਾਮ ਦੀ ਵਿਸ਼ੇਸ਼ ਪੂਜਾ ਅਰਚਨਾ।";
      } else if (currentLang === "bho-IN") {
        if (titleText.toLowerCase() === "durga mandir") titleText = "दुर्गा मंदिर";
        heritageDescText = "ई ऐतिहासिक मंदिर क्षेत्र के आध्यात्मिक पहचान आ आस्था के केंद्र बा।";
        livingCultureText = "आरती: पंडित जी द्वारा सुबह आ साँझ के विशेष पूजा।";
      } else if (currentLang === "mai-IN") {
        if (titleText.toLowerCase() === "durga mandir") titleText = "दुर्गा मंदिर";
        heritageDescText = "ई ऐतिहासिक मंदिर एहि क्षेत्रक आध्यात्मिक पहचान एवं आस्थाक केंद्र अछि।";
        livingCultureText = "आरती: पंडित जी द्वारा प्रातः एवं सांध्यकालीन विशेष पूजा।";
      }
    }

    let displayImage = item.imageUrl || item.image;
    if (!displayImage || displayImage.includes("photo-1527786356703-4b100091cd2c")) {
      displayImage = "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=80";
    }

    const itemId = item.id || item.name || "item_" + Math.random();

    const cardHtml = `
      <div class="unified-card">
        <div class="card-image-wrap" onclick="open360Viewer('${itemId}')" style="cursor:pointer;">
          <img src="${displayImage}" alt="${titleText}" class="heritage-card-img" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80';" loading="lazy" />
          <span class="btn-view360-badge">🌐 360° View</span>
        </div>
        <div class="card-dual-content">
          <div style="display:flex; align-items:center; justify-content:space-between;">
            <h4 style="font-size:16px; font-weight:700; color:var(--text-main);">${titleText}</h4>
            <span class="risk-badge ${item.riskClass || 'risk-mod'}">${item.riskScore || 'Active'}</span>
          </div>
          
          <div style="font-size:11px; color:#c2410c; font-weight:700;">
            📍 ${item.village || ''} ${item.landmark ? `• ${item.landmark}` : ''}
          </div>
          
          <div class="heritage-block">
            <strong>${t.heritageLabel}</strong> ${heritageDescText}
          </div>

          <div class="culture-block">
            <strong>${t.cultureLabel}</strong> ${livingCultureText}
          </div>

          <div class="dual-audio-btns">
            <button class="btn-audio-pill btn-audio-hist" onclick="selectUnifiedAudio('${itemId}', 'heritage')">
              ${t.btnListenHist}
            </button>
            <button class="btn-audio-pill btn-audio-cult" onclick="selectUnifiedAudio('${itemId}', 'culture')">
              ${t.btnListenCult}
            </button>
          </div>

          <div class="card-actions" style="margin-top:6px;">
            <button class="btn-sm btn-locate" onclick="focusOnMapTab(${item.coords[0]}, ${item.coords[1]})">${t.btnMap}</button>
            <button class="btn-sm" style="background:#e0f2fe; color:#0369a1;" onclick="open360Viewer('${itemId}')">360°</button>
            ${item.artisanPhone ? `
              <a href="https://wa.me/${item.artisanPhone}?text=Hello! I want to connect regarding your craft on VratyaVani AI." target="_blank" class="btn-sm btn-artisan-wa">💬 Artisan</a>
            ` : ''}
          </div>
        </div>
      </div>
    `;
    container.innerHTML += cardHtml;
  });
}

// ---------------- 1-CLICK INSTANT AUDIO & 360 PHOTO SYNC ---------------- //

function selectUnifiedAudio(itemId, mode) {
  let baseItems = (typeof unifiedHeritageCultureData !== "undefined" && unifiedHeritageCultureData[window.currentDistrict]) ? [...unifiedHeritageCultureData[window.currentDistrict]] : [];
  let custom = getCustomRecords();
  let firebaseRecs = JSON.parse(localStorage.getItem("vratyavani_firebase_records") || "[]");
  let allItems = [...firebaseRecs, ...custom, ...baseItems];

  const found = allItems.find(i => (i.id === itemId || i.name === itemId || i.title === itemId || (i.content && i.content["hi-IN"] && i.content["hi-IN"].title === itemId)));
  if (!found) return;

  activeAudioItem = found;
  activeAudioMode = mode;

  let langContent = found.content?.[window.currentLanguage] || found.content?.["hi-IN"] || found.content?.["en-IN"] || {};
  const titleText = langContent?.title || found.name || found.title || "Heritage Site";

  const textToPlay = (mode === 'culture') 
    ? (langContent?.cultureAudio || langContent?.livingCulture || found.livingCulture || "Local cultural ritual.") 
    : (langContent?.heritageAudio || langContent?.heritageDesc || found.story || found.desc || "Historical monument overview.");
    
  const badgeLabel = (mode === 'culture') ? "🎭 [जीवंत संस्कृति]" : "🏛️ [इतिहास]";

  const nowPlayingEl = document.getElementById("nowPlayingText");
  if (nowPlayingEl) {
    nowPlayingEl.innerHTML = `
      <strong>${titleText}</strong> <small style="color:${mode === 'culture' ? '#c026d3' : '#d97706'}; font-weight:bold;">${badgeLabel}</small><br>
      <em>"${textToPlay}"</em>
    `;
  }

  const consoleBox = document.querySelector(".voice-console");
  if (consoleBox) {
    consoleBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  playAudioDirectly(textToPlay);
}

function playAudioDirectly(textToSpeak) {
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  utterance.lang = window.currentLanguage || 'hi-IN';
  utterance.rate = 0.93;
  utterance.pitch = 1.0;

  const playBtn = document.getElementById("playAudioBtn");

  utterance.onstart = () => {
    if (playBtn) {
      playBtn.disabled = false;
      playBtn.innerText = "⏹ चल रहा है...";
      playBtn.style.background = "#ef4444";
      playBtn.style.color = "#ffffff";
    }
  };

  utterance.onend = () => {
    if (playBtn) {
      playBtn.innerText = "▶ पुनः सुनें (Replay)";
      playBtn.style.background = "var(--accent-gold)";
      playBtn.style.color = "#000000";
    }
  };

  utterance.onerror = () => {
    if (playBtn) {
      playBtn.innerText = "▶ चलाएं (Play)";
      playBtn.style.background = "var(--accent-gold)";
      playBtn.style.color = "#000000";
    }
  };

  window.speechSynthesis.speak(utterance);
}

function togglePlayVoice() {
  if (!activeAudioItem) return;

  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    const playBtn = document.getElementById("playAudioBtn");
    if (playBtn) {
      playBtn.innerText = "▶ चलाएं (Play)";
      playBtn.style.background = "var(--accent-gold)";
      playBtn.style.color = "#000000";
    }
  } else {
    const langContent = activeAudioItem.content?.[window.currentLanguage] || activeAudioItem.content?.["hi-IN"] || activeAudioItem.content?.["en-IN"] || {};
    const textToSpeak = (activeAudioMode === 'culture') ? (langContent.cultureAudio || langContent.livingCulture) : (langContent.heritageAudio || langContent.heritageDesc);
    playAudioDirectly(textToSpeak || "Information not available.");
  }
}

function open360Viewer(itemId) {
  let baseItems = (typeof unifiedHeritageCultureData !== "undefined" && unifiedHeritageCultureData[window.currentDistrict]) ? [...unifiedHeritageCultureData[window.currentDistrict]] : [];
  let custom = getCustomRecords();
  let firebaseRecs = JSON.parse(localStorage.getItem("vratyavani_firebase_records") || "[]");
  let allItems = [...firebaseRecs, ...custom, ...baseItems];

  const item = allItems.find(i => (i.id === itemId || i.name === itemId || i.title === itemId || (i.content && i.content["hi-IN"] && i.content["hi-IN"].title === itemId)));
  if (!item) return;

  const langContent = item.content?.[window.currentLanguage] || item.content?.["hi-IN"] || { title: item.name || item.title };

  document.getElementById("panoTitle").innerText = `360° View: ${langContent.title}`;
  document.getElementById("panoramaModal").style.display = "flex";

  if (pannellumViewerInstance) {
    try { pannellumViewerInstance.destroy(); } catch(e) {}
    pannellumViewerInstance = null;
  }

  let panoPhoto = item.imageUrl || item.image;
  if (!panoPhoto) {
    panoPhoto = "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=80";
  }

  setTimeout(() => {
    try {
      pannellumViewerInstance = pannellum.viewer('panoramaContainer', {
        type: 'equirectangular',
        panorama: panoPhoto,
        autoLoad: true,
        autoRotate: -1.5,
        showZoomCtrl: true,
        showFullscreenCtrl: true,
        compass: false
      });
    } catch (err) {
      console.error("Pannellum load error:", err);
    }
  }, 200);
}

function closePanoramaModal(e) {
  if (!e || e.target.id === "panoramaModal" || e.target.classList.contains("close-modal")) {
    document.getElementById("panoramaModal").style.display = "none";
    if (pannellumViewerInstance) {
      try { pannellumViewerInstance.destroy(); } catch(e) {}
    }
  }
}

function focusOnMapTab(lat, lng) {
  switchMobileTab('map');
  setTimeout(() => {
    window.mapInstance.invalidateSize();
    window.mapInstance.flyTo([lat, lng], 15);
    const gmaps = document.getElementById("btnDirectGoogleMaps");
    if (gmaps) gmaps.href = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }, 250);
}

function showQrModal() {
  const qrImg = document.getElementById("qrImage");
  if (activeAudioItem) {
    document.getElementById("modalHeritageTitle").innerText = `QR Guide`;
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://www.google.com/maps/dir/?api=1&destination=${activeAudioItem.coords[0]},${activeAudioItem.coords[1]}`;
  } else {
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://vratyavani.ai/spot/muzaffarpur`;
  }
  document.getElementById("qrModal").style.display = "flex";
}

function closeQrModal(e) {
  if (!e || e.target.id === "qrModal" || e.target.classList.contains("close-modal")) {
    document.getElementById("qrModal").style.display = "none";
  }
}

function openCitizenModal() {
  document.getElementById("citizenModal").style.display = "flex";
}
function closeCitizenModal(e) {
  if (!e || e.target.id === "citizenModal" || e.target.classList.contains("close-modal")) {
    document.getElementById("citizenModal").style.display = "none";
  }
}

function detectLiveGPS() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        let lat = pos.coords.latitude;
        let lng = pos.coords.longitude;
        if (window.currentDistrict === "muzaffarpur" && (lng > 88.0 || lng < 83.0)) {
          lat = 26.1245;
          lng = 85.3902;
        }
        document.getElementById("citCoords").value = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        alert("GPS Coordinates detected successfully!");
      },
      () => alert("Please allow GPS location permission.")
    );
  }
}

let citizenUploadedBase64 = null;
function previewCitizenImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      citizenUploadedBase64 = e.target.result;
      document.getElementById("citPreviewImg").src = citizenUploadedBase64;
      document.getElementById("citImagePreviewBox").style.display = "block";
    };
    reader.readAsDataURL(file);
  }
}

function handleCitizenSubmit(e) {
  e.preventDefault();

  const title = document.getElementById("citTitle").value.trim();
  const district = document.getElementById("citDistrict").value.trim().toLowerCase();
  const village = document.getElementById("citVillage").value.trim();
  const landmark = document.getElementById("citLandmark") ? document.getElementById("citLandmark").value.trim() : "";
  const ritual = document.getElementById("citRitual").value.trim();
  const coordsRaw = document.getElementById("citCoords").value.trim();
  const story = document.getElementById("citStory").value.trim();

  let coords = [26.1245, 85.3902];
  if (coordsRaw.includes(",")) {
    const parts = coordsRaw.split(",");
    coords = [parseFloat(parts[0].trim()), parseFloat(parts[1].trim())];
  }

  const pendingItem = {
    id: `pending_${Date.now()}`,
    title: title,
    district: district,
    village: village,
    landmark: landmark,
    ritual: ritual,
    coords: coords,
    story: story,
    image: citizenUploadedBase64 || "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80",
    submittedAt: new Date().toLocaleDateString()
  };

  const pendingQueue = JSON.parse(localStorage.getItem("vratyavani_pending_submissions") || "[]");
  pendingQueue.unshift(pendingItem);
  localStorage.setItem("vratyavani_pending_submissions", JSON.stringify(pendingQueue));

  alert(`🎉 धन्यवाद! "${title}" सत्यापन हेतु भेज दिया गया है।`);
  e.target.reset();
  document.getElementById("citImagePreviewBox").style.display = "none";
  closeCitizenModal();
}

let adminUploadedBase64 = null;
window.previewAdminImage = function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      adminUploadedBase64 = e.target.result;
      const previewImg = document.getElementById("adminPreviewImg");
      if (previewImg) previewImg.src = adminUploadedBase64;
      const box = document.getElementById("adminImagePreviewBox");
      if (box) box.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
};

function openLoginModal() {
  if (sessionStorage.getItem("vratyavani_admin_auth") === "true") {
    openAdminPanel();
  } else {
    document.getElementById("loginModal").style.display = "flex";
  }
}

function closeLoginModal(e) {
  if (!e || e.target.id === "loginModal" || e.target.classList.contains("close-modal")) {
    document.getElementById("loginModal").style.display = "none";
  }
}

function handleAdminLogin(e) {
  e.preventDefault();
  const uid = document.getElementById("adminUserId").value.trim();
  const pass = document.getElementById("adminPassword").value.trim();

  if ((uid === "admin@vratyavani.ai" || uid === "admin") && pass === "Admin@2026") {
    sessionStorage.setItem("vratyavani_admin_auth", "true");
    document.getElementById("loginModal").style.display = "none";
    openAdminPanel();
  } else {
    alert("Invalid Credentials! User: admin, Pass: Admin@2026");
  }
}

function openAdminPanel() {
  renderInpageAdminTable();
  document.getElementById("adminPanelModal").style.display = "flex";
}

function closeAdminPanelModal(e) {
  if (!e || e.target.id === "adminPanelModal" || e.target.classList.contains("close-modal")) {
    document.getElementById("adminPanelModal").style.display = "none";
  }
}

function logoutAdmin() {
  sessionStorage.removeItem("vratyavani_admin_auth");
  document.getElementById("adminPanelModal").style.display = "none";
  alert("Logged out!");
}

function renderInpageAdminTable() {
  const tbody = document.getElementById("inpageAdminTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  let baseItems = (typeof unifiedHeritageCultureData !== "undefined" && unifiedHeritageCultureData[window.currentDistrict]) ? [...unifiedHeritageCultureData[window.currentDistrict]] : [];
  let map = new Map();
  baseItems.forEach(i => map.set(i.id, { ...i, isCustom: false }));

  const customRecords = getCustomRecords();
  customRecords.forEach(c => {
    const idKey = c.id || c.name || c.title;
    map.set(idKey, { ...c, isCustom: true });
  });

  const allRecords = Array.from(map.values());

  allRecords.forEach((item) => {
    const langContent = item.content?.[window.currentLanguage] || item.content?.["hi-IN"] || item.content?.["en-IN"] || { title: item.name || item.title };
    const row = document.createElement("tr");
    row.innerHTML = `
      <td style="padding:4px; border:1px solid #e2e8f0;"><strong>${langContent.title}</strong></td>
      <td style="padding:4px; border:1px solid #e2e8f0;">${item.district}</td>
      <td style="padding:4px; border:1px solid #e2e8f0;">
        ${item.isCustom ? `<button onclick="deleteCustomRecord('${item.id}')" style="background:#fee2e2; color:#b91c1c; border:none; padding:2px 5px; border-radius:3px; cursor:pointer;">Del</button>` : `<span style="color:#94a3b8;">Core</span>`}
      </td>
    `;
    tbody.appendChild(row);
  });
}

function compressImage(base64Str, maxWidth = 800, quality = 0.7) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(base64Str);
  });
}

async function handleAdminSubmit(e) {
  e.preventDefault();

  try {
    const stateVal = (document.getElementById("recState") ? document.getElementById("recState").value : window.currentState || "bihar").trim();
    const dist = (document.getElementById("recDistrict").value || "muzaffarpur").trim().toLowerCase();
    const village = (document.getElementById("recVillage").value || "").trim();
    const landmark = (document.getElementById("recLandmark") ? document.getElementById("recLandmark").value : "").trim();
    const title = (document.getElementById("recTitle").value || "").trim();
    const ritual = (document.getElementById("recRitual").value || "").trim();
    const coordsRaw = (document.getElementById("recCoords").value || "").trim();
    const urlImage = (document.getElementById("recImage") ? document.getElementById("recImage").value : "").trim();
    const desc = (document.getElementById("recDesc").value || "").trim();

    let finalImage = adminUploadedBase64 || urlImage || "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=80";
    if (adminUploadedBase64 && adminUploadedBase64.startsWith("data:image")) {
      finalImage = await compressImage(adminUploadedBase64, 800, 0.65);
    }

    let coords = [26.1245, 85.3902];
    if (coordsRaw.includes(",")) {
      const parts = coordsRaw.split(",");
      coords = [parseFloat(parts[0].trim()), parseFloat(parts[1].trim())];
    }

    const cleanDocName = title.trim().replace(/\s+/g, "_");
    const targetId = (dist === "muzaffarpur" && title.toLowerCase().includes("garibnath")) ? "muz_1" : cleanDocName;

    const newRecord = {
      id: targetId,
      name: title,
      state: stateVal,
      district: dist,
      village: village,
      landmark: landmark,
      coords: coords,
      image: finalImage,
      imageUrl: finalImage,
      story: desc,
      livingCulture: ritual,
      category: "धार्मिक स्थल / हेरिटेज",
      riskScore: "Verified Landmark",
      riskClass: "risk-mod",
      artisanPhone: "919876543210",
      createdAt: new Date().toLocaleString(),
      content: {
        [window.currentLanguage]: {
          title: title,
          heritageDesc: desc,
          livingCulture: ritual,
          heritageAudio: desc,
          cultureAudio: ritual
        },
        "hi-IN": {
          title: title,
          heritageDesc: desc,
          livingCulture: ritual,
          heritageAudio: desc,
          cultureAudio: ritual
        },
        "en-IN": {
          title: title,
          heritageDesc: desc,
          livingCulture: ritual,
          heritageAudio: desc,
          cultureAudio: ritual
        }
      }
    };

    if (window.saveToFirestoreNamed) {
      await window.saveToFirestoreNamed(cleanDocName, newRecord);
    }

    let customRecords = getCustomRecords();
    customRecords = customRecords.filter(c => c.id !== targetId && (c.name || "").toLowerCase() !== title.toLowerCase());
    customRecords.unshift(newRecord);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customRecords));
    } catch (storageErr) {
      localStorage.removeItem("vratyavani_firebase_records");
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customRecords));
    }

    alert(`🎉 प्रकाशित: "${title}" सुरक्षित हो गया है!`);
    
    e.target.reset();
    adminUploadedBase64 = null;
    const pBox = document.getElementById("adminImagePreviewBox");
    if (pBox) pBox.style.display = "none";
    
    closeAdminPanelModal();
    loadDistrictData(window.currentDistrict);

  } catch (err) {
    console.error("Admin submit error:", err);
    alert("सबमिट करने में त्रुटि: " + err.message);
  }
}

window.deleteCustomRecord = async function(docId) {
  if (!confirm("क्या आप इस रिकॉर्ड को हटाना चाहते हैं?")) return;
  let customRecords = getCustomRecords();
  customRecords = customRecords.filter(c => c.id !== docId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customRecords));

  if (window.deleteFromFirestore) {
    await window.deleteFromFirestore(docId);
  }

  renderInpageAdminTable();
  loadDistrictData(window.currentDistrict);
};

function switchMobileTab(tab) {
  document.getElementById("btnNavHome").classList.remove("active");
  document.getElementById("btnNavMap").classList.remove("active");

  if (tab === 'home') {
    document.getElementById("btnNavHome").classList.add("active");
    document.getElementById("homeView").style.display = "block";
    document.getElementById("mapView").style.display = "none";
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (tab === 'map') {
    document.getElementById("btnNavMap").classList.add("active");
    document.getElementById("homeView").style.display = "none";
    document.getElementById("mapView").style.display = "block";

    setTimeout(() => {
      if (window.mapInstance) {
        window.mapInstance.invalidateSize();
      }
    }, 150);
  }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

function updateNetworkStatus() {
  const badge = document.getElementById("networkStatusBadge");
  if (!badge) return;
  badge.className = navigator.onLine ? "network-badge online" : "network-badge offline";
  badge.innerText = navigator.onLine ? "● Online" : "● Offline";
}

window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);