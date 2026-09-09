/* ==========================================================================
   Shiplystic Prarthana - Temple & Package Database (Expanded Services)
   ========================================================================== */

const TEMPLE_DATA = [
  {
    id: "mahakaleshwar-ujjain",
    name: "Shri Mahakaleshwar",
    deity: "Lord Shiva / Mahakal",
    location: "Ujjain, Madhya Pradesh",
    tag: "Jyotirlinga",
    image: "../images/temples/mahakaleshwar-ujjain.jpg",
    rating: "4.9 ★ (12,450+ Bookings)",
    basePrice: 1999,
    packages: [
      {
        id: "maka-standard",
        name: "Shri Mahakaleshwar Prarthana Package",
        price: 1999,
        popular: true,
        features: [
          "Temple Puja performed by Temple's own Priests",
          "₹501 Passed directly as Temple Donation",
          "Official Receipt & Proof Shared by Temple",
          "Maha Prasad Hygienically Sealed & Packed",
          "Multi-Carrier Doorstep Delivery via Shiplystic"
        ]
      }
    ],
    description: "Shri Mahakaleshwar of Ujjain is a sacred Jyotirlinga shrine. Pujas are performed directly by temple priests, followed by direct donation pass-through and secure prasad delivery."
  },
  {
    id: "kashi-vishwanath",
    name: "Shri Kashi Vishwanath",
    deity: "Lord Shiva",
    location: "Varanasi, Uttar Pradesh",
    tag: "Jyotirlinga",
    image: "../images/temples/kashi-vishwanath.jpg",
    rating: "4.9 ★ (18,300+ Bookings)",
    basePrice: 1999,
    packages: [
      {
        id: "kashi-standard",
        name: "Shri Kashi Vishwanath Prarthana Package",
        price: 1999,
        popular: true,
        features: [
          "Sugam Darshan & Rudrabhishek Prayers by Temple Priests",
          "₹501 Passed directly as Temple Donation",
          "Official Receipt & Confirmation Shared",
          "Authentic Kashi Sacred Prasad & Vibhuti Box",
          "Multi-Carrier Logistics Doorstep Delivery"
        ]
      }
    ],
    description: "Sacred Jyotirlinga on the banks of holy Ganga in Kashi. Includes ₹501 direct donation, official receipt, sacred Ganga jal & prasad, and doorstep delivery."
  },
  {
    id: "somnath",
    name: "Shri Somnath Temple",
    deity: "Lord Shiva / Someshwar",
    location: "Veraval, Gujarat",
    tag: "Jyotirlinga",
    image: "../images/temples/somnath.jpg",
    rating: "4.9 ★ (11,800+ Bookings)",
    basePrice: 1999,
    packages: [
      {
        id: "somnath-standard",
        name: "Shri Somnath Prarthana Package",
        price: 1999,
        popular: true,
        features: [
          "First Among 12 Jyotirlingas Rituals by Temple Priests",
          "₹501 Passed directly as Temple Donation",
          "Official Receipt & Proof Shared",
          "Maha Prasad & Holy Bhasma Box",
          "Shiplystic Multi-Carrier Express Delivery"
        ]
      }
    ],
    description: "The premier Jyotirlinga located at Triveni Sangam in Veraval. Rituals performed by official temple priests with direct donation pass-through."
  },
  {
    id: "kedarnath",
    name: "Shri Kedarnath Dham",
    deity: "Lord Shiva / Kedar",
    location: "Rudraprayag, Uttarakhand",
    tag: "Jyotirlinga",
    image: "../images/temples/kedarnath.jpg",
    rating: "4.9 ★ (16,500+ Bookings)",
    basePrice: 1999,
    packages: [
      {
        id: "kedar-standard",
        name: "Shri Kedarnath Prarthana Package",
        price: 1999,
        popular: true,
        features: [
          "Sacred Himalayan Jyotirlinga Puja by Temple Priests",
          "₹501 Passed directly as Temple Donation",
          "Official Confirmation & Receipt",
          "Blessed Himalayan Dry Fruit Prasad Box",
          "Doorstep Express Delivery via Shiplystic"
        ]
      }
    ],
    description: "Revered Himalayan Shiva sanctum. Pujas conducted directly by shrine priests with full transparency and doorstep prasad delivery."
  },
  {
    id: "omkareshwar",
    name: "Shri Omkareshwar",
    deity: "Lord Shiva",
    location: "Khandwa District, Madhya Pradesh",
    tag: "Jyotirlinga",
    image: "../images/temples/omkareshwar.jpg",
    rating: "4.8 ★ (8,900+ Bookings)",
    basePrice: 1999,
    packages: [
      {
        id: "om-standard",
        name: "Shri Omkareshwar Prarthana Package",
        price: 1999,
        popular: true,
        features: [
          "Rituals conducted by Omkareshwar Temple Priests",
          "₹501 Passed directly as Temple Donation",
          "Official Receipt & Video Proof Shared",
          "Maha Prasad Packed for Secure Transit",
          "Shiplystic Multi-Carrier Doorstep Delivery"
        ]
      }
    ],
    description: "Located on the Narmada River island, Omkareshwar Jyotirlinga pujas are facilitated through official booking, donation pass-through, and doorstep prasad dispatch."
  },
  {
    id: "vaishno-devi",
    name: "Mata Vaishno Devi Shrine",
    deity: "Goddess Vaishno Devi / Durga",
    location: "Katra, Jammu & Kashmir",
    tag: "Shakti Peeth",
    image: "../images/temples/vaishno-devi.jpg",
    rating: "4.9 ★ (22,100+ Bookings)",
    basePrice: 1999,
    packages: [
      {
        id: "vaishno-standard",
        name: "Mata Vaishno Devi Prarthana Package",
        price: 1999,
        popular: true,
        features: [
          "Holy Cave Chunt & Aarti Rituals by Shrine Priests",
          "₹501 Passed directly as Temple Donation",
          "Official Board Receipt & Proof Shared",
          "Blessed Khazana Coins & Maha Prasad Box",
          "Multi-Carrier Express Doorstep Delivery"
        ]
      }
    ],
    description: "Sacred Trikuta mountain shrine of Mata Vaishno Devi. Official donation pass-through and authentic blessed prasad shipped home."
  },
  {
    id: "mahalaxmi-kolhapur",
    name: "Shri Mahalaxmi Temple",
    deity: "Goddess Mahalaxmi / Ambabai",
    location: "Kolhapur, Maharashtra",
    tag: "Shakti Peeth",
    image: "../images/temples/mahalaxmi-kolhapur.jpg",
    rating: "4.9 ★ (15,200+ Bookings)",
    basePrice: 1999,
    packages: [
      {
        id: "laks-standard",
        name: "Shri Mahalaxmi Prarthana Package",
        price: 1999,
        popular: true,
        features: [
          "Kumkumarchana Rituals by Temple Priests",
          "₹501 Passed directly as Temple Donation",
          "Official Temple Receipt & Proof",
          "Blessed Haldi-Kumkum & Maha Prasad",
          "Shiplystic Multi-Carrier Express Delivery"
        ]
      }
    ],
    description: "Shri Ambabai Mahalaxmi Temple of Kolhapur is a revered Shakti Peeth. We facilitate your booking, pass on your ₹501 donation, and ship blessed prasad."
  },
  {
    id: "siddhivinayak-mumbai",
    name: "Shri Siddhivinayak Temple",
    deity: "Lord Ganesha / Siddhivinayak",
    location: "Mumbai, Maharashtra",
    tag: "Major Ganpati Temple",
    image: "../images/temples/siddhivinayak.jpg",
    rating: "4.9 ★ (19,400+ Bookings)",
    basePrice: 1999,
    packages: [
      {
        id: "siddhi-standard",
        name: "Shri Siddhivinayak Prarthana Package",
        price: 1999,
        popular: true,
        features: [
          "Modak Offering & Ganpati Atharvashirsha Avartan by Priests",
          "₹501 Passed directly as Temple Donation",
          "Official Temple Trust Receipt",
          "Authentic Ladoo Prasad & Sacred Angavastra",
          "Shiplystic Express Doorstep Delivery"
        ]
      }
    ],
    description: "Famous Prabhadevi Ganesha shrine in Mumbai. Rituals performed by official temple priests with ₹501 direct donation pass-through."
  },
  {
    id: "sai-baba-shirdi",
    name: "Shri Sai Baba Sansthan",
    deity: "Shri Sai Baba",
    location: "Shirdi, Maharashtra",
    tag: "Sai Temple",
    image: "../images/temples/sai-baba-shirdi.jpg",
    rating: "4.9 ★ (20,100+ Bookings)",
    basePrice: 1999,
    packages: [
      {
        id: "sai-standard",
        name: "Shri Sai Baba Prarthana Package",
        price: 1999,
        popular: true,
        features: [
          "Aarti & Prayers by Sansthan Priests",
          "₹501 Passed directly as Temple Donation",
          "Official Receipt & Confirmation Shared",
          "Authentic Sacred Shirdi Udi & Prasad Box",
          "Multi-Carrier Logistics Doorstep Delivery"
        ]
      }
    ],
    description: "Sansthan rituals performed by Shirdi priests. Includes ₹501 direct donation, official receipt, authentic Udi prasad, and multi-carrier doorstep delivery."
  },
  {
    id: "tirupati-balaji",
    name: "Shri Tirupati Balaji Temple",
    deity: "Lord Venkateswara / Balaji",
    location: "Tirumala, Andhra Pradesh",
    tag: "Revered Shrine",
    image: "../images/temples/tirupati.jpg",
    rating: "4.9 ★ (25,000+ Bookings)",
    basePrice: 1999,
    packages: [
      {
        id: "tiru-standard",
        name: "Shri Tirupati Balaji Prarthana Package",
        price: 1999,
        popular: true,
        features: [
          "Archana & Prayers by Temple Priests",
          "₹501 Passed directly as Temple Donation",
          "Official TTD Board Receipt",
          "Famous Authentic Tirupati Srivari Ladoo Prasad",
          "Temperature & Moisture Controlled Express Logistics"
        ]
      }
    ],
    description: "World famous Tirumala Venkateswara Swamy temple. Includes ₹501 direct donation, receipt, and authentic Tirupati Srivari Ladoo doorstep delivery."
  },
  {
    id: "jagannath-puri",
    name: "Shri Jagannath Temple",
    deity: "Lord Jagannath, Balabhadra & Subhadra",
    location: "Puri, Odisha",
    tag: "Char Dham",
    image: "../images/temples/jagannath-puri.jpg",
    rating: "4.9 ★ (14,100+ Bookings)",
    basePrice: 1999,
    packages: [
      {
        id: "jagan-standard",
        name: "Shri Jagannath Puri Prarthana Package",
        price: 1999,
        popular: true,
        features: [
          "Holy Mahaprasad Rituals by Temple Servitors / Priests",
          "₹501 Passed directly as Temple Donation",
          "Official Receipt & Proof",
          "Authentic Khaja & Nirmalya Maha Prasad Box",
          "Shiplystic Multi-Carrier Doorstep Delivery"
        ]
      }
    ],
    description: "Sacred Char Dham shrine of Lord Jagannath in Puri. Rituals conducted by traditional temple servitors with authentic Mahaprasad delivery."
  },
  {
    id: "dwarkadhish",
    name: "Shri Dwarkadhish Temple",
    deity: "Lord Krishna / Dwarkadhish",
    location: "Dwarka, Gujarat",
    tag: "Char Dham",
    image: "../images/temples/dwarkadhish.jpg",
    rating: "4.8 ★ (10,500+ Bookings)",
    basePrice: 1999,
    packages: [
      {
        id: "dwarka-standard",
        name: "Shri Dwarkadhish Prarthana Package",
        price: 1999,
        popular: true,
        features: [
          "Makhan Mishri Offering & Puja by Shrine Priests",
          "₹501 Passed directly as Temple Donation",
          "Official Receipt & Confirmation",
          "Special Dwarkadhish Sugar Candy Prasad Box",
          "Multi-Carrier Express Doorstep Delivery"
        ]
      }
    ],
    description: "Historic Char Dham kingdom of Lord Krishna in Dwarka. Official donation pass-through and blessed prasad delivery to your home."
  },
  {
    id: "badrinath",
    name: "Shri Badrinath Dham",
    deity: "Lord Vishnu / Badri Narayan",
    location: "Chamoli, Uttarakhand",
    tag: "Char Dham",
    image: "../images/temples/badrinath.jpg",
    rating: "4.9 ★ (13,700+ Bookings)",
    basePrice: 1999,
    packages: [
      {
        id: "badri-standard",
        name: "Shri Badrinath Prarthana Package",
        price: 1999,
        popular: true,
        features: [
          "Vishnu Sahasranama Archana by Temple Priests",
          "₹501 Passed directly as Temple Donation",
          "Official Board Confirmation Receipt",
          "Blessed Badrinath Tulsi & Dry Fruit Prasad",
          "Multi-Carrier Express Delivery"
        ]
      }
    ],
    description: "Sacred Himalayan Vishnu Dham. Facilitated puja bookings with ₹501 direct temple donation pass-through and doorstep prasad delivery."
  },
  {
    id: "rameswaram",
    name: "Shri Ramanathaswamy Temple (Rameswaram)",
    deity: "Lord Shiva / Ramanathaswamy",
    location: "Rameswaram Island, Tamil Nadu",
    tag: "Char Dham",
    image: "../images/temples/rameswaram.jpg",
    rating: "4.9 ★ (14,500+ Bookings)",
    basePrice: 1999,
    packages: [
      {
        id: "rameswaram-standard",
        name: "Shri Rameswaram Char Dham Prarthana Package",
        price: 1999,
        popular: true,
        features: [
          "22 Sacred Theertham Snanam & Sanctum Puja by Priests",
          "₹501 Passed directly as Temple Donation",
          "Official Temple Trust Confirmation & Receipt",
          "Consecrated Vibhuti, Kumkum & Blessed Sweet Prasad",
          "Multi-Carrier Doorstep Express Delivery"
        ]
      }
    ],
    description: "Sacred Southern Char Dham and holy Jyotirlinga sanctum in Rameswaram. Includes ₹501 direct temple donation pass-through and authentic blessed prasad delivery."
  },
  {
    id: "ayodhya-ram-mandir",
    name: "Shri Ram Janmabhoomi Mandir",
    deity: "Lord Ram Lalla",
    location: "Ayodhya, Uttar Pradesh",
    tag: "Sacred Shrine",
    image: "../images/temples/ayodhya.jpg",
    rating: "5.0 ★ (35,000+ Bookings)",
    basePrice: 1999,
    packages: [
      {
        id: "ayodhya-standard",
        name: "Shri Ram Lalla Ayodhya Prarthana Package",
        price: 1999,
        popular: true,
        features: [
          "Special Archana & Bhog Offering by Trust Priests",
          "₹501 Passed directly as Temple Donation",
          "Official Trust Receipt & Confirmation",
          "Blessed Ayodhya Ram Lalla Elaichi Dana & Cardamom Prasad Box",
          "Priority Multi-Carrier Doorstep Delivery"
        ]
      }
    ],
    description: "Divine Shri Ram Janmabhoomi Mandir in Ayodhya. Book your prarthana, pass on ₹501 direct donation, and receive blessed Ayodhya prasad."
  },
  {
    id: "mathura-vrindavan",
    name: "Mathura-Vrindavan Shri Krishna Shrines",
    deity: "Lord Krishna & Radha Rani",
    location: "Mathura & Vrindavan, Uttar Pradesh",
    tag: "Sacred Shrine",
    image: "../images/temples/mathura-vrindavan.jpg",
    rating: "4.9 ★ (21,800+ Bookings)",
    basePrice: 1999,
    packages: [
      {
        id: "mathura-standard",
        name: "Shri Krishna Banke Bihari Prarthana Package",
        price: 1999,
        popular: true,
        features: [
          "Peda Offering & Chappan Bhog Invocations by Priests",
          "₹501 Passed directly as Temple Donation",
          "Official Receipt & Video Proof Shared",
          "Authentic Mathura Peda & Vrindavan Chandan Box",
          "Shiplystic Multi-Carrier Express Delivery"
        ]
      }
    ],
    description: "Sacred birthplace and playland of Lord Krishna in Mathura & Vrindavan. Pujas conducted by traditional goswamis with authentic Peda prasad delivery."
  },
  {
    id: "dagdusheth-ganpati",
    name: "Shreemant Dagdusheth Halwai Ganpati",
    deity: "Lord Ganesha / Dagdusheth Ganpati",
    location: "Pune, Maharashtra",
    tag: "Revered Shrine",
    image: "../images/temples/dagdusheth-ganpati.jpg",
    rating: "5.0 ★ (28,500+ Bookings)",
    basePrice: 1999,
    packages: [
      {
        id: "dagdusheth-standard",
        name: "Shreemant Dagdusheth Ganpati Prarthana Package",
        price: 1999,
        popular: true,
        features: [
          "Atharvashirsha Avartan & Modak Bhog by Trust Priests",
          "₹501 Passed directly as Temple Trust Donation",
          "Official Trust Receipt & Confirmation",
          "Special Dagdusheth Modak & Dry Fruit Maha Prasad Box",
          "Express Temperature-Controlled Delivery"
        ]
      }
    ],
    description: "World-renowned Wish-Fulfilling Ganpati of Pune. Authentic rituals by temple trust priests, direct ₹501 donation pass-through, and blessed Modak prasad doorstep delivery."
  },
  {
    id: "gajanan-maharaj-shegaon",
    name: "Shri Gajanan Maharaj Sansthan, Shegaon",
    deity: "Sant Shri Gajanan Maharaj",
    location: "Shegaon, Buldhana District, Maharashtra",
    tag: "Revered Shrine",
    image: "../images/temples/gajanan-maharaj-shegaon.jpg",
    rating: "4.9 ★ (22,000+ Bookings)",
    basePrice: 1999,
    packages: [
      {
        id: "shegaon-standard",
        name: "Shri Gajanan Maharaj Sansthan Prarthana Package",
        price: 1999,
        popular: true,
        features: [
          "Samadhi Mandir Pooja & Aarti Invocations by Sansthan Sevaks",
          "₹501 Passed directly as Temple Donation",
          "Official Sansthan Trust Receipt",
          "Authentic Shegaon Mahaprasad Box & Sacred Angavastra",
          "Multi-Carrier Express Doorstep Delivery"
        ]
      }
    ],
    description: "Revered spiritual pilgrimage of Sant Shri Gajanan Maharaj in Shegaon. Official sansthan donation pass-through, temple receipt, and doorstep blessed prasad delivery."
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TEMPLE_DATA };
}
