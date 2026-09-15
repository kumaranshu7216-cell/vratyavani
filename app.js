/**
 * VratyaVani AI — Unified Heritage & Living Culture Engine
 * Deduplication Filter, Safe Named Firestore Engine & Smooth Radar
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

// पुराने डुप्लीकेट्स को हटाने वाला क्लीनर
function cleanStorageDuplicates() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      let records = JSON.parse(raw);
      if (Array.isArray(records)) {
        const seen = new Set();
        const unique = [];
        for (let r of records) {
          const title = (r.name) || (r.content && r.content["hi-IN"] && r.content["hi-IN"].title) || (r.content && r.content["en-IN"] && r.content["en-IN"].title) || r.title || r.id;
          const key = (r.district || "") + "_" + title.trim().toLowerCase();
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
  }, 800);
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

  document.getElementById("navDistrictLabel").innerText = distKey.toUpperCase();
  document.getElementById("navLangLabel").innerText = lang.split('-')[0].toUpperCase();
  document.getElementById("langSelect").value = lang;

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

const i18n = {
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
    emptyMsg: `No records found in this district. <button onclick="openCitizenModal()" style="background:#d97706; color:#000; border:none; padding:4px 8px; border-radius:4px; font-weight:bold; cursor:pointer; margin-left:6px;">Click + Contribute to add</button>`
  },
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
    emptyMsg: `इस ज़िले में अभी रिकॉर्ड नहीं है। <button onclick="openCitizenModal()" style="background:#d97706; color:#000; border:none; padding:4px 8px; border-radius:4px; font-weight:bold; cursor:pointer; margin-left:6px;">यहाँ + क्लिक कर जोड़ें</button>`
  }
};

window.applyLanguage = function(langKey) {
  window.currentLanguage = langKey;
  const t = i18n[langKey] || i18n["en-IN"];

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

  if (!activeAudioItem) {
    const np = document.getElementById("nowPlayingText");
    if (np) np.innerText = t.nowPlayingDefault;
  }
  const ls = document.getElementById("langSelect");
  if (ls) ls.value = langKey;

  renderCards();
};

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

function getCustomRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

// डुप्लीकेट-प्रूफ डेटा लोडिंग इंजन
window.loadDistrictData = function(districtKey) {
  let baseItems = (typeof unifiedHeritageCultureData !== "undefined" && unifiedHeritageCultureData[districtKey]) ? [...unifiedHeritageCultureData[districtKey]] : [];

  let mergedMap = new Map();

  // 1. बेस आइटम्स जोड़ें
  baseItems.forEach(item => {
    mergedMap.set(item.id, item);
  });

  // 2. कस्टम व फ़ायरबेस रिकॉर्ड्स से ओवरराइड करें (बिना डुप्लीकेट)
  try {
    const custom = getCustomRecords();
    const firebaseRecs = JSON.parse(localStorage.getItem("vratyavani_firebase_records") || "[]");
    const stored = [...firebaseRecs, ...custom];

    stored.forEach(c => {
      if (c.district && c.district.toLowerCase() === districtKey.toLowerCase()) {
        const idKey = (districtKey === "muzaffarpur" && (c.name || "").toLowerCase().includes("garibnath")) ? "muz_1" : (c.id || c.name);
        mergedMap.set(idKey, { ...c, id: idKey });
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
      const locContent = (item.content && item.content[window.currentLanguage]) ? item.content[window.currentLanguage] : (item.content ? item.content["hi-IN"] || item.content["en-IN"] : { title: item.name || item.title });
      const marker = L.marker(item.coords).addTo(window.mapInstance);
      marker.bindPopup(`
        <strong>${locContent.title}</strong><br>
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

    document.getElementById("btnDirectGoogleMaps").href = `https://www.google.com/maps/dir/?api=1&destination=${items[0].coords[0]},${items[0].coords[1]}`;
  }

  renderCards(items);
};

// रेंडर कार्ड्स
function renderCards(preloadedItems) {
  const container = document.getElementById("cardsGrid");
  if (!container) return;
  container.innerHTML = "";

  const t = i18n[window.currentLanguage] || i18n["en-IN"];

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
          const idKey = (window.currentDistrict === "muzaffarpur" && (c.name || "").toLowerCase().includes("garibnath")) ? "muz_1" : (c.id || c.name);
          map.set(idKey, { ...c, id: idKey });
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
    const locContent = (item.content && item.content[window.currentLanguage]) ? item.content[window.currentLanguage] : (item.content ? item.content["hi-IN"] || item.content["en-IN"] : { title: item.name || item.title, desc: item.story || item.desc });

    let displayImage = item.imageUrl || item.image;
    if (!displayImage || displayImage.includes("photo-1527786356703-4b100091cd2c")) {
      displayImage = (item.district === "varanasi") ? "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80" : "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=80";
    }

    const cardHtml = `
      <div class="unified-card">
        <div class="card-image-wrap" onclick="open360Viewer('${item.id}')" style="cursor:pointer;">
          <img src="${displayImage}" alt="${locContent.title}" class="heritage-card-img" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80';" loading="lazy" />
          <span class="btn-view360-badge">${t.btnView360}</span>
        </div>
        <div class="card-dual-content">
          <div style="display:flex; align-items:center; justify-content:space-between;">
            <h4 style="font-size:16px; font-weight:700; color:var(--text-main);">${locContent.title}</h4>
            <span class="risk-badge ${item.riskClass || 'risk-mod'}">${item.riskScore || 'Active'}</span>
          </div>
          
          <div style="font-size:11px; color:#c2410c; font-weight:700;">
            📍 ${item.village || ''} ${item.landmark ? `• ${item.landmark}` : ''}
          </div>
          
          <div class="heritage-block">
            <strong>🏛️ धरोहर परिचय:</strong> ${locContent.heritageDesc || locContent.desc || item.story || ''}
          </div>

          <div class="culture-block">
            <strong>🎭 जीवंत परंपरा:</strong> ${locContent.livingCulture || locContent.cultureRitual || 'स्थानीय लोक-परंपरा व पूजा विधि।'}
          </div>

          <div class="dual-audio-btns">
            <button class="btn-audio-pill btn-audio-hist" onclick="selectUnifiedAudio('${item.id}', 'heritage')">
              ${t.btnListenHist}
            </button>
            <button class="btn-audio-pill btn-audio-cult" onclick="selectUnifiedAudio('${item.id}', 'culture')">
              ${t.btnListenCult}
            </button>
          </div>

          <div class="card-actions" style="margin-top:6px;">
            <button class="btn-sm btn-locate" onclick="focusOnMapTab(${item.coords[0]}, ${item.coords[1]})">${t.btnMap}</button>
            <button class="btn-sm" style="background:#e0f2fe; color:#0369a1;" onclick="open360Viewer('${item.id}')">${t.btnView360}</button>
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

function selectUnifiedAudio(itemId, mode) {
  let baseItems = (typeof unifiedHeritageCultureData !== "undefined" && unifiedHeritageCultureData[window.currentDistrict]) ? [...unifiedHeritageCultureData[window.currentDistrict]] : [];
  let custom = getCustomRecords();
  let allItems = [...custom, ...baseItems];

  const found = allItems.find(i => i.id === itemId);
  if (!found) return;

  activeAudioItem = found;
  activeAudioMode = mode;

  const locContent = (found.content && found.content[window.currentLanguage]) ? found.content[window.currentLanguage] : (found.content ? found.content["hi-IN"] || found.content["en-IN"] : { title: found.name || found.title, audio: found.bhashiniAudioText });

  const textToPlay = (mode === 'culture') ? (locContent.cultureAudio || locContent.livingCulture) : (locContent.heritageAudio || locContent.heritageDesc || found.story);
  const badgeLabel = (mode === 'culture') ? "🎭 [जीवंत संस्कृति]" : "🏛️ [इतिहास]";

  document.getElementById("nowPlayingText").innerHTML = `
    <strong>${locContent.title}</strong> <small style="color:${mode === 'culture' ? '#c026d3' : '#d97706'}; font-weight:bold;">${badgeLabel}</small><br>
    <em>"${textToPlay}"</em>
  `;

  const playBtn = document.getElementById("playAudioBtn");
  if (playBtn) {
    playBtn.disabled = false;
    const t = i18n[window.currentLanguage] || i18n["en-IN"];
    playBtn.innerText = t.btnPlay;
  }
}

function togglePlayVoice() {
  if (!activeAudioItem) return;

  const t = i18n[window.currentLanguage] || i18n["en-IN"];
  const locContent = (activeAudioItem.content && activeAudioItem.content[window.currentLanguage]) ? activeAudioItem.content[window.currentLanguage] : (activeAudioItem.content ? activeAudioItem.content["hi-IN"] || activeAudioItem.content["en-IN"] : { audio: activeAudioItem.bhashiniAudioText });

  const textToSpeak = (activeAudioMode === 'culture') ? (locContent.cultureAudio || locContent.livingCulture) : (locContent.heritageAudio || locContent.heritageDesc || activeAudioItem.story);

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
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

function open360Viewer(itemId) {
  let baseItems = (typeof unifiedHeritageCultureData !== "undefined" && unifiedHeritageCultureData[window.currentDistrict]) ? [...unifiedHeritageCultureData[window.currentDistrict]] : [];
  let custom = getCustomRecords();
  let allItems = [...custom, ...baseItems];

  const item = allItems.find(i => i.id === itemId);
  if (!item) return;

  const locContent = (item.content && item.content[window.currentLanguage]) ? item.content[window.currentLanguage] : (item.content ? item.content["hi-IN"] || item.content["en-IN"] : { title: item.name || item.title });

  document.getElementById("panoTitle").innerText = `360° View: ${locContent.title}`;
  document.getElementById("panoramaModal").style.display = "flex";

  if (pannellumViewerInstance) {
    try { pannellumViewerInstance.destroy(); } catch(e) {}
    pannellumViewerInstance = null;
  }

  let panoPhoto = item.imageUrl || item.image;

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
    } catch (err) {}
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
    document.getElementById("btnDirectGoogleMaps").href = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
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

// ---------------- CITIZEN & ADMIN WORKFLOW ---------------- //

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

  alert(`🎉 धन्यवाद! "${title}" और "${ritual}" सत्यापन हेतु नोडल एडमिन को भेज दिया गया है।`);
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

  allRecords.forEach((item, index) => {
    const title = (item.content && item.content["hi-IN"]) ? item.content["hi-IN"].title : (item.name || item.title);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td style="padding:4px; border:1px solid #e2e8f0;"><strong>${title}</strong></td>
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

// ---------------- VERIFY & PUBLISH LIVE (CRASH-PROOF & NAMED FIRESTORE) ---------------- //

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

    // डॉक्यूमेंट आईडी सीधे नाम से बनेगी
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
        "en-IN": {
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
        }
      }
    };

    // 1. Firebase में नाम से सुरक्षित करें
    if (window.saveToFirestoreNamed) {
      await window.saveToFirestoreNamed(cleanDocName, newRecord);
    }

    // 2. LocalStorage अपडेट करें (डुप्लीकेट हटाकर)
    let customRecords = getCustomRecords();
    customRecords = customRecords.filter(c => c.id !== targetId && (c.name || "").toLowerCase() !== title.toLowerCase());
    customRecords.unshift(newRecord);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customRecords));
    } catch (storageErr) {
      localStorage.removeItem("vratyavani_firebase_records");
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customRecords));
    }

    alert(`🎉 प्रकाशित: "${title}" अब Firebase में सीधे नाम (${cleanDocName}) और State (${stateVal}) के साथ सुरक्षित हो गया है!`);
    
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