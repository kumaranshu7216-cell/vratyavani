/**
 * VratyaVani AI — Authentic Heritage & Living Culture Dataset
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
  { code: "jharkhand", name: "Jharkhand (झारखंड)" }
];

const unifiedHeritageCultureData = {
  muzaffarpur: [
    {
      id: "muz_1",
      category: "sacred",
      state: "bihar",
      district: "muzaffarpur",
      districtName: "Muzaffarpur",
      village: "Purani Bazar (पुरानी बाज़ार)",
      coords: [26.1245, 85.3902],
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
      riskScore: "Preserved (Active)",
      riskClass: "risk-mod",
      artisanPhone: "919876543210",
      content: {
        "hi-IN": {
          title: "बाबा गरीबनाथ धाम एवं सावन डाक-बम परंपरा",
          heritageDesc: "उत्तर बिहार का देवघर माना जाने वाला तीन शताब्दियों पुराना ऐतिहासिक मनोकामना शिवधाम। पुरानी बाज़ार में स्थित।",
          livingCulture: "सावन मास में पहलेजा घाट (गंगा तट) से 70+ किमी पैदल गंगाजल लाकर जलाभिषेक करने की अखंड 'बोल-बम' लोक-परंपरा।",
          heritageAudio: "बाबा गरीबनाथ धाम मुजफ्फरपुर का ऐतिहासिक आध्यात्मिक केंद्र है। यहाँ स्थापित शिवलिंग मनोकामना लिंग के रूप में ख्यात है।",
          cultureAudio: "सावन के महीने में यहाँ लाखों श्रद्धालु बिना रुके नंगे पाँव डाक-बम बनकर गंगाजल लेकर दौड़ते हैं। यह केवल पूजा नहीं, बल्कि मिथिला और तिरहुत की सामूहिक लोक-आस्था और सांस्कृतिक एकता का महापर्व है।"
        },
        "en-IN": {
          title: "Baba Garibnath Dham & Sawan Dak-Bam Tradition",
          heritageDesc: "300-year-old historic pilgrimage site revered as the sacred sanctum of North Bihar, situated at Purani Bazar.",
          livingCulture: "70km barefoot walking pilgrimage carrying holy Ganga water with non-stop chants of 'Bol-Bam'.",
          heritageAudio: "Welcome to Baba Garibnath Dham, the historical soul of Muzaffarpur, revered for centuries as a sacred Shiva pilgrimage.",
          cultureAudio: "During the holy month of Sawan, thousands of pilgrims walk continuously day and night from the river Ganga to offer holy water, celebrating unbroken living oral chants."
        }
      }
    },
    {
      id: "muz_2",
      category: "nature_craft",
      state: "bihar",
      district: "muzaffarpur",
      districtName: "Muzaffarpur",
      village: "Sikandarpur Lake & Bochaha Cluster",
      coords: [26.1315, 85.3850],
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      riskScore: "Risk: 8.5 (Urgent)",
      riskClass: "risk-high",
      artisanPhone: "919876543210",
      content: {
        "hi-IN": {
          title: "सिकंदरपुर झील एवं सुजनी लोक-कसीदाकारी",
          heritageDesc: "बूढ़ी गंडक नदी से जुड़ा ऐतिहासिक जल विस्तार एवं तिरहुत का प्राकृतिक जल संरक्षण स्थल।",
          livingCulture: "महिलाओं द्वारा चौपालों में लोकगीत गाते हुए पुरानी साड़ियों पर सुई-धागे से सामाजिक गाथाएं काढ़ने की जीआई-टैग्ड सुजनी कला।",
          heritageAudio: "सिकंदरपुर जलाशय प्राचीन समय से तिरहुत के पर्यावरण और नौकायन का मुख्य केंद्र रहा है।",
          cultureAudio: "सुजनी शिल्प मुजफ्फरपुर की माताओं-बहनों की सुई-धागे से लिखी गई कविता है, जिसमें वे अपने जीवन के सुख-दुख और लोक-कथाओं को कपड़ों पर उकेरती हैं।"
        },
        "en-IN": {
          title: "Sikandarpur Lake & Sujani GI Craft Circle",
          heritageDesc: "Historic lake waterfront connected to the Burhi Gandak river in Tirhut.",
          livingCulture: "GI-tagged narrative quilt embroidery hand-woven by rural women while singing folk folklore.",
          heritageAudio: "Sikandarpur lake is an eco-heritage wetland sustaining the biodiversity and history of Tirhut.",
          cultureAudio: "Sujani craft transforms discarded textiles into visual tapestries of folklore, woven collectively by village women circles."
        }
      }
    }
  ],
  patna: [
    {
      id: "pat_1",
      category: "sacred",
      state: "bihar",
      district: "patna",
      districtName: "Patna",
      village: "Kumhrar & Ganga Ghats",
      coords: [25.5992, 85.1843],
      image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
      riskScore: "Preserved Landmark",
      riskClass: "risk-mod",
      content: {
        "hi-IN": {
          title: "कुम्रहार मौर्य राजप्रसाद एवं छठ महापर्व संगम",
          heritageDesc: "सम्राट चंद्रगुप्त मौर्य और अशोक के 80-स्तंभों वाले भव्य मौर्य संसद के पुरातात्विक खंडहर।",
          livingCulture: "गंगा तट पर अस्ताचलगामी एवं उदयीमान सूर्य को अर्घ्य देने का वैदिक लोक-त्योहार छठ और पारंपरिक कोकिला गीत।",
          heritageAudio: "कुम्रहार प्राचीन पाटलिपुत्र का वह भव्य पुरातात्विक केंद्र है जहाँ कभी मौर्य साम्राज्य की संसद हुआ करती थी।",
          cultureAudio: "पाटलिपुत्र की धरती पर गंगा तटों पर आयोजित होने वाला छठ महापर्व प्रकृति, जल और सूर्य के प्रति कृतज्ञता की जीवित वैदिक परंपरा है।"
        },
        "en-IN": {
          title: "Kumhrar Mauryan Assembly & Living Chhath Rituals",
          heritageDesc: "Ruins of the imperial 80-pillared assembly hall of the Mauryan Empire.",
          livingCulture: "Ancient solar worship ritual performed barefoot along the River Ganga with oral folk music.",
          heritageAudio: "Kumhrar holds the monumental architectural ruins of Emperor Ashoka's council hall.",
          cultureAudio: "Along the historic banks of Pataliputra, the living festival of Chhath celebrates direct worship of nature and solar cycles."
        }
      }
    }
  ],
  varanasi: [
    {
      id: "var_1",
      category: "sacred",
      state: "up",
      district: "varanasi",
      districtName: "Varanasi",
      village: "Dashashwamedh Ghat",
      coords: [25.3109, 83.0107],
      // REAL GENUINE DASHASHWAMEDH GHAT & GANGA AARTI IMAGE (NO VAN)
      image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
      riskScore: "Living Vedic Heritage",
      riskClass: "risk-mod",
      content: {
        "hi-IN": {
          title: "काशी विश्वनाथ एवं दशाश्वमेध गंगा महाआरती",
          heritageDesc: "संसार की प्राचीनतम जीवंत आध्यात्मिक नगरी का पावन ज्योतिर्लिंग धाम।",
          livingCulture: "प्रति संध्या शंखनाद, सहस्र दीपकों और संस्कृत वैदिक ऋचाओं के साथ मां गंगा की जीवंत महाआरती।",
          heritageAudio: "काशी विश्वनाथ ज्योतिर्लिंग और दशाश्वमेध घाट भारतीय ज्ञान और अध्यात्म का शाश्वत केंद्र हैं।",
          cultureAudio: "दशाश्वमेध घाट पर होने वाली संध्या गंगा महाआरती तीन हजार वर्षों से अनवरत चल रही जीवित स्तोत्र और दीप-दान परंपरा का अनुपम दर्शन कराती है।"
        },
        "en-IN": {
          title: "Kashi Vishwanath & Living Ganga Maha Aarti",
          heritageDesc: "Ancient sanctum sanctorum in the world's oldest continually inhabited city.",
          livingCulture: "Synchronized fire lamp ceremonies, conch blowing, and unbroken Sanskrit oral chanting every twilight.",
          heritageAudio: "Kashi Vishwanath represents the timeless architectural and spiritual core of Varanasi.",
          cultureAudio: "The evening Ganga Aarti is an unbroken 3,000-year-old living tradition of choreographed fire prayers honoring the sacred river."
        }
      }
    }
  ],
  amritsar: [
    {
      id: "amr_1",
      category: "sacred",
      state: "punjab",
      district: "amritsar",
      districtName: "Amritsar",
      village: "Golden Temple Complex",
      coords: [31.6200, 74.8765],
      image: "https://images.unsplash.com/photo-1514222709107-a180c68d72b4?auto=format&fit=crop&w=800&q=80",
      riskScore: "Universal Living Tradition",
      riskClass: "risk-mod",
      content: {
        "hi-IN": {
          title: "श्री हरमंदिर साहिब एवं गुरु का अटूट लंगर",
          heritageDesc: "अमृत सरोवर के मध्य स्थित सिख पंथ का स्वर्ण मंडित सर्वोच्च ऐतिहासिक धर्मस्थल।",
          livingCulture: "प्रतिदिन 1 लाख से अधिक लोगों को पंगत में बैठाकर भोजन कराने का निःस्वार्थ लंगर एवं 24 घंटे अखंड राग कीर्तन।",
          heritageAudio: "श्री हरमंदिर साहिब पवित्र अमृत सरोवर के मध्य स्थित है, जिसकी नींव संत हज़रत मियां मीर ने रखी थी।",
          cultureAudio: "यहाँ का लंगर और कार-सेवा इस बात का जीवित प्रमाण है कि सच्चा धर्म मानवता, समानता और बिना किसी भेदभाव के निःस्वार्थ सेवा में है।"
        },
        "en-IN": {
          title: "Sri Harmandir Sahib & The Living Langar Tradition",
          heritageDesc: "Monumental Golden Temple nestled in the sacred Amrit Sarovar.",
          livingCulture: "World's largest free community kitchen serving 100,000+ meals daily alongside 24/7 classical raga hymns.",
          heritageAudio: "Sri Harmandir Sahib is the architectural jewel of Amritsar, welcoming humanity from all four directions.",
          cultureAudio: "The living tradition of Langar and Kar-Seva embodies true equality, feeding kings and commoners together on the same floor."
        }
      }
    }
  ]
};