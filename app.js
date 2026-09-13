/**
 * VratyaVani AI — Client Logic with Dedicated Views & Instant Translation
 */

window.currentDistrict = "muzaffarpur";
window.currentLanguage = "hi-IN";
let currentCategory = "major";
window.mapInstance = null;
let mapMarkers = [];
let activeAudioItem = null;
const STORAGE_KEY = "vratyavani_custom_records";

const i18n = {
  "hi-IN": {
    heroTitle: "पुरखों की थाती, डिजिटल वाणी की पाती",
    heroSub: "वैदिक जड़ों से आधुनिक AI तक • Dual-Mode Offline Heritage Map & Voice Guide",
    tabMajor: "प्रमुख धरोहर (Major)",
    tabMonument: "स्मारक (Monuments)",
    tabGem: "छिपे रत्न (Undiscovered)",
    tabArtisan: "स्थानीय शिल्पी (Artisans)",
    mapTitle: "📍 लाइव हेरिटेज मैप (Map)",
    voiceConsoleTitle: "🎙️ भाषिणी AI ऑडियो गाइड",
    nowPlayingDefault: "धरोहर चुनें और अपनी बोली में इतिहास सुनें...",
    btnListen: "🎙️ AI सुनें",
    btnMap: "📍 मैप देखें",
    btnPlay: "▶ चलाएं (Play)",
    btnStop: "⏹ चल रहा है...",
    btnReplay: "▶ पुनः सुनें",
    emptyMsg: "इस श्रेणी में वर्तमान में कोई रिकॉर्ड नहीं है।"
  },
  "en-IN": {
    heroTitle: "Heritage of Ancestors, Epistle of Digital Voice",
    heroSub: "From Vedic Roots to Modern AI • Dual-Mode Offline Heritage Map & Voice Guide",
    tabMajor: "Major Heritage",
    tabMonument: "Monuments",
    tabGem: "Undiscovered Gems",
    tabArtisan: "Local Artisans",
    mapTitle: "📍 Live Heritage Map",
    voiceConsoleTitle: "🎙️ Bhashini AI Audio Guide",
    nowPlayingDefault: "Select a heritage site to listen to the narrative...",
    btnListen: "🎙️ AI Listen",
    btnMap: "📍 View on Map",
    btnPlay: "▶ Play Audio",
    btnStop: "⏹ Playing...",
    btnReplay: "▶ Replay",
    emptyMsg: "No records found in this category."
  },
  "pa-IN": {
    heroTitle: "ਪੁਰਖਿਆਂ ਦੀ ਵਿਰਾਸਤ, ਡਿਜੀਟਲ ਆਵਾਜ਼ ਦੀ ਸੌਗਾਤ",
    heroSub: "ਵੈਦਿਕ ਜੜ੍ਹਾਂ ਤੋਂ ਆਧੁਨਿਕ AI ਤੱਕ • Dual-Mode Offline Heritage Map & Voice Guide",
    tabMajor: "ਮੁੱਖ ਵਿਰਾਸਤ",
    tabMonument: "ਸਮਾਰਕ",
    tabGem: "ਅਣਗੌਲੇ ਰਤਨ",
    tabArtisan: "ਕਾਰੀਗਰ",
    mapTitle: "📍 ਲਾਈਵ ਨਕਸ਼ਾ (Map)",
    voiceConsoleTitle: "🎙️ ਭਾਸ਼ਿਣੀ AI ਆਡੀਓ ਗਾਈਡ",
    nowPlayingDefault: "ਵਿਰਾਸਤ ਚੁਣੋ ਅਤੇ ਆਪਣੀ ਬੋਲੀ ਵਿੱਚ ਇਤਿਹਾਸ ਸੁਣੋ...",
    btnListen: "🎙️ AI ਸੁਣੋ",
    btnMap: "📍 ਨਕਸ਼ੇ ਤੇ ਵੇਖੋ",
    btnPlay: "▶ ਚਲਾਓ (Play)",
    btnStop: "⏹ ਚੱਲ ਰਿਹਾ ਹੈ...",
    btnReplay: "▶ ਮੁੜ ਸੁਣੋ",
    emptyMsg: "ਇਸ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਕੋਈ ਰਿਕਾਰਡ ਨਹੀਂ ਹੈ।"
  },
  "bho-IN": {
    heroTitle: "पुरखन के धरोहर, डिजिटल बानी के पाती",
    heroSub: "वैदिक जड़ से आधुनिक AI ले • Dual-Mode Offline Heritage Map & Voice Guide",
    tabMajor: "खास धरोहर",
    tabMonument: "स्मारक",
    tabGem: "छुपल रतन",
    tabArtisan: "कारीगर",
    mapTitle: "📍 लाइव हेरिटेज मैप (Map)",
    voiceConsoleTitle: "🎙️ भाषिणी AI ऑडियो गाइड",
    nowPlayingDefault: "धरोहर चुनीं आ अपनी बोली में इतिहास सुनीं...",
    btnListen: "🎙️ AI सुनीं",
    btnMap: "📍 मैप पर देखीं",
    btnPlay: "▶ बजाईं (Play)",
    btnStop: "⏹ बाजत बा...",
    btnReplay: "▶ फेर से सुनीं",
    emptyMsg: "ए श्रेणी में कवनो रेकॉर्ड नइखे।"
  },
  "mai-IN": {
    heroTitle: "पुरखाक धरोहर, डिजिटल वाणीक पाती",
    heroSub: "वैदिक जड़ सं आधुनिक AI धरि • Dual-Mode Offline Heritage Map & Voice Guide",
    tabMajor: "प्रमुख धरोहर",
    tabMonument: "स्मारक",
    tabGem: "लुकल रत्न",
    tabArtisan: "शिल्पी",
    mapTitle: "📍 लाइव हेरिटेज मैप (Map)",
    voiceConsoleTitle: "🎙️ भाषिणी AI ऑडियो गाइड",
    nowPlayingDefault: "धरोहर चुनू आ अपन मैथिली में इतिहास सुनू...",
    btnListen: "🎙️ AI सुनू",
    btnMap: "📍 मैप पर देखू",
    btnPlay: "▶ बजाउ (Play)",
    btnStop: "⏹ बाजि रहल अछि...",
    btnReplay: "▶ पुनः सुनू",
    emptyMsg: "एहि श्रेणी में कोनो रेकॉर्ड नहि अछि।"
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
  if (!activeAudioItem) {
    document.getElementById("nowPlayingText").innerText = t.nowPlayingDefault;
  }
  document.getElementById("langSelect").value = langKey;

  renderCards();
};

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

document.addEventListener("DOMContentLoaded", () => {
  initMap();
  loadDistrictData(window.currentDistrict);
  updateNetworkStatus();
});

function initMap() {
  window.mapInstance = L.map('map').setView([26.1209, 85.3647], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap | VratyaVani AI'
  }).addTo(window.mapInstance);
}

function onDistrictChange(districtKey) {
  window.currentDistrict = districtKey;
  document.getElementById("currentDistrictBadge").innerText = districtKey.toUpperCase();
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
    const matching = merged.filter(c => c.district === districtKey);
    items = [...matching, ...items];
  } catch (e) {}

  mapMarkers.forEach(m => window.mapInstance.removeLayer(m));
  mapMarkers = [];

  if (items.length > 0) {
    window.mapInstance.flyTo(items[0].coords, 12);
    items.forEach(item => {
      const locContent = (item.content && item.content[window.currentLanguage]) ? item.content[window.currentLanguage] : (item.content ? item.content["en-IN"] : { title: item.title });
      const marker = L.marker(item.coords).addTo(window.mapInstance);
      marker.bindPopup(`
        <strong>${locContent.title}</strong><br>
        <button onclick="selectForVoice('${item.id}')" style="margin-top:6px; padding:4px 8px; font-size:11px; background:#d97706; color:#000; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">
          🎙️ Audio
        </button>
      `);
      mapMarkers.push(marker);
    });

    // Update bottom Google Maps direct navigation link
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
      items = [...merged.filter(c => c.district === window.currentDistrict), ...items];
    } catch(e) {}
  }

  const filtered = items.filter(item => item.category === currentCategory);

  if (filtered.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted); padding:20px; text-align:center;">${t.emptyMsg}</p>`;
    return;
  }

  filtered.forEach(item => {
    const isArtisan = item.category === "artisan";
    const locContent = (item.content && item.content[window.currentLanguage]) ? item.content[window.currentLanguage] : (item.content ? item.content["en-IN"] : { title: item.title, desc: item.desc });

    const cardHtml = `
      <div class="heritage-card">
        <div class="card-image-wrap">
          <img src="${item.image}" alt="${locContent.title}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80';" loading="lazy" />
          ${item.view360Url ? `
            <a href="${item.view360Url}" target="_blank" class="btn-view360-badge">🌐 360° View</a>
          ` : ''}
        </div>
        <div class="card-content">
          <span class="card-tag">${item.category}</span>
          <h4 class="card-title">${locContent.title}</h4>
          <p class="card-desc">${locContent.desc}</p>
          <div class="card-actions">
            <button class="btn-sm btn-listen" onclick="selectForVoice('${item.id}')">${t.btnListen}</button>
            <button class="btn-sm btn-locate" onclick="focusOnMapTab(${item.coords[0]}, ${item.coords[1]})">${t.btnMap}</button>
            ${isArtisan && item.artisanPhone ? `
              <a href="https://wa.me/${item.artisanPhone}?text=Hello! I found your art on VratyaVani AI." target="_blank" class="btn-sm btn-artisan-wa">💬 WhatsApp</a>
            ` : ''}
          </div>
        </div>
      </div>
    `;
    container.innerHTML += cardHtml;
  });
}

// Focus on Map tab and zoom
function focusOnMapTab(lat, lng) {
  switchMobileTab('map');
  setTimeout(() => {
    window.mapInstance.flyTo([lat, lng], 16);
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

// Admin Security Gate Handlers
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
  const dist = document.getElementById("recDistrict").value;
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

  alert(`Published: ${title}`);
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