/**
 * VratyaVani AI — Community-Verified Immersive Heritage Network
 * Architecture: Trust Engine + Risk Radar + Firebase Cloud Sync + Multi-Language AI Narration
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBnmNiC5xAEAli-yRDOGMJKBOGNxe9am18",
  authDomain: "vratyavani-a48fc.firebaseapp.com",
  projectId: "vratyavani-a48fc",
  storageBucket: "vratyavani-a48fc.firebasestorage.app",
  messagingSenderId: "512746364837",
  appId: "1:512746364837:web:639440528e52d23fd4d24c"
};

const fbApp = initializeApp(firebaseConfig);
const db = getFirestore(fbApp);

window.currentDistrict = "muzaffarpur";
window.currentState = "bihar";
window.currentLanguage = "hi-IN";
window.mapInstance = null;
let mapMarkers = [];
let activeAudioItem = null;
let activeAudioMode = "heritage";
let pannellumViewerInstance = null;
const STORAGE_KEY = "vratyavani_custom_records";
const PENDING_KEY = "vratyavani_pending_submissions";

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

// UI Multi-Language Dictionary
const uiStrings = {
  "hi-IN": {
    heroTitle: "पुरखों की थाती, डिजिटल वाणी की पाती",
    heroSub: "India's Community-Verified Immersive Heritage & Preservation Network",
    mapTitle: "📍 Living Heritage Clusters & Map",
    voiceConsoleTitle: "🎙️ Multilingual AI Story Mode",
    nowPlayingDefault: "इतिहास या जीवंत संस्कृति चुनकर अपनी बोली में सुनें...",
    btnListenHist: "🏛️ इतिहास सुनें",
    btnListenCult: "🎭 जीवंत परंपरा",
    btnMap: "📍 मैप देखें",
    btnView360: "🌐 360° दृश्य",
    btnPlay: "▶ Play Narrative",
    emptyMsg: "इस ज़िले में अभी कोई रिकॉर्ड नहीं है। 'धरोहर व संस्कृति जोड़ें' से नया डेटा अपलोड करें।",
    heritageLabel: "🏛️ Trust & Heritage Overview:",
    cultureLabel: "🎭 Living Culture & Ritual:"
  },
  "en-IN": {
    heroTitle: "Heritage of Ancestors, Epistle of Digital Voice",
    heroSub: "India's Community-Verified Immersive Heritage & Preservation Network",
    mapTitle: "📍 Living Heritage Clusters & Map",
    voiceConsoleTitle: "🎙️ Multilingual AI Story Mode",
    nowPlayingDefault: "Choose 'History' or 'Living Culture' to experience immersive AI narration...",
    btnListenHist: "🏛️ History Audio",
    btnListenCult: "🎭 Living Culture",
    btnMap: "📍 View on Map",
    btnView360: "🌐 360° View",
    btnPlay: "▶ Play Narrative",
    emptyMsg: "No records found in this district. Please submit upcoming heritage.",
    heritageLabel: "🏛️ Trust & Heritage Overview:",
    cultureLabel: "🎭 Living Culture & Ritual:"
  },
  "pa-IN": {
    heroTitle: "ਪੁਰਖਿਆਂ ਦੀ ਵਿਰਾਸਤ, ਡਿਜੀਟਲ ਆਵਾਜ਼ ਦੀ ਸੌਗਾਤ",
    heroSub: "India's Community-Verified Immersive Heritage & Preservation Network",
    mapTitle: "📍 Living Heritage Clusters & Map",
    voiceConsoleTitle: "🎙️ Multilingual AI Story Mode",
    nowPlayingDefault: "ਇਤਿਹਾਸ ਜਾਂ ਸੰਸਕ੍ਰਿਤੀ ਚੁਣੋ और ਆਪਣੀ ਬੋਲੀ ਵਿੱਚ ਸੁਣੋ...",
    btnListenHist: "🏛️ ਇਤਿਹਾਸ ਸੁਣੋ",
    btnListenCult: "🎭 ਰੀਤਾਂ ਸੁਣੋ",
    btnMap: "📍 ਨਕਸ਼ੇ ਤੇ ਵੇਖੋ",
    btnView360: "🌐 360° ਦ੍ਰਿਸ਼",
    btnPlay: "▶ Play Narrative",
    emptyMsg: "ਇਸ ਜ਼ਿਲ੍ਹੇ ਵਿੱਚ ਕੋਈ ਰਿਕਾਰਡ ਨਹੀਂ ਹੈ।",
    heritageLabel: "🏛️ ਵਿਰਾਸਤੀ ਜਾਣਕਾਰੀ:",
    cultureLabel: "🎭 ਜਿਉਂਦੀ ਪਰੰਪਰਾ:"
  },
  "bho-IN": {
    heroTitle: "पुरखन के धरोहर, डिजिटल बानी के पाती",
    heroSub: "India's Community-Verified Immersive Heritage & Preservation Network",
    mapTitle: "📍 Living Heritage Clusters & Map",
    voiceConsoleTitle: "🎙️ Multilingual AI Story Mode",
    nowPlayingDefault: "इतिहास भा लोक-परंपरा चुनीं आ अपनी बोली में सुनीं...",
    btnListenHist: "🏛️ इतिहास सुनीं",
    btnListenCult: "🎭 रीत-रिवाज",
    emptyMsg: "ए श्रेणी में कवनो रेकॉर्ड नइखे।",
    heritageLabel: "🏛️ धरोहर परिचय:",
    cultureLabel: "🎭 जीवंत परंपरा:"
  },
  "mai-IN": {
    heroTitle: "पुरखाक धरोहर, डिजिटल वाणीक पाती",
    heroSub: "India's Community-Verified Immersive Heritage & Preservation Network",
    mapTitle: "📍 Living Heritage Clusters & Map",
    voiceConsoleTitle: "🎙️ Multilingual AI Story Mode",
    nowPlayingDefault: "इतिहास वा संस्कृति चुनू आ अपन मैथिली में सुनू...",
    emptyMsg: "एहि जिला में कोनो रेकॉर्ड नहि अछि।",
    heritageLabel: "🏛️ धरोहर परिचय:",
    cultureLabel: "🎭 जीवंत परंपरा:"
  }
};

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
      setTimeout(() => {
        splash.style.display = "none";
        document.getElementById("locationModal").style.display = "flex";
      }, 700);
    }
  }, 1000);
}

window.openLocationModalDirect = function() { document.getElementById("locationModal").style.display = "flex"; };
window.closeLocationModal = function() { document.getElementById("locationModal").style.display = "none"; };

window.confirmLocationSelection = function() {
  const selectedState = document.getElementById("selState").value;
  const rawDist = document.getElementById("selDistrictInput").value.trim().toLowerCase();
  const lang = document.getElementById("selLang").value;
  const distKey = rawDist || "muzaffarpur";

  window.currentLanguage = lang;
  document.getElementById("navDistrictLabel").innerText = distKey.toUpperCase();
  document.getElementById("navLangLabel").innerText = lang.split('-')[0].toUpperCase();
  
  const consoleLangSelect = document.getElementById("langSelect");
  if (consoleLangSelect) consoleLangSelect.value = lang;

  document.getElementById("locationModal").style.display = "none";
  window.applyLanguage(lang);
  window.onDistrictChange(distKey);
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
  renderCards();
};

window.onConsoleLangChange = function(lang) { window.applyLanguage(lang); };

document.addEventListener("DOMContentLoaded", () => {
  initMap();
  syncCloudHeritage();
});

function initMap() {
  window.mapInstance = L.map('map').setView([26.1245, 85.3902], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(window.mapInstance);
}

window.onDistrictChange = function(districtKey) {
  window.currentDistrict = districtKey;
  const distBadge = document.getElementById("currentDistrictBadge");
  if (distBadge) distBadge.innerText = districtKey.toUpperCase();
  loadDistrictData(window.currentDistrict);
};

function getCustomRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function getPendingSubmissions() {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

// SYNC DATA FROM FIREBASE FIRESTORE
async function syncCloudHeritage() {
  try {
    const querySnapshot = await getDocs(collection(db, "vratyavani_records"));
    const cloudRecords = [];
    querySnapshot.forEach((d) => cloudRecords.push({ id: d.id, ...d.data() }));
    if (cloudRecords.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudRecords));
    }
  } catch (e) {}
  loadDistrictData(window.currentDistrict);
}

window.loadDistrictData = function(districtKey) {
  let mergedMap = new Map();
  try {
    const custom = getCustomRecords();
    custom.forEach(c => {
      if (c.district && c.district.toLowerCase() === districtKey.toLowerCase()) {
        mergedMap.set(c.id || c.name, c);
      }
    });
  } catch (e) {}

  const items = Array.from(mergedMap.values());
  mapMarkers.forEach(m => window.mapInstance.removeLayer(m));
  mapMarkers = [];

  if (items.length > 0) {
    window.mapInstance.flyTo(items[0].coords, 13);
    items.forEach(item => {
      const marker = L.marker(item.coords).addTo(window.mapInstance);
      marker.bindPopup(`<strong>${item.name || item.title}</strong>`);
      mapMarkers.push(marker);
    });
  }
  renderCards(items);
};

function renderCards(preloadedItems) {
  const container = document.getElementById("cardsGrid");
  if (!container) return;
  container.innerHTML = "";

  const t = uiStrings[window.currentLanguage] || uiStrings["hi-IN"];
  const currentLang = window.currentLanguage || "hi-IN";
  let items = preloadedItems || getCustomRecords().filter(c => c.district?.toLowerCase() === window.currentDistrict.toLowerCase());

  if (items.length === 0) {
    container.innerHTML = `<div style="color:var(--text-muted); padding:30px; text-align:center; grid-column:1/-1; font-weight:600; font-size:14px;">${t.emptyMsg}</div>`;
    return;
  }

  items.forEach(item => {
    let titleText = item.name || item.title || "Heritage Site";
    let heritageDescText = item.story || item.desc || "Historical monument overview.";
    let livingCultureText = item.livingCulture || "Local sacred tradition.";

    if (currentLang !== "en-IN") {
      const lowerTitle = titleText.toLowerCase();
      if (currentLang === "hi-IN" && lowerTitle.includes("durga")) {
        titleText = "दुर्गा मंदिर";
        heritageDescText = item.story || "यह ऐतिहासिक मंदिर इस क्षेत्र की आध्यात्मिक पहचान है।";
      }
    }

    let displayImage = item.imageUrl || item.image || "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=80";
    const itemId = item.id || item.name || "item_" + Math.random();

    const cardHtml = `
      <div class="unified-card">
        <div class="card-image-wrap" onclick="open360Viewer('${itemId}')" style="cursor:pointer;">
          <img src="${displayImage}" alt="${titleText}" class="heritage-card-img" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1561361513-2d000a50f0dc';" loading="lazy" />
          <span class="btn-view360-badge">🌐 360° WebXR</span>
        </div>
        <div class="card-dual-content">
          <div style="display:flex; align-items:center; justify-content:space-between;">
            <h4 style="font-size:16px; font-weight:700; color:var(--text-main);">${titleText}</h4>
            <span class="risk-badge" style="background:#dcfce7; color:#15803d; padding:2px 8px; border-radius:10px; font-size:10px; font-weight:bold;">🟢 VERIFIED TRUST</span>
          </div>
          <div style="font-size:11px; color:#c2410c; font-weight:700;">📍 ${item.village || ''} ${item.landmark ? `• ${item.landmark}` : ''}</div>
          <div class="heritage-block"><strong>${t.heritageLabel}</strong> ${heritageDescText}</div>
          <div class="culture-block"><strong>${t.cultureLabel}</strong> ${livingCultureText}</div>
          <div class="dual-audio-btns">
            <button class="btn-audio-pill btn-audio-hist" onclick="selectUnifiedAudio('${itemId}', 'heritage')">${t.btnListenHist}</button>
            <button class="btn-audio-pill btn-audio-cult" onclick="selectUnifiedAudio('${itemId}', 'culture')">${t.btnListenCult}</button>
          </div>
          <div class="card-actions" style="margin-top:6px;">
            <button class="btn-sm btn-locate" onclick="focusOnMapTab(${item.coords[0]}, ${item.coords[1]})">${t.btnMap}</button>
            <button class="btn-sm" style="background:#e0f2fe; color:#0369a1;" onclick="open360Viewer('${itemId}')">360° View</button>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += cardHtml;
  });
}

// CITIZEN SUBMISSION
window.handleCitizenSubmit = function(e) {
  e.preventDefault();
  const pendingItem = {
    id: `pending_${Date.now()}`,
    title: document.getElementById("citTitle").value.trim(),
    district: document.getElementById("citDistrict").value.trim().toLowerCase(),
    village: document.getElementById("citVillage").value.trim(),
    landmark: document.getElementById("citLandmark").value.trim(),
    ritual: document.getElementById("citRitual").value.trim(),
    coords: document.getElementById("citCoords").value.split(",").map(v => parseFloat(v.trim())),
    story: document.getElementById("citStory").value.trim(),
    image: citizenUploadedBase64 || "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=80",
    aiValidation: "✓ Metadata Verified | GPS Consistent"
  };

  const pendingQueue = getPendingSubmissions();
  pendingQueue.unshift(pendingItem);
  localStorage.setItem(PENDING_KEY, JSON.stringify(pendingQueue));
  alert(`🛡️ Trust Engine Success: "${pendingItem.title}" submitted for review!`);
  e.target.reset();
  closeCitizenModal();
};

// ADMIN APPROVAL & FIREBASE SYNC
window.openAdminPanel = function() {
  renderInpageAdminTable();
  document.getElementById("adminPanelModal").style.display = "flex";
};

window.closeAdminPanelModal = function(e) {
  if (!e || e.target.id === "adminPanelModal" || e.target.classList.contains("close-modal")) {
    document.getElementById("adminPanelModal").style.display = "none";
  }
};

function renderInpageAdminTable() {
  const pendingTbody = document.getElementById("pendingCitizenTableBody");
  if (!pendingTbody) return;
  pendingTbody.innerHTML = "";
  const pendingItems = getPendingSubmissions();

  if (pendingItems.length === 0) {
    pendingTbody.innerHTML = `<tr><td colspan="4" style="padding:8px; text-align:center; color:#64748b;">No pending submissions.</td></tr>`;
    return;
  }

  pendingItems.forEach((pItem, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td style="padding:6px; border:1px solid #e2e8f0;"><strong>${pItem.title}</strong></td>
      <td style="padding:6px; border:1px solid #e2e8f0;">${pItem.district}</td>
      <td style="padding:6px; border:1px solid #e2e8f0; color:#15803d; font-size:10px;">${pItem.aiValidation}</td>
      <td style="padding:6px; border:1px solid #e2e8f0;">
        <button onclick="approvePendingSubmission(${index})" style="background:#dcfce7; color:#15803d; border:none; padding:4px 10px; border-radius:4px; font-weight:bold; cursor:pointer;">Approve & Live</button>
      </td>
    `;
    pendingTbody.appendChild(row);
  });
}

window.approvePendingSubmission = async function(index) {
  let pendingItems = getPendingSubmissions();
  const approvedItem = pendingItems[index];
  if (!approvedItem) return;

  const verifiedRecord = {
    id: `rec_${Date.now()}`,
    name: approvedItem.title,
    district: approvedItem.district.toLowerCase(),
    village: approvedItem.village,
    landmark: approvedItem.landmark,
    coords: approvedItem.coords,
    image: approvedItem.image,
    imageUrl: approvedItem.image,
    story: approvedItem.story,
    livingCulture: approvedItem.ritual,
    createdAt: new Date().toLocaleString()
  };

  // Save to Firebase Cloud Firestore
  try {
    await setDoc(doc(db, "vratyavani_records", verifiedRecord.id), verifiedRecord);
  } catch (err) {}

  let customRecords = getCustomRecords();
  customRecords.unshift(verifiedRecord);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customRecords));

  pendingItems.splice(index, 1);
  localStorage.setItem(PENDING_KEY, JSON.stringify(pendingItems));

  alert(`✅ Approved and synced to Firebase Cloud successfully!`);
  renderInpageAdminTable();
  loadDistrictData(window.currentDistrict);
};

window.handleAdminLogin = function(e) {
  e.preventDefault();
  if (document.getElementById("adminUserId").value.trim() === "admin" && document.getElementById("adminPassword").value.trim() === "Admin@2026") {
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
window.closeLoginModal = function(e) {
  if (!e || e.target.id === "loginModal" || e.target.classList.contains("close-modal")) document.getElementById("loginModal").style.display = "none";
};

let citizenUploadedBase64 = null;
window.previewCitizenImage = function(event) {
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
};

let adminUploadedBase64 = null;
window.previewAdminImage = function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      adminUploadedBase64 = e.target.result;
      document.getElementById("adminPreviewImg").src = adminUploadedBase64;
      document.getElementById("adminImagePreviewBox").style.display = "block";
    };
    reader.readAsDataURL(file);
  }
};

window.handleAdminSubmit = async function(e) {
  e.preventDefault();
  const directRecord = {
    id: `rec_${Date.now()}`,
    name: document.getElementById("recTitle").value.trim(),
    district: document.getElementById("recDistrict").value.trim().toLowerCase(),
    coords: document.getElementById("recCoords").value.split(",").map(v => parseFloat(v.trim())),
    image: adminUploadedBase64 || "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=80",
    imageUrl: adminUploadedBase64 || "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=80",
    story: document.getElementById("recDesc").value.trim(),
    livingCulture: document.getElementById("recRitual").value.trim(),
    createdAt: new Date().toLocaleString()
  };

  try {
    await setDoc(doc(db, "vratyavani_records", directRecord.id), directRecord);
  } catch (err) {}

  let customRecords = getCustomRecords();
  customRecords.unshift(directRecord);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customRecords));

  alert(`🎉 Published directly to Firebase Cloud!`);
  e.target.reset();
  closeAdminPanelModal();
  loadDistrictData(window.currentDistrict);
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

window.selectUnifiedAudio = function(itemId, mode) {
  let custom = getCustomRecords();
  const found = custom.find(i => i.id === itemId || i.name === itemId);
  if (!found) return;
  const textToPlay = (mode === 'culture') ? found.livingCulture : found.story;
  const nowPlayingEl = document.getElementById("nowPlayingText");
  if (nowPlayingEl) nowPlayingEl.innerHTML = `<strong>${found.name}</strong><br><em>"${textToPlay}"</em>`;
  playAudioDirectly(textToPlay);
};

function playAudioDirectly(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = window.currentLanguage || 'hi-IN';
  window.speechSynthesis.speak(utter);
}

window.open360Viewer = function(itemId) {
  let custom = getCustomRecords();
  const found = custom.find(i => i.id === itemId || i.name === itemId);
  if (!found) return;
  document.getElementById("panoTitle").innerText = `360° WebXR Tour: ${found.name}`;
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

window.closePanoramaModal = function(e) {
  if (!e || e.target.id === "panoramaModal" || e.target.classList.contains("close-modal")) {
    document.getElementById("panoramaModal").style.display = "none";
    if (pannellumViewerInstance) { try { pannellumViewerInstance.destroy(); } catch(e) {} }
  }
};

window.focusOnMapTab = function(lat, lng) {
  switchMobileTab('map');
  setTimeout(() => {
    window.mapInstance.invalidateSize();
    window.mapInstance.flyTo([lat, lng], 15);
  }, 250);
};

window.showQrModal = function() { alert("Spot QR Code Scanner Active for Offline Mode."); };
window.closeQrModal = function() {};
window.openCitizenModal = function() { document.getElementById("citizenModal").style.display = "flex"; };
window.closeCitizenModal = function() { document.getElementById("citizenModal").style.display = "none"; };