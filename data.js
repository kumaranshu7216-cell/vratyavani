/**
 * VratyaVani AI — Verified Real Heritage & Artisan Database
 */

const heritageData = {
  muzaffarpur: [
    {
      id: "muz_1",
      category: "major",
      state: "bihar",
      district: "muzaffarpur",
      districtName: "Muzaffarpur (Tirhut)",
      coords: [26.1209, 85.3647],
      // Baba Garibnath Real Sanctum Image
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Baba_Garibnath_Temple.jpg/640px-Baba_Garibnath_Temple.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80",
      content: {
        "hi-IN": {
          title: "बाबा गरीबनाथ धाम (Baba Garibnath)",
          desc: "उत्तर बिहार का देवघर माना जाने वाला ऐतिहासिक मनोकामना शिवधाम।",
          audio: "बाबा गरीबनाथ धाम मुजफ्फरपुर का आध्यात्मिक हृदय है। जनश्रुति के अनुसार यहाँ स्थापित मनोकामना लिंग भक्तों की हर पुकार सुनता है।"
        },
        "en-IN": {
          title: "Baba Garibnath Dham",
          desc: "Renowned as the Deoghar of North Bihar, a sacred historic Shiva pilgrimage.",
          audio: "Welcome to Baba Garibnath Dham, the spiritual soul of Muzaffarpur. Revered for fulfilling heartfelt wishes of pilgrims."
        },
        "bho-IN": {
          title: "बाबा गरीबनाथ धाम",
          desc: "उत्तर बिहार के देवघर कहल जाए वाला ई ऐतिहासिक शिव मंदिर ह।",
          audio: "प्रणाम, ई बाबा गरीबनाथ मंदिर के पावन इतिहास ह। मुजफ्फरपुर के ई प्राचीन शिव धाम सभे के मनोकामना पूर्ण करेला।"
        },
        "mai-IN": {
          title: "बाबा गरीबनाथ धाम",
          desc: "उत्तर बिहारक देवघर मानल जायवला ऐतिहासिक मनोकामना शिवधाम।",
          audio: "बाबा गरीबनाथ धाम मुजफ्फरपुरक आध्यात्मिक हृदय थिक। एतय स्थापित शिवलिंग सभक मनोकामना पूर्ण करैत छथि।"
        },
        "pa-IN": {
          title: "ਬਾਬਾ ਗਰੀਬਨਾਥ ਧਾਮ",
          desc: "ਉੱਤਰੀ ਬਿਹਾਰ ਦਾ ਦੇਵਘਰ ਮੰਨਿਆ ਜਾਣ ਵਾਲਾ ਪ੍ਰਾਚੀਨ ਸ਼ਿਵ ਮੰਦਰ।",
          audio: "ਬਾਬਾ ਗਰੀਬਨਾਥ ਧਾਮ ਮੁਜ਼ੱਫਰਪੁਰ ਦਾ ਇਤਿਹਾਸਕ ਅਧਿਆਤਮਿਕ ਕੇਂਦਰ ਹੈ।"
        }
      }
    },
    {
      id: "muz_2",
      category: "gem",
      state: "bihar",
      district: "muzaffarpur",
      districtName: "Muzaffarpur (Tirhut)",
      coords: [26.1315, 85.3850],
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
      content: {
        "hi-IN": {
          title: "सिकंदरपुर झील व बूढ़ी गंडक तट",
          desc: "तिरहुत का प्राचीन प्राकृतिक जल विस्तार और नौकायन का शांत आश्रय स्थल।",
          audio: "सिकंदरपुर जलाशय बूढ़ी गंडक नदी से जुड़ा ऐतिहासिक जल क्षेत्र है, जो शांत नौकायन के लिए प्रसिद्ध है।"
        },
        "en-IN": {
          title: "Sikandarpur Lake & Burhi Gandak",
          desc: "An eco-heritage lake waterfront providing scenic boating and tranquility in Tirhut.",
          audio: "Sikandarpur lake is an eco-cultural waterbody connected to the historic Burhi Gandak river."
        },
        "bho-IN": {
          title: "सिकंदरपुर झील",
          desc: "बूढ़ी गंडक नदी से जुड़ल तिरहुत के प्राकृतिक जल पर्यटन स्थल।",
          audio: "सिकंदरपुर झील मुजफ्फरपुर के बहुत शांत आ खूबसूरत जल क्षेत्र ह।"
        },
        "mai-IN": {
          title: "सिकंदरपुर दह",
          desc: "बूढ़ी गंडकक तट पर स्थित तिरहुतक प्राकृतिक धरोहर।",
          audio: "सिकंदरपुर जलाशय तिरहुतक प्राचीन प्राकृतिक धरोहर थिक।"
        },
        "pa-IN": {
          title: "ਸਿਕੰਦਰਪੁਰ ਝੀਲ",
          desc: "ਇਤਿਹਾਸਕ ਬੂੜ੍ਹੀ ਗੰਡਕ ਨਦੀ ਨਾਲ ਜੁੜੀ ਖੂਬਸੂਰਤ ਝੀਲ।",
          audio: "ਸਿਕੰਦਰਪੁਰ ਝੀਲ ਤਿਰਹੁੱਤ ਦੀ ਇੱਕ ਖੂਬਸੂਰਤ ਕੁਦਰਤੀ ਵਿਰਾਸਤ ਹੈ।"
        }
      }
    },
    {
      id: "muz_3",
      category: "monument",
      state: "bihar",
      district: "muzaffarpur",
      districtName: "Muzaffarpur (Tirhut)",
      coords: [26.1180, 85.3920],
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80",
      content: {
        "hi-IN": {
          title: "अमर शहीद खुदीराम बोस स्मारक",
          desc: "1908 में मात्र 18 वर्ष की आयु में फांसी के फंदे को चूमने वाले अमर बलिदानी का स्मृति स्थल।",
          audio: "11 अगस्त 1908 को मुजफ्फरपुर जेल में क्रांतिकारी खुदीराम बोस ने स्वाधीनता के लिए शहादत दी थी।"
        },
        "en-IN": {
          title: "Khudiram Bose Memorial",
          desc: "Historic memorial honoring the youngest revolutionary freedom fighter executed in 1908.",
          audio: "On 11 August 1908, in Muzaffarpur, 18-year-old Khudiram Bose laid down his life smiling for India's freedom."
        },
        "bho-IN": {
          title: "शहीद खुदीराम बोस स्मारक",
          desc: "भारत के आजादी खातिर मात्र 18 साल में शहादत देवे वाला वीर के स्मृति स्थल।",
          audio: "1908 में मुजफ्फरपुर के धरती पर खुदीराम बोस देश खातिर फांसी के फंदा चूम लिहलें।"
        },
        "mai-IN": {
          title: "खुदीराम बोस स्मारक",
          desc: "मातृभूमिक स्वाधीनता लेल सर्वस्व न्योछावर करयवला युवा क्रांतिकारीक स्मृति स्थल।",
          audio: "मुजफ्फरपुर जेल में 1908 में अमर बलिदानी खुदीराम बोस हँसैत-हँसैत फांसी लगौने छलाह।"
        },
        "pa-IN": {
          title: "ਸ਼ਹੀਦ ਖੁਦੀਰਾਮ ਬੋਸ ਸਮਾਰਕ",
          desc: "ਦੇਸ਼ ਦੀ ਆਜ਼ਾਦੀ ਲਈ 18 ਸਾਲ ਦੀ ਉਮਰ ਵਿੱਚ ਕੁਰਬਾਨ ਹੋਣ ਵਾਲੇ ਅਮਰ ਸ਼ਹੀਦ ਦੀ ਯਾਦਗਾਰ।",
          audio: "ਇਹ ਉਹ ਪਵਿੱਤਰ ਧਰਤੀ ਹੈ ਜਿੱਥੇ ਖੁਦੀਰਾਮ ਬੋਸ ਨੇ ਹੱਸਦੇ-ਹੱਸਦੇ ਸ਼ਹਾਦਤ ਦਿੱਤੀ।"
        }
      }
    },
    {
      id: "muz_4",
      category: "artisan",
      state: "bihar",
      district: "muzaffarpur",
      districtName: "Muzaffarpur (Tirhut)",
      coords: [26.1150, 85.3500],
      image: "https://images.unsplash.com/photo-1607344645866-009c320b5ab8?auto=format&fit=crop&w=600&q=80",
      artisanPhone: "919876543210",
      content: {
        "hi-IN": {
          title: "सुजनी कढ़ाई एवं शाही लीची क्लस्टर",
          desc: "जीआई-टैग्ड सुजनी हस्तशिल्प और विश्व प्रसिद्ध मुजफ्फरपुर शाही लीची उत्पाद।",
          audio: "सुजनी शिल्प मुजफ्फरपुर के ग्रामीण अंचलों की माताओं-बहनों की सुई-धागे से गढ़ी गई अमर लोककला है।"
        },
        "en-IN": {
          title: "Sujani Embroidery & Shahi Litchi Cluster",
          desc: "GI-tagged rural needlecraft and world-famous Shahi Litchi direct from village weavers.",
          audio: "Sujani is a world-recognized GI-tagged craft, woven with patience and love by local artisans."
        },
        "bho-IN": {
          title: "सुजनी शिल्प क्लस्टर",
          desc: "जीआई-टैग पावल सुजनी कला आ लीची उत्पाद सीधे शिल्पी लोगन से खरीदीं।",
          audio: "सुजनी शिल्प तिरहुत के माई-बहिन लोगन के सुई-धागा से बनल पारंपरिक कला ह।"
        },
        "mai-IN": {
          title: "सुजनी कसीदाकारी कारीगर",
          desc: "जीआई टैग प्राप्त सुजनी हस्तशिल्प सीधे ग्रामीण महिला शिल्पी सं प्राप्त करू।",
          audio: "सुजनी शिल्प मुजफ्फरपुरक घर-घरक पारम्परिक सुई-धागाक अमर लोककला थिक।"
        },
        "pa-IN": {
          title: "ਸੁਜਨੀ ਦਸਤਕਾਰੀ ਕਲੱਸਟਰ",
          desc: "ਜੀ.ਆਈ. ਟੈਗ ਪ੍ਰਾਪਤ ਹੱਥੀਂ ਬੁਣਾਈ ਅਤੇ ਸ਼ਾਹੀ ਲੀਚੀ ਦੇ ਸਿੱਧੇ ਕਾਰੀਗਰ।",
          audio: "ਸੁਜਨੀ ਕਲਾ ਤਿਰਹੁੱਤ ਦੀਆਂ ਔਰਤਾਂ ਦੁਆਰਾ ਸੂਈ-ਧਾਗੇ ਨਾਲ ਸਿਰਜੀ ਗਈ ਅਮਰ ਵਿਰਾਸਤ ਹੈ।"
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
      districtName: "Patna (Pataliputra)",
      coords: [25.5992, 85.1843],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Pillared_Hall_Ruins_at_Kumhrar.jpg/640px-Pillared_Hall_Ruins_at_Kumhrar.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80",
      content: {
        "hi-IN": {
          title: "कुम्रहार - 80 स्तंभों वाला मौर्य राजप्रसाद",
          desc: "सम्राट चंद्रगुप्त मौर्य और अशोक के विशाल पाटलिपुत्र साम्राज्य के पुरातात्विक अवशेष।",
          audio: "कुम्रहार प्राचीन पाटलिपुत्र का वह भव्य पुरातात्विक केंद्र है जहाँ कभी मौर्य साम्राज्य की संसद हुआ करती थी।"
        },
        "en-IN": {
          title: "Kumhrar - 80-Pillared Mauryan Hall",
          desc: "Excavation site of the monumental imperial assembly hall of Emperor Ashoka.",
          audio: "Kumhrar holds the ancient ruins of the 80-pillared throne hall of the Mauryan Empire in Pataliputra."
        },
        "bho-IN": {
          title: "कुम्रहार - मौर्य साम्राज्य के खंडहर",
          desc: "सम्राट अशोक आ चंद्रगुप्त मौर्य के 80 खंभा वाला राजदरबार के अवशेष।",
          audio: "कुम्रहार में मौर्य राजवंश के भव्य राजमहल के पुरातात्विक सबूत मिलेला।"
        },
        "mai-IN": {
          title: "कुम्रहार - प्राचीन पाटलिपुत्र",
          desc: "सम्राट अशोकक 80 स्तंभक राजप्रसादक पुरातात्विक अवशेष।",
          audio: "कुम्रहार प्राचीन पाटलिपुत्रक ओ ऐतिहासिक स्थल थिक जतय मौर्य साम्राज्यक सभा छल।"
        },
        "pa-IN": {
          title: "ਕੁਮਰਹਾਰ - ਮੌਰੀਆ ਦਰਬਾਰ",
          desc: "ਸਮਰਾਟ ਅਸ਼ੋਕ ਦੇ 80 ਖੰਭਿਆਂ ਵਾਲੇ ਵਿਸ਼ਾਲ ਮੌਰੀਆ ਦਰਬਾਰ ਦੇ ਖੰਡਰ।",
          audio: "ਕੁਮਰਹਾਰ ਪੁਰਾਤਨ ਪਾਟਲੀਪੁਤਰ ਦਾ ਇਤਿਹਾਸਕ ਪ੍ਰਤੀਕ ਹੈ।"
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
      districtName: "Varanasi (Kashi)",
      coords: [25.3109, 83.0107],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Ahilya_Ghat_by_the_Ganges%2C_Varanasi.jpg/640px-Ahilya_Ghat_by_the_Ganges%2C_Varanasi.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80",
      content: {
        "hi-IN": {
          title: "काशी विश्वनाथ कॉरिडोर एवं दशाश्वमेध घाट",
          desc: "संसार की प्राचीनतम जीवंत नगरी का पावन ज्योतिर्लिंग और गंगा महाआरती तट।",
          audio: "काशी विश्वनाथ ज्योतिर्लिंग और मां गंगा का दशाश्वमेध तट सनातन अध्यात्म का शाश्वत प्रकाशपुंज है।"
        },
        "en-IN": {
          title: "Kashi Vishwanath & Dashashwamedh Ghat",
          desc: "The timeless heart of spirituality along the sacred banks of Mother Ganga.",
          audio: "Welcome to Kashi, the oldest living spiritual capital of the world, radiating sacred peace on the Ganga."
        },
        "bho-IN": {
          title: "काशी विश्वनाथ आ दशाश्वमेध घाट",
          desc: "भगवान शिव के पावन ज्योतिर्लिंग आ गंगा मइया के भव्य आरती के धाम।",
          audio: "काशी विश्वनाथ मंदिर गंगा किनारे बसल दुनिया के सबसे पुरान आध्यात्मिक नगरी ह।"
        },
        "mai-IN": {
          title: "काशी विश्वनाथ धाम",
          desc: "संसारक प्राचीनतम आध्यात्मिक नगरीक ज्योतिर्लिंग एवं महाआरती घाट।",
          audio: "काशी विश्वनाथ आ दशाश्वमेध घाट भारतीय ज्ञान परंपराक संगम थिक।"
        },
        "pa-IN": {
          title: "ਕਾਸ਼ੀ ਵਿਸ਼ਵਨਾਥ ਕੋਰੀਡੋਰ",
          desc: "ਗੰਗਾ ਕੰਢੇ ਸਥਿਤ ਦੁਨੀਆ ਦੀ ਸਭ ਤੋਂ ਪੁਰਾਣੀ ਅਧਿਆਤਮਿਕ ਨਗਰੀ ਦਾ ਕੇਂਦਰ।",
          audio: "ਕਾਸ਼ੀ ਵਿਸ਼ਵਨਾਥ ਅਤੇ ਦਸ਼ਾਸ਼ਵਮੇਧ ਘਾਟ ਸਦੀਵੀ ਸ਼ਾਂਤੀ ਦਾ ਪ੍ਰਤੀਕ ਹਨ।"
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
      coords: [31.6200, 74.8765],
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/The_Golden_Temple_of_Amritsar%2C_Punjab_%28India%29.jpg/640px-The_Golden_Temple_of_Amritsar%2C_Punjab_%28India%29.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1514222709107-a180c68d72b4?auto=format&fit=crop&w=600&q=80",
      content: {
        "hi-IN": {
          title: "श्री हरमंदिर साहिब (स्वर्ण मंदिर)",
          desc: "सिख पंथ का सर्वोच्च धर्मस्थल, जो विश्व भर में समरसता और अखंड लंगर सेवा का प्रतीक है।",
          audio: "श्री हरमंदिर साहिब पवित्र अमृत सरोवर के मध्य स्थित है, जहाँ गुरुबाणी का अखंड प्रवाह होता है।"
        },
        "en-IN": {
          title: "Sri Harmandir Sahib (Golden Temple)",
          desc: "The supreme spiritual sanctuary of Sikhism, radiating universal equality and peace.",
          audio: "Welcome to Sri Harmandir Sahib, the Golden Temple in Amritsar, open to humanity across all walks of life."
        },
        "bho-IN": {
          title: "स्वर्ण मंदिर (हरमंदिर साहिब)",
          desc: "पवित्र अमृत सरोवर के बीच में स्थित सिख धर्म के सबसे पावन धाम।",
          audio: "श्री हरमंदिर साहिब अमृतसर के पावन सरोवर में स्थित बा, जहाँ हर इंसान के प्रेम से स्वागत होखेला।"
        },
        "mai-IN": {
          title: "श्री हरमंदिर साहिਬ",
          desc: "अमृत सरोवरक मध्य स्थित सिख पंथक सर्वोच्च पावन धर्मस्थल।",
          audio: "श्री हरमंदिर साहिब समरसता आ अखण्ड लंगरक अनुपम वैश्विक प्रतीक थिक।"
        },
        "pa-IN": {
          title: "ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ (ਸਵਰਨ ਮੰਦਰ)",
          desc: "ਸਿੱਖ ਕੌਮ ਦਾ ਸਰਵਉੱਚ ਰੂਹਾਨੀ ਕੇਂਦਰ, ਜਿੱਥੇ ਅੰਮ੍ਰਿਤ ਸਰੋਵਰ ਵਿੱਚ ਗੁਰਬਾਣੀ ਦਾ ਪ੍ਰਵਾਹ ਹੁੰਦਾ ਹੈ।",
          audio: "ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ ਅੰਮ੍ਰਿਤਸਰ ਵਿਖੇ ਸਥਿਤ ਸਮੁੱਚੀ ਮਾਨਵਤਾ ਲਈ ਸਾਂਝੀਵਾਲਤਾ ਦਾ ਅਦੁੱਤੀ ਪ੍ਰਤੀਕ ਹੈ।"
        }
      }
    }
  ]
};