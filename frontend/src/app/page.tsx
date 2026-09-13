"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Award, BookOpen, Activity, Cpu, Shield, Sparkles, Heart,
  ArrowRight, Calendar, MapPin, ChevronRight, Quote, Plus 
} from "lucide-react";
import { getHomepage, getEvents, getNews, getGallery, HomepageData, SchoolEvent, SchoolNews, GalleryItem } from "@/utils/api";

// --- Static Seed Fallbacks in case API server is unreachable ---
const fallbackHome: HomepageData = {
  hero: {
    tagline: "Empowering Minds, Shaping Futures",
    subtitle: "Welcome to Lather High School, Karnal\nA distinguished institution offering education from UKG to Class 10th. With a legacy of academic excellence, strong values, and holistic development, we are committed to nurturing confident, responsible, and well-rounded individuals prepared to shape a brighter future.",
    imageUrl: "/images/school-photo.jpg",
    ctaPrimary: "Admissions open 2026-27",
    ctaSecondary: "Explore Campus"
  },
  welcome: {
    title: "Welcome Message",
    text: "At Lather High School, Karnal, we believe that education is about more than academic achievement. It is about nurturing curiosity, confidence, discipline, and strong values in every student.\n\nWe strive to provide a supportive environment where students can learn, grow, explore their talents, and develop into well-rounded individuals.\n\nOur goal is to prepare every child for a bright future with knowledge, character, and a sense of responsibility towards society.",
    image: "/images/director-principal.jpg",
    principalName: "Ms. Poonam Lather",
    principalTitle: "Principal, Lather High School"
  },
  whyChooseUs: [
    { title: "Experienced Faculty", description: "Dedicated and experienced teachers who guide students with care, encouragement, and individual attention.", icon: "Award" },
    { title: "Academic Excellence", description: "A strong focus on academic fundamentals, disciplined learning, and helping every student achieve their full potential.", icon: "BookOpen" },
    { title: "Values & Discipline", description: "We believe in building strong character through discipline, respect, responsibility, and good values.", icon: "Shield" },
    { title: "Sports & Activities", description: "Encouraging students to participate in sports and co-curricular activities to develop confidence, teamwork, and a healthy spirit.", icon: "Activity" },
    { title: "Supportive Environment", description: "A caring and positive school environment where students feel encouraged to learn, express themselves, and grow.", icon: "Sparkles" },
    { title: "Opportunity for Every Child", description: "We believe that a child’s potential should never be limited by financial circumstances. Our vision is to create a nurturing and inclusive environment where children from diverse backgrounds can learn, grow, and build a brighter future.", icon: "Heart" }
  ],
  stats: {
    yearsOfExcellence: 41,
    students: 1800,
    teachers: 120,
    awards: 85
  }
};

const fallbackEvents: SchoolEvent[] = [
  { id: 1, title: "Annual Sports Meet 2026", date: "2026-10-15", description: "Our annual inter-house athletics, swimming, and track championship matches at the main sports complex.", location: "Main Athletic Arena" },
  { id: 2, title: "Silver Jubilee Alumni Reunion", date: "2026-11-20", description: "Celebrating 25 years of excellence with alumni from all batches joining us for a gala dinner, speeches, and interactive student panels.", location: "School Auditorium" }
];

const fallbackNews: SchoolNews[] = [
  { id: 1, title: "Lather High School Achieves Outstanding Board Results", date: "2026-06-02", content: "Our students secured 100% pass percentages with exemplary scores in board examinations.", imageUrl: "/images/award.jpg" },
  { id: 2, title: "Students Win National Robotics Olympiad", date: "2026-07-20", content: "The Lather High School Robotics club secured the gold trophy in the Junior Autonomous Vehicle division in Delhi.", imageUrl: "/images/competition.jpg" }
];

const fallbackGallery: GalleryItem[] = [
  { id: 1, type: "image", category: "Campus", url: "/images/school-campus.jpg", orderIndex: 1 },
  { id: 2, type: "image", category: "Labs", url: "/images/computer-lab.jpg", orderIndex: 2 },
  { id: 3, type: "image", category: "Sports", url: "/images/physical-exercise.jpg", orderIndex: 3 },
  { id: 4, type: "image", category: "Events", url: "/images/dance-competition.jpg", orderIndex: 4 }
];

const iconMap: Record<string, any> = {
  Award,
  BookOpen,
  Activity,
  Cpu,
  Shield,
  Sparkles,
  Heart,
};

export default function HomePage() {
  const [homeData, setHomeData] = useState<HomepageData>(fallbackHome);
  const [events, setEvents] = useState<SchoolEvent[]>(fallbackEvents);
  const [news, setNews] = useState<SchoolNews[]>(fallbackNews);
  const [gallery, setGallery] = useState<GalleryItem[]>(fallbackGallery);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const home = await getHomepage();
      if (home) setHomeData(home);

      const evs = await getEvents();
      if (evs && evs.length > 0) setEvents(evs);

      const nw = await getNews();
      if (nw && nw.length > 0) setNews(nw);

      const gal = await getGallery();
      if (gal && gal.length > 0) setGallery(gal);
    }
    loadData();
  }, []);

  // Split subtitle nicely if line break exists or format as requested
  const rawSubtitle = homeData.hero.subtitle || fallbackHome.hero.subtitle;
  const subtitleLines = rawSubtitle.split("\n");

  return (
    <div className="relative w-full">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] sm:min-h-[95vh] w-full flex flex-col justify-center pt-28 pb-16 items-center overflow-hidden bg-slate-900">
        {/* Background School Campus Photo with clean fitting and cinematic gentle scale */}
        <motion.div 
          className="absolute inset-0 w-full h-full"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        >
          <img
            src={homeData.hero.imageUrl || "/images/school-photo.jpg"}
            alt="Lather High School Campus Building"
            className="w-full h-full object-cover object-center sm:object-[center_35%]"
          />
        </motion.div>

        {/* Rich atmospheric overlays: reveals the school photo vividly while ensuring pristine readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/55 to-slate-950/75 z-10" />
        <div className="absolute inset-0 bg-secondary/20 mix-blend-multiply z-10" />

        {/* Content Box */}
        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center text-white flex flex-col items-center">
          
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6 inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 shadow-2xl"
          >
            <img src="/schoollogo.png" alt="School Logo" className="h-8 w-auto drop-shadow-md" />
            <span className="font-nav text-xs font-semibold tracking-wider text-white uppercase">
              Lather High School • Karnal
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-heading text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6 drop-shadow-xl leading-tight"
          >
            {homeData.hero.tagline}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-body text-base sm:text-lg lg:text-xl text-white/95 max-w-3xl mb-10 leading-relaxed font-normal drop-shadow-md space-y-2"
          >
            {subtitleLines.length > 1 ? (
              <>
                <p className="font-semibold text-accent/95 text-lg sm:text-xl lg:text-2xl drop-shadow">
                  {subtitleLines[0]}
                </p>
                <p className="text-white/90 text-sm sm:text-base lg:text-lg leading-relaxed">
                  {subtitleLines.slice(1).join("\n")}
                </p>
              </>
            ) : (
              <p className="whitespace-pre-line">{rawSubtitle}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center"
          >
            <Link
              href="/admission"
              className="font-nav bg-primary hover:bg-primary/90 text-white py-3.5 px-8 rounded-full text-sm font-semibold uppercase tracking-wider shadow-xl shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary/50 text-center"
            >
              {homeData.hero.ctaPrimary || "Admissions open 2026-27"}
            </Link>
            <Link
              href="/about"
              className="font-nav bg-white/20 hover:bg-white/30 text-white border border-white/35 py-3.5 px-8 rounded-full text-sm font-semibold uppercase tracking-wider backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 shadow-lg text-center"
            >
              {homeData.hero.ctaSecondary}
            </Link>
          </motion.div>

        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 opacity-80">
          <span className="text-[10px] uppercase tracking-[0.25em] text-white font-semibold drop-shadow">Scroll</span>
          <div className="w-[1.5px] h-10 bg-white/40 rounded relative overflow-hidden">
            <motion.div
              animate={{ y: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-full h-1/2 bg-accent"
            />
          </div>
        </div>
      </section>

      {/* 2. WELCOME MESSAGE SECTION */}
      <section className="py-24 bg-white px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Combined Leadership Photo: Director Mr. Kanwar Singh Lather & Principal Ms. Poonam Lather */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative"
          >
            <div className="absolute -inset-4 border border-primary/10 rounded-3xl transform rotate-1 pointer-events-none" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white group hover-zoom-container">
              <div className="h-[480px] sm:h-[520px] w-full overflow-hidden bg-gray-100">
                <img
                  src="/images/director-principal.jpg"
                  alt="Mr. Kanwar Singh Lather (Director) & Ms. Poonam Lather (Principal)"
                  className="w-full h-full object-cover object-top hover-zoom-img"
                />
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-6 text-white flex flex-col justify-end">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-heading text-base sm:text-lg font-bold text-white">Mr. Kanwar Singh Lather</span>
                  <span className="text-xs bg-primary/90 text-white font-nav font-bold uppercase tracking-wider px-2 py-0.5 rounded">Director</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-heading text-base sm:text-lg font-bold text-white">Ms. Poonam Lather</span>
                  <span className="text-xs bg-accent text-white font-nav font-bold uppercase tracking-wider px-2 py-0.5 rounded">Principal</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {homeData.welcome.title || "Welcome Message"}
            </h2>
            <div className="w-16 h-[3px] bg-accent" />
            <p className="font-body text-gray-600 leading-relaxed text-base whitespace-pre-line">
              {homeData.welcome.text}
            </p>
            <div className="mt-4">
              <Link 
                href="/about" 
                className="font-nav group inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary transition-colors"
              >
                Discover Our Academic Philosophy
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 3. WHY CHOOSE US (ANIMATED CARDS) */}
      <section className="py-24 bg-bg-light px-6 lg:px-8 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-nav text-xs font-bold uppercase tracking-[0.3em] text-primary">Core Pillars</span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-3 mb-4 leading-tight">
              Why Choose Lather High School
            </h2>
            <div className="w-12 h-[3px] bg-accent mx-auto mb-4" />
            <p className="font-body text-gray-500">
              A breakdown of the educational framework and high-end infrastructure that drives academic excellence at Karnal's premium school.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {homeData.whyChooseUs.map((card, idx) => {
              const IconComp = iconMap[card.icon] || Award;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col"
                >
                  <div className="w-12 h-12 bg-primary/5 group-hover:bg-primary text-primary group-hover:text-white rounded-xl flex items-center justify-center mb-6 transition-colors duration-300">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
                  <p className="font-body text-sm text-gray-500 leading-relaxed flex-grow">{card.description}</p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. SCHOOL CULTURE SECTION */}
      <section className="py-24 bg-white px-6 lg:px-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-nav text-xs font-bold uppercase tracking-[0.3em] text-primary">Our School Culture</span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-3 mb-4 leading-tight">
              Life & Values at Lather High School
            </h2>
            <div className="w-12 h-[3px] bg-accent mx-auto mb-4" />
            <p className="font-body text-gray-500">
              A glimpse into the daily lives of our students, where spiritual harmony and deep academic focus blend to build complete characters.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Prayer and Spiritual assembly */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-bg-light border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div className="h-80 relative overflow-hidden bg-gray-100">
                <img 
                  src="/images/prayer.jpg" 
                  alt="Students in Morning Prayer Assembly" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="p-8">
                <h3 className="font-heading text-2xl font-bold text-gray-900 mb-3">Morning Assembly & Values</h3>
                <p className="font-body text-sm text-gray-500 leading-relaxed">
                  Each day begins with a meaningful morning assembly that encourages discipline, gratitude, positive thinking, and a strong sense of unity among our students. It sets a positive tone for the day ahead.
                </p>
              </div>
            </motion.div>

            {/* Study and Academic hours */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-bg-light border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div className="h-80 relative overflow-hidden bg-gray-100">
                <img 
                  src="/images/teacher-teaching.jpg" 
                  alt="Teacher Teaching Students in Classroom" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="p-8">
                <h3 className="font-heading text-2xl font-bold text-gray-900 mb-3">Academic Dedication & Learning</h3>
                <p className="font-body text-sm text-gray-500 leading-relaxed">
                  We encourage students to develop strong study habits, curiosity, and a genuine interest in learning. With the guidance of our teachers, students are encouraged to think independently, work together, and build confidence in their abilities.
                </p>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* 5. REAL CLIENT TESTIMONIALS */}
      <section className="py-24 bg-bg-light px-6 lg:px-8 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-nav text-xs font-bold uppercase tracking-[0.3em] text-primary">Voices of LA</span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-2 mb-4 leading-tight">Testimonials</h2>
            <div className="w-12 h-[3px] bg-accent mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Testimonial 1: Himanshu Kashyap */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm flex flex-col justify-between relative hover:shadow-md transition-shadow">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10" />
              <p className="font-body text-sm text-gray-600 leading-relaxed mb-6 italic">
                "Hello everyone, I am Himanshu Kashyap, an alumnus (pass-out student). I would like to share my experience regarding the quality of education here. If you are looking for top-notch study material, excellent guidance, and a great learning environment, Lather Institute is the best place to be. The faculty is extremely supportive, and the teaching methodology helps build a very strong foundation. Highly recommended for every serious student!"
              </p>
              <div className="border-t border-gray-50 pt-4">
                <h4 className="font-heading text-base font-bold text-gray-900">Himanshu Kashyap</h4>
                <p className="text-xs text-primary font-semibold font-nav uppercase tracking-wider mt-0.5">Alumnus (Pass-Out Student)</p>
              </div>
            </div>

            {/* Testimonial 2: Suchita Yadav */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm flex flex-col justify-between relative hover:shadow-md transition-shadow">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10" />
              <p className="font-body text-sm text-gray-600 leading-relaxed mb-6 italic">
                "Securing 98% marks as a student of Lather High School (Batch 2023-24) is a moment of immense pride for me. I have been able to achieve this milestone only because of the excellent education and supportive teachers here. A heartfelt thank you to Lather High School for the right guidance and best education!"
              </p>
              <div className="border-t border-gray-50 pt-4">
                <h4 className="font-heading text-base font-bold text-gray-900">Suchita Yadav</h4>
                <p className="text-xs text-primary font-semibold font-nav uppercase tracking-wider mt-0.5">Student • Batch 2023-24 (98% Board Score)</p>
              </div>
            </div>

            {/* Testimonial 3: Ritu Lather */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm flex flex-col justify-between relative hover:shadow-md transition-shadow">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10" />
              <p className="font-body text-sm text-gray-600 leading-relaxed mb-6 italic">
                "Lather High School is where my journey began. The values, discipline, and academic strength I received here became the base of my life. From those classrooms to working internationally today, I carry my school with me in everything I do."
              </p>
              <div className="border-t border-gray-50 pt-4">
                <h4 className="font-heading text-base font-bold text-gray-900">Ritu Lather</h4>
                <p className="text-xs text-primary font-semibold font-nav uppercase tracking-wider mt-0.5">Alumna • Working Internationally</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. GALLERY PREVIEW */}
      <section className="py-24 bg-white px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
            <div>
              <span className="font-nav text-xs font-bold uppercase tracking-[0.3em] text-primary">Visual Narrative</span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-2">Campus Highlights</h2>
            </div>
            <div>
              <Link 
                href="/gallery" 
                className="inline-flex items-center gap-2 font-nav text-xs font-bold uppercase tracking-wider text-primary border-b-2 border-primary/20 hover:border-primary pb-1 transition-all duration-300"
              >
                Explore Full Gallery &rarr;
              </Link>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Campus', 'Labs', 'Sports', 'Events'].map((categoryName) => {
              const matchedItem = gallery.find((g) => g.category?.toLowerCase() === categoryName.toLowerCase()) || 
                                  fallbackGallery.find((f) => f.category?.toLowerCase() === categoryName.toLowerCase()) ||
                                  fallbackGallery[0];
              return (
                <div 
                  key={categoryName} 
                  className="group relative h-72 rounded-2xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer hover-zoom-container bg-gray-100"
                  onClick={() => setActivePhoto(matchedItem.url)}
                >
                  <img 
                    src={matchedItem.url} 
                    alt={matchedItem.category} 
                    className="absolute inset-0 w-full h-full object-cover hover-zoom-img"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-6" />
                  <div className="absolute bottom-5 left-5 right-5 z-10">
                    <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-md font-nav text-[10px] font-bold uppercase tracking-widest text-white mb-1 shadow-sm">
                      {categoryName}
                    </span>
                    <h3 className="font-heading text-lg font-bold text-white drop-shadow-sm leading-tight">
                      {categoryName === 'Campus' ? 'Campus & Building' :
                       categoryName === 'Labs' ? 'Computer & Tech Lab' :
                       categoryName === 'Sports' ? 'Athletics & Training' :
                       'Events & Celebrations'}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {activePhoto && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setActivePhoto(null)}
        >
          <button className="absolute top-6 right-6 text-white text-4xl">&times;</button>
          <img src={activePhoto} alt="Zoomed view" className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain cursor-default" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

    </div>
  );
}
