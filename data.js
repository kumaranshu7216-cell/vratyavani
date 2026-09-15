/**
 * VratyaVani AI — Accurate Territory & Verified Heritage Dataset
 */

const allIndiaStates = [
  { code: "bihar", name: "Bihar (बिहार)" },
  { code: "up", name: "Uttar Pradesh (उत्तर प्रदेश)" },
  { code: "punjab", name: "Punjab (ਪੰਜਾਬ)" },
  { code: "rajasthan", name: "Rajasthan (राजस्थान)" },
  { code: "mp", name: "Madhya Pradesh (मध्य प्रदेश)" },
  { code: "delhi", name: "Delhi NCR (दिल्ली)" },
  { code: "bengal", name: "West Bengal (पश्चिम बंगाल)" },
  { code: "maharashtra", name: "Maharashtra (महाराष्ट्र)" },
  { code: "gujarat", name: "Gujarat (गुजरात)" },
  { code: "odisha", name: "Odisha (ओडिशा)" },
  { code: "assam", name: "Assam (असम)" },
  { code: "jharkhand", name: "Jharkhand (झारखंड)" },
  { code: "uk", name: "Uttarakhand (उत्तराखंड)" },
  { code: "hp", name: "Himachal Pradesh (हिमाचल)" },
  { code: "jk", name: "Jammu & Kashmir (जम्मू-कश्मीर)" },
  { code: "tamilnadu", name: "Tamil Nadu (तमिलनाडु)" },
  { code: "karnataka", name: "Karnataka (कर्नाटक)" },
  { code: "kerala", name: "Kerala (केरल)" },
  { code: "telangana", name: "Telangana (तेलंगाना)" },
  { code: "ap", name: "Andhra Pradesh (आंध्र प्रदेश)" },
  { code: "haryana", name: "Haryana (हरियाणा)" },
  { code: "chhattisgarh", name: "Chhattisgarh (छत्तीसगढ़)" },
  { code: "goa", name: "Goa (गोवा)" }
];

const heritageData = {
  muzaffarpur: [
    {
      id: "muz_1",
      category: "major",
      state: "bihar",
      district: "muzaffarpur",
      districtName: "Muzaffarpur",
      // Corrected: Purani Bazar / Chhata Chowk
      village: "Purani Bazar (पुरानी बाज़ार)",
      coords: [26.1245, 85.3902],
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
      content: {
        "hi-IN": {
          title: "बाबा गरीबनाथ धाम (Baba Garibnath)",
          desc: "उत्तर बिहार का देवघर माना जाने वाला ऐतिहासिक मनोकामना शिवधाम। पुरानी बाज़ार में स्थित।",
          audio: "बाबा गरीबनाथ धाम मुजफ्फरपुर का आध्यात्मिक हृदय है। जनश्रुति के अनुसार यहाँ स्थापित मनोकामना लिंग भक्तों की हर पुकार सुनता है।"
        },
        "en-IN": {
          title: "Baba Garibnath Dham",
          desc: "Known as the Deoghar of North Bihar, situated at Purani Bazar, historic Shiva pilgrimage.",
          audio: "Welcome to Baba Garibnath Dham, located in Purani Bazar, the spiritual sanctum of Muzaffarpur."
        }
      }
    },
    {
      id: "muz_2",
      category: "gem",
      state: "bihar",
      district: "muzaffarpur",
      districtName: "Muzaffarpur",
      village: "Sikandarpur Lake Sector (सिकंदरपुर झील)",
      coords: [26.1315, 85.3850],
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      content: {
        "hi-IN": {
          title: "सिकंदरपुर झील व बूढ़ी गंडक तट",
          desc: "तिरहुत का प्राचीन प्राकृतिक जल विस्तार और नौकायन का शांत आश्रय स्थल।",
          audio: "सिकंदरपुर जलाशय बूढ़ी गंडक नदी से जुड़ा ऐतिहासिक जल क्षेत्र है।"
        },
        "en-IN": {
          title: "Sikandarpur Lake Waterfront",
          desc: "Scenic eco-heritage waterbody connected to the historic Burhi Gandak river.",
          audio: "Sikandarpur lake is an eco-cultural waterbody in Tirhut."
        }
      }
    }
  ],
  patna: [
    {
      id: "pat_1",
      category: "major",
      state: "bihar",
      district: "patna",
      districtName: "Patna",
      village: "Kumhrar Heritage Zone (कुम्रहार)",
      coords: [25.5992, 85.1843],
      image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
      content: {
        "hi-IN": {
          title: "कुम्रहार - 80 स्तंभों वाला मौर्य राजप्रसाद",
          desc: "सम्राट चंद्रगुप्त मौर्य और अशोक के विशाल पाटलिपुत्र साम्राज्य के पुरातात्विक अवशेष।",
          audio: "कुम्रहार प्राचीन पाटलिपुत्र का वह भव्य पुरातात्विक केंद्र है जहाँ कभी मौर्य साम्राज्य की संसद हुआ करती थी।"
        },
        "en-IN": {
          title: "Kumhrar - 80-Pillared Mauryan Hall",
          desc: "Ruins of the imperial assembly hall of the Mauryan Empire in Pataliputra.",
          audio: "Kumhrar holds the ancient ruins of the 80-pillared throne hall."
        }
      }
    }
  ],
  varanasi: [
    {
      id: "var_1",
      category: "major",
      state: "up",
      district: "varanasi",
      districtName: "Varanasi",
      village: "Dashashwamedh Ghat (दशाश्वमेध घाट)",
      coords: [25.3109, 83.0107],
      image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
      content: {
        "hi-IN": {
          title: "काशी विश्वनाथ कॉरिडोर एवं दशाश्वमेध घाट",
          desc: "संसार की प्राचीनतम जीवंत नगरी का पावन ज्योतिर्लिंग और गंगा महाआरती तट।",
          audio: "काशी विश्वनाथ ज्योतिर्लिंग और मां गंगा का दशाश्वमेध तट सनातन अध्यात्म का शाश्वत प्रकाशपुंज है।"
        },
        "en-IN": {
          title: "Kashi Vishwanath & Dashashwamedh Ghat",
          desc: "Sacred heart of spirituality along the holy banks of Mother Ganga.",
          audio: "Welcome to Kashi, the oldest living cultural capital."
        }
      }
    }
  ],
  amritsar: [
    {
      id: "amr_1",
      category: "major",
      state: "punjab",
      district: "amritsar",
      districtName: "Amritsar",
      village: "Golden Temple Complex (ਹਰਿਮੰਦਰ ਸਾਹਿਬ)",
      coords: [31.6200, 74.8765],
      image: "https://images.unsplash.com/photo-1514222709107-a180c68d72b4?auto=format&fit=crop&w=800&q=80",
      content: {
        "hi-IN": {
          title: "श्री हरमंदिर साहिब (स्वर्ण मंदिर)",
          desc: "सिख पंथ का सर्वोच्च धर्मस्थल, जो विश्व भर में समरसता और अखंड लंगर सेवा का प्रतीक है।",
          audio: "श्री हरमंदिर साहिब पवित्र अमृत सरोवर के मध्य स्थित है, जहाँ गुरुबाणी का अखंड प्रवाह होता है।"
        },
        "en-IN": {
          title: "Sri Harmandir Sahib (Golden Temple)",
          desc: "Supreme spiritual sanctuary of Sikhism, radiating universal equality.",
          audio: "Welcome to Sri Harmandir Sahib, the Golden Temple in Amritsar."
        }
      }
    }
  ]
};