/**
 * VratyaVani AI — Authentic Images, 360 Panorama & Multilingual Dataset
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
      // Baba Garibnath Sanctum Temple Image
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
      view360Url: "https://www.google.com/maps/@26.1209,85.3647,3a,75y,90t/data=!3m8!1e1!3m6!1sAF1QipN!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com!7i13312!8i6656",
      content: {
        "hi-IN": {
          title: "बाबा गरीबनाथ धाम (Baba Garibnath)",
          desc: "उत्तर बिहार का देवघर माना जाने वाला ऐतिहासिक मनोकामना शिवधाम।",
          audio: "बाबा गरीबनाथ धाम मुजफ्फरपुर का आध्यात्मिक हृदय है। जनश्रुति के अनुसार यहाँ स्थापित मनोकामना लिंग भक्तों की हर पुकार सुनता है।"
        },
        "en-IN": {
          title: "Baba Garibnath Dham",
          desc: "Known as the Deoghar of North Bihar, a sacred historic Shiva pilgrimage.",
          audio: "Welcome to Baba Garibnath Dham, the spiritual center of Muzaffarpur, revered for fulfilling devotees' prayers."
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
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      view360Url: "https://www.google.com/maps/@26.1315,85.3850,3a,75y/data=!3m8!1e1",
      content: {
        "hi-IN": {
          title: "सिकंदरपुर झील व बूढ़ी गंडक तट",
          desc: "तिरहुत का प्राचीन प्राकृतिक जल विस्तार और नौकायन का शांत आश्रय स्थल।",
          audio: "सिकंदरपुर जलाशय बूढ़ी गंडक नदी से जुड़ा ऐतिहासिक जल क्षेत्र है, जो शांत नौकायन के लिए प्रसिद्ध है।"
        },
        "en-IN": {
          title: "Sikandarpur Lake Waterfront",
          desc: "Historic waterbody connected to Burhi Gandak, offering scenic boating and tranquility.",
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
      image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
      view360Url: "https://www.google.com/maps/@25.5992,85.1843,3a,75y/data=!3m8!1e1",
      content: {
        "hi-IN": {
          title: "कुम्रहार - 80 स्तंभों वाला मौर्य राजप्रसाद",
          desc: "सम्राट चंद्रगुप्त मौर्य और अशोक के विशाल पाटलिपुत्र साम्राज्य के पुरातात्विक अवशेष।",
          audio: "कुम्रहार प्राचीन पाटलिपुत्र का वह भव्य पुरातात्विक केंद्र है जहाँ कभी मौर्य साम्राज्य की संसद हुआ करती थी।"
        },
        "en-IN": {
          title: "Kumhrar - 80-Pillared Mauryan Hall",
          desc: "Archaeological ruins of the imperial assembly hall of the Mauryan Empire.",
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
      // Authentic Dashashwamedh Ghat Ganga Aarti & Kashi Vishwanath corridor
      image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
      view360Url: "https://www.google.com/maps/@25.3109,83.0107,3a,75y/data=!3m8!1e1",
      content: {
        "hi-IN": {
          title: "काशी विश्वनाथ कॉरिडोर एवं दशाश्वमेध घाट",
          desc: "संसार की प्राचीनतम जीवंत आध्यात्मिक नगरी का पावन ज्योतिर्लिंग और गंगा महाआरती तट।",
          audio: "काशी विश्वनाथ ज्योतिर्लिंग और मां गंगा का दशाश्वमेध तट सनातन अध्यात्म का शाश्वत प्रकाशपुंज है।"
        },
        "en-IN": {
          title: "Kashi Vishwanath & Dashashwamedh Ghat",
          desc: "Timeless sanctum of spirituality along the holy banks of the sacred River Ganga.",
          audio: "Welcome to Kashi, the oldest living spiritual capital of the world, radiating sacred peace on the holy Ganga."
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
      // Authentic Golden Temple Sanctum Image
      image: "https://images.unsplash.com/photo-1514222709107-a180c68d72b4?auto=format&fit=crop&w=800&q=80",
      view360Url: "https://www.google.com/maps/@31.6200,74.8765,3a,75y/data=!3m8!1e1",
      content: {
        "hi-IN": {
          title: "श्री हरमंदिर साहिब (स्वर्ण मंदिर)",
          desc: "सिख पंथ का सर्वोच्च धर्मस्थल, जो विश्व भर में समरसता और अखंड लंगर सेवा का प्रतीक है।",
          audio: "श्री हरमंदिर साहिब पवित्र अमृत सरोवर के मध्य स्थित है, जहाँ गुरुबाणी का अखंड प्रवाह होता है।"
        },
        "en-IN": {
          title: "Sri Harmandir Sahib (Golden Temple)",
          desc: "Supreme spiritual sanctuary of Sikhism, radiating universal brotherhood and equality.",
          audio: "Welcome to Sri Harmandir Sahib, the Golden Temple in Amritsar, welcoming humanity from all walks of life."
        },
        "bho-IN": {
          title: "स्वर्ण मंदिर (हरमंदिर साहिब)",
          desc: "पवित्र अमृत सरोवर के बीच में स्थित सिख धर्म के सबसे पावन धाम।",
          audio: "श्री हरमंदिर साहिब अमृतसर के पावन सरोवर में स्थित बा, जहाँ हर इंसान के प्रेम से स्वागत होखेला।"
        },
        "mai-IN": {
          title: "श्री हरमंदिर साहिब",
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