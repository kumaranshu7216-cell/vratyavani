/**
 * VratyaVani AI (व्रात्यवाणी) — Single-Page Unified Engine
 * Admin Credentials: admin@vratyavani.ai (or 'admin') / Admin@2026
 */

window.currentDistrict = "muzaffarpur";
let currentCategory = "major";
let mapInstance = null;
let mapMarkers = [];
let activeAudioItem = null;
const STORAGE_KEY = "vratyavani_custom_records";

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

// Track Network
window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);

function updateNetworkStatus() {
  const badge = document.getElementById("networkStatusBadge");
  if (!badge) return;
  if (navigator.onLine) {
    badge.className = "network-badge online";
    badge.innerText = "● Online (Firebase Live)";
    if (window.syncCloudHeritage) window.syncCloudHeritage();
  } else {
    badge.className = "network-badge offline";
    badge.innerText = "● Offline (Cached)";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initMap();
  loadDistrictData(window.currentDistrict);
  updateNetworkStatus();
});

function initMap() {
  mapInstance = L.map('map').setView([26.1209, 85.3647], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap | VratyaVani AI'
  }).addTo(mapInstance);
}

function onDistrictChange(districtKey) {
  window.currentDistrict = districtKey;
  const districtNames = {
    muzaffarpur: "मुजफ्फरपुर (तिरहुत)",
    patna: "पटना (पाटलिपुत्र)",
    varanasi: "वाराणसी (काशी)",
    amritsar: "अमृतसर (पंजाब)"
  };
  document.getElementById("currentDistrictBadge").innerText = districtNames[districtKey] || districtKey;
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
  } catch (e) {
    return [];
  }
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

  mapMarkers.forEach(m => mapInstance.removeLayer(m));
  mapMarkers = [];

  if (items.length > 0) {
    mapInstance.flyTo(items[0].coords, 12);
    items.forEach(item => {
      const marker = L.marker(item.coords).addTo(mapInstance);
      marker.bindPopup(`
        <strong>${item.title}</strong><br>
        <small style="text-transform:uppercase; color:#c2410c;">${item.category}</small><br>
        <button onclick="selectForVoice('${item.id}')" style="margin-top:6px; padding:4px 8px; font-size:11px; background:#d97706; color:#000; border:none; border-radius:4px; font-weight:700; cursor:pointer;">
          🎙️ AI वॉयस गाइड
        </button>
      `);
      mapMarkers.push(marker);
    });
  }

  renderCards(items);
};

function renderCards(preloadedItems) {
  const container = document.getElementById("cardsGrid");
  container.innerHTML = "";

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
    container.innerHTML = `<p style="color:var(--text-muted); grid-column:1/-1; padding:20px;">इस श्रेणी में वर्तमान में कोई रिकॉर्ड नहीं है। Admin Portal से नया डेटा जोड़ें।</p>`;
    return;
  }

  filtered.forEach(item => {
    const isArtisan = item.category === "artisan";
    const cardHtml = `
      <div class="heritage-card">
        <img src="${item.image}" alt="${item.title}" loading="lazy" />
        <div class="card-content">
          <span class="card-tag">${item.category}</span>
          <h4 class="card-title">${item.title}</h4>
          <p class="card-desc">${item.desc}</p>
          <div class="card-actions">
            <button class="btn-sm btn-listen" onclick="selectForVoice('${item.id}')">🎙️ AI सुनें</button>
            <button class="btn-sm btn-locate" onclick="panToLocation(${item.coords[0]}, ${item.coords[1]})">📍 रडार</button>
            ${isArtisan && item.artisanPhone ? `
              <a href="https://wa.me/${item.artisanPhone}?text=नमस्ते! मैंने VratyaVani AI पर आपकी कला देखी।" target="_blank" class="btn-sm btn-artisan-wa">💬 कारीगर</a>
            ` : ''}
          </div>
        </div>
      </div>
    `;
    container.innerHTML += cardHtml;
  });
}

function panToLocation(lat, lng) {
  mapInstance.flyTo([lat, lng], 15);
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
  document.getElementById("nowPlayingText").innerHTML = `
    <strong>${found.title}</strong><br>
    <em>"${found.bhashiniAudioText}"</em>
  `;
  const playBtn = document.getElementById("playAudioBtn");
  playBtn.disabled = false;
  playBtn.innerText = "▶ AI आवाज़ सुनें";
}

function togglePlayVoice() {
  if (!activeAudioItem) return;

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(activeAudioItem.bhashiniAudioText);
    utterance.lang = document.getElementById("langSelect").value;
    utterance.rate = 0.92;

    utterance.onstart = () => {
      document.getElementById("playAudioBtn").innerText = "⏹ चल रहा है...";
    };
    utterance.onend = () => {
      document.getElementById("playAudioBtn").innerText = "▶ पुनः सुनें";
    };

    window.speechSynthesis.speak(utterance);
  } else {
    alert("डिवाइस में वॉयस सिंथेसिस उपलब्ध नहीं है।");
  }
}

function showQrModal() {
  const qrImg = document.getElementById("qrImage");
  if (activeAudioItem) {
    document.getElementById("modalHeritageTitle").innerText = `QR: ${activeAudioItem.title}`;
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://vratyavani.ai/spot/${activeAudioItem.id}`;
  } else {
    document.getElementById("modalHeritageTitle").innerText = `VratyaVani AI Spot Guide`;
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://vratyavani.ai/spot/muzaffarpur`;
  }
  document.getElementById("qrModal").style.display = "flex";
}

function closeQrModal(e) {
  if (!e || e.target.id === "qrModal" || e.target.classList.contains("close-modal")) {
    document.getElementById("qrModal").style.display = "none";
  }
}

// ---------------- ADMIN LOGIN & IN-PAGE DASHBOARD LOGIC ---------------- //

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

  // Validate Credentials
  if ((uid === "admin@vratyavani.ai" || uid === "admin") && pass === "Admin@2026") {
    sessionStorage.setItem("vratyavani_admin_auth", "true");
    document.getElementById("loginModal").style.display = "none";
    openAdminPanel();
  } else {
    alert("अमान्य क्रेडेंशियल्स! सही Admin User ID और Password दर्ज करें। (ID: admin, Pass: Admin@2026)");
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
  alert("लॉगआउट सफल!");
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
    const row = document.createElement("tr");
    row.innerHTML = `
      <td style="padding:5px; border:1px solid #e2e8f0;"><strong>${item.title}</strong></td>
      <td style="padding:5px; border:1px solid #e2e8f0;">${item.district}</td>
      <td style="padding:5px; border:1px solid #e2e8f0; text-transform:uppercase;">${item.category}</td>
      <td style="padding:5px; border:1px solid #e2e8f0;">
        ${item.isCustom ? `<button onclick="deleteCustomRecord(${index})" style="background:#fee2e2; color:#b91c1c; border:none; padding:2px 5px; border-radius:3px; cursor:pointer;">हटाएं</button>` : `<span style="color:#94a3b8;">Core</span>`}
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
  const phone = document.getElementById("recPhone").value.trim();
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
    title: title,
    desc: desc,
    coords: coords,
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=400&q=80",
    bhashiniAudioText: desc,
    artisanPhone: phone || null,
    source: "Firebase Cloud Synced"
  };

  // Firebase Firestore Sync
  if (window.saveToFirestore) {
    const cloudId = await window.saveToFirestore(newRecord);
    if (cloudId) newRecord.cloudDocId = cloudId;
  }

  const customRecords = getCustomRecords();
  customRecords.unshift(newRecord);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customRecords));

  alert(`🎉 VratyaVani AI: "${title}" को सत्यापित कर तुरंत लाइव कर दिया गया है!`);
  e.target.reset();
  renderInpageAdminTable();
  loadDistrictData(window.currentDistrict);
}

window.deleteCustomRecord = async function(recordIndex) {
  if (!confirm("क्या आप इस रिकॉर्ड को हटाना चाहते हैं?")) return;

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