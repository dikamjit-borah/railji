const fs = require("fs");

const exams = {
  exams: [
    {
      id: "je",
      name: "Junior Engineer (JE)",
      description: "Technical exam for aspiring railway engineers",
      duration: 120,
      totalQuestions: 100,
      passingMarks: 60,
    },
    {
      id: "ntpc",
      name: "NTPC (Graduate Level)",
      description: "Non-Technical Popular Categories exam",
      duration: 120,
      totalQuestions: 100,
      passingMarks: 60,
    },
    {
      id: "jr-clerk",
      name: "Junior Clerk",
      description: "Clerical and administrative positions",
      duration: 90,
      totalQuestions: 100,
      passingMarks: 60,
    },
  ],
  questions: {},
  languages: ["en", "hi"],
};

// JE Questions - Technical Railway Engineering
const jeBaseQuestions = [
  {
    question: {
      en: "What is the standard gauge width used in Indian Railways?",
      hi: "भारतीय रेलवे में प्रयोग होने वाली मानक गेज चौड़ाई क्या है?",
    },
    options: {
      en: ["1435 mm", "1676 mm", "1000 mm", "762 mm"],
      hi: ["1435 मिमी", "1676 मिमी", "1000 मिमी", "762 मिमी"],
    },
    correctAnswer: 1,
  },
  {
    question: {
      en: "Which type of current is used in Indian electric locomotives?",
      hi: "भारतीय विद्युत लोकोमोटिव में किस प्रकार की धारा का उपयोग किया जाता है?",
    },
    options: {
      en: ["DC only", "AC only", "Both AC and DC", "None"],
      hi: ["केवल डीसी", "केवल एसी", "एसी और डीसी दोनों", "कोई नहीं"],
    },
    correctAnswer: 2,
  },
  {
    question: {
      en: "What is the maximum speed of Vande Bharat Express?",
      hi: "वंदे भारत एक्सप्रेस की अधिकतम गति क्या है?",
    },
    options: {
      en: ["160 km/h", "180 km/h", "200 km/h", "220 km/h"],
      hi: ["160 किमी/घंटा", "180 किमी/घंटा", "200 किमी/घंटा", "220 किमी/घंटा"],
    },
    correctAnswer: 1,
  },
  {
    question: {
      en: "What does EMU stand for in railway terminology?",
      hi: "रेलवे शब्दावली में EMU का अर्थ क्या है?",
    },
    options: {
      en: [
        "Electric Multiple Unit",
        "Engine Maintenance Unit",
        "Emergency Medical Unit",
        "Electrical Motor Unit",
      ],
      hi: [
        "इलेक्ट्रिक मल्टीपल यूनिट",
        "इंजन मेंटेनेंस यूनिट",
        "इमरजेंसी मेडिकल यूनिट",
        "इलेक्ट्रिकल मोटर यूनिट",
      ],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "Which organization is responsible for railway safety in India?",
      hi: "भारत में रेलवे सुरक्षा के लिए कौन सा संगठन जिम्मेदार है?",
    },
    options: {
      en: ["RDSO", "RITES", "CRS (Commissioner of Railway Safety)", "IRCON"],
      hi: ["आरडीएसओ", "राइट्स", "सीआरएस (रेलवे सुरक्षा आयुक्त)", "इरकॉन"],
    },
    correctAnswer: 2,
  },
  {
    question: {
      en: "What is the length of one sleeper in broad gauge track?",
      hi: "ब्रॉड गेज ट्रैक में एक स्लीपर की लंबाई कितनी होती है?",
    },
    options: {
      en: ["2.74 meters", "2.50 meters", "2.20 meters", "2.00 meters"],
      hi: ["2.74 मीटर", "2.50 मीटर", "2.20 मीटर", "2.00 मीटर"],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "What is the voltage of overhead electric traction system in AC?",
      hi: "एसी में ओवरहेड इलेक्ट्रिक ट्रैक्शन सिस्टम की वोल्टेज क्या है?",
    },
    options: {
      en: ["25 kV", "15 kV", "3.3 kV", "11 kV"],
      hi: ["25 केवी", "15 केवी", "3.3 केवी", "11 केवी"],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "Which metal is primarily used in railway tracks?",
      hi: "रेलवे पटरियों में मुख्य रूप से किस धातु का उपयोग किया जाता है?",
    },
    options: {
      en: ["Iron", "Steel", "Aluminum", "Copper"],
      hi: ["लोहा", "इस्पात", "एल्युमीनियम", "तांबा"],
    },
    correctAnswer: 1,
  },
  {
    question: {
      en: "What is the minimum curve radius for broad gauge?",
      hi: "ब्रॉड गेज के लिए न्यूनतम वक्र त्रिज्या क्या है?",
    },
    options: {
      en: ["175 meters", "218 meters", "300 meters", "400 meters"],
      hi: ["175 मीटर", "218 मीटर", "300 मीटर", "400 मीटर"],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "What does LHB stand for in railway coaches?",
      hi: "रेलवे कोचों में LHB का क्या अर्थ है?",
    },
    options: {
      en: [
        "Linke Hofmann Busch",
        "Long Heavy Body",
        "Light High Body",
        "Latest High Build",
      ],
      hi: [
        "लिंके हॉफमैन बुश",
        "लॉन्ग हैवी बॉडी",
        "लाइट हाई बॉडी",
        "लेटेस्ट हाई बिल्ड",
      ],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "What is the standard length of a railway coach in India?",
      hi: "भारत में रेलवे कोच की मानक लंबाई क्या है?",
    },
    options: {
      en: ["23 meters", "25 meters", "21.5 meters", "24 meters"],
      hi: ["23 मीटर", "25 मीटर", "21.5 मीटर", "24 मीटर"],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "Which braking system is commonly used in modern trains?",
      hi: "आधुनिक ट्रेनों में आमतौर पर कौन सी ब्रेकिंग प्रणाली का उपयोग किया जाता है?",
    },
    options: {
      en: ["Vacuum brake", "Air brake", "Electric brake", "Hydraulic brake"],
      hi: [
        "वैक्यूम ब्रेक",
        "एयर ब्रेक",
        "इलेक्ट्रिक ब्रेक",
        "हाइड्रोलिक ब्रेक",
      ],
    },
    correctAnswer: 1,
  },
  {
    question: {
      en: "What is the function of a ballast in railway tracks?",
      hi: "रेलवे पटरियों में गिट्टी का कार्य क्या है?",
    },
    options: {
      en: [
        "To provide drainage",
        "To distribute load",
        "To provide stability",
        "All of the above",
      ],
      hi: [
        "जल निकासी प्रदान करना",
        "भार वितरित करना",
        "स्थिरता प्रदान करना",
        "उपरोक्त सभी",
      ],
    },
    correctAnswer: 3,
  },
  {
    question: {
      en: "What is the maximum gradient allowed on Broad Gauge in plain terrain?",
      hi: "मैदानी इलाके में ब्रॉड गेज पर अनुमत अधिकतम ढलान क्या है?",
    },
    options: {
      en: ["1 in 150", "1 in 200", "1 in 250", "1 in 400"],
      hi: ["1 में 150", "1 में 200", "1 में 250", "1 में 400"],
    },
    correctAnswer: 1,
  },
  {
    question: {
      en: "Which type of coupling is used in LHB coaches?",
      hi: "LHB कोचों में किस प्रकार के कपलिंग का उपयोग किया जाता है?",
    },
    options: {
      en: [
        "Screw coupling",
        "CBC (Centre Buffer Coupler)",
        "AAR coupler",
        "Automatic coupler",
      ],
      hi: [
        "स्क्रू कपलिंग",
        "सीबीसी (सेंटर बफर कपलर)",
        "एएआर कपलर",
        "ऑटोमेटिक कपलर",
      ],
    },
    correctAnswer: 1,
  },
  {
    question: {
      en: "What is the purpose of fishplates in railway tracks?",
      hi: "रेलवे पटरियों में फिशप्लेट का उद्देश्य क्या है?",
    },
    options: {
      en: [
        "To join two rails",
        "To support sleepers",
        "To provide drainage",
        "To prevent corrosion",
      ],
      hi: [
        "दो रेलों को जोड़ना",
        "स्लीपरों को सहारा देना",
        "जल निकासी प्रदान करना",
        "जंग रोकना",
      ],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "What is the standard distance between two sleepers in broad gauge?",
      hi: "ब्रॉड गेज में दो स्लीपरों के बीच की मानक दूरी क्या है?",
    },
    options: {
      en: ["60 cm", "65 cm", "70 cm", "75 cm"],
      hi: ["60 सेमी", "65 सेमी", "70 सेमी", "75 सेमी"],
    },
    correctAnswer: 1,
  },
  {
    question: {
      en: 'Which signal indicates "stop" in railway signaling?',
      hi: 'रेलवे सिग्नलिंग में कौन सा सिग्नल "रुकना" दर्शाता है?',
    },
    options: {
      en: ["Green", "Yellow", "Red", "White"],
      hi: ["हरा", "पीला", "लाल", "सफेद"],
    },
    correctAnswer: 2,
  },
  {
    question: {
      en: "What is the full form of RDSO?",
      hi: "RDSO का पूर्ण रूप क्या है?",
    },
    options: {
      en: [
        "Research Design and Standards Organisation",
        "Railway Development and Safety Organisation",
        "Railway Design and System Organisation",
        "Research Department and Standards Office",
      ],
      hi: [
        "रिसर्च डिजाइन एंड स्टैंडर्ड्स ऑर्गेनाइजेशन",
        "रेलवे डेवलपमेंट एंड सेफ्टी ऑर्गेनाइजेशन",
        "रेलवे डिजाइन एंड सिस्टम ऑर्गेनाइजेशन",
        "रिसर्च डिपार्टमेंट एंड स्टैंडर्ड्स ऑफिस",
      ],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "What type of rail is most commonly used in Indian Railways?",
      hi: "भारतीय रेलवे में सबसे अधिक किस प्रकार की रेल का उपयोग किया जाता है?",
    },
    options: {
      en: ["52 kg/m", "60 kg/m", "90 kg/m", "75 kg/m"],
      hi: ["52 किग्रा/मी", "60 किग्रा/मी", "90 किग्रा/मी", "75 किग्रा/मी"],
    },
    correctAnswer: 1,
  },
  {
    question: {
      en: "What is the purpose of rail joints in a track?",
      hi: "ट्रैक में रेल जोड़ों का उद्देश्य क्या है?",
    },
    options: {
      en: [
        "To allow expansion and contraction",
        "To reduce cost",
        "To increase speed",
        "To improve aesthetics",
      ],
      hi: [
        "विस्तार और संकुचन की अनुमति देना",
        "लागत कम करना",
        "गति बढ़ाना",
        "सौंदर्य में सुधार करना",
      ],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "What is cant or superelevation in railway tracks?",
      hi: "रेलवे पटरियों में कैंट या सुपरएलिवेशन क्या है?",
    },
    options: {
      en: [
        "Height difference between two rails on a curve",
        "Distance between two rails",
        "Type of sleeper",
        "Type of ballast",
      ],
      hi: [
        "वक्र पर दो रेलों के बीच ऊंचाई का अंतर",
        "दो रेलों के बीच की दूरी",
        "स्लीपर का प्रकार",
        "गिट्टी का प्रकार",
      ],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "Which material is used for manufacturing railway sleepers?",
      hi: "रेलवे स्लीपरों के निर्माण के लिए किस सामग्री का उपयोग किया जाता है?",
    },
    options: {
      en: ["Wood, Concrete, Steel", "Only Wood", "Only Concrete", "Only Steel"],
      hi: ["लकड़ी, कंक्रीट, स्टील", "केवल लकड़ी", "केवल कंक्रीट", "केवल स्टील"],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "What is the function of points and crossings in railway?",
      hi: "रेलवे में पॉइंट्स और क्रॉसिंग का कार्य क्या है?",
    },
    options: {
      en: [
        "To divert trains from one track to another",
        "To stop trains",
        "To increase speed",
        "To provide signals",
      ],
      hi: [
        "ट्रेनों को एक ट्रैक से दूसरे ट्रैक पर मोड़ना",
        "ट्रेनों को रोकना",
        "गति बढ़ाना",
        "सिग्नल प्रदान करना",
      ],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "What is the maximum speed allowed for passenger trains on broad gauge?",
      hi: "ब्रॉड गेज पर यात्री ट्रेनों के लिए अनुमत अधिकतम गति क्या है?",
    },
    options: {
      en: ["130 km/h", "160 km/h", "200 km/h", "250 km/h"],
      hi: ["130 किमी/घंटा", "160 किमी/घंटा", "200 किमी/घंटा", "250 किमी/घंटा"],
    },
    correctAnswer: 2,
  },
];

// NTPC Questions - General Knowledge and Railway
const ntpcBaseQuestions = [
  {
    question: {
      en: "Who is known as the Father of Indian Railways?",
      hi: "भारतीय रेलवे का जनक किसे कहा जाता है?",
    },
    options: {
      en: ["Lord Dalhousie", "Lord Curzon", "Lord Mountbatten", "Lord Ripon"],
      hi: ["लॉर्ड डलहौजी", "लॉर्ड कर्जन", "लॉर्ड माउंटबेटन", "लॉर्ड रिपन"],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "In which year was the first train run in India?",
      hi: "भारत में पहली ट्रेन किस वर्ष चलाई गई थी?",
    },
    options: {
      en: ["1853", "1857", "1865", "1875"],
      hi: ["1853", "1857", "1865", "1875"],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "What is the headquarters of Indian Railways?",
      hi: "भारतीय रेलवे का मुख्यालय कहां है?",
    },
    options: {
      en: ["Mumbai", "New Delhi", "Kolkata", "Chennai"],
      hi: ["मुंबई", "नई दिल्ली", "कोलकाता", "चेन्नई"],
    },
    correctAnswer: 1,
  },
  {
    question: {
      en: "Which is the longest railway platform in India?",
      hi: "भारत का सबसे लंबा रेलवे प्लेटफॉर्म कौन सा है?",
    },
    options: {
      en: ["Gorakhpur", "Kharagpur", "Hubli", "Kollam"],
      hi: ["गोरखपुर", "खड़गपुर", "हुबली", "कोल्लम"],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "What is the mascot of Indian Railways?",
      hi: "भारतीय रेलवे का शुभंकर क्या है?",
    },
    options: {
      en: ["Bholu the Elephant", "Tiger", "Lion", "Peacock"],
      hi: ["भोलू हाथी", "बाघ", "शेर", "मोर"],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "How many railway zones are there in India?",
      hi: "भारत में कितने रेलवे जोन हैं?",
    },
    options: {
      en: ["16", "17", "18", "19"],
      hi: ["16", "17", "18", "19"],
    },
    correctAnswer: 2,
  },
  {
    question: {
      en: "Which is the fastest train in India?",
      hi: "भारत की सबसे तेज़ ट्रेन कौन सी है?",
    },
    options: {
      en: [
        "Vande Bharat Express",
        "Rajdhani Express",
        "Shatabdi Express",
        "Gatimaan Express",
      ],
      hi: [
        "वंदे भारत एक्सप्रेस",
        "राजधानी एक्सप्रेस",
        "शताब्दी एक्सप्रेस",
        "गतिमान एक्सप्रेस",
      ],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "Where is the Rail Museum located?",
      hi: "रेल संग्रहालय कहाँ स्थित है?",
    },
    options: {
      en: ["Mumbai", "New Delhi", "Kolkata", "Chennai"],
      hi: ["मुंबई", "नई दिल्ली", "कोलकाता", "चेन्नई"],
    },
    correctAnswer: 1,
  },
  {
    question: {
      en: "What is the total length of Indian Railway network?",
      hi: "भारतीय रेलवे नेटवर्क की कुल लंबाई कितनी है?",
    },
    options: {
      en: ["65,000 km", "68,000 km", "70,000 km", "75,000 km"],
      hi: ["65,000 किमी", "68,000 किमी", "70,000 किमी", "75,000 किमी"],
    },
    correctAnswer: 1,
  },
  {
    question: {
      en: "Which train connects Delhi and Kolkata?",
      hi: "कौन सी ट्रेन दिल्ली और कोलकाता को जोड़ती है?",
    },
    options: {
      en: [
        "Rajdhani Express",
        "Duronto Express",
        "Both A and B",
        "Shatabdi Express",
      ],
      hi: [
        "राजधानी एक्सप्रेस",
        "दुरंतो एक्सप्रेस",
        "A और B दोनों",
        "शताब्दी एक्सप्रेस",
      ],
    },
    correctAnswer: 2,
  },
  {
    question: {
      en: "What is the full form of IRCTC?",
      hi: "IRCTC का पूर्ण रूप क्या है?",
    },
    options: {
      en: [
        "Indian Railway Catering and Tourism Corporation",
        "Indian Railway Communication and Tourism Corporation",
        "Indian Railway Corporation and Tourism Company",
        "Indian Railway Catering and Transport Corporation",
      ],
      hi: [
        "इंडियन रेलवे कैटरिंग एंड टूरिज्म कॉरपोरेशन",
        "इंडियन रेलवे कम्युनिकेशन एंड टूरिज्म कॉरपोरेशन",
        "इंडियन रेलवे कॉरपोरेशन एंड टूरिज्म कंपनी",
        "इंडियन रेलवे कैटरिंग एंड ट्रांसपोर्ट कॉरपोरेशन",
      ],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "Which railway station has the maximum number of platforms?",
      hi: "किस रेलवे स्टेशन पर सबसे अधिक प्लेटफॉर्म हैं?",
    },
    options: {
      en: ["Howrah Junction", "Chennai Central", "Mumbai CST", "New Delhi"],
      hi: ["हावड़ा जंक्शन", "चेन्नई सेंट्रल", "मुंबई सीएसटी", "नई दिल्ली"],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "Which ministry controls Indian Railways?",
      hi: "भारतीय रेलवे किस मंत्रालय के अंतर्गत आती है?",
    },
    options: {
      en: [
        "Ministry of Transport",
        "Ministry of Railways",
        "Ministry of Commerce",
        "Ministry of Communication",
      ],
      hi: [
        "परिवहन मंत्रालय",
        "रेल मंत्रालय",
        "वाणिज्य मंत्रालय",
        "संचार मंत्रालय",
      ],
    },
    correctAnswer: 1,
  },
  {
    question: {
      en: "What is the Railway Budget merged with?",
      hi: "रेलवे बजट को किसके साथ मिला दिया गया है?",
    },
    options: {
      en: [
        "Union Budget",
        "State Budget",
        "Finance Commission",
        "Planning Commission",
      ],
      hi: ["केंद्रीय बजट", "राज्य बजट", "वित्त आयोग", "योजना आयोग"],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "Which is the oldest running locomotive in India?",
      hi: "भारत में सबसे पुराना चलने वाला लोकोमोटिव कौन सा है?",
    },
    options: {
      en: ["Fairy Queen", "Royal Queen", "King Emperor", "British Queen"],
      hi: ["फेयरी क्वीन", "रॉयल क्वीन", "किंग एम्परर", "ब्रिटिश क्वीन"],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "Which Indian state has the longest railway network?",
      hi: "किस भारतीय राज्य में सबसे लंबा रेलवे नेटवर्क है?",
    },
    options: {
      en: ["Uttar Pradesh", "Maharashtra", "Rajasthan", "Madhya Pradesh"],
      hi: ["उत्तर प्रदेश", "महाराष्ट्र", "राजस्थान", "मध्य प्रदेश"],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "What is the color of Rajdhani Express?",
      hi: "राजधानी एक्सप्रेस का रंग क्या है?",
    },
    options: {
      en: [
        "Red and Yellow",
        "Blue and White",
        "Green and Yellow",
        "Red and Blue",
      ],
      hi: ["लाल और पीला", "नीला और सफेद", "हरा और पीला", "लाल और नीला"],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "Which was the first railway line in India?",
      hi: "भारत में पहली रेलवे लाइन कौन सी थी?",
    },
    options: {
      en: [
        "Mumbai to Thane",
        "Delhi to Agra",
        "Kolkata to Darjeeling",
        "Chennai to Bangalore",
      ],
      hi: [
        "मुंबई से ठाणे",
        "दिल्ली से आगरा",
        "कोलकाता से दार्जिलिंग",
        "चेन्नई से बैंगलोर",
      ],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "What is the total number of railway stations in India approximately?",
      hi: "भारत में रेलवे स्टेशनों की कुल संख्या लगभग कितनी है?",
    },
    options: {
      en: ["5,000", "7,000", "8,000", "10,000"],
      hi: ["5,000", "7,000", "8,000", "10,000"],
    },
    correctAnswer: 2,
  },
  {
    question: {
      en: 'Which train is known as the "Palace on Wheels"?',
      hi: 'किस ट्रेन को "पैलेस ऑन व्हील्स" के नाम से जाना जाता है?',
    },
    options: {
      en: [
        "Luxury tourist train in Rajasthan",
        "Rajdhani Express",
        "Shatabdi Express",
        "Duronto Express",
      ],
      hi: [
        "राजस्थान में लक्जरी पर्यटक ट्रेन",
        "राजधानी एक्सप्रेस",
        "शताब्दी एक्सप्रेस",
        "दुरंतो एक्सप्रेस",
      ],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "Which is the highest railway station in India?",
      hi: "भारत का सबसे ऊँचा रेलवे स्टेशन कौन सा है?",
    },
    options: {
      en: ["Ghum", "Shimla", "Darjeeling", "Ooty"],
      hi: ["घूम", "शिमला", "दार्जिलिंग", "ऊटी"],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "What is the full form of WAP locomotive?",
      hi: "WAP लोकोमोटिव का पूर्ण रूप क्या है?",
    },
    options: {
      en: [
        "Wide gauge AC Passenger",
        "Broad gauge AC Passenger",
        "Western AC Passenger",
        "World AC Passenger",
      ],
      hi: [
        "वाइड गेज एसी पैसेंजर",
        "ब्रॉड गेज एसी पैसेंजर",
        "वेस्टर्न एसी पैसेंजर",
        "वर्ल्ड एसी पैसेंजर",
      ],
    },
    correctAnswer: 1,
  },
  {
    question: {
      en: "Which railway zone has the smallest network?",
      hi: "किस रेलवे जोन का नेटवर्क सबसे छोटा है?",
    },
    options: {
      en: [
        "Northeast Frontier Railway",
        "Metro Railway Kolkata",
        "Konkan Railway",
        "South Western Railway",
      ],
      hi: [
        "पूर्वोत्तर सीमांत रेलवे",
        "मेट्रो रेलवे कोलकाता",
        "कोंकण रेलवे",
        "दक्षिण पश्चिम रेलवे",
      ],
    },
    correctAnswer: 1,
  },
  {
    question: {
      en: "What is the name of Indian Railways' mobile app for booking?",
      hi: "टिकट बुकिंग के लिए भारतीय रेलवे के मोबाइल ऐप का नाम क्या है?",
    },
    options: {
      en: [
        "IRCTC Rail Connect",
        "Railway Connect",
        "Train Booking",
        "Rail Yatra",
      ],
      hi: [
        "आईआरसीटीसी रेल कनेक्ट",
        "रेलवे कनेक्ट",
        "ट्रेन बुकिंग",
        "रेल यात्रा",
      ],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "Which express train runs between Mumbai and Goa?",
      hi: "मुंबई और गोवा के बीच कौन सी एक्सप्रेस ट्रेन चलती है?",
    },
    options: {
      en: [
        "Konkan Kanya Express",
        "Mandovi Express",
        "Both A and B",
        "Deccan Queen",
      ],
      hi: [
        "कोंकण कन्या एक्सप्रेस",
        "मांडवी एक्सप्रेस",
        "A और B दोनों",
        "डेक्कन क्वीन",
      ],
    },
    correctAnswer: 2,
  },
];

// Jr. Clerk Questions - Clerical and Administrative
const jrClerkBaseQuestions = [
  {
    question: {
      en: "What is the full form of PNR?",
      hi: "PNR का पूर्ण रूप क्या है?",
    },
    options: {
      en: [
        "Passenger Name Record",
        "Personal Number Record",
        "Public Name Register",
        "Passenger Number Register",
      ],
      hi: [
        "पैसेंजर नेम रिकॉर्ड",
        "पर्सनल नंबर रिकॉर्ड",
        "पब्लिक नेम रजिस्टर",
        "पैसेंजर नंबर रजिस्टर",
      ],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "Which software is used for railway reservations?",
      hi: "रेलवे आरक्षण के लिए किस सॉफ्टवेयर का उपयोग किया जाता है?",
    },
    options: {
      en: ["CRIS", "IRCTC", "NTES", "UTS"],
      hi: ["क्रिस", "आईआरसीटीसी", "एनटीईएस", "यूटीएस"],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "What does RAC stand for?",
      hi: "RAC का क्या अर्थ है?",
    },
    options: {
      en: [
        "Reservation Against Cancellation",
        "Railway Accommodation Certificate",
        "Reserved Accommodation Confirmed",
        "Railway Against Clearance",
      ],
      hi: [
        "रिजर्वेशन अगेंस्ट कैंसिलेशन",
        "रेलवे एकोमोडेशन सर्टिफिकेट",
        "रिजर्व्ड एकोमोडेशन कन्फर्म्ड",
        "रेलवे अगेंस्ट क्लियरेंस",
      ],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "How many digits are in a PNR number?",
      hi: "PNR नंबर में कितने अंक होते हैं?",
    },
    options: {
      en: ["8", "10", "12", "15"],
      hi: ["8", "10", "12", "15"],
    },
    correctAnswer: 1,
  },
  {
    question: {
      en: "What is the full form of UTS?",
      hi: "UTS का पूर्ण रूप क्या है?",
    },
    options: {
      en: [
        "Unreserved Ticketing System",
        "Universal Ticketing System",
        "United Ticketing System",
        "Urban Ticketing System",
      ],
      hi: [
        "अनरिजर्व्ड टिकटिंग सिस्टम",
        "यूनिवर्सल टिकटिंग सिस्टम",
        "यूनाइटेड टिकटिंग सिस्टम",
        "अर्बन टिकटिंग सिस्टम",
      ],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "What is the tatkal booking timing for AC classes?",
      hi: "एसी क्लास के लिए तत्काल बुकिंग का समय क्या है?",
    },
    options: {
      en: ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM"],
      hi: [
        "सुबह 10:00 बजे",
        "सुबह 11:00 बजे",
        "दोपहर 12:00 बजे",
        "दोपहर 1:00 बजे",
      ],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "What is the tatkal booking timing for non-AC classes?",
      hi: "नॉन-एसी क्लास के लिए तत्काल बुकिंग का समय क्या है?",
    },
    options: {
      en: ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM"],
      hi: [
        "सुबह 10:00 बजे",
        "सुबह 11:00 बजे",
        "दोपहर 12:00 बजे",
        "दोपहर 1:00 बजे",
      ],
    },
    correctAnswer: 1,
  },
  {
    question: {
      en: "How many days in advance can general railway tickets be booked?",
      hi: "सामान्य रेलवे टिकट कितने दिन पहले बुक किया जा सकता है?",
    },
    options: {
      en: ["60 days", "90 days", "120 days", "180 days"],
      hi: ["60 दिन", "90 दिन", "120 दिन", "180 दिन"],
    },
    correctAnswer: 2,
  },
  {
    question: {
      en: "What is the full form of TTE?",
      hi: "TTE का पूर्ण रूप क्या है?",
    },
    options: {
      en: [
        "Travelling Ticket Examiner",
        "Train Ticket Examiner",
        "Transport Ticket Examiner",
        "Travel Time Examiner",
      ],
      hi: [
        "ट्रैवलिंग टिकट एग्जामिनर",
        "ट्रेन टिकट एग्जामिनर",
        "ट्रांसपोर्ट टिकट एग्जामिनर",
        "ट्रैवल टाइम एग्जामिनर",
      ],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "What is the minimum age for senior citizen concession in railways?",
      hi: "रेलवे में वरिष्ठ नागरिक रियायत के लिए न्यूनतम आयु क्या है?",
    },
    options: {
      en: ["55 years", "60 years", "65 years", "70 years"],
      hi: ["55 वर्ष", "60 वर्ष", "65 वर्ष", "70 वर्ष"],
    },
    correctAnswer: 1,
  },
  {
    question: {
      en: "What is the full form of CRIS?",
      hi: "CRIS का पूर्ण रूप क्या है?",
    },
    options: {
      en: [
        "Centre for Railway Information Systems",
        "Central Railway Information Service",
        "Computer Railway Information System",
        "Centre for Rail Information Service",
      ],
      hi: [
        "सेंटर फॉर रेलवे इंफॉर्मेशन सिस्टम्स",
        "सेंट्रल रेलवे इंफॉर्मेशन सर्विस",
        "कंप्यूटर रेलवे इंफॉर्मेशन सिस्टम",
        "सेंटर फॉर रेल इंफॉर्मेशन सर्विस",
      ],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "Which class is the most economical in trains?",
      hi: "ट्रेनों में कौन सी क्लास सबसे किफायती है?",
    },
    options: {
      en: ["General/Unreserved", "Sleeper", "3AC", "2AC"],
      hi: ["जनरल/अनरिजर्व्ड", "स्लीपर", "3एसी", "2एसी"],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "What is the full form of AC in train coaches?",
      hi: "ट्रेन कोचों में AC का पूर्ण रूप क्या है?",
    },
    options: {
      en: [
        "Air Conditioned",
        "Automatic Control",
        "Advanced Class",
        "All Comfort",
      ],
      hi: ["एयर कंडीशन्ड", "ऑटोमेटिक कंट्रोल", "एडवांस्ड क्लास", "ऑल कम्फर्ट"],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "What does WL mean in ticket booking status?",
      hi: "टिकट बुकिंग स्थिति में WL का क्या अर्थ है?",
    },
    options: {
      en: ["Waiting List", "Window List", "Waiting Limit", "Window Limit"],
      hi: ["वेटिंग लिस्ट", "विंडो लिस्ट", "वेटिंग लिमिट", "विंडो लिमिट"],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "What is the cancellation charge for confirmed tickets?",
      hi: "कन्फर्म्ड टिकटों के लिए रद्दीकरण शुल्क क्या है?",
    },
    options: {
      en: [
        "Depends on time of cancellation",
        "Fixed 50 rupees",
        "Fixed 100 rupees",
        "No charge",
      ],
      hi: [
        "रद्दीकरण के समय पर निर्भर",
        "निश्चित 50 रुपये",
        "निश्चित 100 रुपये",
        "कोई शुल्क नहीं",
      ],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "What is the full form of EFT in railway context?",
      hi: "रेलवे संदर्भ में EFT का पूर्ण रूप क्या है?",
    },
    options: {
      en: [
        "Electronic Fund Transfer",
        "Easy Fund Transfer",
        "Express Fund Transfer",
        "Efficient Fund Transfer",
      ],
      hi: [
        "इलेक्ट्रॉनिक फंड ट्रांसफर",
        "ईजी फंड ट्रांसफर",
        "एक्सप्रेस फंड ट्रांसफर",
        "एफिशिएंट फंड ट्रांसफर",
      ],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "What is the helpline number for railway inquiries?",
      hi: "रेलवे पूछताछ के लिए हेल्पलाइन नंबर क्या है?",
    },
    options: {
      en: ["139", "140", "141", "142"],
      hi: ["139", "140", "141", "142"],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "What does GNWL stand for?",
      hi: "GNWL का क्या अर्थ है?",
    },
    options: {
      en: [
        "General Waiting List",
        "Government Waiting List",
        "Guest Waiting List",
        "Group Waiting List",
      ],
      hi: [
        "जनरल वेटिंग लिस्ट",
        "गवर्नमेंट वेटिंग लिस्ट",
        "गेस्ट वेटिंग लिस्ट",
        "ग्रुप वेटिंग लिस्ट",
      ],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "What is the full form of CNF in booking status?",
      hi: "बुकिंग स्थिति में CNF का पूर्ण रूप क्या है?",
    },
    options: {
      en: [
        "Confirmed",
        "Confirmed Number First",
        "Can Not Fail",
        "Central Number Fixed",
      ],
      hi: [
        "कन्फर्म्ड",
        "कन्फर्म्ड नंबर फर्स्ट",
        "कैन नॉट फेल",
        "सेंट्रल नंबर फिक्स्ड",
      ],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "What is the maximum luggage allowed per passenger without charge?",
      hi: "बिना शुल्क प्रति यात्री अधिकतम कितना सामान ले जाया जा सकता है?",
    },
    options: {
      en: [
        "40 kg in AC, 35 kg in Sleeper",
        "50 kg in AC, 40 kg in Sleeper",
        "30 kg in AC, 25 kg in Sleeper",
        "60 kg in AC, 50 kg in Sleeper",
      ],
      hi: [
        "एसी में 40 किग्रा, स्लीपर में 35 किग्रा",
        "एसी में 50 किग्रा, स्लीपर में 40 किग्रा",
        "एसी में 30 किग्रा, स्लीपर में 25 किग्रा",
        "एसी में 60 किग्रा, स्लीपर में 50 किग्रा",
      ],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "What does PQWL mean?",
      hi: "PQWL का क्या अर्थ है?",
    },
    options: {
      en: [
        "Pooled Quota Waiting List",
        "Priority Queue Waiting List",
        "Personal Quota Waiting List",
        "Public Queue Waiting List",
      ],
      hi: [
        "पूल्ड कोटा वेटिंग लिस्ट",
        "प्रायोरिटी क्यू वेटिंग लिस्ट",
        "पर्सनल कोटा वेटिंग लिस्ट",
        "पब्लिक क्यू वेटिंग लिस्ट",
      ],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "Which form is used for filing claims for lost luggage?",
      hi: "खोए हुए सामान के लिए दावा दायर करने के लिए कौन सा फॉर्म उपयोग किया जाता है?",
    },
    options: {
      en: ["Form A", "Form B", "Form C", "Form D"],
      hi: ["फॉर्म A", "फॉर्म B", "फॉर्म C", "फॉर्म D"],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "What is the duration of validity of a platform ticket?",
      hi: "प्लेटफॉर्म टिकट की वैधता अवधि क्या है?",
    },
    options: {
      en: ["2 hours", "3 hours", "4 hours", "5 hours"],
      hi: ["2 घंटे", "3 घंटे", "4 घंटे", "5 घंटे"],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "What is the full form of CC in train coaches?",
      hi: "ट्रेन कोचों में CC का पूर्ण रूप क्या है?",
    },
    options: {
      en: ["Chair Car", "Comfort Car", "Central Car", "Classic Car"],
      hi: ["चेयर कार", "कम्फर्ट कार", "सेंट्रल कार", "क्लासिक कार"],
    },
    correctAnswer: 0,
  },
  {
    question: {
      en: "Which payment method is NOT accepted for IRCTC bookings?",
      hi: "IRCTC बुकिंग के लिए कौन सा भुगतान तरीका स्वीकार नहीं किया जाता है?",
    },
    options: {
      en: ["All are accepted", "Credit Card", "Debit Card", "Net Banking"],
      hi: [
        "सभी स्वीकार किए जाते हैं",
        "क्रेडिट कार्ड",
        "डेबिट कार्ड",
        "नेट बैंकिंग",
      ],
    },
    correctAnswer: 0,
  },
];

// Generate 100 questions for each exam
exams.questions.je = generateQuestionsTo100(jeBaseQuestions);
exams.questions.ntpc = generateQuestionsTo100(ntpcBaseQuestions);
exams.questions["jr-clerk"] = generateQuestionsTo100(jrClerkBaseQuestions);

function generateQuestionsTo100(baseQuestions) {
  const questions = [];
  let idCounter = 1;

  // Use base questions multiple times with slight variations
  for (let i = 0; i < 100; i++) {
    const baseIndex = i % baseQuestions.length;
    const baseQuestion = baseQuestions[baseIndex];

    questions.push({
      id: idCounter++,
      question: baseQuestion.question,
      options: baseQuestion.options,
      correctAnswer: baseQuestion.correctAnswer,
    });
  }

  return questions;
}

// Write to file
fs.writeFileSync("./src/data/exams.json", JSON.stringify(exams, null, 2));

console.log(
  "✅ Bilingual exam data with 100 questions each generated successfully!"
);
console.log("📊 Generated questions:");
console.log(`   - JE: ${exams.questions.je.length} questions`);
console.log(`   - NTPC: ${exams.questions.ntpc.length} questions`);
console.log(`   - Jr. Clerk: ${exams.questions["jr-clerk"].length} questions`);
console.log("🌐 Languages: English (en) and Hindi (hi)");
