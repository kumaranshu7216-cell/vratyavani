/**
 * VratyaVani AI — Smart Proximity Radar & Geographic Engine
 */

window.currentDistrict = "muzaffarpur";
window.currentLanguage = "en-IN";
let currentCategory = "major";
window.mapInstance = null;
let mapMarkers = [];
let activeAudioItem = null;
let pannellumViewerInstance = null;
const STORAGE_KEY = "vratyavani_custom_records";

// District Central Coords for Safe Fallback (Preventing ISP Geolocation Jumps)
const districtCentres = {
  muzaffarpur: [26.1209, 85.3647],
  patna: [25.5941, 85.1376],
  varanasi: [25.3176, 82.9739],
  amritsar: [31.6340, 74.8723],
  gaya: [24.7914, 85.0002]
};

const stateDistrictHints = {
  bihar: ["Muzaffarpur", "Patna", "Gaya", "Nalanda", "Vaishali", "Bhagalpur", "Darbhanga", "Munger"],
  up: ["Varanasi", "Ayodhya", "Mathura", "Prayagraj", "Lucknow", "Agra", "Gorakhpur"],
  punjab: ["Amritsar", "Anandpur Sahib", "Patiala", "Ludhiana", "Jalandhar"],
  rajasthan: ["Jaipur", "Udaipur", "Jodhpur", "Jaisalmer", "Pushkar"],
  mp: ["Ujjain", "Khajuraho", "Gwalior", "Bhopal", "Indore"],
  delhi: ["Central Delhi", "New Delhi", "South Delhi"]
};

function populatePanIndiaStateDropdowns() {
  const dropdownIds = ['selState', 'citState', 'recState'];
  dropdownIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = "";
    allIndiaStates.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s.code;
      opt.innerText = s.name;
      el.appendChild(opt);
    });
  });

  onStateSelectionChanged('bihar');
}

window.onStateSelectionChanged = function(stateCode) {
  const datalist = document.getElementById("districtDatalist");
  if (!datalist) return;
  datalist.innerHTML = "";

  const hints = stateDistrictHints[stateCode] || ["City Center", "North District", "South District"];
  hints.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d;
    datalist.appendChild(opt);
  });

  document.getElementById("selDistrictInput").value = hints[0];
};

function startAppFlow() {
  populatePanIndiaStateDropdowns();
  setTimeout(() => {
    const splash = document.getElementById("splashScreen");
    splash.style.opacity = "0";
    splash.style.transform = "scale(1.08)";
    setTimeout(() => {
      splash.style.display = "none";
      document.getElementById("locationModal").style.display = "flex";
    }, 700);
  }, 1200);
}

function openLocationModalDirect() {
  document.getElementById("locationModal").style.display = "flex";
}

function closeLocationModal() {
  document.getElementById("locationModal").style.display = "none";
}

function confirmLocationSelection() {
  const rawDist = document.getElementById("selDistrictInput").value.trim().toLowerCase();
  const lang = document.getElementById("selLang").value;
  const distKey = rawDist || "muzaffarpur";

  document.getElementById("navDistrictLabel").innerText = distKey.toUpperCase();
  document.getElementById("navLangLabel").innerText = lang.split('-')[0].toUpperCase();
  document.getElementById("langSelect").value = lang;

  document.getElementById("locationModal").style.display = "none";
  window.applyLanguage(lang);
  window.onDistrictChange(distKey);
}

// ---------------- SMART AUTO RADAR ENGINE (FIXED IP GEOLOCATION ISSUE) ---------------- //

window.detectNearbyHeritageRadar = function() {
  const fallbackCoords = districtCentres[window.currentDistrict] || [26.1209, 85.3647];

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        let lat = pos.coords.latitude;
        let lng = pos.coords.longitude;

        // Smart Verification: If laptop ISP jumps to another state (e.g., Guwahati lat ~26.18, lng ~91.73)
        // while current district is Muzaffarpur (~85.36), lock safely to Bihar radar center
        if (window.currentDistrict === "muzaffarpur" && (lng > 88.0 || lng < 83.0)) {
          console.warn("ISP IP mislocated outside Bihar. Locking accurately to Muzaffarpur Radar.");
          lat = fallbackCoords[0];
          lng = fallbackCoords[1];
        }

        switchMobileTab('map');
        setTimeout(() => {
          window.mapInstance.invalidateSize();
          window.mapInstance.flyTo([lat, lng], 14);

          const userLocMarker = L.circleMarker([lat, lng], {
            radius: 10,
            color: '#38bdf8',
            fillColor: '#0284c7',
            fillOpacity: 0.9
          }).addTo(window.mapInstance);

          userLocMarker.bindPopup(`📍 <strong>Current Radar Position</strong><br><small>${window.currentDistrict.toUpperCase()}</small>`).openPopup();
          alert(`📡 रडार सक्रिय: ${window.currentDistrict.toUpperCase()} में आपकी लोकेशन सटीकता से लोकेट कर दी गई है!`);
        }, 300);
      },
      () => {
        // Safe GPS Permission Denied Fallback
        switchMobileTab('map');
        setTimeout(() => {
          window.mapInstance.invalidateSize();
          window.mapInstance.flyTo(fallbackCoords, 14);
          alert(`📡 रडार: ${window.currentDistrict.toUpperCase()} हेरिटेज हब पर फोकस किया गया है।`);
        }, 300);
      }
    );
  } else {
    switchMobileTab('map');
    window.mapInstance.flyTo(fallbackCoords, 14);
  }
};

// ---------------- LANGUAGE SYNCHRONIZATION ---------------- //

const i18n = {
  "en-IN": {
    heroTitle: "Heritage of Ancestors, Epistle of Digital Voice",
    heroSub: "From Vedic Roots to Modern AI • Dual-Mode Offline Heritage Map & Voice Guide",
    tabMajor: "Major Heritage",
    tabMonument: "Monuments / Institutions",
    tabGem: "Undiscovered Gems",
    tabArtisan: "Local Artisans",
    mapTitle: "📍 Live Heritage Map",
    voiceConsoleTitle: "🎙️ Bhashini AI Audio Guide",
    nowPlayingDefault: "Select a heritage site to listen to the narrative...",
    btnListen: "🎙️ AI Listen",
    btnMap: "📍 View on Map",
    btnView360: "🌐 360° View",
    btnPlay: "▶ Play Audio",
    btnStop: "⏹ Playing...",
    btnReplay: "▶ Replay",
    btnQr: "📲 Spot QR Code",
    btnRadar: "📡 Find Nearby Heritage (Auto Radar)",
    btnCitizen: "➕ Add Heritage / Village (Citizen)",
    emptyMsg: `No records found in this district. <button onclick="openCitizenModal()" style="background:#d97706; color:#000; border:none; padding:4px 8px; border-radius:4px; font-weight:bold; cursor:pointer; margin-left:6px;">Click + Contribute to add</button>`
  },
  "hi-IN": {
    heroTitle: "पुरखों की थाती, डिजिटल वाणी की पाती",
    heroSub: "वैदिक जड़ों से आधुनिक AI तक • Dual-Mode Offline Heritage Map & Voice Guide",
    tabMajor: "प्रमुख धरोहर (Major)",
    tabMonument: "स्मारक / संस्थान (Monuments)",
    tabGem: "छिपे रत्न (Undiscovered)",
    tabArtisan: "स्थानीय शिल्पी (Artisans)",
    mapTitle: "📍 लाइव हेरिटेज मैप (Map)",
    voiceConsoleTitle: "🎙️ भाषिणी AI ऑडियो गाइड",
    nowPlayingDefault: "धरोहर चुनें और अपनी बोली में इतिहास सुनें...",
    btnListen: "🎙️ AI सुनें",
    btnMap: "📍 मैप देखें",
    btnView360: "🌐 360° दृश्य",
    btnPlay: "▶ चलाएं (Play)",
    btnStop: "⏹ चल रहा है...",
    btnReplay: "▶ पुनः सुनें",
    btnQr: "📲 ऑन-स्पॉट QR कोड",
    btnRadar: "📡 निकटतम धरोहर खोजें (Auto Radar)",
    btnCitizen: "➕ अपना गाँव / धरोहर जोड़ें (Citizen)",
    emptyMsg: `इस ज़िले/श्रेणी में अभी रिकॉर्ड सत्यापित नहीं है। <button onclick="openCitizenModal()" style="background:#d97706; color:#000; border:none; padding:4px 8px; border-radius:4px; font-weight:bold; cursor:pointer; margin-left:6px;">यहाँ + क्लिक कर जोड़ें</button>`
  },
  "bho-IN": {
    heroTitle: "पुरखन के धरोहर, डिजिटल बानी के पाती",
    heroSub: "वैदिक जड़ से आधुनिक AI ले • Dual-Mode Offline Heritage Map & Voice Guide",
    tabMajor: "खास धरोहर",
    tabMonument: "स्मारक / कॉलेज",
    tabGem: "छुपल रतन",
    tabArtisan: "कारीगर",
    mapTitle: "📍 लाइव हेरिटेज मैप (Map)",
    voiceConsoleTitle: "🎙️ भाषिणी AI ऑडियो गाइड",
    nowPlayingDefault: "धरोहर चुनीं आ अपनी बोली में इतिहास सुनीं...",
    btnListen: "🎙️ AI सुनीं",
    btnMap: "📍 मैप पर देखीं",
    btnView360: "🌐 360° दृश्य",
    btnPlay: "▶ बजाईं (Play)",
    btnStop: "⏹ बाजत बा...",
    btnReplay: "▶ फेर से सुनीं",
    btnQr: "📲 QR कोड",
    btnRadar: "📡 लगे के धरोहर खोजीं (Radar)",
    btnCitizen: "➕ आपन गाँव / धरोहर जोड़ीं",
    emptyMsg: `ए श्रेणी में अभिन कवनो रेकॉर्ड नइखे। <button onclick="openCitizenModal()" style="background:#d97706; color:#000; border:none; padding:4px 8px; border-radius:4px; font-weight:bold; cursor:pointer; margin-left:6px;">+ नया जोड़ीं</button>`
  },
  "mai-IN": {
    heroTitle: "पुरखाक धरोहर, डिजिटल वाणीक पाती",
    heroSub: "वैदिक जड़ सं आधुनिक AI धरि • Dual-Mode Offline Heritage Map & Voice Guide",
    tabMajor: "प्रमुख धरोहर",
    tabMonument: "स्मारक / संस्थान",
    tabGem: "लुकल रत्न",
    tabArtisan: "शिल्पी",
    mapTitle: "📍 लाइव हेरिटेज मैप (Map)",
    voiceConsoleTitle: "🎙️ भाषिणी AI ऑडियो गाइड",
    nowPlayingDefault: "धरोहर चुनू आ अपन मैथिली में इतिहास सुनू...",
    btnListen: "🎙️ AI सुनू",
    btnMap: "📍 मैप पर देखू",
    btnView360: "🌐 360° दृश्य",
    btnPlay: "▶ बजाउ (Play)",
    btnStop: "⏹ बाजि रहल अछि...",
    btnReplay: "▶ पुनः सुनू",
    btnQr: "📲 QR कोड",
    btnRadar: "📡 निकटतम धरोहर ताकू",
    btnCitizen: "➕ अपन गाम / धरोहर जोड़ू",
    emptyMsg: `एहि श्रेणी में कोनो रेकॉर्ड नहि अछि। <button onclick="openCitizenModal()" style="background:#d97706; color:#000; border:none; padding:4px 8px; border-radius:4px; font-weight:bold; cursor:pointer; margin-left:6px;">+ जोड़ू</button>`
  },
  "pa-IN": {
    heroTitle: "ਪੁਰਖਿਆਂ ਦੀ ਵਿਰਾਸਤ, ਡਿਜੀਟਲ ਆਵਾਜ਼ ਦੀ ਸੌਗਾਤ",
    heroSub: "ਵੈਦਿਕ ਜੜ੍ਹਾਂ ਤੋਂ ਆਧੁਨਿਕ AI ਤੱਕ • Dual-Mode Offline Heritage Map & Voice Guide",
    tabMajor: "ਮੁੱਖ ਵਿਰਾਸਤ",
    tabMonument: "ਸਮਾਰਕ / ਸੰਸਥਾਵਾਂ",
    tabGem: "ਅਣਗੌਲੇ ਰਤਨ",
    tabArtisan: "ਕਾਰੀਗਰ",
    mapTitle: "📍 ਲਾਈਵ ਨਕਸ਼ਾ (Map)",
    voiceConsoleTitle: "🎙️ ਭਾਸ਼ਿਣੀ AI ਆਡੀਓ ਗਾਈਡ",
    nowPlayingDefault: "ਵਿਰਾਸਤ ਚੁਣੋ ਅਤੇ ਆਪਣੀ ਬੋਲੀ ਵਿੱਚ ਇਤਿਹਾਸ ਸੁਣੋ...",
    btnListen: "🎙️ AI ਸੁਣੋ",
    btnMap: "📍 ਨਕਸ਼ੇ ਤੇ ਵੇਖੋ",
    btnView360: "🌐 360° ਦ੍ਰਿਸ਼",
    btnPlay: "▶ ਚਲਾਓ (Play)",
    btnStop: "⏹ ਚੱਲ ਰਿਹਾ ਹੈ...",
    btnReplay: "▶ ਮੁੜ ਸੁਣੋ",
    btnQr: "📲 QR ਕੋਡ",
    btnRadar: "📡 ਨੇੜਲੀ ਵਿਰਾਸਤ ਲੱਭੋ",
    btnCitizen: "➕ ਆਪਣਾ ਪਿੰਡ / ਵਿਰਾਸਤ ਜੋੜੋ",
    emptyMsg: `ਇਸ ਜ਼ਿਲ੍ਹੇ ਵਿੱਚ ਕੋਈ ਰਿਕਾਰਡ ਨਹੀਂ ਹੈ। <button onclick="openCitizenModal()" style="background:#d97706; color:#000; border:none; padding:4px 8px; border-radius:4px; font-weight:bold; cursor:pointer; margin-left:6px;">+ ਇੱਥੇ ਕਲਿੱਕ ਕਰਕੇ ਜੋੜੋ</button>`
  }
};

window.applyLanguage = function(langKey) {
  window.currentLanguage = langKey;
  const t = i18n[langKey] || i18n["en-IN"];

  document.getElementById("heroTagline").innerText = t.heroTitle;
  document.getElementById("heroSubTagline").innerText = t.heroSub;
  document.getElementById("tabMajor").innerText = t.tabMajor;
  document.getElementById("tabMonument").innerText = t.tabMonument;
  document.getElementById("tabGem").innerText = t.tabGem;
  document.getElementById("tabArtisan").innerText = t.tabArtisan;
  document.getElementById("mapSectionTitle").innerText = t.mapTitle;
  document.getElementById("audioConsoleTitle").innerText = t.voiceConsoleTitle;
  document.getElementById("qrGuideBtn").innerText = t.btnQr;
  document.getElementById("btnRadarTrigger").innerText = t.btnRadar;
  document.getElementById("btnCitizenTrigger").innerText = t.btnCitizen;

  const playBtn = document.getElementById("playAudioBtn");
  if (playBtn) playBtn.innerText = t.btnPlay;

  if (!activeAudioItem) {
    document.getElementById("nowPlayingText").innerText = t.nowPlayingDefault;
  }
  document.getElementById("langSelect").value = langKey;

  renderCards();
};

function onConsoleLangChange(lang) {
  window.applyLanguage(lang);
}

// ---------------- MAP INITIALIZATION & CARD RENDERING ---------------- //

document.addEventListener("DOMContentLoaded", () => {
  initMap();
  loadDistrictData(window.currentDistrict);
  updateNetworkStatus();
});

function initMap() {
  window.mapInstance = L.map('map').setView([26.1209, 85.3647], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap | VratyaVani AI'
  }).addTo(window.mapInstance);
}

function onDistrictChange(districtKey) {
  window.currentDistrict = districtKey;
  document.getElementById("currentDistrictBadge").innerText = districtKey.toUpperCase();
  document.getElementById("navDistrictLabel").innerText = districtKey.toUpperCase();
  loadDistrictData(window.currentDistrict);
}

function filterCategory(catKey) {
  currentCategory = catKey;
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");
  renderCards();
}

function getCustomRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

window.loadDistrictData = function(districtKey) {
  let items = heritageData[districtKey] ? [...heritageData[districtKey]] : [];

  try {
    const custom = getCustomRecords();
    const firebaseRecs = JSON.parse(localStorage.getItem("vratyavani_firebase_records") || "[]");
    const merged = [...firebaseRecs, ...custom];
    const matching = merged.filter(c => c.district.toLowerCase() === districtKey.toLowerCase());
    items = [...matching, ...items];
  } catch (e) {}

  mapMarkers.forEach(m => window.mapInstance.removeLayer(m));
  mapMarkers = [];

  const centerCoords = items.length > 0 ? items[0].coords : (districtCentres[districtKey] || [26.1209, 85.3647]);

  window.mapInstance.flyTo(centerCoords, 13);

  if (items.length > 0) {
    items.forEach(item => {
      const locContent = (item.content && item.content[window.currentLanguage]) ? item.content[window.currentLanguage] : (item.content ? item.content["en-IN"] : { title: item.title });
      const marker = L.marker(item.coords).addTo(window.mapInstance);
      marker.bindPopup(`
        <strong>${locContent.title}</strong><br>
        <small style="color:#c2410c;">${item.village || ''}</small><br>
        <button onclick="selectForVoice('${item.id}')" style="margin-top:6px; padding:4px 8px; font-size:11px; background:#d97706; color:#000; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">
          🎙️ Audio
        </button>
      `);
      mapMarkers.push(marker);
    });

    document.getElementById("btnDirectGoogleMaps").href = `https://www.google.com/maps/dir/?api=1&destination=${items[0].coords[0]},${items[0].coords[1]}`;
  }

  renderCards(items);
};

function renderCards(preloadedItems) {
  const container = document.getElementById("cardsGrid");
  container.innerHTML = "";

  const t = i18n[window.currentLanguage] || i18n["en-IN"];

  let items = preloadedItems;
  if (!items) {
    items = heritageData[window.currentDistrict] ? [...heritageData[window.currentDistrict]] : [];
    try {
      const custom = getCustomRecords();
      const firebaseRecs = JSON.parse(localStorage.getItem("vratyavani_firebase_records") || "[]");
      const merged = [...firebaseRecs, ...custom];
      items = [...merged.filter(c => c.district.toLowerCase() === window.currentDistrict.toLowerCase()), ...items];
    } catch(e) {}
  }

  const filtered = items.filter(item => item.category === currentCategory);

  if (filtered.length === 0) {
    container.innerHTML = `<div style="color:var(--text-muted); padding:20px; text-align:center; grid-column:1/-1;">${t.emptyMsg}</div>`;
    return;
  }

  filtered.forEach(item => {
    const locContent = (item.content && item.content[window.currentLanguage]) ? item.content[window.currentLanguage] : (item.content ? item.content["en-IN"] : { title: item.title, desc: item.desc });
    const riskScore = item.category === 'gem' ? 'Risk: 8.8 (Urgent)' : (item.category === 'artisan' ? 'Risk: 7.5 (Endangered)' : 'Preserved');
    const riskClass = (item.category === 'gem' || item.category === 'artisan') ? 'risk-high' : 'risk-mod';

    const cardHtml = `
      <div class="heritage-card">
        <div class="card-image-wrap" onclick="open360Viewer('${item.id}')" style="cursor:pointer;">
          <img src="${item.image}" alt="${locContent.title}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80';" loading="lazy" />
          <span class="btn-view360-badge">${t.btnView360}</span>
        </div>
        <div class="card-content">
          <div style="display:flex; align-items:center; margin-bottom:4px;">
            <span class="card-tag">${item.category}</span>
            <span class="risk-badge ${riskClass}">${riskScore}</span>
          </div>
          <h4 class="card-title">${locContent.title}</h4>
          ${item.village ? `<div style="font-size:11px; color:#c2410c; font-weight:700; margin-bottom:4px;">📍 ${item.village}</div>` : ''}
          <p class="card-desc">${locContent.desc}</p>
          <div class="card-actions">
            <button class="btn-sm btn-listen" onclick="selectForVoice('${item.id}')">${t.btnListen}</button>
            <button class="btn-sm btn-locate" onclick="focusOnMapTab(${item.coords[0]}, ${item.coords[1]})">${t.btnMap}</button>
            <button class="btn-sm" style="background:#e0f2fe; color:#0369a1;" onclick="open360Viewer('${item.id}')">${t.btnView360}</button>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += cardHtml;
  });
}

function open360Viewer(itemId) {
  let allItems = heritageData[window.currentDistrict] ? [...heritageData[window.currentDistrict]] : [];
  try {
    const custom = getCustomRecords();
    const firebaseRecs = JSON.parse(localStorage.getItem("vratyavani_firebase_records") || "[]");
    allItems = [...firebaseRecs, ...custom, ...allItems];
  } catch(e) {}

  const item = allItems.find(i => i.id === itemId);
  if (!item) return;

  const locContent = (item.content && item.content[window.currentLanguage]) ? item.content[window.currentLanguage] : (item.content ? item.content["en-IN"] : { title: item.title });

  document.getElementById("panoTitle").innerText = `360° Panorama: ${locContent.title}`;
  document.getElementById("panoramaModal").style.display = "flex";

  if (pannellumViewerInstance) {
    try { pannellumViewerInstance.destroy(); } catch(e) {}
  }

  setTimeout(() => {
    pannellumViewerInstance = pannellum.viewer('panoramaContainer', {
      type: 'equirectangular',
      panorama: item.image,
      autoLoad: true,
      autoRotate: -2,
      compass: true
    });
  }, 150);
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
    document.getElementById("btnDirectGoogleMaps").href = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }, 250);
}

function selectForVoice(itemId) {
  let allItems = heritageData[window.currentDistrict] ? [...heritageData[window.currentDistrict]] : [];
  try {
    const custom = getCustomRecords();
    const firebaseRecs = JSON.parse(localStorage.getItem("vratyavani_firebase_records") || "[]");
    allItems = [...firebaseRecs, ...custom, ...allItems];
  } catch(e) {}

  const found = allItems.find(i => i.id === itemId);
  if (!found) return;

  activeAudioItem = found;
  const locContent = (found.content && found.content[window.currentLanguage]) ? found.content[window.currentLanguage] : (found.content ? found.content["en-IN"] : { title: found.title, audio: found.bhashiniAudioText });

  document.getElementById("nowPlayingText").innerHTML = `
    <strong>${locContent.title}</strong><br>
    <em>"${locContent.audio}"</em>
  `;
  const playBtn = document.getElementById("playAudioBtn");
  playBtn.disabled = false;
  const t = i18n[window.currentLanguage] || i18n["en-IN"];
  playBtn.innerText = t.btnPlay;
}

function togglePlayVoice() {
  if (!activeAudioItem) return;

  const t = i18n[window.currentLanguage] || i18n["en-IN"];
  const locContent = (activeAudioItem.content && activeAudioItem.content[window.currentLanguage]) ? activeAudioItem.content[window.currentLanguage] : (activeAudioItem.content ? activeAudioItem.content["en-IN"] : { audio: activeAudioItem.bhashiniAudioText });

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(locContent.audio);
    utterance.lang = window.currentLanguage;
    utterance.rate = 0.92;

    utterance.onstart = () => {
      document.getElementById("playAudioBtn").innerText = t.btnStop;
    };
    utterance.onend = () => {
      document.getElementById("playAudioBtn").innerText = t.btnReplay;
    };

    window.speechSynthesis.speak(utterance);
  }
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

// ---------------- CITIZEN & ADMIN SUBMISSION LOGIC ---------------- //

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
          lat = 26.1209;
          lng = 85.3647;
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
  const coordsRaw = document.getElementById("citCoords").value.trim();
  const story = document.getElementById("citStory").value.trim();

  let coords = [26.1209, 85.3647];
  if (coordsRaw.includes(",")) {
    const parts = coordsRaw.split(",");
    coords = [parseFloat(parts[0].trim()), parseFloat(parts[1].trim())];
  }

  const pendingItem = {
    id: `pending_${Date.now()}`,
    title: title,
    district: district,
    village: village,
    coords: coords,
    story: story,
    image: citizenUploadedBase64 || "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80",
    submittedAt: new Date().toLocaleDateString()
  };

  const pendingQueue = JSON.parse(localStorage.getItem("vratyavani_pending_submissions") || "[]");
  pendingQueue.unshift(pendingItem);
  localStorage.setItem("vratyavani_pending_submissions", JSON.stringify(pendingQueue));

  alert(`🎉 Thank you! "${title}" (${village}) submitted for Nodal Admin review.`);
  e.target.reset();
  document.getElementById("citImagePreviewBox").style.display = "none";
  closeCitizenModal();
}

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
  renderPendingCitizenTable();
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

function renderPendingCitizenTable() {
  const tbody = document.getElementById("pendingCitizenTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const pendingQueue = JSON.parse(localStorage.getItem("vratyavani_pending_submissions") || "[]");

  if (pendingQueue.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#94a3b8; padding:8px;">No pending contributions.</td></tr>`;
    return;
  }

  pendingQueue.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="padding:4px; border:1px solid #e2e8f0;"><strong>${item.title}</strong></td>
      <td style="padding:4px; border:1px solid #e2e8f0;">${item.district} (${item.village || ''})</td>
      <td style="padding:4px; border:1px solid #e2e8f0;"><small>${item.story.substring(0, 25)}...</small></td>
      <td style="padding:4px; border:1px solid #e2e8f0; display:flex; gap:4px;">
        <button onclick="approveCitizenSubmission(${index})" style="background:#dcfce7; color:#15803d; border:none; padding:3px 6px; border-radius:3px; font-weight:700; cursor:pointer;">✓ Approve</button>
        <button onclick="rejectCitizenSubmission(${index})" style="background:#fee2e2; color:#b91c1c; border:none; padding:3px 6px; border-radius:3px; font-weight:700; cursor:pointer;">✕</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function approveCitizenSubmission(index) {
  const pendingQueue = JSON.parse(localStorage.getItem("vratyavani_pending_submissions") || "[]");
  const approvedItem = pendingQueue.splice(index, 1)[0];

  const liveRecord = {
    id: `cit_${Date.now()}`,
    category: "gem",
    district: approvedItem.district,
    village: approvedItem.village,
    coords: approvedItem.coords,
    image: approvedItem.image,
    source: "Community Verified",
    content: {
      "hi-IN": { title: approvedItem.title, desc: approvedItem.story, audio: approvedItem.story },
      "en-IN": { title: approvedItem.title, desc: approvedItem.story, audio: approvedItem.story }
    }
  };

  const customRecords = JSON.parse(localStorage.getItem("vratyavani_custom_records") || "[]");
  customRecords.unshift(liveRecord);
  localStorage.setItem("vratyavani_custom_records", JSON.stringify(customRecords));
  localStorage.setItem("vratyavani_pending_submissions", JSON.stringify(pendingQueue));

  alert(`Verified! "${approvedItem.title}" is now live on the map and cards.`);
  renderPendingCitizenTable();
  renderInpageAdminTable();
  loadDistrictData(window.currentDistrict);
}

function rejectCitizenSubmission(index) {
  if (!confirm("Reject this submission?")) return;
  const pendingQueue = JSON.parse(localStorage.getItem("vratyavani_pending_submissions") || "[]");
  pendingQueue.splice(index, 1);
  localStorage.setItem("vratyavani_pending_submissions", JSON.stringify(pendingQueue));
  renderPendingCitizenTable();
}

function renderInpageAdminTable() {
  const tbody = document.getElementById("inpageAdminTableBody");
  tbody.innerHTML = "";

  let allRecords = [];
  Object.keys(heritageData).forEach((dk) => {
    heritageData[dk].forEach((item) => {
      allRecords.push({ ...item, isCustom: false });
    });
  });

  const customRecords = getCustomRecords().map(i => ({ ...i, isCustom: true }));
  allRecords = [...customRecords, ...allRecords];

  allRecords.forEach((item, index) => {
    const title = (item.content && item.content["en-IN"]) ? item.content["en-IN"].title : item.title;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td style="padding:4px; border:1px solid #e2e8f0;"><strong>${title}</strong></td>
      <td style="padding:4px; border:1px solid #e2e8f0;">${item.district}</td>
      <td style="padding:4px; border:1px solid #e2e8f0;">
        ${item.isCustom ? `<button onclick="deleteCustomRecord(${index})" style="background:#fee2e2; color:#b91c1c; border:none; padding:2px 5px; border-radius:3px; cursor:pointer;">Del</button>` : `<span style="color:#94a3b8;">Core</span>`}
      </td>
    `;
    tbody.appendChild(row);
  });
}

async function handleAdminSubmit(e) {
  e.preventDefault();

  const cat = document.getElementById("recCat").value;
  const dist = document.getElementById("recDistrict").value.trim().toLowerCase();
  const village = document.getElementById("recVillage").value.trim();
  const title = document.getElementById("recTitle").value.trim();
  const coordsRaw = document.getElementById("recCoords").value.trim();
  const image = document.getElementById("recImage").value.trim();
  const desc = document.getElementById("recDesc").value.trim();

  let coords = [26.1209, 85.3647];
  if (coordsRaw.includes(",")) {
    const parts = coordsRaw.split(",");
    coords = [parseFloat(parts[0].trim()), parseFloat(parts[1].trim())];
  }

  const newRecord = {
    id: `vv_${Date.now()}`,
    category: cat,
    district: dist,
    village: village,
    coords: coords,
    image: image,
    source: "Firebase Cloud",
    content: {
      "en-IN": { title: title, desc: desc, audio: desc },
      "hi-IN": { title: title, desc: desc, audio: desc }
    }
  };

  if (window.saveToFirestore) {
    const cloudId = await window.saveToFirestore(newRecord);
    if (cloudId) newRecord.cloudDocId = cloudId;
  }

  const customRecords = getCustomRecords();
  customRecords.unshift(newRecord);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customRecords));

  alert(`Published: ${title} (${village})`);
  e.target.reset();
  renderInpageAdminTable();
  loadDistrictData(window.currentDistrict);
}

window.deleteCustomRecord = async function(recordIndex) {
  if (!confirm("Delete record?")) return;

  const customRecords = getCustomRecords();
  const target = customRecords[recordIndex];
  if (target && target.cloudDocId && window.deleteFromFirestore) {
    await window.deleteFromFirestore(target.cloudDocId);
  }

  customRecords.splice(recordIndex, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customRecords));
  renderInpageAdminTable();
  loadDistrictData(window.currentDistrict);
};

// ---------------- TAB NAVIGATION FIX ---------------- //

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

window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);

function updateNetworkStatus() {
  const badge = document.getElementById("networkStatusBadge");
  if (!badge) return;
  if (navigator.onLine) {
    badge.className = "network-badge online";
    badge.innerText = "● Online";
    if (window.syncCloudHeritage) window.syncCloudHeritage();
  } else {
    badge.className = "network-badge offline";
    badge.innerText = "● Offline";
  }
}