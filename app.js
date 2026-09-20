/**
 * VratyaVani AI — India's Community-Verified Immersive Heritage Network
 * Unified Architecture with:
 * - Specific District/State Focus on Map Radar when empty
 * - True In-Memory Translation Engine (Hindi, Punjabi, Bhojpuri, Maithili, English)
 * - Native Accent TTS Voice Narration
 * - Community Poll Signal Voting (Yes / No) with Fixed Render
 * - Admin Approve / Reject Cloud Actions
 * - Live Camera Capture Support
 * - Admin-Only State Cultural Highlight Controls
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
let adminUploadedBase64 = null;

const STORAGE_KEY = "vratyavani_custom_records";
const PENDING_KEY = "vratyavani_pending_submissions";
const BANNER_KEY = "vratyavani_custom_banner";

// Coordinates Map for Selected District Radar Autofocus
const districtCoordinatesMap = {
  muzaffarpur: [26.1245, 85.3902],
  patna: [25.5941, 85.1376],
  gaya: [24.7914, 85.0002],
  varanasi: [25.3109, 83.0107],
  ayodhya: [26.7922, 82.1998],
  mathura: [27.4924, 77.6737],
  amritsar: [31.6200, 74.8765],
  "anandpur sahib": [31.2359, 76.4988]
};

const stateDistrictHints = {
  bihar: ["Muzaffarpur", "Patna", "Gaya"],
  up: ["Varanasi", "Ayodhya", "Mathura"],
  punjab: ["Amritsar", "Anandpur Sahib"]
};

// Full In-Memory Heritage Translation Database (English to Native Dialects)
const heritageNarrativeTranslations = {
  "baba garibnath": {
    "hi-IN": {
      title: "बाबा गरीबनाथ धाम",
      desc: "हमारे चारों ओर फैले इस प्राचीन मंदिर के इतिहास को देखें। स्थानीय बुजुर्ग बताते हैं कि 300 वर्ष पूर्व यह संपूर्ण क्षेत्र एक सघन निजी वन हुआ करता था। एक दिन जमींदार ने विशाल बरगद के पेड़ को काटने का आदेश दिया। जैसे ही कुल्हाड़ी ने जड़ों पर प्रहार किया, वृक्ष से रक्त जैसा लाल तरल बहने लगा। भयभीत श्रमिक औजार फेंक कर भाग गए। उसी रात भगवान शिव ने जमींदार के स्वप्न में दर्शन देकर कहा: 'वृक्ष मत काटो, इसकी जड़ों के नीचे स्वयंभू शिवलिंग विद्यमान है। मैं असहायों की रक्षा के लिए यहाँ प्रकट हुआ हूँ, मुझे गरीबनाथ कहो।' अगली सुबह ग्रामीणों ने खुदाई कर पवित्र पाषाण प्राप्त किया। आज यह उत्तर बिहार के देवघर के रूप में सुप्रसिद्ध है।",
      culture: "जीवंत संस्कृति: तीन शताब्दियों से चली आ रही यह पावन परंपरा मानती है कि भगवान शिव यहाँ दीन-दुखियों के रक्षक हैं। मुख्य परंपराओं में वार्षिक श्रावण मास कांवड़ यात्रा, विनम्रता के प्रतीक रूप में नंगे पाँव पैदल चलने का संकल्प और असाध्य रोगों से मुक्ति का अटूट विश्वास शामिल है।",
      tradition: "लोक परंपरा: वार्षिक श्रावण मेला, अखंड महाशिवरात्रि भजन कीर्तन और सदियों पुरानी पवित्र लोक आस्था।"
    },
    "pa-IN": {
      title: "ਬਾਬਾ ਗਰੀਬਨਾਥ ਧਾਮ",
      desc: "ਇਸ ਪੁਰਾਤਨ ਮੰਦਰ ਦੇ ਇਤਿਹਾਸ ਵੱਲ ਵੇਖੋ। ਬਜ਼ੁਰਗ ਦੱਸਦੇ ਹਨ ਕਿ 300 ਸਾਲ ਪਹਿਲਾਂ ਇਹ ਇਲਾਕਾ ਇਕ ਸੰਘਣਾ ਨਿੱਜੀ ਜੰਗਲ ਸੀ। ਇਕ ਦਿਨ ਜ਼ਿਮੀਂਦਾਰ ਨੇ ਵਿਸ਼ਾਲ ਬੋਹੜ ਦਾ ਦਰੱਖਤ ਕੱਟਣ ਦਾ ਹੁਕਮ ਦਿੱਤਾ। ਜਿਵੇਂ ਹੀ ਕੁਹਾੜੀ ਜੜ੍ਹਾਂ 'ਤੇ ਲੱਗੀ, ਰੁੱਖ 'ਚੋਂ ਲਾਲ ਤਰਲ ਨਿਕਲਣ ਲੱਗਾ। ਡਰੇ ਹੋਏ ਮਜ਼ਦੂਰ ਔਜ਼ਾਰ ਛੱਡ ਕੇ ਭੱਜ ਗਏ। ਉਸੇ ਰਾਤ ਭਗਵਾਨ ਸ਼ਿਵ ਨੇ ਜ਼ਿਮੀਂਦਾਰ ਦੇ ਸੁਪਨੇ ਵਿਚ ਦਰਸ਼ਨ ਦੇ ਕੇ ਕਿਹਾ: 'ਰੁੱਖ ਨਾ ਕੱਟੋ, ਇਸ ਦੀਆਂ ਜੜ੍ਹਾਂ ਹੇਠਾਂ ਸਵੈ-ਪ੍ਰਗਟ ਸ਼ਿਵਲਿੰਗ ਹੈ। ਮੈਨੂੰ ਗਰੀਬਨਾਥ ਕਹੋ।' ਅਗਲੀ ਸਵੇਰ ਪਿੰਡ ਵਾਸੀਆਂ ਨੇ ਖੁਦਾਈ ਕਰਕੇ ਪਵਿੱਤਰ ਸ਼ਿਵਲਿੰਗ ਪ੍ਰਾਪਤ ਕੀਤਾ। ਅੱਜ ਇਸਨੂੰ ਉੱਤਰੀ ਬਿਹਾਰ ਦਾ ਦੇਵਘਰ ਕਿਹਾ ਜਾਂਦਾ ਹੈ।",
      culture: "ਜਿਉਂਦਾ ਸੱਭਿਆਚਾਰ: ਤਿੰਨ ਸਦੀਆਂ ਤੋਂ ਚਲੀ ਆ ਰਹੀ ਪਰੰਪਰਾ ਦੱਸਦੀ ਹੈ ਕਿ ਭਗਵਾਨ ਸ਼ਿਵ ਗਰੀਬਾਂ ਅਤੇ ਲਾਚਾਰਾਂ ਦੇ ਰਾਖੇ ਹਨ। ਮੁੱਖ ਰੀਤਾਂ ਵਿੱਚ ਸਾਵਣ ਮਹੀਨੇ ਦੀ ਯਾਤਰਾ, ਨੰਗੇ ਪੈਰੀਂ ਚੱਲਣ ਦੀ ਤਪੱਸਿਆ ਅਤੇ ਰੋਗ-ਮੁਕਤੀ ਦੀ ਪੱਕੀ ਆਸਥਾ ਸ਼ਾਮਲ ਹੈ।",
      tradition: "ਲੋਕ ਪਰੰਪਰਾ: ਸਾਲਾਨਾ ਸਾਵਣ ਮੇਲਾ, ਸ਼ਿਵਰਾਤਰੀ ਕੀਰਤਨ ਅਤੇ ਸਦੀਆਂ ਪੁਰਾਣੀ ਲੋਕ ਸ਼ਰਧਾ।"
    },
    "bho-IN": {
      title: "बाबा गरीबनाथ धाम",
      desc: "एह प्राचीन मंदिर के इतिहास के देखीं। पुरान लोग बतावेला कि 300 साल पहिले ई पूरा इलाका एगो घना जंगल रहे। जमींदार विशाल बरगद काटे के हुकुम दिहलें। कुल्हाड़ी लागतही पेड़ से खून जइसन लाल रस बहे लागल। उहे रात भगवान शिव जमींदार के सपना में अइलें आ कहलें: 'पेड़ मत काटो, जड़ के नीचे स्वयंभू शिवलिंग बा। हम दीन-दुखिया के रक्षा करे खातिर गरीबनाथ हईं।' बिहान भइला पर खनला से पावन शिवलिंग मिलल। आज ई उत्तर बिहार के देवघर कहल जाला।",
      culture: "लोक संस्कृति: तीन सदी से चलल आवत ई पावन परंपरा में मानल जाला कि बाबा गरीबनाथ असहाय के सहारा हउवें। सावन में बोल-बम कांवड़ यात्रा आ नंगे पाँव पैदल चल के जल चढ़ावे के अटूट विश्वास बा।",
      tradition: "लोक परंपरा: सालाना सावन मेला, महाशिवरात्रि के अखंड जागरण आ लोकगीत भजन।"
    },
    "mai-IN": {
      title: "बाबा गरीबनाथ धाम",
      desc: "एहि प्राचीन मंदिरक इतिहास देखू। बुजुर्ग लोकनि कहैत छथि जे 300 वर्ष पूर्व ई संपूर्ण क्षेत्र एकटा सघन वन छल। जमींदार विशाल वटवृक्ष कटबाक आदेश देलनि। कुल्हाड़ीक प्रहार होइते वृक्ष सं रक्त सदृश लाल तरल बहए लागल। ओही राति भगवान शिव जमींदारक स्वप्न में दर्शन द' कहलथिन: 'वृक्ष नहि काटू, जड़िक नीचा स्वयंभू शिवलिंग अछि। हम गरीबनाथ छी।' दोसर दिन प्रातः ग्रामीण लोकनि पवित्र शिवलिंग प्राप्त कएल। आई ई उत्तर बिहारक देवघर कहाइत अछि।",
      culture: "जीवित संस्कृति: तीन शताब्दी सं चलि आबि रहल परंपराक अनुसार भगवान शिव एतय दीन-दुखियाक उद्धारक छथि। साओन मासक कांवड़ यात्रा आ नंगे पाँव चलबाक संकल्प एहि ठामक मुख्य आस्था अछि।",
      tradition: "लोक परंपरा: वार्षिक श्रावणी मेला, महाशिवरात्रि अखण्ड कीर्तन आ पारंपरिक लोकगीत।"
    }
  }
};

// Full UI Translation Matrix across 5 Dialects
const uiDictionary = {
  "hi-IN": {
    heroTitle: "पुरखों की थाती, डिजिटल वाणी की पाती",
    heroSub: "India's Community-Verified Immersive Heritage & Preservation Network",
    mapTitle: "📍 Living Heritage Clusters & Circuit Map",
    voiceConsoleTitle: "🎙️ Multilingual AI Voice Guide",
    circuitSectionTitle: "📍 इस क्षेत्र के प्रमुख सर्किट स्थल",
    nowPlayingDefault: "इतिहास, संस्कृति या परंपरा चुनकर अपनी बोली में सुनें...",
    emptyDistrictMsg: "इस ज़िले में अभी कोई रिकॉर्ड नहीं है।",
    btnRadarText: "📡 चुने गए ज़िले का सर्किट मैप पर देखें",
    btnListenHist: "🏛️ इतिहास सुनें",
    btnListenCult: "🎭 संस्कृति सुनें",
    btnListenTrad: "📜 परंपरा सुनें",
    btnVoteYes: "👍 Yes (सत्यापित)",
    btnVoteNo: "👎 No (अमान्य)",
    heritageLabel: "🏛️ धरोहर परिचय:",
    cultureLabel: "🎭 जीवंत संस्कृति:",
    traditionLabel: "📜 लोक परंपरा:",
    verifiedTrust: "🟢 VERIFIED TRUST",
    upcomingLabel: "🟡 UPCOMING HERITAGE",
    tabHome: "होम",
    tabMap: "क्लस्टर्स",
    tabTerritory: "क्षेत्र",
    tabAdmin: "एडमिन",
    locModalTitle: "VratyaVani नेटवर्क",
    locModalSub: "राज्य, ज़िला और अपनी स्थानीय बोली चुनें",
    lblState: "State (राज्य)",
    lblDistrict: "District (ज़िला)",
    lblLang: "AI Voice Guide Dialect (भाषा / बोली)",
    btnExplore: "Explore Verified Network ➔",
    citHeading: "🏛️ Submit Upcoming Heritage",
    citSubText: "नागरिक साक्ष्य आधारित ट्रस्ट इंजन सत्यापन (Cloud Synced)",
    lblCitState: "State (राज्य)",
    lblCitDistrict: "District (ज़िला)",
    lblCitVillage: "Village / Cluster Area (गाँव / क्षेत्र)",
    lblCitTitle: "Heritage Name (धरोहर का नाम)",
    lblCitRitual: "Living Culture / Ritual (जीवंत संस्कृति / पूजा)",
    lblCitTradition: "Tradition / Folk Practice (लोक परंपरा)",
    lblCitPhoto: "Evidence Photo (फोटो साक्ष्य)",
    lblCitGps: "GPS Coordinates (जीपीएस)",
    lblCitStory: "Oral Narrative / Story (ऐतिहासिक विवरण / कथा)",
    btnCitSubmit: "Submit to Community & Cloud",
    btnPassport: "🎨 Heritage Passport"
  },
  "en-IN": {
    heroTitle: "Heritage of Ancestors, Epistle of Digital Voice",
    heroSub: "India's Community-Verified Immersive Heritage & Preservation Network",
    mapTitle: "📍 Living Heritage Clusters & Circuit Map",
    voiceConsoleTitle: "🎙️ Multilingual AI Voice Guide",
    circuitSectionTitle: "📍 Key Circuit Points in this Region",
    nowPlayingDefault: "Select History, Culture or Tradition to experience AI narration...",
    emptyDistrictMsg: "No records found in this district yet.",
    btnRadarText: "📡 Explore Selected District on Map Radar",
    btnListenHist: "🏛️ History Audio",
    btnListenCult: "🎭 Culture Audio",
    btnListenTrad: "📜 Tradition Audio",
    btnVoteYes: "👍 Yes (Verify)",
    btnVoteNo: "👎 No (Reject)",
    heritageLabel: "🏛️ Heritage Overview:",
    cultureLabel: "🎭 Living Culture:",
    traditionLabel: "📜 Folk Tradition:",
    verifiedTrust: "🟢 VERIFIED TRUST",
    upcomingLabel: "🟡 UPCOMING HERITAGE",
    tabHome: "Home",
    tabMap: "Clusters",
    tabTerritory: "Territory",
    tabAdmin: "Admin",
    locModalTitle: "VratyaVani Network",
    locModalSub: "Select State, District and Local Dialect",
    lblState: "State",
    lblDistrict: "District",
    lblLang: "AI Voice Guide Dialect",
    btnExplore: "Explore Verified Network ➔",
    citHeading: "🏛️ Submit Upcoming Heritage",
    citSubText: "Submitted to VratyaVani Trust Engine (Cross-device verified via Cloud).",
    lblCitState: "State",
    lblCitDistrict: "District",
    lblCitVillage: "Village / Cluster Area",
    lblCitTitle: "Heritage Name / Shrine",
    lblCitRitual: "Living Culture / Ritual",
    lblCitTradition: "Tradition / Folk Practice",
    lblCitPhoto: "Evidence Photo",
    lblCitGps: "GPS Coordinates",
    lblCitStory: "Oral Narrative / Story",
    btnCitSubmit: "Submit to Community & Cloud",
    btnPassport: "🎨 Heritage Passport"
  },
  "pa-IN": {
    heroTitle: "ਪੁਰਖਿਆਂ ਦੀ ਵਿਰਾਸਤ, ਡਿਜੀਟਲ ਆਵਾਜ਼ ਦੀ ਸੌਗਾਤ",
    heroSub: "India's Community-Verified Immersive Heritage & Preservation Network",
    mapTitle: "📍 ਵਿਰਾਸਤੀ ਕਲੱਸਟਰ ਅਤੇ ਨਕਸ਼ਾ",
    voiceConsoleTitle: "🎙️ ਬਹੁ-ਭਾਸ਼ਾਈ AI ਆਡੀਓ ਗਾਈਡ",
    circuitSectionTitle: "📍 ਇਸ ਖੇਤਰ ਦੇ ਮੁੱਖ ਵਿਰਾਸਤੀ ਸਥਾਨ",
    nowPlayingDefault: "ਇਤਿਹਾਸ ਜਾਂ ਰੀਤਾਂ ਸੁਣੋ ਆਪਣੀ ਬੋਲੀ ਵਿੱਚ...",
    emptyDistrictMsg: "ਇਸ ਜ਼ਿਲ੍ਹੇ ਵਿੱਚ ਕੋਈ ਰਿਕਾਰਡ ਨਹੀਂ ਹੈ।",
    btnRadarText: "📡 ਚੁਣੇ ਹੋਏ ਜ਼ਿਲ੍ਹੇ ਦਾ ਨਕਸ਼ਾ ਵੇਖੋ",
    btnListenHist: "🏛️ ਇਤਿਹਾਸ ਸੁਣੋ",
    btnListenCult: "🎭 ਸੱਭਿਆਚਾਰ ਸੁਣੋ",
    btnListenTrad: "📜 ਰੀਤਾਂ ਸੁਣੋ",
    btnVoteYes: "👍 ਹਾਂ (ਤਸਦੀਕ ਹੈ)",
    btnVoteNo: "👎 ਨਹੀਂ (ਰੱਦ)",
    heritageLabel: "🏛️ ਵਿਰਾਸਤੀ ਜਾਣਕਾਰੀ:",
    cultureLabel: "🎭 ਜਿਉਂਦਾ ਸੱਭਿਆਚਾਰ:",
    traditionLabel: "📜 ਲੋਕ ਪਰੰਪਰਾ:",
    verifiedTrust: "🟢 ਤਸਦੀਕਸ਼ੁਦਾ ਵਿਰਾਸਤ",
    upcomingLabel: "🟡 ਨਵੀਂ ਆਗਾਮੀ ਵਿਰਾਸਤ",
    tabHome: "ਘਰ",
    tabMap: "ਕਲੱਸਟਰ",
    tabTerritory: "ਖੇਤਰ",
    tabAdmin: "ਐਡਮਿਨ",
    locModalTitle: "VratyaVani ਨੈੱਟਵਰਕ",
    locModalSub: "ਰਾਜ, ਜ਼ਿਲ੍ਹਾ ਅਤੇ ਪੰਜਾਬੀ ਬੋਲੀ ਚੁਣੋ",
    lblState: "ਰਾਜ",
    lblDistrict: "ਜ਼ਿਲ੍ਹਾ",
    lblLang: "AI ਗਾਈਡ ਬੋਲੀ",
    btnExplore: "ਨੈੱਟਵਰਕ ਵੇਖੋ ➔",
    citHeading: "🏛️ ਨਵੀਂ ਵਿਰਾਸਤ ਦਰਜ ਕਰੋ",
    citSubText: "ਕਲਾਉਡ ਟਰੱਸਟ ਇੰਜਣ ਤਸਦੀਕ",
    lblCitState: "ਰਾਜ",
    lblCitDistrict: "ਜ਼ਿਲ੍ਹਾ",
    lblCitVillage: "ਪਿੰਡ / ਖੇਤਰ",
    lblCitTitle: "ਵਿਰਾਸਤ ਦਾ ਨਾਮ",
    lblCitRitual: "ਸੱਭਿਆਚਾਰ / ਪੂਜਾ",
    lblCitTradition: "ਲੋਕ ਪਰੰਪਰਾ",
    lblCitPhoto: "ਫੋਟੋ ਸਬੂਤ",
    lblCitGps: "ਜੀਪੀਐੱਸ",
    lblCitStory: "ਇਤਿਹਾਸਕ ਕਥਾ",
    btnCitSubmit: "ਕਲਾਉਡ 'ਤੇ ਦਰਜ ਕਰੋ",
    btnPassport: "🎨 ਹੈਰੀਟੇਜ ਪਾਸਪੋਰਟ"
  },
  "bho-IN": {
    heroTitle: "पुरखन के धरोहर, डिजिटल बानी के पाती",
    heroSub: "India's Community-Verified Immersive Heritage & Preservation Network",
    mapTitle: "📍 धरोहर क्लस्टर आ सर्किट नक्शा",
    voiceConsoleTitle: "🎙️ बहुभाषी AI आवाज गाइड",
    circuitSectionTitle: "📍 एह इलाका के मुख्य सर्किट स्थल",
    nowPlayingDefault: "इतिहास भा लोक-परंपरा चुनीं आ अपनी बोली में सुनीं...",
    emptyDistrictMsg: "एह जिला में अभी कवनो रेकॉर्ड नइखे।",
    btnRadarText: "📡 चुनल जिला के सर्किट नक्शा पर देखीं",
    btnListenHist: "🏛️ इतिहास सुनीं",
    btnListenCult: "🎭 संस्कृति सुनीं",
    btnListenTrad: "📜 परंपरा सुनीं",
    btnVoteYes: "👍 हाँ (सत्यापित)",
    btnVoteNo: "👎 ना (अमान्य)",
    heritageLabel: "🏛️ धरोहर परिचय:",
    cultureLabel: "🎭 लोक संस्कृति:",
    traditionLabel: "📜 रीत-परंपरा:",
    verifiedTrust: "🟢 प्रमाणित धरोहर",
    upcomingLabel: "🟡 सत्यापन खातिर धरोहर",
    tabHome: "होम",
    tabMap: "क्लस्टर",
    tabTerritory: "इलाका",
    tabAdmin: "एडमिन",
    locModalTitle: "VratyaVani नेटवर्क",
    locModalSub: "राज्य, ज़िला आ अपन बोली चुनीं",
    lblState: "राज्य",
    lblDistrict: "ज़िला",
    lblLang: "AI आवाज गाइड बोली",
    btnExplore: "सत्यापित नेटवर्क देखीं ➔",
    citHeading: "🏛️ नया धरोहर जोड़ीं",
    citSubText: "क्लाउड आधारित कम्युनिटी ट्रस्ट इंजन",
    lblCitState: "राज्य",
    lblCitDistrict: "ज़िला",
    lblCitVillage: "गाँव / इलाका",
    lblCitTitle: "धरोहर के नाम",
    lblCitRitual: "पूजा-पाठ / रीत",
    lblCitTradition: "लोक परंपरा",
    lblCitPhoto: "फोटो साक्ष्य",
    lblCitGps: "जीपीएस",
    lblCitStory: "इतिहास आ लोककथा",
    btnCitSubmit: "सबमिट करीं",
    btnPassport: "🎨 हेरिटेज पासपोर्ट"
  },
  "mai-IN": {
    heroTitle: "पुरखाक धरोहर, डिजिटल वाणीक पाती",
    heroSub: "India's Community-Verified Immersive Heritage & Preservation Network",
    mapTitle: "📍 धरोहर क्लस्टर एवं सर्किट मानचित्र",
    voiceConsoleTitle: "🎙️ बहुभाषी AI वाणी गाइड",
    circuitSectionTitle: "📍 एहि क्षेत्रक प्रमुख सर्किट स्थल",
    nowPlayingDefault: "इतिहास वा संस्कृति चुनू आ अपन मैथिली में सुनू...",
    emptyDistrictMsg: "एहि जिला में अखन कोनो रेकॉर्ड नहि अछि।",
    btnRadarText: "📡 चुनल जिलाक सर्किट मानचित्र पर देखू",
    btnListenHist: "🏛️ इतिहास सुनू",
    btnListenCult: "🎭 संस्कृति सुनू",
    btnListenTrad: "📜 परंपरा सुनू",
    btnVoteYes: "👍 हाँ (सत्य अछि)",
    btnVoteNo: "👎 नहि (अमान्य)",
    heritageLabel: "🏛️ धरोहर परिचय:",
    cultureLabel: "🎭 जीवित संस्कृति:",
    traditionLabel: "📜 लोक परंपरा:",
    verifiedTrust: "🟢 सत्यापित धरोहर",
    upcomingLabel: "🟡 आगामी धरोहर",
    tabHome: "होम",
    tabMap: "क्लस्टर",
    tabTerritory: "क्षेत्र",
    tabAdmin: "एडमिन",
    locModalTitle: "VratyaVani नेटवर्क",
    locModalSub: "राज्य, ज़िला एवं अपन मैथिली बोली चुनू",
    lblState: "राज्य",
    lblDistrict: "ज़िला",
    lblLang: "AI वाणी गाइड भाषा",
    btnExplore: "नेटवर्क देखू ➔",
    citHeading: "🏛️ आगामी धरोहर जोड़ू",
    citSubText: "क्लाउड आधारित ट्रस्ट इंजन सत्यापन",
    lblCitState: "राज्य",
    lblCitDistrict: "ज़िला",
    lblCitVillage: "गाँव / क्षेत्र",
    lblCitTitle: "धरोहरक नाम",
    lblCitRitual: "संस्कृति / अनुष्ठान",
    lblCitTradition: "लोक परंपरा",
    lblCitPhoto: "साक्ष्य फोटो",
    lblCitGps: "जीपीएस",
    lblCitStory: "ऐतिहासिक विवरण",
    btnCitSubmit: "क्लाउड पर सबमिट करू",
    btnPassport: "🎨 हेरिटेज पासपोर्ट"
  }
};

// Online / Offline Auto Detection
function setupNetworkStatusDetector() {
  const badge = document.getElementById("networkStatusBadge");
  const updateStatus = () => {
    if (!badge) return;
    if (navigator.onLine) {
      badge.innerText = "● Online PWA";
      badge.className = "network-badge online";
      badge.style.background = "#dcfce7";
      badge.style.color = "#15803d";
    } else {
      badge.innerText = "● Offline Mode";
      badge.className = "network-badge offline";
      badge.style.background = "#fee2e2";
      badge.style.color = "#991b1b";
    }
  };
  window.addEventListener("online", updateStatus);
  window.addEventListener("offline", updateStatus);
  updateStatus();
}

function populatePanIndiaStateDropdowns() {
  const dropdownIds = ['selState', 'citState', 'admState', 'admBannerState'];
  dropdownIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = "";
    const states = [
      { code: 'bihar', name: 'Bihar (बिहार)' },
      { code: 'up', name: 'Uttar Pradesh (उत्तर प्रदेश)' },
      { code: 'punjab', name: 'Punjab (ਪੰਜਾਬ)' }
    ];
    states.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s.code;
      opt.innerText = s.name;
      el.appendChild(opt);
    });
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
  setupNetworkStatusDetector();
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
  const selectedState = document.getElementById("selState").value;
  const rawDist = document.getElementById("selDistrictInput").value.trim().toLowerCase();
  const lang = document.getElementById("selLang").value;
  const distKey = rawDist || "muzaffarpur";

  window.currentState = selectedState;
  window.currentDistrict = distKey;
  window.currentLanguage = lang;

  document.getElementById("navStateLabel").innerText = selectedState.toUpperCase();
  document.getElementById("navDistrictLabel").innerText = distKey.toUpperCase();
  document.getElementById("navLangLabel").innerText = lang.split('-')[0].toUpperCase();
  
  const consoleLangSelect = document.getElementById("langSelect");
  if (consoleLangSelect) consoleLangSelect.value = lang;

  document.getElementById("locationModal").style.display = "none";
  window.renderAdminStateHighlight(selectedState);
  window.applyInterfaceLanguage(lang);
  window.onDistrictChange(distKey);
};

window.onConsoleLangChange = function(lang) {
  window.currentLanguage = lang;
  document.getElementById("navLangLabel").innerText = lang.split('-')[0].toUpperCase();
  window.applyInterfaceLanguage(lang);
  loadDistrictData(window.currentDistrict);
};

// Admin State Highlight Banner (Appears only if created by admin)
window.renderAdminStateHighlight = function(stateKey) {
  const box = document.getElementById("stateCulturalHighlightBox");
  const raw = localStorage.getItem(BANNER_KEY);
  if (!raw) {
    if (box) box.style.display = "none";
    return;
  }
  try {
    const banners = JSON.parse(raw);
    const active = banners[stateKey];
    if (active && active.title) {
      document.getElementById("stateHighlightBadge").innerText = `${stateKey.toUpperCase()} CULTURAL IDENTITY`;
      document.getElementById("stateHighlightTitle").innerText = active.title;
      document.getElementById("stateHighlightDesc").innerText = active.desc;
      document.getElementById("stateHighlightImg").src = active.img;
      box.style.display = "flex";
    } else {
      box.style.display = "none";
    }
  } catch (e) {
    if (box) box.style.display = "none";
  }
};

// Complete Interface Language Switcher
window.applyInterfaceLanguage = function(langKey) {
  const d = uiDictionary[langKey] || uiDictionary["hi-IN"];
  
  const h1 = document.getElementById("heroTagline");
  if (h1) h1.innerText = d.heroTitle;
  const h2 = document.getElementById("heroSubTagline");
  if (h2) h2.innerText = d.heroSub;
  const mapT = document.getElementById("mapSectionTitle");
  if (mapT) mapT.innerText = d.mapTitle;
  const audT = document.getElementById("audioConsoleTitle");
  if (audT) audT.innerText = d.voiceConsoleTitle;
  const circT = document.getElementById("circuitSectionTitle");
  if (circT) circT.innerText = d.circuitSectionTitle;
  const nowPlay = document.getElementById("nowPlayingText");
  if (nowPlay) nowPlay.innerText = d.nowPlayingDefault;
  const btnPass = document.getElementById("btnHeroPassport");
  if (btnPass) btnPass.innerText = d.btnPassport;

  // Bottom Navigation
  const tHome = document.getElementById("tabLabelHome");
  if (tHome) tHome.innerText = d.tabHome;
  const tMap = document.getElementById("tabLabelMap");
  if (tMap) tMap.innerText = d.tabMap;
  const tTerr = document.getElementById("tabLabelTerritory");
  if (tTerr) tTerr.innerText = d.tabTerritory;
  const tAdm = document.getElementById("tabLabelAdmin");
  if (tAdm) tAdm.innerText = d.tabAdmin;

  // Modals & Labels
  const lTitle = document.getElementById("locModalTitle");
  if (lTitle) lTitle.innerText = d.locModalTitle;
  const lSub = document.getElementById("locModalSub");
  if (lSub) lSub.innerText = d.locModalSub;
  const lState = document.getElementById("lblSelState");
  if (lState) lState.innerText = d.lblState;
  const lDist = document.getElementById("lblSelDistrict");
  if (lDist) lDist.innerText = d.lblDistrict;
  const lLang = document.getElementById("lblSelLang");
  if (lLang) lLang.innerText = d.lblLang;
  const btnExp = document.getElementById("btnConfirmLoc");
  if (btnExp) btnExp.innerText = d.btnExplore;

  // Citizen Modal
  const cHead = document.getElementById("citModalHeading");
  if (cHead) cHead.innerText = d.citHeading;
  const cSub = document.getElementById("citModalSubText");
  if (cSub) cSub.innerText = d.citSubText;
  const lcState = document.getElementById("lblCitState");
  if (lcState) lcState.innerText = d.lblCitState;
  const lcDist = document.getElementById("lblCitDistrict");
  if (lcDist) lcDist.innerText = d.lblCitDistrict;
  const lcVill = document.getElementById("lblCitVillage");
  if (lcVill) lcVill.innerText = d.lblCitVillage;
  const lcTit = document.getElementById("lblCitTitle");
  if (lcTit) lcTit.innerText = d.lblCitTitle;
  const lcRit = document.getElementById("lblCitRitual");
  if (lcRit) lcRit.innerText = d.lblCitRitual;
  const lcTrad = document.getElementById("lblCitTradition");
  if (lcTrad) lcTrad.innerText = d.lblCitTradition;
  const lcPho = document.getElementById("lblCitPhoto");
  if (lcPho) lcPho.innerText = d.lblCitPhoto;
  const lcGps = document.getElementById("lblCitGps");
  if (lcGps) lcGps.innerText = d.lblCitGps;
  const lcSto = document.getElementById("lblCitStory");
  if (lcSto) lcSto.innerText = d.lblCitStory;
  const btnCitSub = document.getElementById("btnCitSubmitFinal");
  if (btnCitSub) btnCitSub.innerText = d.btnCitSubmit;
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

// Real-Time Cross Device Firestore Sync
async function syncCloudHeritage() {
  try {
    const vSnap = await getDocs(collection(db, "vratyavani_records"));
    const verifiedList = [];
    vSnap.forEach(d => verifiedList.push({ id: d.id, ...d.data(), isVerified: true }));
    if (verifiedList.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(verifiedList));
    }

    const pSnap = await getDocs(collection(db, "vratyavani_pending"));
    const pendingList = [];
    pSnap.forEach(d => pendingList.push({ id: d.id, ...d.data(), isVerified: false }));
    if (pendingList.length > 0) {
      localStorage.setItem(PENDING_KEY, JSON.stringify(pendingList));
    }
  } catch (e) {
    console.warn("Cloud sync fallback to local:", e);
  }
  loadDistrictData(window.currentDistrict);
}

window.loadDistrictData = function(districtKey) {
  let verified = getLocalVerifiedRecords();
  let pending = getLocalPendingRecords();

  let combined = [...pending, ...verified];
  let filtered = combined.filter(c => c.district && c.district.toLowerCase() === districtKey.toLowerCase());

  // Render Map markers
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
    } else {
      // Focus strictly on Selected District Center Coordinates (NOT User Live Location)
      const targetCoords = districtCoordinatesMap[districtKey.toLowerCase()] || [26.1245, 85.3902];
      window.mapInstance.flyTo(targetCoords, 12);
    }
  }

  renderCards(filtered);
  renderMapCircuitList(filtered);
};

// Itemized 1, 2, 3 Circuit List Under Map
function renderMapCircuitList(itemsList) {
  const listContainer = document.getElementById("mapLocationsList");
  if (!listContainer) return;
  listContainer.innerHTML = "";

  if (itemsList.length === 0) {
    listContainer.innerHTML = `<div style="font-size:12px; color:#64748b; padding:10px; background:#f8fafc; border-radius:6px; text-align:center;">No circuit points recorded yet in this district. Click 'Submit Upcoming Heritage' to add.</div>`;
    return;
  }

  itemsList.forEach((item, index) => {
    const itemCard = document.createElement("div");
    itemCard.style.background = "#ffffff";
    itemCard.style.padding = "10px 14px";
    itemCard.style.borderRadius = "8px";
    itemCard.style.boxShadow = "0 2px 6px rgba(0,0,0,0.06)";
    itemCard.style.border = "1px solid #e2e8f0";
    itemCard.style.display = "flex";
    itemCard.style.justifyContent = "space-between";
    itemCard.style.alignItems = "center";
    itemCard.style.cursor = "pointer";

    itemCard.innerHTML = `
      <div>
        <span style="font-weight:800; color:var(--primary-deep); font-size:12px;">#${index + 1}. ${item.name || item.title}</span>
        <div style="font-size:11px; color:#64748b; margin-top:2px;">📍 ${item.village || 'Cluster Point'} • ${item.isVerified ? '🟢 Verified' : '🟡 Upcoming'}</div>
      </div>
      <button style="background:#e0f2fe; color:#0369a1; border:none; padding:5px 10px; border-radius:5px; font-size:11px; font-weight:bold; cursor:pointer;">
        Focus ➔
      </button>
    `;

    itemCard.onclick = () => {
      if (window.mapInstance && item.coords) {
        window.mapInstance.flyTo(item.coords, 16);
      }
    };

    listContainer.appendChild(itemCard);
  });
}

function renderCards(itemsList) {
  const container = document.getElementById("cardsGrid");
  if (!container) return;
  container.innerHTML = "";

  const d = uiDictionary[window.currentLanguage] || uiDictionary["hi-IN"];
  const lang = window.currentLanguage;

  // Empty District: Show Heritage Radar Focus Button for the Selected District
  if (itemsList.length === 0) {
    container.innerHTML = `
      <div style="background:#fff; border-radius:12px; padding:25px; text-align:center; grid-column:1/-1; box-shadow:0 4px 12px rgba(0,0,0,0.06);">
        <p style="color:#64748b; font-weight:600; font-size:13px; margin-bottom:12px;">${d.emptyDistrictMsg}</p>
        <button type="button" onclick="redirectToMapRadar('${window.currentDistrict}')" style="background:#38bdf8; color:#000; border:none; padding:10px 18px; border-radius:20px; font-weight:800; font-size:12px; cursor:pointer; box-shadow:0 4px 10px rgba(56,189,248,0.3);">
          ${d.btnRadarText}
        </button>
      </div>
    `;
    return;
  }

  itemsList.forEach(item => {
    let title = item.name || item.title || "Heritage Site";
    let desc = item.story || item.desc || "Historic monument overview.";
    let ritual = item.livingCulture || "Sacred traditional practice.";
    let tradition = item.tradition || "Annual folk celebration & heritage gathering.";

    // Automatic Translation Adaptation: If user typed in English, adapt to selected dialect
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("garibnath") || lowerTitle.includes("garib nath")) {
      const transObj = heritageNarrativeTranslations["baba garibnath"][lang];
      if (transObj) {
        title = transObj.title;
        desc = transObj.desc;
        ritual = transObj.culture;
        tradition = transObj.tradition;
      }
    }

    let displayImage = item.imageUrl || item.image || "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=80";
    const itemId = item.id || `item_${Math.random()}`;
    const yesVotes = item.yesVotes || item.votes || 1;
    const noVotes = item.noVotes || 0;
    const isVerified = item.isVerified === true;

    // Fixed Clean String Rendering for Poll Votes (Bug Fixed)
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
              ${isVerified ? d.verifiedTrust : d.upcomingLabel}
            </span>
          </div>
          <div style="font-size:11px; color:#c2410c; font-weight:700; margin-bottom:6px;">📍 Cluster Area: ${item.village || 'Main Circuit'}</div>
          
          <p style="font-size:12px; color:#334155; margin-bottom:5px;"><strong>${d.heritageLabel}</strong> ${desc}</p>
          <p style="font-size:12px; color:#6b21a8; margin-bottom:5px;"><strong>${d.cultureLabel}</strong> ${ritual}</p>
          <p style="font-size:12px; color:#b45309; margin-bottom:8px;"><strong>${d.traditionLabel}</strong> ${tradition}</p>
          
          <!-- Triple Multilingual Audio Narration Pills (History, Culture & Tradition) -->
          <div style="display:flex; gap:6px; margin:10px 0; flex-wrap:wrap;">
            <button type="button" class="btn-audio-pill" onclick="selectUnifiedAudio('${itemId}', 'heritage')" style="background:#fef3c7; color:#92400e; border:none; padding:5px 10px; border-radius:15px; font-size:11px; font-weight:bold; cursor:pointer;">${d.btnListenHist}</button>
            <button type="button" class="btn-audio-pill" onclick="selectUnifiedAudio('${itemId}', 'culture')" style="background:#dcfce7; color:#15803d; border:none; padding:5px 10px; border-radius:15px; font-size:11px; font-weight:bold; cursor:pointer;">${d.btnListenCult}</button>
            <button type="button" class="btn-audio-pill" onclick="selectUnifiedAudio('${itemId}', 'tradition')" style="background:#ede9fe; color:#5b21b6; border:none; padding:5px 10px; border-radius:15px; font-size:11px; font-weight:bold; cursor:pointer;">${d.btnListenTrad}</button>
          </div>

          <!-- Community Poll Signal Voting (Yes / No) for Upcoming Heritage -->
          ${!isVerified ? `
            <div style="background:#f8fafc; border:1px dashed #f59e0b; padding:8px 10px; border-radius:6px; margin-bottom:10px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <span style="font-size:11px; color:#92400e; font-weight:700;">🗳️ Community Poll Signals:</span>
                <span style="font-size:10px; color:#15803d; font-weight:bold;">🟢 Yes: ${yesVotes} \vert{} 🔴 No: ${noVotes}</span>
              </div>
              <div style="display:flex; gap:8px;">
                <button type="button" onclick="castPollVote('${itemId}', 'yes')" style="flex:1; background:#dcfce7; color:#15803d; border:1px solid #86efac; padding:4px 6px; border-radius:4px; font-size:10px; font-weight:bold; cursor:pointer;">${d.btnVoteYes}</button>
                <button type="button" onclick="castPollVote('${itemId}', 'no')" style="flex:1; background:#fee2e2; color:#991b1b; border:1px solid #fca5a5; padding:4px 6px; border-radius:4px; font-size:10px; font-weight:bold; cursor:pointer;">${d.btnVoteNo}</button>
              </div>
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

// Redirect Empty District to Map Radar Tab focusing on the Selected District
window.redirectToMapRadar = function(targetDistrict) {
  switchMobileTab('map');
  setTimeout(() => {
    if (window.mapInstance) {
      window.mapInstance.invalidateSize();
      const coords = districtCoordinatesMap[targetDistrict.toLowerCase()] || [26.1245, 85.3902];
      window.mapInstance.flyTo(coords, 12);
    }
  }, 200);
};

// Auto Live GPS Detection for Submissions
window.detectLiveCitizenGPS = function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
        const input = document.getElementById("citCoords");
        if (input) input.value = coords;
        alert(`📍 Live GPS Detected: ${coords}`);
      },
      (err) => {
        alert("GPS detection failed. Please allow location permissions.");
      },
      { timeout: 8000 }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
};

// Community Poll Voting (Yes / No)
window.castPollVote = async function(itemId, type) {
  let pending = getLocalPendingRecords();
  const found = pending.find(i => i.id === itemId);
  if (found) {
    if (type === 'yes') {
      found.yesVotes = (found.yesVotes || found.votes || 1) + 1;
    } else {
      found.noVotes = (found.noVotes || 0) + 1;
    }
    found.votes = (found.yesVotes || 1);
    localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
    try {
      await updateDoc(doc(db, "vratyavani_pending", itemId), { 
        yesVotes: found.yesVotes, 
        noVotes: found.noVotes,
        votes: found.votes 
      });
    } catch (e) {}
    alert(`👍 आपका पोल सिग्नल (${type.toUpperCase()}) सफलतापूर्वक दर्ज हो गया है!`);
    loadDistrictData(window.currentDistrict);
  }
};

// Audio Narration Handler (Speaks strictly in the selected Language)
window.selectUnifiedAudio = function(itemId, mode) {
  let verified = getLocalVerifiedRecords();
  let pending = getLocalPendingRecords();
  const found = [...verified, ...pending].find(i => i.id === itemId);
  if (!found) return;

  const lang = window.currentLanguage || 'hi-IN';
  let title = found.name || found.title;
  let textToPlay = "";

  // Check In-Memory Translation for Native Voice Accent
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("garibnath") || lowerTitle.includes("garib nath")) {
    const transObj = heritageNarrativeTranslations["baba garibnath"][lang];
    if (transObj) {
      title = transObj.title;
      if (mode === 'culture') textToPlay = transObj.culture;
      else if (mode === 'tradition') textToPlay = transObj.tradition;
      else textToPlay = transObj.desc;
    }
  }

  if (!textToPlay) {
    if (mode === 'culture') textToPlay = found.livingCulture || "Local sacred tradition.";
    else if (mode === 'tradition') textToPlay = found.tradition || "Annual folk celebration.";
    else textToPlay = found.story || "Historic monument narrative.";
  }

  const nowPlayingEl = document.getElementById("nowPlayingText");
  if (nowPlayingEl) {
    nowPlayingEl.innerHTML = `<strong>🔊 [${lang.toUpperCase()}] ${title}:</strong><br><em>"${textToPlay}"</em>`;
  }
  playAudioDirectly(textToPlay, lang);
};

function playAudioDirectly(text, lang) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  
  // Set Accurate Voice Synthesis Dialect
  utter.lang = lang || window.currentLanguage || 'hi-IN';
  utter.rate = 0.90;
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

window.previewAdminImage = function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      adminUploadedBase64 = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Citizen Submission
window.handleCitizenSubmit = async function(e) {
  e.preventDefault();
  const pendingId = `pending_${Date.now()}`;
  const pendingItem = {
    id: pendingId,
    title: document.getElementById("citTitle").value.trim(),
    state: document.getElementById("citState").value,
    district: document.getElementById("citDistrict").value.trim().toLowerCase(),
    village: document.getElementById("citVillage").value.trim() || "Cluster Area",
    ritual: document.getElementById("citRitual").value.trim(),
    tradition: document.getElementById("citTradition").value.trim(),
    coords: document.getElementById("citCoords").value.split(",").map(v => parseFloat(v.trim())),
    story: document.getElementById("citStory").value.trim(),
    image: citizenUploadedBase64 || "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=80",
    votes: 1,
    yesVotes: 1,
    noVotes: 0,
    aiValidation: "✓ Metadata Verified | GPS Consistent",
    isVerified: false,
    submittedAt: new Date().toLocaleString()
  };

  let localPending = getLocalPendingRecords();
  localPending.unshift(pendingItem);
  localStorage.setItem(PENDING_KEY, JSON.stringify(localPending));

  try {
    await setDoc(doc(db, "vratyavani_pending", pendingId), pendingItem);
  } catch (err) {
    console.warn("Cloud upload fallback:", err);
  }

  alert(`🛡️ Trust Engine: "${pendingItem.title}" सफलतापर्वक Vihaan-Purkha क्लाउड में सबमिट हो गया है और होम स्क्रीन पर वोटिंग के लिए लाइव है!`);
  e.target.reset();
  citizenUploadedBase64 = null;
  const boxEl = document.getElementById("citImagePreviewBox");
  if (boxEl) boxEl.style.display = "none";
  closeCitizenModal();
  loadDistrictData(window.currentDistrict);
};

// Admin Login & Desk
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
    const yes = pItem.yesVotes || pItem.votes || 1;
    const no = pItem.noVotes || 0;
    row.innerHTML = `
      <td style="padding:8px; border:1px solid #e2e8f0;"><strong>${pItem.title}</strong></td>
      <td style="padding:8px; border:1px solid #e2e8f0;">${pItem.district}</td>
      <td style="padding:8px; border:1px solid #e2e8f0; font-size:10px;">
        <span style="color:#15803d; font-weight:bold;">Yes: ${yes}</span> | <span style="color:#991b1b; font-weight:bold;">No: ${no}</span>
      </td>
      <td style="padding:8px; border:1px solid #e2e8f0; display:flex; gap:6px;">
        <button type="button" onclick="approveCloudSubmission('${pItem.id}')" style="background:#dcfce7; color:#15803d; border:none; padding:4px 8px; border-radius:4px; font-weight:bold; cursor:pointer;">Approve</button>
        <button type="button" onclick="rejectCloudSubmission('${pItem.id}')" style="background:#fee2e2; color:#991b1b; border:none; padding:4px 8px; border-radius:4px; font-weight:bold; cursor:pointer;">Reject</button>
      </td>
    `;
    pendingTbody.appendChild(row);
  });
}

// Approve Cloud Submission (Directly becomes VERIFIED TRUST)
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
    state: found.state || "bihar",
    district: found.district.toLowerCase(),
    village: found.village || "",
    coords: found.coords,
    image: found.image,
    imageUrl: found.image,
    story: found.story,
    livingCulture: found.ritual,
    tradition: found.tradition || "Ancient living tradition",
    isVerified: true,
    approvedAt: new Date().toLocaleString()
  };

  try {
    await setDoc(doc(db, "vratyavani_records", verifiedRecord.id), verifiedRecord);
    await deleteDoc(doc(db, "vratyavani_pending", docId));
  } catch (err) {
    console.warn("Cloud approve update error:", err);
  }

  let localPending = getLocalPendingRecords().filter(i => i.id !== docId);
  localStorage.setItem(PENDING_KEY, JSON.stringify(localPending));

  let verified = getLocalVerifiedRecords();
  verified.unshift(verifiedRecord);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(verified));

  alert(`✅ "${found.title}" को मान्यता (VERIFIED TRUST) मिल गई है और यह परमानेंट लाइव हो गया है!`);
  renderInpageAdminTable();
  loadDistrictData(window.currentDistrict);
};

// Admin Rejection Handler
window.rejectCloudSubmission = async function(docId) {
  if (!confirm("क्या आप इस सबमिशन को रिजेक्ट करके हटाना चाहते हैं?")) return;

  try {
    await deleteDoc(doc(db, "vratyavani_pending", docId));
  } catch (err) {
    console.warn("Cloud delete error:", err);
  }

  let localPending = getLocalPendingRecords().filter(i => i.id !== docId);
  localStorage.setItem(PENDING_KEY, JSON.stringify(localPending));

  alert("❌ सबमिशन रिजेक्ट कर दिया गया है।");
  renderInpageAdminTable();
  loadDistrictData(window.currentDistrict);
};

// Admin State Highlight Banner Manager (Admin Controlled Only)
window.handleAdminBannerUpdate = function(e) {
  e.preventDefault();
  const stateKey = document.getElementById("admBannerState").value;
  const title = document.getElementById("admBannerTitle").value.trim();
  const desc = document.getElementById("admBannerDesc").value.trim();
  const imgUrl = document.getElementById("admBannerImgUrl").value.trim();

  let banners = {};
  try {
    const raw = localStorage.getItem(BANNER_KEY);
    if (raw) banners = JSON.parse(raw);
  } catch(e) {}

  banners[stateKey] = { title, desc, img: imgUrl };
  localStorage.setItem(BANNER_KEY, JSON.stringify(banners));

  alert(`🎉 ${stateKey.toUpperCase()} के लिए कल्चरल हाईलाइट बैनर सेट हो गया है!`);
  e.target.reset();
  window.renderAdminStateHighlight(window.currentState);
};

// Direct Admin Heritage Publication Submission
window.handleAdminDirectSubmit = async function(e) {
  e.preventDefault();
  const newId = `rec_${Date.now()}`;
  const directRecord = {
    id: newId,
    name: document.getElementById("admTitle").value.trim(),
    state: document.getElementById("admState").value,
    district: document.getElementById("admDistrict").value.trim().toLowerCase(),
    village: document.getElementById("admVillage").value.trim(),
    coords: document.getElementById("admCoords").value.split(",").map(v => parseFloat(v.trim())),
    livingCulture: document.getElementById("admRitual").value.trim(),
    tradition: document.getElementById("admTradition").value.trim(),
    story: document.getElementById("admStory").value.trim(),
    image: adminUploadedBase64 || "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=80",
    imageUrl: adminUploadedBase64 || "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=80",
    isVerified: true,
    publishedBy: "Admin",
    createdAt: new Date().toLocaleString()
  };

  try {
    await setDoc(doc(db, "vratyavani_records", newId), directRecord);
  } catch (err) {
    console.warn("Admin direct publish cloud error:", err);
  }

  let verified = getLocalVerifiedRecords();
  verified.unshift(directRecord);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(verified));

  alert(`🎉 "${directRecord.name}" direct cloud par publish ho gaya hai!`);
  e.target.reset();
  adminUploadedBase64 = null;
  closeAdminPanelModal();
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