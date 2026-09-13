import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing database to allow clean updates
  await prisma.faculty.deleteMany({});
  await prisma.alumni.deleteMany({});
  await prisma.gallery.deleteMany({});
  await prisma.blog.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.news.deleteMany({});
  await prisma.pageContent.deleteMany({});

  // Create default admin
  const adminUsername = 'admin';
  const adminPassword = 'admin123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.admin.upsert({
    where: { username: adminUsername },
    update: {},
    create: {
      username: adminUsername,
      password: hashedPassword,
    },
  });
  console.log('Admin user created successfully (username: admin, password: admin123).');

  // Seed Homepage content
  const homeContent = {
    hero: {
      tagline: 'Empowering Minds, Shaping Futures',
      subtitle: 'Welcome to Lather High School, Karnal\nA distinguished institution offering education from UKG to Class 12. With a legacy of academic excellence, strong values, and holistic development, we are committed to nurturing confident, responsible, and well-rounded individuals prepared to shape a brighter future.',
      imageUrl: '/images/school-photo.jpg',
      ctaPrimary: 'Admissions open 2026-27',
      ctaSecondary: 'Explore Campus'
    },
    welcome: {
      title: 'Welcome Message',
      text: 'At Lather High School, Karnal, we believe that education is about more than academic achievement. It is about nurturing curiosity, confidence, discipline, and strong values in every student.\n\nWe strive to provide a supportive environment where students can learn, grow, explore their talents, and develop into well-rounded individuals.\n\nOur goal is to prepare every child for a bright future with knowledge, character, and a sense of responsibility towards society.',
      image: '/images/director.jpg',
      principalName: 'Ms. Poonam Lather',
      principalTitle: 'Principal, Lather High School'
    },
    whyChooseUs: [
      {
        title: 'Experienced Faculty',
        description: 'Dedicated and experienced teachers who guide students with care, encouragement, and individual attention.',
        icon: 'Award'
      },
      {
        title: 'Academic Excellence',
        description: 'A strong focus on academic fundamentals, disciplined learning, and helping every student achieve their full potential.',
        icon: 'BookOpen'
      },
      {
        title: 'Values & Discipline',
        description: 'We believe in building strong character through discipline, respect, responsibility, and good values.',
        icon: 'Shield'
      },
      {
        title: 'Sports & Activities',
        description: 'Encouraging students to participate in sports and co-curricular activities to develop confidence, teamwork, and a healthy spirit.',
        icon: 'Activity'
      },
      {
        title: 'Supportive Environment',
        description: 'A caring and positive school environment where students feel encouraged to learn, express themselves, and grow.',
        icon: 'Sparkles'
      },
      {
        title: 'Opportunity for Every Child',
        description: 'We believe that a child’s potential should never be limited by financial circumstances. Our vision is to create a nurturing and inclusive environment where children from diverse backgrounds can learn, grow, and build a brighter future.',
        icon: 'Heart'
      }
    ],
    stats: {
      yearsOfExcellence: 41,
      students: 1800,
      teachers: 120,
      awards: 85
    }
  };

  await prisma.pageContent.upsert({
    where: { key: 'home' },
    update: {},
    create: {
      key: 'home',
      value: JSON.stringify(homeContent),
    },
  });

  // Seed About Page content
  const aboutContent = {
    history: 'Lather High School was founded in 1985 with a visionary spirit to establish a premier co-educational residential-cum-day school in Karnal, Haryana. Over the last four decades, the school has evolved into an educational powerhouse, setting standards in progressive learning pedagogy, modern labs, and high-performance sports environments.',
    mission: 'To provide a stimulating learning environment that encourages curiosity, critical thinking, creative expression, and moral character. We strive to mold students into confident, responsible, and skilled leaders of tomorrow.',
    vision: 'To make quality education accessible to every child, regardless of their financial circumstances. We believe that a child’s dreams and potential should never be limited by their ability to afford education. Our vision is to create an inclusive and nurturing environment where every student has the opportunity to learn, grow, and build a brighter future.',
    philosophy: 'Our academic philosophy, "Learning by Doing," is inspired by the best editorial schools. We combine traditional academic discipline with design thinking, collaborative group problem solving, and technological integration. Every student is mentored to pursue intellectual excellence alongside physical well-being, creative exploration, and social responsibility.',
    timeline: [
      { year: '1985', event: 'Lather High School established in Karnal with 150 students.' },
      { year: '2007', event: 'Inauguration of the state-of-the-art Science Wing and Library.' },
      { year: '2012', event: 'Received CBSE National Award for Academic Excellence.' },
      { year: '2018', event: 'Completion of the Sports Complex, featuring an indoor swimming pool.' },
      { year: '2023', event: 'Launched AI & Robotics center and implemented clean green solar-powered campus.' },
      { year: '2026', event: 'Celebrating 41 years of educational excellence.' }
    ],
    infrastructure: [
      {
        title: 'Smart Classrooms',
        description: 'Interactive touch panels, ergonomic seating, and individual smart devices integration.',
        image: '/images/classroom.jpg'
      },
      {
        title: 'Research-Grade Labs',
        description: 'Fully equipped Physics, Chemistry, Biology, and computer sciences centers.',
        image: '/images/computer-lab.jpg'
      },
      {
        title: 'Elite Library',
        description: 'A repository of over 20,000 physical books, digital catalogs, and international journals.',
        image: '/images/library.jpg'
      }
    ]
  };

  await prisma.pageContent.upsert({
    where: { key: 'about' },
    update: {},
    create: {
      key: 'about',
      value: JSON.stringify(aboutContent),
    },
  });

  // Seed Alumni
  const alumniData = [
    {
      name: 'Aditya Sen',
      batch: '2012',
      currentPosition: 'Senior Software Engineer',
      company: 'Google, Mountain View',
      achievement: 'Pioneered AI models in search and mentored junior engineers.',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      linkedin: 'https://linkedin.com'
    },
    {
      name: 'Priyanka Chopra',
      batch: '2015',
      currentPosition: 'Consultant cardiologist',
      company: 'Max Healthcare, Delhi',
      achievement: 'Top ranker in NEET PG and published research in international cardiology journals.',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      linkedin: 'https://linkedin.com'
    },
    {
      name: 'Ranveer Singh',
      batch: '2018',
      currentPosition: 'Founder & CEO',
      company: 'GreenDrive Mobility',
      achievement: 'Successfully raised $3M in seed funding for EV logistics startup in India.',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
      linkedin: 'https://linkedin.com'
    }
  ];

  for (const alumni of alumniData) {
    await prisma.alumni.create({ data: alumni });
  }

  // Seed Faculty
  const facultyData = [
    {
      name: 'Mr. Arvind Saxena',
      department: 'Mathematics',
      qualification: 'M.Sc, B.Ed (Delhi University)',
      experience: '15 Years',
      photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
      bio: 'Mr. Saxena specializes in Calculus and Algebra. He has pioneered interactive visual geometry techniques that help students easily grasp complex three-dimensional curves.'
    },
    {
      name: 'Dr. Meera Nanda',
      department: 'Science',
      qualification: 'Ph.D in Chemistry, Net Qualified',
      experience: '12 Years',
      photoUrl: 'https://images.unsplash.com/photo-1580894732444-8fecef2271ff?auto=format&fit=crop&q=80&w=400',
      bio: 'Dr. Nanda handles senior secondary Chemistry. She is the supervisor of our award-winning organic chemistry lab and actively inspires students toward research in bio-plastics.'
    },
    {
      name: 'Mrs. Sarah D\'Souza',
      department: 'English Literature',
      qualification: 'M.A. English (JNU), M.Phil',
      experience: '18 Years',
      photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400',
      bio: 'Mrs. D\'Souza coaches the debating society and teaches literature. She emphasizes critical essay writing and organizes our prestigious annual inter-school lit-fest.'
    }
  ];

  for (const faculty of facultyData) {
    await prisma.faculty.create({ data: faculty });
  }

  // Seed Gallery
  const galleryData = [
    { type: 'image', category: 'Campus', url: '/images/school-campus.jpg', orderIndex: 1 },
    { type: 'image', category: 'Labs', url: '/images/computer-lab.jpg', orderIndex: 2 },
    { type: 'image', category: 'Sports', url: '/images/students-playing.jpg', orderIndex: 3 },
    { type: 'image', category: 'Events', url: '/images/dance-competition.jpg', orderIndex: 4 }
  ];

  for (const item of galleryData) {
    await prisma.gallery.create({ data: item });
  }

  // Seed Blogs
  const blogData = [
    {
      title: 'The Role of AI and Robotics in Modern Education',
      slug: 'role-of-ai-robotics-modern-education',
      content: '<p>Artificial Intelligence (AI) and robotics are no longer concepts confined to sci-fi novels. In today\'s pedagogical landscape, they play an essential role in training student minds to think computationally. At Lather High School, our advanced lab features automated robotic arms and IoT boards that let students code and build active solutions to real-world problems. Discover how this hands-on engineering is shaping future engineers.</p>',
      category: 'Technology',
      featuredImage: '/images/computer-lab.jpg',
      draft: false,
      publishedAt: new Date()
    },
    {
      title: 'Fostering a Culture of Reading: The LA Literary Program',
      slug: 'fostering-culture-of-reading-literary-program',
      content: '<p>In an age dominated by screens and prompt reels, deep-focus reading has become an endangered skill. Our library program at Lather High School challenges this trend. By scheduling dedicated reading hours and engaging students in literary debate, we help them develop strong analytical vocabulary and deep empathy. Read on to find out how our English faculty helps students love literature.</p>',
      category: 'Academics',
      featuredImage: '/images/library.jpg',
      draft: false,
      publishedAt: new Date()
    }
  ];

  for (const blog of blogData) {
    await prisma.blog.create({ data: blog });
  }

  // Seed Events & News
  const eventData = [
    { title: 'Annual Sports Meet 2026', date: '2026-10-15', description: 'Our annual inter-house athletics, swimming, and track championship matches at the main sports complex.', location: 'Main Athletic Arena' },
    { title: 'Silver Jubilee Alumni Reunion', date: '2026-11-20', description: 'Celebrating 25 years of excellence with alumni from all batches joining us for a gala dinner, speeches, and interactive student panels.', location: 'School Auditorium' }
  ];

  for (const event of eventData) {
    await prisma.event.create({ data: event });
  }

  const newsData = [
    { title: 'Lather High School Tops District CBSE Ranks', date: '2026-06-02', content: 'Our senior secondary students secured 100% pass percentages with 35 students scoring above 95% in CBSE boards.', imageUrl: '/images/award.jpg' },
    { title: 'Students Win National Robotics Olympiad', date: '2026-07-20', content: 'The LA Robotics club secured the gold trophy in the Junior Autonomous Vehicle division in Delhi.', imageUrl: '/images/competition.jpg' }
  ];

  for (const news of newsData) {
    await prisma.news.create({ data: news });
  }



  // Seed Donation page details
  const donationContent = {
    slogan: 'Together, We Can Shape More Futures',
    description: 'Education has the power to inspire lives and build a better tomorrow. Your support can help Lather High School provide greater opportunities for students, strengthen learning resources, and continue nurturing future generations. Every contribution, big or small, can make a meaningful difference in a student’s journey.',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=la.higherschool@sbi&pn=LA%20The%20Higher%20School&cu=INR',
    bankDetails: {
      bankName: 'State Bank of India',
      accountName: 'LATHER HIGH SCHOOL SOCIETY',
      accountNumber: '39485720194',
      ifsc: 'SBIN0001048',
      branch: 'Sector 12 Branch, Karnal',
    },
    causes: [
      { id: 'scholarship', title: 'Student Scholarships', description: 'Help talented students from economically weaker sections access quality education.' }
    ]
  };

  await prisma.pageContent.upsert({
    where: { key: 'donation' },
    update: {},
    create: {
      key: 'donation',
      value: JSON.stringify(donationContent),
    },
  });

  // Seed Contact details
  const contactContent = {
    phone: '+91 94665 18003, +91 81686 53159',
    email: 'admission@latherhighschool.com, latherhighschoo@gmail.com',
    address: 'Pritam nagar karnal 132001',
    mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3466.527390977239!2d76.9740523!3d29.684128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390e719c8fba56cf%3A0xe54d8a1fc414589d!2sKarnal%2C%20Haryana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
    officeHours: 'Monday - Saturday: 8:00 AM - 3:00 PM'
  };

  await prisma.pageContent.upsert({
    where: { key: 'contact' },
    update: {},
    create: {
      key: 'contact',
      value: JSON.stringify(contactContent),
    },
  });

  // Seed SEO content
  const seoContent = {
    metaTitle: 'Lather High School | Best School in Karnal, Haryana',
    metaDescription: 'Lather High School, Karnal - A prestigious CBSE educational institution offering elite academic standards, world-class athletic facilities, and holistic student-centric leadership coaching.',
    metaKeywords: 'Lather High School, Karnal School, Best CBSE School Karnal, Elite School Haryana, Top Residential School Karnal',
    openGraphImg: '/images/school-campus.jpg'
  };

  await prisma.pageContent.upsert({
    where: { key: 'seo' },
    update: {},
    create: {
      key: 'seo',
      value: JSON.stringify(seoContent),
    },
  });

  console.log('Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
