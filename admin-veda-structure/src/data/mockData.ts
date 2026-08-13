import type {
  Product, Category, Course, Booking, Order, Customer, Expert,
  Payment, Review, Coupon, Notification,
} from '@/types';

export const categories: Category[] = [
  { id: 'cat-1', name: 'Puja Items', productsCount: 34, status: 'Active', createdAt: '12 Jan 2026', description: 'Essential items for daily worship and rituals' },
  { id: 'cat-2', name: 'Rudraksha', productsCount: 22, status: 'Active', createdAt: '15 Jan 2026', description: 'Authentic rudraksha beads and malas' },
  { id: 'cat-3', name: 'Gemstones', productsCount: 18, status: 'Active', createdAt: '18 Jan 2026', description: 'Certified natural gemstones' },
  { id: 'cat-4', name: 'Yantra', productsCount: 12, status: 'Active', createdAt: '20 Jan 2026', description: 'Sacred geometric instruments' },
  { id: 'cat-5', name: 'Spiritual Books', productsCount: 26, status: 'Active', createdAt: '22 Jan 2026', description: 'Vedic literature and spiritual guides' },
  { id: 'cat-6', name: 'Puja Kits', productsCount: 9, status: 'Inactive', createdAt: '25 Jan 2026', description: 'Complete kits for specific pujas' },
  { id: 'cat-7', name: 'Healing Products', productsCount: 7, status: 'Active', createdAt: '28 Jan 2026', description: 'Crystals and healing tools' },
];

export const products: Product[] = [
  {
    id: 'p-1001', name: 'Premium Rudraksha Mala', sku: 'RUDK-001', category: 'Rudraksha', subcategory: 'Mala',
    description: 'Authentic 5 Mukhi Rudraksha mala with 108+1 beads, handcrafted with premium thread. Each bead is tested and certified for authenticity.',
    shortDescription: '108+1 authentic 5 Mukhi Rudraksha beads',
    price: 1299, discountPrice: 999, stock: 45, lowStockThreshold: 10, weight: '120g', dimensions: '45cm length',
    images: ['https://images.pexels.com/photos/8470903/pexels-photo-8470903.jpeg?auto=compress&cs=tinysrgb&w=400'],
    thumbnail: 'https://images.pexels.com/photos/8470903/pexels-photo-8470903.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['rudraksha', 'mala', 'meditation'], status: 'Active',
    metaTitle: 'Premium Rudraksha Mala - Veda Structure', metaDescription: 'Buy authentic 5 Mukhi Rudraksha Mala online',
    slug: 'premium-rudraksha-mala', createdAt: '15 Feb 2026', sales: 234,
  },
  {
    id: 'p-1002', name: 'Copper Yantra - Shree Mahalakshmi', sku: 'YANT-002', category: 'Yantra', subcategory: 'Mahalakshmi',
    description: 'Energized Mahalakshmi Yantra made of pure copper, engraved with sacred geometry. Brings wealth and prosperity.',
    shortDescription: 'Pure copper energized Mahalakshmi Yantra',
    price: 2499, stock: 18, lowStockThreshold: 5, weight: '250g', dimensions: '15x15 cm',
    images: ['https://images.pexels.com/photos/8470899/pexels-photo-8470899.jpeg?auto=compress&cs=tinysrgb&w=400'],
    thumbnail: 'https://images.pexels.com/photos/8470899/pexels-photo-8470899.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['yantra', 'mahalakshmi', 'wealth'], status: 'Active',
    metaTitle: 'Mahalakshmi Copper Yantra - Veda Structure', metaDescription: 'Energized copper Mahalakshmi Yantra',
    slug: 'copper-yantra-mahalakshmi', createdAt: '18 Feb 2026', sales: 156,
  },
  {
    id: 'p-1003', name: 'Complete Puja Kit - Diwali Special', sku: 'PUJA-003', category: 'Puja Kits', subcategory: 'Festival',
    description: 'Complete Diwali puja kit with all essential items including diyas, incense, sweets, and decorations.',
    shortDescription: 'All-inclusive Diwali puja essentials',
    price: 3499, discountPrice: 2999, stock: 8, lowStockThreshold: 15, weight: '1.5kg', dimensions: '40x30x15 cm',
    images: ['https://images.pexels.com/photos/8470905/pexels-photo-8470905.jpeg?auto=compress&cs=tinysrgb&w=400'],
    thumbnail: 'https://images.pexels.com/photos/8470905/pexels-photo-8470905.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['puja', 'diwali', 'kit'], status: 'Active',
    metaTitle: 'Diwali Puja Kit - Veda Structure', metaDescription: 'Complete Diwali puja essentials kit',
    slug: 'diwali-puja-kit', createdAt: '20 Feb 2026', sales: 89,
  },
  {
    id: 'p-1004', name: 'Gemstone Bracelet - Yellow Sapphire', sku: 'GEMS-004', category: 'Gemstones', subcategory: 'Bracelet',
    description: 'Natural Yellow Sapphire (Pukhraj) bracelet, certified and untreated. Brings wisdom and prosperity.',
    shortDescription: 'Certified natural Yellow Sapphire bracelet',
    price: 8999, stock: 12, lowStockThreshold: 3, weight: '15g', dimensions: 'Adjustable',
    images: ['https://images.pexels.com/photos/8470912/pexels-photo-8470912.jpeg?auto=compress&cs=tinysrgb&w=400'],
    thumbnail: 'https://images.pexels.com/photos/8470912/pexels-photo-8470912.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['gemstone', 'sapphire', 'bracelet'], status: 'Active',
    metaTitle: 'Yellow Sapphire Bracelet - Veda Structure', metaDescription: 'Certified natural Yellow Sapphire bracelet',
    slug: 'yellow-sapphire-bracelet', createdAt: '22 Feb 2026', sales: 67,
  },
  {
    id: 'p-1005', name: 'Bhagavad Gita - Sanskrit with Hindi Translation', sku: 'BOOK-005', category: 'Spiritual Books', subcategory: 'Scriptures',
    description: 'Complete Bhagavad Gita with original Sanskrit verses and detailed Hindi translation with commentary.',
    shortDescription: 'Sanskrit-Hindi Bhagavad Gita with commentary',
    price: 599, stock: 0, lowStockThreshold: 20, weight: '800g', dimensions: '25x18x4 cm',
    images: ['https://images.pexels.com/photos/8470907/pexels-photo-8470907.jpeg?auto=compress&cs=tinysrgb&w=400'],
    thumbnail: 'https://images.pexels.com/photos/8470907/pexels-photo-8470907.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['book', 'gita', 'scripture'], status: 'Out of Stock',
    metaTitle: 'Bhagavad Gita Book - Veda Structure', metaDescription: 'Bhagavad Gita with Hindi translation',
    slug: 'bhagavad-gita-hindi', createdAt: '25 Feb 2026', sales: 412,
  },
  {
    id: 'p-1006', name: 'Healing Crystal Set - 7 Chakra', sku: 'HEAL-006', category: 'Healing Products', subcategory: 'Crystals',
    description: 'Set of 7 chakra healing crystals for meditation and energy balancing. Each crystal corresponds to a chakra.',
    shortDescription: '7 chakra healing crystal set for meditation',
    price: 1799, discountPrice: 1499, stock: 25, lowStockThreshold: 8, weight: '350g', dimensions: '20x15x5 cm',
    images: ['https://images.pexels.com/photos/8470918/pexels-photo-8470918.jpeg?auto=compress&cs=tinysrgb&w=400'],
    thumbnail: 'https://images.pexels.com/photos/8470918/pexels-photo-8470918.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['crystal', 'chakra', 'healing'], status: 'Active',
    metaTitle: '7 Chakra Crystal Set - Veda Structure', metaDescription: 'Healing crystal set for chakra balancing',
    slug: '7-chakra-crystal-set', createdAt: '28 Feb 2026', sales: 178,
  },
  {
    id: 'p-1007', name: 'Brass Diya Set (Pack of 5)', sku: 'PUJA-007', category: 'Puja Items', subcategory: 'Diyas',
    description: 'Traditional brass diyas set of 5, perfect for daily aarti and festive occasions.',
    shortDescription: 'Set of 5 traditional brass diyas',
    price: 799, stock: 60, lowStockThreshold: 15, weight: '400g', dimensions: '8cm diameter each',
    images: ['https://images.pexels.com/photos/8470920/pexels-photo-8470920.jpeg?auto=compress&cs=tinysrgb&w=400'],
    thumbnail: 'https://images.pexels.com/photos/8470920/pexels-photo-8470920.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['diya', 'brass', 'puja'], status: 'Active',
    metaTitle: 'Brass Diya Set - Veda Structure', metaDescription: 'Traditional brass diyas pack of 5',
    slug: 'brass-diya-set', createdAt: '02 Mar 2026', sales: 298,
  },
  {
    id: 'p-1008', name: 'Tulsi Mala - Original', sku: 'RUDK-008', category: 'Rudraksha', subcategory: 'Tulsi',
    description: 'Original Tulsi wood mala with 108 beads, used for chanting and worship.',
    shortDescription: '108 beads original Tulsi wood mala',
    price: 499, stock: 3, lowStockThreshold: 10, weight: '80g', dimensions: '40cm length',
    images: ['https://images.pexels.com/photos/8470922/pexels-photo-8470922.jpeg?auto=compress&cs=tinysrgb&w=400'],
    thumbnail: 'https://images.pexels.com/photos/8470922/pexels-photo-8470922.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['tulsi', 'mala', 'chanting'], status: 'Draft',
    metaTitle: 'Tulsi Mala - Veda Structure', metaDescription: 'Original Tulsi wood mala 108 beads',
    slug: 'tulsi-mala-original', createdAt: '05 Mar 2026', sales: 0,
  },
];

export const courses: Course[] = [
  { id: 'c-101', title: 'Vedic Astrology Basics', instructor: 'Pandit Rajesh Sharma', category: 'Astrology', price: 4999, students: 342, lessons: 24, duration: '12 hours', status: 'Published', createdAt: '10 Jan 2026', thumbnail: 'https://images.pexels.com/photos/8470903/pexels-photo-8470903.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Learn the fundamentals of Vedic astrology, including planets, houses, and zodiac signs.' },
  { id: 'c-102', title: 'Learn Kundli Reading', instructor: 'Acharya Meena Iyer', category: 'Astrology', price: 6999, students: 218, lessons: 30, duration: '18 hours', status: 'Published', createdAt: '15 Jan 2026', thumbnail: 'https://images.pexels.com/photos/8470899/pexels-photo-8470899.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Master the art of reading and interpreting Kundli (birth charts) step by step.' },
  { id: 'c-103', title: 'Meditation & Spirituality', instructor: 'Guru Sri Anand', category: 'Spirituality', price: 2999, students: 567, lessons: 18, duration: '10 hours', status: 'Published', createdAt: '20 Jan 2026', thumbnail: 'https://images.pexels.com/photos/8470905/pexels-photo-8470905.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'A complete guide to meditation techniques for spiritual growth and inner peace.' },
  { id: 'c-104', title: 'Vastu Shastra Fundamentals', instructor: 'Dr. Suresh Verma', category: 'Vastu', price: 5499, students: 189, lessons: 22, duration: '14 hours', status: 'Published', createdAt: '25 Jan 2026', thumbnail: 'https://images.pexels.com/photos/8470912/pexels-photo-8470912.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Understand Vastu principles for home and office design to attract positive energy.' },
  { id: 'c-105', title: 'Numerology Mastery', instructor: 'Acharya Meena Iyer', category: 'Numerology', price: 3999, students: 0, lessons: 16, duration: '8 hours', status: 'Draft', createdAt: '01 Feb 2026', thumbnail: 'https://images.pexels.com/photos/8470918/pexels-photo-8470918.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Decode the power of numbers and their influence on your life path.' },
  { id: 'c-106', title: 'Advanced Palmistry', instructor: 'Pandit Rajesh Sharma', category: 'Palmistry', price: 7999, students: 95, lessons: 28, duration: '16 hours', status: 'Published', createdAt: '05 Feb 2026', thumbnail: 'https://images.pexels.com/photos/8470920/pexels-photo-8470920.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Deep dive into palm reading techniques and interpretation of palm lines.' },
];

export const experts: Expert[] = [
  { id: 'e-201', name: 'Pandit Rajesh Sharma', type: 'Pandit', specialization: 'Vedic Rituals & Pujas', experience: 18, rating: 4.9, bookings: 342, status: 'Active', photo: 'https://images.pexels.com/photos/8470903/pexels-photo-8470903.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Expert in Vedic rituals, pujas, and havan ceremonies with 18+ years of experience.', languages: ['Hindi', 'Sanskrit', 'English'], consultationFee: 999, availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], availableTimeSlots: ['09:00 AM', '11:30 AM', '02:00 PM', '04:00 PM'] },
  { id: 'e-202', name: 'Acharya Meena Iyer', type: 'Astrologer', specialization: 'Vedic Astrology & Kundli', experience: 15, rating: 4.8, bookings: 278, status: 'Active', photo: 'https://images.pexels.com/photos/8470899/pexels-photo-8470899.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Renowned Vedic astrologer specializing in Kundli reading and life predictions.', languages: ['English', 'Tamil', 'Hindi'], consultationFee: 1499, availableDays: ['Mon', 'Wed', 'Fri', 'Sat'], availableTimeSlots: ['10:00 AM', '01:00 PM', '03:30 PM'] },
  { id: 'e-203', name: 'Dr. Suresh Verma', type: 'Spiritual Expert', specialization: 'Vastu & Numerology', experience: 22, rating: 4.9, bookings: 198, status: 'Active', photo: 'https://images.pexels.com/photos/8470905/pexels-photo-8470905.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'PhD in Vastu Shastra with expertise in numerology and energy healing.', languages: ['English', 'Hindi'], consultationFee: 1999, availableDays: ['Tue', 'Thu', 'Sat', 'Sun'], availableTimeSlots: ['11:00 AM', '02:00 PM', '05:00 PM'] },
  { id: 'e-204', name: 'Guru Sri Anand', type: 'Spiritual Expert', specialization: 'Meditation & Spirituality', experience: 25, rating: 5.0, bookings: 156, status: 'On Leave', photo: 'https://images.pexels.com/photos/8470912/pexels-photo-8470912.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Spiritual master with 25 years of experience teaching meditation and mindfulness.', languages: ['English', 'Hindi', 'Bengali'], consultationFee: 1299, availableDays: ['Mon', 'Tue', 'Wed'], availableTimeSlots: ['06:00 AM', '07:00 AM', '06:00 PM'] },
  { id: 'e-205', name: 'Pandit Krishna Murthy', type: 'Pandit', specialization: 'Havan & Sanskar', experience: 12, rating: 4.7, bookings: 234, status: 'Active', photo: 'https://images.pexels.com/photos/8470918/pexels-photo-8470918.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Specialist in havan ceremonies, sanskar rituals, and griha pravesh pujas.', languages: ['Hindi', 'Telugu', 'Sanskrit'], consultationFee: 899, availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], availableTimeSlots: ['08:00 AM', '10:00 AM', '12:00 PM', '03:00 PM'] },
  { id: 'e-206', name: 'Jyotish Priya Gupta', type: 'Astrologer', specialization: 'Tarot & Numerology', experience: 8, rating: 4.6, bookings: 167, status: 'Active', photo: 'https://images.pexels.com/photos/8470920/pexels-photo-8470920.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Tarot reader and numerologist helping clients find clarity and direction.', languages: ['English', 'Hindi', 'Marathi'], consultationFee: 799, availableDays: ['Wed', 'Thu', 'Fri', 'Sat', 'Sun'], availableTimeSlots: ['11:00 AM', '01:00 PM', '04:00 PM', '06:00 PM'] },
];

export const customers: Customer[] = [
  { id: 'cus-301', name: 'Rahul Sharma', email: 'rahul.sharma@email.com', phone: '9876543210', gender: 'Male', orders: 12, bookings: 5, totalSpent: 45600, joinedDate: '15 Jan 2026', status: 'Active', avatar: 'https://images.pexels.com/photos/8470903/pexels-photo-8470903.jpeg?auto=compress&cs=tinysrgb&w=100', address: '12 MG Road, Bengaluru, Karnataka 560001' },
  { id: 'cus-302', name: 'Priya Patel', email: 'priya.patel@email.com', phone: '9876512345', gender: 'Female', orders: 8, bookings: 3, totalSpent: 28900, joinedDate: '20 Jan 2026', status: 'Active', avatar: 'https://images.pexels.com/photos/8470899/pexels-photo-8470899.jpeg?auto=compress&cs=tinysrgb&w=100', address: '45 Anna Salai, Chennai, Tamil Nadu 600002' },
  { id: 'cus-303', name: 'Amit Kumar', email: 'amit.kumar@email.com', phone: '9988776655', gender: 'Male', orders: 15, bookings: 8, totalSpent: 62300, joinedDate: '10 Jan 2026', status: 'Active', avatar: 'https://images.pexels.com/photos/8470905/pexels-photo-8470905.jpeg?auto=compress&cs=tinysrgb&w=100', address: '78 Park Street, Kolkata, West Bengal 700016' },
  { id: 'cus-304', name: 'Sneha Reddy', email: 'sneha.reddy@email.com', phone: '9123456789', gender: 'Female', orders: 5, bookings: 2, totalSpent: 18700, joinedDate: '05 Feb 2026', status: 'Active', avatar: 'https://images.pexels.com/photos/8470912/pexels-photo-8470912.jpeg?auto=compress&cs=tinysrgb&w=100', address: '23 Banjara Hills, Hyderabad, Telangana 500034' },
  { id: 'cus-305', name: 'Vikram Singh', email: 'vikram.singh@email.com', phone: '9012345678', gender: 'Male', orders: 20, bookings: 12, totalSpent: 89500, joinedDate: '08 Jan 2026', status: 'Active', avatar: 'https://images.pexels.com/photos/8470918/pexels-photo-8470918.jpeg?auto=compress&cs=tinysrgb&w=100', address: '56 Connaught Place, New Delhi 110001' },
  { id: 'cus-306', name: 'Anjali Desai', email: 'anjali.desai@email.com', phone: '8765432109', gender: 'Female', orders: 3, bookings: 1, totalSpent: 9800, joinedDate: '12 Feb 2026', status: 'Inactive', avatar: 'https://images.pexels.com/photos/8470920/pexels-photo-8470920.jpeg?auto=compress&cs=tinysrgb&w=100', address: '89 Marine Drive, Mumbai, Maharashtra 400020' },
  { id: 'cus-307', name: 'Karthik Nair', email: 'karthik.nair@email.com', phone: '8098765432', gender: 'Male', orders: 7, bookings: 4, totalSpent: 32100, joinedDate: '18 Feb 2026', status: 'Active', avatar: 'https://images.pexels.com/photos/8470922/pexels-photo-8470922.jpeg?auto=compress&cs=tinysrgb&w=100', address: '34 Marine Drive, Kochi, Kerala 682031' },
  { id: 'cus-308', name: 'Divya Joshi', email: 'divya.joshi@email.com', phone: '8976543210', gender: 'Female', orders: 10, bookings: 6, totalSpent: 41500, joinedDate: '22 Feb 2026', status: 'Active', avatar: 'https://images.pexels.com/photos/8470907/pexels-photo-8470907.jpeg?auto=compress&cs=tinysrgb&w=100', address: '67 Law Garden, Ahmedabad, Gujarat 380006' },
];

export const bookings: Booking[] = [
  {
    id: 'BK-10021', customerId: 'cus-303', customerName: 'Shivam Kumar', customerEmail: 'shivam.kumar@email.com', customerPhone: '9876543210',
    gender: 'Male', dateOfBirth: '15 Aug 1990', timeOfBirth: '04:30 AM', placeOfBirth: 'Patna, Bihar', address: '12 Boring Road, Patna, Bihar 800001',
    service: 'Astrology Consultation', expert: 'Pandit Rajesh Sharma', expertId: 'e-201', bookingDate: '10 Aug 2026', bookingTime: '04:00 PM',
    duration: '45 minutes', status: 'Confirmed', mode: 'Video Call', amount: 999, paymentStatus: 'Paid',
    transactionId: 'TXN-20260810-10021', paymentDate: '08 Aug 2026', paymentMethod: 'UPI - GPay',
    customerNotes: 'I want to discuss about my career and marriage prospects. My birth details are accurate.',
    adminNotes: '', createdAt: '08 Aug 2026',
  },
  {
    id: 'BK-10022', customerId: 'cus-301', customerName: 'Rahul Sharma', customerEmail: 'rahul.sharma@email.com', customerPhone: '9876543210',
    gender: 'Male', dateOfBirth: '22 Mar 1988', timeOfBirth: '10:15 AM', placeOfBirth: 'Pune, Maharashtra', address: '12 MG Road, Bengaluru, Karnataka 560001',
    service: 'Pandit Booking', expert: 'Pandit Krishna Murthy', expertId: 'e-205', bookingDate: '11 Aug 2026', bookingTime: '10:00 AM',
    duration: '2 hours', status: 'Confirmed', mode: 'In-Person', amount: 2999, paymentStatus: 'Paid',
    transactionId: 'TXN-20260809-10022', paymentDate: '09 Aug 2026', paymentMethod: 'Credit Card',
    customerNotes: 'Griha Pravesh puja at my new flat. Please bring all necessary items.',
    adminNotes: 'Customer requested all puja items to be arranged by the pandit.', createdAt: '09 Aug 2026',
  },
  {
    id: 'BK-10023', customerId: 'cus-302', customerName: 'Priya Patel', customerEmail: 'priya.patel@email.com', customerPhone: '9876512345',
    gender: 'Female', dateOfBirth: '05 Jul 1992', timeOfBirth: '02:45 PM', placeOfBirth: 'Surat, Gujarat', address: '45 Anna Salai, Chennai, Tamil Nadu 600002',
    service: 'Vastu Consultation', expert: 'Dr. Suresh Verma', expertId: 'e-203', bookingDate: '12 Aug 2026', bookingTime: '11:00 AM',
    duration: '60 minutes', status: 'Pending', mode: 'Online', amount: 1999, paymentStatus: 'Pending',
    transactionId: '', paymentDate: '', paymentMethod: '',
    customerNotes: 'Need vastu analysis for my new office space. Will share floor plan during consultation.',
    adminNotes: '', createdAt: '09 Aug 2026',
  },
  {
    id: 'BK-10024', customerId: 'cus-304', customerName: 'Sneha Reddy', customerEmail: 'sneha.reddy@email.com', customerPhone: '9123456789',
    gender: 'Female', dateOfBirth: '18 Nov 1995', timeOfBirth: '08:00 PM', placeOfBirth: 'Warangal, Telangana', address: '23 Banjara Hills, Hyderabad, Telangana 500034',
    service: 'Numerology', expert: 'Jyotish Priya Gupta', expertId: 'e-206', bookingDate: '08 Aug 2026', bookingTime: '01:00 PM',
    duration: '30 minutes', status: 'Completed', mode: 'Phone', amount: 799, paymentStatus: 'Paid',
    transactionId: 'TXN-20260807-10024', paymentDate: '07 Aug 2026', paymentMethod: 'UPI - PhonePe',
    customerNotes: 'Want to know my lucky number and name correction suggestions.',
    adminNotes: 'Consultation completed. Suggested name correction. Follow-up booked for next month.', createdAt: '07 Aug 2026',
  },
  {
    id: 'BK-10025', customerId: 'cus-305', customerName: 'Vikram Singh', customerEmail: 'vikram.singh@email.com', customerPhone: '9012345678',
    gender: 'Male', dateOfBirth: '30 Jan 1985', timeOfBirth: '06:20 AM', placeOfBirth: 'Jaipur, Rajasthan', address: '56 Connaught Place, New Delhi 110001',
    service: 'Astrology Consultation', expert: 'Acharya Meena Iyer', expertId: 'e-202', bookingDate: '13 Aug 2026', bookingTime: '10:00 AM',
    duration: '45 minutes', status: 'Confirmed', mode: 'Video Call', amount: 1499, paymentStatus: 'Paid',
    transactionId: 'TXN-20260809-10025', paymentDate: '09 Aug 2026', paymentMethod: 'Debit Card',
    customerNotes: 'Need guidance on business partnership timing. Have been facing losses since 2 years.',
    adminNotes: '', createdAt: '09 Aug 2026',
  },
  {
    id: 'BK-10026', customerId: 'cus-306', customerName: 'Anjali Desai', customerEmail: 'anjali.desai@email.com', customerPhone: '8765432109',
    gender: 'Female', dateOfBirth: '12 Apr 1993', timeOfBirth: '11:30 PM', placeOfBirth: 'Mumbai, Maharashtra', address: '89 Marine Drive, Mumbai, Maharashtra 400020',
    service: 'Pandit Booking', expert: 'Pandit Rajesh Sharma', expertId: 'e-201', bookingDate: '05 Aug 2026', bookingTime: '08:00 AM',
    duration: '3 hours', status: 'Cancelled', mode: 'In-Person', amount: 3499, paymentStatus: 'Refunded',
    transactionId: 'TXN-20260802-10026', paymentDate: '02 Aug 2026', paymentMethod: 'UPI - Paytm',
    customerNotes: 'Satyanarayan puja at home. Need pandit for 3 hours.',
    adminNotes: 'Customer cancelled due to family emergency. Refund processed.', createdAt: '02 Aug 2026',
  },
  {
    id: 'BK-10027', customerId: 'cus-307', customerName: 'Karthik Nair', customerEmail: 'karthik.nair@email.com', customerPhone: '8098765432',
    gender: 'Male', dateOfBirth: '25 Sep 1989', timeOfBirth: '03:15 AM', placeOfBirth: 'Kochi, Kerala', address: '34 Marine Drive, Kochi, Kerala 682031',
    service: 'Other Services', expert: 'Guru Sri Anand', expertId: 'e-204', bookingDate: '14 Aug 2026', bookingTime: '06:00 AM',
    duration: '60 minutes', status: 'Rescheduled', mode: 'Online', amount: 1299, paymentStatus: 'Paid',
    transactionId: 'TXN-20260808-10027', paymentDate: '08 Aug 2026', paymentMethod: 'Credit Card',
    customerNotes: 'Meditation guidance session. Want to learn advanced techniques.',
    adminNotes: 'Rescheduled from 10 Aug to 14 Aug due to expert on leave.', createdAt: '08 Aug 2026',
  },
  {
    id: 'BK-10028', customerId: 'cus-308', customerName: 'Divya Joshi', customerEmail: 'divya.joshi@email.com', customerPhone: '8976543210',
    gender: 'Female', dateOfBirth: '08 Dec 1991', timeOfBirth: '07:45 AM', placeOfBirth: 'Ahmedabad, Gujarat', address: '67 Law Garden, Ahmedabad, Gujarat 380006',
    service: 'Astrology Consultation', expert: 'Acharya Meena Iyer', expertId: 'e-202', bookingDate: '09 Aug 2026', bookingTime: '01:00 PM',
    duration: '45 minutes', status: 'Completed', mode: 'Video Call', amount: 1499, paymentStatus: 'Paid',
    transactionId: 'TXN-20260806-10028', paymentDate: '06 Aug 2026', paymentMethod: 'UPI - GPay',
    customerNotes: 'Want to discuss about my health issues and remedies.',
    adminNotes: 'Consultation completed. Suggested gemstone therapy and mantras.', createdAt: '06 Aug 2026',
  },
];

export const orders: Order[] = [
  {
    id: 'VS1001', customerId: 'cus-301', customerName: 'Rahul Sharma', customerEmail: 'rahul.sharma@email.com', customerPhone: '9876543210',
    items: [{ productId: 'p-1001', name: 'Premium Rudraksha Mala', image: 'https://images.pexels.com/photos/8470903/pexels-photo-8470903.jpeg?auto=compress&cs=tinysrgb&w=100', quantity: 1, price: 999 }],
    total: 999, subtotal: 999, discount: 0, shipping: 0, paymentStatus: 'Paid', paymentMethod: 'UPI - GPay', transactionId: 'TXN-VS1001',
    orderStatus: 'Delivered', shippingAddress: '12 MG Road, Bengaluru, Karnataka 560001', date: '08 Aug 2026',
    timeline: [
      { status: 'Order Placed', date: '05 Aug 2026', done: true },
      { status: 'Payment Confirmed', date: '05 Aug 2026', done: true },
      { status: 'Processing', date: '06 Aug 2026', done: true },
      { status: 'Shipped', date: '06 Aug 2026', done: true },
      { status: 'Out for Delivery', date: '08 Aug 2026', done: true },
      { status: 'Delivered', date: '08 Aug 2026', done: true },
    ],
  },
  {
    id: 'VS1002', customerId: 'cus-302', customerName: 'Priya Patel', customerEmail: 'priya.patel@email.com', customerPhone: '9876512345',
    items: [{ productId: 'p-1004', name: 'Gemstone Bracelet - Yellow Sapphire', image: 'https://images.pexels.com/photos/8470912/pexels-photo-8470912.jpeg?auto=compress&cs=tinysrgb&w=100', quantity: 1, price: 8999 }],
    total: 8999, subtotal: 8999, discount: 0, shipping: 0, paymentStatus: 'Paid', paymentMethod: 'Credit Card', transactionId: 'TXN-VS1002',
    orderStatus: 'Shipped', shippingAddress: '45 Anna Salai, Chennai, Tamil Nadu 600002', date: '09 Aug 2026',
    timeline: [
      { status: 'Order Placed', date: '08 Aug 2026', done: true },
      { status: 'Payment Confirmed', date: '08 Aug 2026', done: true },
      { status: 'Processing', date: '09 Aug 2026', done: true },
      { status: 'Shipped', date: '09 Aug 2026', done: true },
      { status: 'Out for Delivery', date: '', done: false },
      { status: 'Delivered', date: '', done: false },
    ],
  },
  {
    id: 'VS1003', customerId: 'cus-303', customerName: 'Amit Kumar', customerEmail: 'amit.kumar@email.com', customerPhone: '9988776655',
    items: [
      { productId: 'p-1003', name: 'Complete Puja Kit - Diwali Special', image: 'https://images.pexels.com/photos/8470905/pexels-photo-8470905.jpeg?auto=compress&cs=tinysrgb&w=100', quantity: 1, price: 2999 },
      { productId: 'p-1007', name: 'Brass Diya Set (Pack of 5)', image: 'https://images.pexels.com/photos/8470920/pexels-photo-8470920.jpeg?auto=compress&cs=tinysrgb&w=100', quantity: 2, price: 799 },
    ],
    total: 4597, subtotal: 4597, discount: 0, shipping: 0, paymentStatus: 'Pending', paymentMethod: 'COD', transactionId: '',
    orderStatus: 'Pending', shippingAddress: '78 Park Street, Kolkata, West Bengal 700016', date: '09 Aug 2026',
    timeline: [
      { status: 'Order Placed', date: '09 Aug 2026', done: true },
      { status: 'Payment Confirmed', date: '', done: false },
      { status: 'Processing', date: '', done: false },
      { status: 'Shipped', date: '', done: false },
      { status: 'Out for Delivery', date: '', done: false },
      { status: 'Delivered', date: '', done: false },
    ],
  },
  {
    id: 'VS1004', customerId: 'cus-305', customerName: 'Vikram Singh', customerEmail: 'vikram.singh@email.com', customerPhone: '9012345678',
    items: [{ productId: 'p-1006', name: 'Healing Crystal Set - 7 Chakra', image: 'https://images.pexels.com/photos/8470918/pexels-photo-8470918.jpeg?auto=compress&cs=tinysrgb&w=100', quantity: 1, price: 1499 }],
    total: 1499, subtotal: 1499, discount: 0, shipping: 49, paymentStatus: 'Paid', paymentMethod: 'Debit Card', transactionId: 'TXN-VS1004',
    orderStatus: 'Processing', shippingAddress: '56 Connaught Place, New Delhi 110001', date: '09 Aug 2026',
    timeline: [
      { status: 'Order Placed', date: '09 Aug 2026', done: true },
      { status: 'Payment Confirmed', date: '09 Aug 2026', done: true },
      { status: 'Processing', date: '09 Aug 2026', done: true },
      { status: 'Shipped', date: '', done: false },
      { status: 'Out for Delivery', date: '', done: false },
      { status: 'Delivered', date: '', done: false },
    ],
  },
  {
    id: 'VS1005', customerId: 'cus-304', customerName: 'Sneha Reddy', customerEmail: 'sneha.reddy@email.com', customerPhone: '9123456789',
    items: [{ productId: 'p-1002', name: 'Copper Yantra - Shree Mahalakshmi', image: 'https://images.pexels.com/photos/8470899/pexels-photo-8470899.jpeg?auto=compress&cs=tinysrgb&w=100', quantity: 1, price: 2499 }],
    total: 2499, subtotal: 2499, discount: 0, shipping: 0, paymentStatus: 'Failed', paymentMethod: 'Credit Card', transactionId: 'TXN-VS1005-FAIL',
    orderStatus: 'Cancelled', shippingAddress: '23 Banjara Hills, Hyderabad, Telangana 500034', date: '07 Aug 2026',
    timeline: [
      { status: 'Order Placed', date: '07 Aug 2026', done: true },
      { status: 'Payment Confirmed', date: '', done: false },
      { status: 'Processing', date: '', done: false },
      { status: 'Shipped', date: '', done: false },
      { status: 'Out for Delivery', date: '', done: false },
      { status: 'Delivered', date: '', done: false },
    ],
  },
  {
    id: 'VS1006', customerId: 'cus-307', customerName: 'Karthik Nair', customerEmail: 'karthik.nair@email.com', customerPhone: '8098765432',
    items: [{ productId: 'p-1001', name: 'Premium Rudraksha Mala', image: 'https://images.pexels.com/photos/8470903/pexels-photo-8470903.jpeg?auto=compress&cs=tinysrgb&w=100', quantity: 2, price: 999 }],
    total: 1998, subtotal: 1998, discount: 0, shipping: 0, paymentStatus: 'Paid', paymentMethod: 'UPI - PhonePe', transactionId: 'TXN-VS1006',
    orderStatus: 'Delivered', shippingAddress: '34 Marine Drive, Kochi, Kerala 682031', date: '03 Aug 2026',
    timeline: [
      { status: 'Order Placed', date: '01 Aug 2026', done: true },
      { status: 'Payment Confirmed', date: '01 Aug 2026', done: true },
      { status: 'Processing', date: '01 Aug 2026', done: true },
      { status: 'Shipped', date: '02 Aug 2026', done: true },
      { status: 'Out for Delivery', date: '03 Aug 2026', done: true },
      { status: 'Delivered', date: '03 Aug 2026', done: true },
    ],
  },
  {
    id: 'VS1007', customerId: 'cus-308', customerName: 'Divya Joshi', customerEmail: 'divya.joshi@email.com', customerPhone: '8976543210',
    items: [{ productId: 'p-1005', name: 'Bhagavad Gita - Sanskrit with Hindi Translation', image: 'https://images.pexels.com/photos/8470907/pexels-photo-8470907.jpeg?auto=compress&cs=tinysrgb&w=100', quantity: 1, price: 599 }],
    total: 599, subtotal: 599, discount: 0, shipping: 49, paymentStatus: 'Paid', paymentMethod: 'Credit Card', transactionId: 'TXN-VS1007',
    orderStatus: 'Delivered', shippingAddress: '67 Law Garden, Ahmedabad, Gujarat 380006', date: '28 Jul 2026',
    timeline: [
      { status: 'Order Placed', date: '25 Jul 2026', done: true },
      { status: 'Payment Confirmed', date: '25 Jul 2026', done: true },
      { status: 'Processing', date: '26 Jul 2026', done: true },
      { status: 'Shipped', date: '26 Jul 2026', done: true },
      { status: 'Out for Delivery', date: '28 Jul 2026', done: true },
      { status: 'Delivered', date: '28 Jul 2026', done: true },
    ],
  },
];

export const payments: Payment[] = [
  { id: 'pay-1', transactionId: 'TXN-VS1001', customerName: 'Rahul Sharma', refId: 'VS1001', refType: 'Order', amount: 999, method: 'UPI - GPay', status: 'Paid', date: '05 Aug 2026' },
  { id: 'pay-2', transactionId: 'TXN-VS1002', customerName: 'Priya Patel', refId: 'VS1002', refType: 'Order', amount: 8999, method: 'Credit Card', status: 'Paid', date: '08 Aug 2026' },
  { id: 'pay-3', transactionId: 'TXN-20260810-10021', customerName: 'Shivam Kumar', refId: 'BK-10021', refType: 'Booking', amount: 999, method: 'UPI - GPay', status: 'Paid', date: '08 Aug 2026' },
  { id: 'pay-4', transactionId: 'TXN-VS1003', customerName: 'Amit Kumar', refId: 'VS1003', refType: 'Order', amount: 4597, method: 'COD', status: 'Pending', date: '09 Aug 2026' },
  { id: 'pay-5', transactionId: 'TXN-VS1004', customerName: 'Vikram Singh', refId: 'VS1004', refType: 'Order', amount: 1499, method: 'Debit Card', status: 'Paid', date: '09 Aug 2026' },
  { id: 'pay-6', transactionId: 'TXN-VS1005-FAIL', customerName: 'Sneha Reddy', refId: 'VS1005', refType: 'Order', amount: 2499, method: 'Credit Card', status: 'Failed', date: '07 Aug 2026' },
  { id: 'pay-7', transactionId: 'TXN-20260809-10022', customerName: 'Rahul Sharma', refId: 'BK-10022', refType: 'Booking', amount: 2999, method: 'Credit Card', status: 'Paid', date: '09 Aug 2026' },
  { id: 'pay-8', transactionId: 'TXN-20260807-10024', customerName: 'Sneha Reddy', refId: 'BK-10024', refType: 'Booking', amount: 799, method: 'UPI - PhonePe', status: 'Paid', date: '07 Aug 2026' },
  { id: 'pay-9', transactionId: 'TXN-20260802-10026', customerName: 'Anjali Desai', refId: 'BK-10026', refType: 'Booking', amount: 3499, method: 'UPI - Paytm', status: 'Refunded', date: '02 Aug 2026' },
  { id: 'pay-10', transactionId: 'TXN-VS1006', customerName: 'Karthik Nair', refId: 'VS1006', refType: 'Order', amount: 1998, method: 'UPI - PhonePe', status: 'Paid', date: '01 Aug 2026' },
];

export const reviews: Review[] = [
  { id: 'rev-1', customerName: 'Rahul Sharma', itemType: 'Product', itemName: 'Premium Rudraksha Mala', rating: 5, comment: 'Excellent quality rudraksha mala. Beads are genuine and the mala is beautifully crafted. Highly recommended!', date: '08 Aug 2026', status: 'Approved' },
  { id: 'rev-2', customerName: 'Priya Patel', itemType: 'Product', itemName: 'Gemstone Bracelet - Yellow Sapphire', rating: 4, comment: 'Good quality bracelet but the size was slightly bigger than expected. Overall satisfied with the purchase.', date: '09 Aug 2026', status: 'Approved' },
  { id: 'rev-3', customerName: 'Amit Kumar', itemType: 'Course', itemName: 'Vedic Astrology Basics', rating: 5, comment: 'Pandit Rajesh Sharma ji explains complex concepts in a very simple way. The course is worth every rupee.', date: '05 Aug 2026', status: 'Approved' },
  { id: 'rev-4', customerName: 'Sneha Reddy', itemType: 'Service', itemName: 'Numerology Consultation', rating: 4, comment: 'The consultation was helpful. Priya Gupta ji gave good insights about my life path number.', date: '08 Aug 2026', status: 'Pending' },
  { id: 'rev-5', customerName: 'Vikram Singh', itemType: 'Product', itemName: 'Healing Crystal Set - 7 Chakra', rating: 3, comment: 'Crystals are okay but I expected better packaging. Some crystals had minor scratches.', date: '09 Aug 2026', status: 'Pending' },
  { id: 'rev-6', customerName: 'Divya Joshi', itemType: 'Product', itemName: 'Bhagavad Gita - Sanskrit with Hindi Translation', rating: 5, comment: 'Beautiful book with clear printing. The Hindi translation and commentary are very helpful for understanding.', date: '28 Jul 2026', status: 'Approved' },
  { id: 'rev-7', customerName: 'Karthik Nair', itemType: 'Service', itemName: 'Vastu Consultation', rating: 5, comment: 'Dr. Suresh Verma gave excellent vastu advice for my new office. Very professional and knowledgeable.', date: '06 Aug 2026', status: 'Approved' },
  { id: 'rev-8', customerName: 'Anjali Desai', itemType: 'Product', itemName: 'Copper Yantra - Shree Mahalakshmi', rating: 2, comment: 'The yantra quality is not as shown in pictures. Disappointed with the finish.', date: '07 Aug 2026', status: 'Hidden' },
];

export const coupons: Coupon[] = [
  { id: 'cpn-1', code: 'VEDA10', discountType: 'Percentage', discountValue: 10, minimumOrder: 999, maximumDiscount: 500, startDate: '01 Aug 2026', endDate: '31 Aug 2026', usageLimit: 100, usedCount: 67, status: 'Active' },
  { id: 'cpn-2', code: 'FESTIVE500', discountType: 'Fixed', discountValue: 500, minimumOrder: 2999, maximumDiscount: 500, startDate: '10 Aug 2026', endDate: '20 Aug 2026', usageLimit: 50, usedCount: 12, status: 'Active' },
  { id: 'cpn-3', code: 'NEWUSER200', discountType: 'Fixed', discountValue: 200, minimumOrder: 599, maximumDiscount: 200, startDate: '01 Jul 2026', endDate: '31 Jul 2026', usageLimit: 200, usedCount: 200, status: 'Expired' },
  { id: 'cpn-4', code: 'PUJA15', discountType: 'Percentage', discountValue: 15, minimumOrder: 1999, maximumDiscount: 1000, startDate: '15 Aug 2026', endDate: '15 Sep 2026', usageLimit: 150, usedCount: 0, status: 'Active' },
  { id: 'cpn-5', code: 'GANESH25', discountType: 'Percentage', discountValue: 25, minimumOrder: 4999, maximumDiscount: 2000, startDate: '01 Sep 2026', endDate: '10 Sep 2026', usageLimit: 80, usedCount: 0, status: 'Inactive' },
];

export const notifications: Notification[] = [
  { id: 'n-1', type: 'order', title: 'New Order Received', message: 'Order #VS1004 from Vikram Singh - ₹1,499', date: '09 Aug 2026, 3:45 PM', read: false },
  { id: 'n-2', type: 'booking', title: 'New Booking Received', message: 'BK-10025 - Astrology Consultation by Vikram Singh', date: '09 Aug 2026, 2:20 PM', read: false },
  { id: 'n-3', type: 'payment', title: 'Payment Successful', message: '₹8,999 received from Priya Patel for Order #VS1002', date: '08 Aug 2026, 6:15 PM', read: false },
  { id: 'n-4', type: 'stock', title: 'Low Stock Alert', message: 'Tulsi Mala - Original is below threshold (3 units left)', date: '09 Aug 2026, 9:00 AM', read: true },
  { id: 'n-5', type: 'customer', title: 'New Customer Registered', message: 'Divya Joshi joined Veda Structure', date: '22 Feb 2026, 11:30 AM', read: true },
  { id: 'n-6', type: 'cancellation', title: 'Booking Cancelled', message: 'BK-10026 cancelled by Anjali Desai - Refund processed', date: '05 Aug 2026, 5:45 PM', read: true },
  { id: 'n-7', type: 'order', title: 'New Order Received', message: 'Order #VS1003 from Amit Kumar - ₹4,597 (COD)', date: '09 Aug 2026, 10:30 AM', read: false },
  { id: 'n-8', type: 'stock', title: 'Low Stock Alert', message: 'Complete Puja Kit - Diwali Special is below threshold (8 units left)', date: '09 Aug 2026, 8:00 AM', read: true },
];

export const revenueData = {
  '7 Days': [
    { name: '03 Aug', revenue: 12500, orders: 12 },
    { name: '04 Aug', revenue: 18900, orders: 18 },
    { name: '05 Aug', revenue: 15600, orders: 15 },
    { name: '06 Aug', revenue: 22300, orders: 22 },
    { name: '07 Aug', revenue: 19800, orders: 19 },
    { name: '08 Aug', revenue: 28400, orders: 28 },
    { name: '09 Aug', revenue: 31200, orders: 31 },
  ],
  '30 Days': [
    { name: 'Week 1', revenue: 89500, orders: 87 },
    { name: 'Week 2', revenue: 112300, orders: 104 },
    { name: 'Week 3', revenue: 98700, orders: 92 },
    { name: 'Week 4', revenue: 134200, orders: 128 },
  ],
  '3 Months': [
    { name: 'Jun', revenue: 342000, orders: 312 },
    { name: 'Jul', revenue: 418000, orders: 389 },
    { name: 'Aug', revenue: 482500, orders: 456 },
  ],
  '1 Year': [
    { name: 'Sep', revenue: 210000, orders: 198 },
    { name: 'Oct', revenue: 245000, orders: 234 },
    { name: 'Nov', revenue: 298000, orders: 287 },
    { name: 'Dec', revenue: 356000, orders: 342 },
    { name: 'Jan', revenue: 312000, orders: 298 },
    { name: 'Feb', revenue: 334000, orders: 321 },
    { name: 'Mar', revenue: 378000, orders: 365 },
    { name: 'Apr', revenue: 392000, orders: 378 },
    { name: 'May', revenue: 365000, orders: 351 },
    { name: 'Jun', revenue: 342000, orders: 312 },
    { name: 'Jul', revenue: 418000, orders: 389 },
    { name: 'Aug', revenue: 482500, orders: 456 },
  ],
  Today: [
    { name: '9 AM', revenue: 4200, orders: 4 },
    { name: '11 AM', revenue: 8900, orders: 8 },
    { name: '1 PM', revenue: 12400, orders: 12 },
    { name: '3 PM', revenue: 9800, orders: 9 },
    { name: '5 PM', revenue: 15600, orders: 15 },
  ],
};

export const bookingTypeData = [
  { name: 'Astrology Consultation', value: 142, color: '#F97316' },
  { name: 'Pandit Booking', value: 98, color: '#7A4F8E' },
  { name: 'Other Services', value: 56, color: '#D4AF37' },
];

export const monthlyRevenue = [
  { name: 'Jan', revenue: 312000, orders: 298, bookings: 24 },
  { name: 'Feb', revenue: 334000, orders: 321, bookings: 28 },
  { name: 'Mar', revenue: 378000, orders: 365, bookings: 32 },
  { name: 'Apr', revenue: 392000, orders: 378, bookings: 35 },
  { name: 'May', revenue: 365000, orders: 351, bookings: 30 },
  { name: 'Jun', revenue: 342000, orders: 312, bookings: 26 },
  { name: 'Jul', revenue: 418000, orders: 389, bookings: 38 },
  { name: 'Aug', revenue: 482500, orders: 456, bookings: 42 },
];

export const customerGrowth = [
  { name: 'Jan', customers: 5200 },
  { name: 'Feb', customers: 5680 },
  { name: 'Mar', customers: 6120 },
  { name: 'Apr', customers: 6780 },
  { name: 'May', customers: 7230 },
  { name: 'Jun', customers: 7640 },
  { name: 'Jul', customers: 8010 },
  { name: 'Aug', customers: 8420 },
];

export const topProducts = [
  { name: 'Bhagavad Gita - Hindi', sales: 412, revenue: 247188 },
  { name: 'Brass Diya Set', sales: 298, revenue: 238102 },
  { name: 'Premium Rudraksha Mala', sales: 234, revenue: 233766 },
  { name: '7 Chakra Crystal Set', sales: 178, revenue: 267822 },
  { name: 'Copper Yantra', sales: 156, revenue: 389844 },
];

export const topCourses = [
  { name: 'Meditation & Spirituality', students: 567, revenue: 1700433 },
  { name: 'Vedic Astrology Basics', students: 342, revenue: 1709658 },
  { name: 'Learn Kundli Reading', students: 218, revenue: 1523782 },
  { name: 'Vastu Shastra Fundamentals', students: 189, revenue: 1039311 },
  { name: 'Advanced Palmistry', students: 95, revenue: 759905 },
];

export const topExperts = [
  { name: 'Pandit Rajesh Sharma', bookings: 342, revenue: 341658 },
  { name: 'Acharya Meena Iyer', bookings: 278, revenue: 416722 },
  { name: 'Pandit Krishna Murthy', bookings: 234, revenue: 210066 },
  { name: 'Dr. Suresh Verma', bookings: 198, revenue: 395802 },
  { name: 'Jyotish Priya Gupta', bookings: 167, revenue: 133433 },
];
