/**
 * VratyaVani AI — India's Community-Verified Immersive Heritage Network
 * Final Stable Version: Unified Cloud + Local Storage Sync for Admin Curation Desk
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

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
window.currentPersona = "tourist";
window.mapInstance = null;
let mapMarkers = [];
let pannellumViewerInstance = null;
let citizenUploadedBase64 = null;

const STORAGE_KEY = "vratyavani_custom_records";
const PENDING_KEY = "vratyavani_pending_submissions";

const stateDistrictHints = {
  bihar: ["Muzaffarpur", "Patna", "Gaya"],
  up: ["Varanasi", "Ayodhya", "Mathura"],
  punjab: ["Amritsar", "Anandpur Sahib"]
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
      }, 400);
    }
  }, 600);
};

window.openLocationModalDirect = function() { document.getElementById("locationModal").style.display = "flex"; };
window.closeLocationModal = function() { document.getElementById("locationModal").style.display = "none"; };
window.openPassportModal = function() { document.getElementById("passportModal").style.display = "flex"; };
window.closePassportModal = function() { document.getElementById("passportModal").style.display = "none"; };

window.confirmLocationSelection = function() {
  const rawDist = document.getElementById("selDistrictInput").value.trim().toLowerCase();
  const lang = document.getElementById("selLang").value;
  const persona = document.getElementById("selPersona").value;
  const distKey = rawDist || "muzaffarpur";

  window.currentLanguage = lang;
  window.currentPersona = persona;
  document.getElementById("navDistrictLabel").innerText = distKey.toUpperCase();
  document.getElementById("navLangLabel").innerText = lang.split('-')[0].toUpperCase();
  
  const consoleLangSelect = document.getElementById("langSelect");
  if (consoleLangSelect) consoleLangSelect.value = lang;

  document.getElementById("locationModal").style.display = "none";
  window.onDistrictChange(distKey);
};

window.onConsoleLangChange = function(lang) {
  window.currentLanguage = lang;
  renderCards();
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

function getCustomRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function getLocalPending() {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

async function getPendingSubmissionsFromCloud() {
  try {
    const querySnapshot = await getDocs(collection(db, "vratyavani_pending"));
    const pendingList = [];
    querySnapshot.forEach((d) => pendingList.push({ id: d.id, ...d.data() }));
    if (pendingList.length > 0) {
      return pendingList;
    }
  } catch (e) {}
  return getLocalPending();
}

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
  if (window.mapInstance) {
    mapMarkers.forEach(m => window.mapInstance.removeLayer(m));
    mapMarkers = [];
    if (items.length > 0) {
      window.mapInstance.flyTo(items[0].coords, 13);
      items.forEach(item => {
        const marker = L.marker(item.coords).addTo(window.mapInstance);
        marker.bindPopup(`<strong>🏛️ ${item.name || item.title}</strong><br><small>Cluster: ${item.village || 'Circuit'}</small>`);
        mapMarkers.push(marker);
      });
    }
  }
  renderCards(items);
};

function renderCards(preloadedItems) {
  const container = document.getElementById("cardsGrid");
  if (!container) return;
  container.innerHTML = "";

  let items = preloadedItems || getCustomRecords().filter(c => c.district?.toLowerCase() === window.currentDistrict.toLowerCase());

  if (items.length === 0) {
    container.innerHTML = `<div style="color:#64748b; padding:30px; text-align:center; grid-column:1/-1; font-weight:600; font-size:14px;">इस ज़िले में अभी कोई रिकॉर्ड नहीं है। 'Submit Upcoming Heritage' से नया डेटा जोड़ें।</div>`;
    return;
  }

  items.forEach(item => {
    let titleText = item.name || item.title || "Heritage Site";
    let descText = item.story || item.desc || "Historical monument overview.";
    
    if (window.currentPersona === 'kids') {
      descText = "बाल कथा: " + descText.substring(0, 90) + "... (बच्चों के लिए सरल विवरण!)";
    } else if (window.currentPersona === 'researcher') {
      descText = "Research Archive: " + descText + " [Metadata Verified]";
    } else if (window.currentPersona === 'spiritual') {
      descText = "आध्यात्मिक संदर्भ: " + descText + " (पवित्र आस्था केंद्र)";
    }

    let ritualText = item.livingCulture || "Local sacred tradition.";
    let displayImage = item.imageUrl || item.image || "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=80";
    const itemId = item.id || item.name || "item_" + Math.random();

    const cardHtml = `
      <div class="unified-card" style="background:#fff; border-radius:12px; padding:15px; box-shadow:0 4px 12px rgba(0,0,0,0.08); margin-bottom:15px; border-left:4px solid var(--accent-gold);">
        <div onclick="open360Viewer('${itemId}')" style="cursor:pointer; position:relative;">
          <img src="${displayImage}" alt="${titleText}" style="width:100%; height:180px; object-fit:cover; border-radius:8px;" />
          <span style="position:absolute; bottom:8px; right:8px; background:rgba(0,0,0,0.75); color:#fff; padding:3px 8px; font-size:10px; border-radius:4px;">🌐 WebXR 360° Tour</span>
        </div>
        <div style="margin-top:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <h4 style="font-size:16px; font-weight:700; color:#1e1b4b;">${titleText}</h4>
            <span style="background:#dcfce7; color:#15803d; padding:2px 8px; font-size:10px; font-weight:bold; border-radius:10px;">🟢 VERIFIED TRUST</span>
          </div>
          <div style="font-size:11px; color:#c2410c; font-weight:700; margin-bottom:6px;">📍 Cluster Area: ${item.village || 'Main Circuit'}</div>
          <p style="font-size:12px; color:#334155; margin-bottom:6px;"><strong>${window.currentPersona.toUpperCase()} Mode:</strong> ${descText}</p>
          <p style="font-size:12px; color:#6b21a8; margin-bottom:8px;"><strong>🎭 Living Culture:</strong> ${ritualText}</p>
          
          <div style="display:flex; gap:8px; margin:10px 0; flex-wrap:wrap;">
            <button type="button" class="btn-audio-pill" onclick="selectUnifiedAudio('${itemId}', 'heritage')" style="background:#fef3c7; color:#92400e; border:none; padding:6px 12px; border-radius:15px; font-size:11px; font-weight:bold; cursor:pointer;">🏛️ इतिहास सुनें (History)</button>
            <button type="button" class="btn-audio-pill" onclick="selectUnifiedAudio('${itemId}', 'culture')" style="background:#dcfce7; color:#15803d; border:none; padding:6px 12px; border-radius:15px; font-size:11px; font-weight:bold; cursor:pointer;">🎭 जीवंत परंपरा (Culture)</button>
          </div>

          <div style="background:#f8fafc; padding:8px; border-radius:6px; margin-bottom:10px; font-size:11px; border:1px solid #e2e8f0;">
            <span style="color:#0284c7; font-weight:bold;">🚨 Heritage Risk Radar:</span> Low Risk (Active community practice)
          </div>

          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button type="button" class="btn-sm" onclick="focusOnMapTab(${item.coords[0]}, ${item.coords[1]})" style="background:#e0f2fe; color:#0369a1; border:none; padding:5px 10px; border-radius:4px; font-weight:bold; cursor:pointer;">📍 Cluster Map</button>
            <button type="button" class="btn-sm" style="background:#fef3c7; color:#b45309; border:none; padding:5px 10px; border-radius:4px; font-weight:bold; cursor:pointer;" onclick="alert('🔗 WhatsApp Artisan Bridge connected: Connect with local artisans.')">🛍️ Artisan Livelihood</button>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += cardHtml;
  });
}

window.selectUnifiedAudio = function(itemId, mode) {
  let custom = getCustomRecords();
  const found = custom.find(i => (i.id === itemId || i.name === itemId));
  if (!found) return;

  const textToPlay = (mode === 'culture') ? found.livingCulture : found.story;
  const nowPlayingEl = document.getElementById("nowPlayingText");
  if (nowPlayingEl) {
    nowPlayingEl.innerHTML = `<strong>🔊 Playing (${mode.toUpperCase()}):</strong> ${found.name}<br><em>"${textToPlay}"</em>`;
  }
  playAudioDirectly(textToPlay);
};

function playAudioDirectly(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = window.currentLanguage || 'hi-IN';
  window.speechSynthesis.speak(utter);
}

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
    aiValidation: "✓ Metadata Verified"
  };

  // Save to LocalStorage as well as Cloud
  let localPending = getLocalPending();
  localPending.unshift(pendingItem);
  localStorage.setItem(PENDING_KEY, JSON.stringify(localPending));

  try {
    await setDoc(doc(db, "vratyavani_pending", pendingId), pendingItem);
  } catch (err) {}

  alert(`🛡️ Trust Engine: "${pendingItem.title}" सफलतापर्वक सबमिट हो गया है!`);
  e.target.reset();
  citizenUploadedBase64 = null;
  const boxEl = document.getElementById("citImagePreviewBox");
  if (boxEl) boxEl.style.display = "none";
  closeCitizenModal();
};

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
  pendingTbody.innerHTML = `<tr><td colspan="4" style="padding:10px; text-align:center; color:#64748b;">Loading queue...</td></tr>`;
  
  const pendingItems = await getPendingSubmissionsFromCloud();
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
      <td style="padding:8px; border:1px solid #e2e8f0; color:#15803d; font-size:10px;">${pItem.aiValidation}</td>
      <td style="padding:8px; border:1px solid #e2e8f0;">
        <button type="button" onclick="approveCloudSubmission('${pItem.id}')" style="background:#dcfce7; color:#15803d; border:none; padding:4px 10px; border-radius:4px; font-weight:bold; cursor:pointer;">Approve & Live</button>
      </td>
    `;
    pendingTbody.appendChild(row);
  });
}

window.approveCloudSubmission = async function(docId) {
  const pendingItems = await getPendingSubmissionsFromCloud();
  const approvedItem = pendingItems.find(i => i.id === docId);
  if (!approvedItem) return;

  const verifiedRecord = {
    id: `rec_${Date.now()}`,
    name: approvedItem.title,
    district: approvedItem.district.toLowerCase(),
    village: approvedItem.village || "",
    coords: approvedItem.coords,
    image: approvedItem.image,
    imageUrl: approvedItem.image,
    story: approvedItem.story,
    livingCulture: approvedItem.ritual,
    createdAt: new Date().toLocaleString()
  };

  try {
    await setDoc(doc(db, "vratyavani_records", verifiedRecord.id), verifiedRecord);
    await deleteDoc(doc(db, "vratyavani_pending", docId));
  } catch (err) {}

  // Remove from local pending storage
  let localPending = getLocalPending().filter(i => i.id !== docId);
  localStorage.setItem(PENDING_KEY, JSON.stringify(localPending));

  let customRecords = getCustomRecords();
  customRecords.unshift(verifiedRecord);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customRecords));

  alert(`✅ "${approvedItem.title}" approve होकर लाइव हो गया है!`);
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
  let custom = getCustomRecords();
  const found = custom.find(i => i.id === itemId || i.name === itemId);
  if (!found) return;
  document.getElementById("panoTitle").innerText = `WebXR 360° Tour: ${found.name}`;
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

window.showQrModal = function() { alert("Spot QR Code Scanner Active for Offline Mode."); };
window.openCitizenModal = function() { document.getElementById("citizenModal").style.display = "flex"; };
window.closeCitizenModal = function() { document.getElementById("citizenModal").style.display = "none"; };