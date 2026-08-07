"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Award, BookOpen, Activity, Cpu, Shield, Sparkles, 
  ArrowRight, Calendar, MapPin, ChevronRight, Quote, Plus 
} from "lucide-react";
import { getHomepage, getEvents, getNews, getGallery, HomepageData, SchoolEvent, SchoolNews, GalleryItem } from "@/utils/api";

// --- Static Seed Fallbacks in case API server is unreachable ---
const fallbackHome: HomepageData = {
  hero: {
    tagline: "Empowering Minds, Shaping Futures",
    subtitle: "Welcome to Lather High School, Karnal. A legacy of academic excellence, premium infrastructure, and holistic character building.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-group-of-students-walking-in-a-university-campus-34384-large.mp4",
    ctaPrimary: "Admissions open 2026-27",
    ctaSecondary: "Explore Campus"
  },
  welcome: {
    title: "Principal's Welcome Message",
    text: "At Lather High School, Karnal, we believe that education is not merely the acquisition of knowledge but the spark that ignites a lifelong journey of discovery. Our custom-crafted curriculum integrates rigorous academics, state-of-the-art facilities, and competitive athletics. We are dedicated to nurturing resilient, empathetic, and intellectually curious individuals who are prepared to make meaningful contributions to the global community. I invite you to explore our campus and witness the vibrant spirit that makes Lather High School a premier choice for education.",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800",
    principalName: "Dr. Anuradha Sharma",
    principalTitle: "Principal, Lather High School"
  },
  whyChooseUs: [
    { title: "Experienced Faculty", description: "Our educators are leaders in their fields, bringing passion, innovation, and personalized guidance to every student.", icon: "Award" },
    { title: "Academic Excellence", description: "Consistent top CBSE ranks, robust college placement records, and comprehensive STEM & liberal arts curriculums.", icon: "BookOpen" },
    { title: "Sports & Athletics", description: "Olympic-size swimming pool, professional tennis courts, and multi-sport indoor stadiums to nurture elite athletics.", icon: "Activity" },
    { title: "Advanced Tech & Labs", description: "Modern robotics labs, coding clubs, smart classrooms, and 3D printing equipment for active learning.", icon: "Cpu" },
    { title: "Secure & Green Campus", description: "A lush 15-acre campus with 24/7 smart surveillance, smart cards, and eco-friendly infrastructure.", icon: "Shield" },
    { title: "Holistic Development", description: "Strong arts, music, dramatics, debates, and community services programs building well-rounded global citizens.", icon: "Sparkles" }
  ],
  stats: {
    yearsOfExcellence: 25,
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
  { id: 1, title: "Lather High School Tops District CBSE Ranks", date: "2026-06-02", content: "Our senior secondary students secured 100% pass percentages with 35 students scoring above 95% in CBSE boards.", imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800" },
  { id: 2, title: "Students Win National Robotics Olympiad", date: "2026-07-20", content: "The LA Robotics club secured the gold trophy in the Junior Autonomous Vehicle division in Delhi.", imageUrl: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&q=80&w=800" }
];

const fallbackGallery: GalleryItem[] = [
  { id: 1, type: "image", category: "Campus", url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800", orderIndex: 1 },
  { id: 2, type: "image", category: "Labs", url: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&q=80&w=800", orderIndex: 2 },
  { id: 3, type: "image", category: "Sports", url: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&q=80&w=800", orderIndex: 3 },
  { id: 4, type: "image", category: "Events", url: "https://images.unsplash.com/photo-1460518451285-cd7afbc11b0b?auto=format&fit=crop&q=80&w=800", orderIndex: 4 }
];

const iconMap: Record<string, any> = {
  Award,
  BookOpen,
  Activity,
  Cpu,
  Shield,
  Sparkles,
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

  return (
    <div className="relative w-full">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[95vh] w-full flex flex-col justify-center pt-24 items-center overflow-hidden bg-black">
        {/* Background Cinematic Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
          src={homeData.hero.videoUrl}
        />
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40 z-10" />

        {/* Content Box */}
        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center text-white flex flex-col items-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <img src="/schoollogo.png" alt="School Logo" className="h-24 w-auto mx-auto drop-shadow-2xl bg-white/10 rounded-full p-2" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-heading text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6 drop-shadow-md leading-none"
          >
            {homeData.hero.tagline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-body text-base sm:text-lg lg:text-xl text-white/80 max-w-3xl mb-10 leading-relaxed font-light"
          >
            {homeData.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/payment"
              className="font-nav bg-primary hover:bg-primary/95 text-white py-3.5 px-8 rounded-full text-sm font-semibold uppercase tracking-wider shadow-lg shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              {homeData.hero.ctaPrimary}
            </Link>
            <Link
              href="/about"
              className="font-nav bg-white/10 hover:bg-white/20 text-white border border-white/20 py-3.5 px-8 rounded-full text-sm font-semibold uppercase tracking-wider backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5"
            >
              {homeData.hero.ctaSecondary}
            </Link>
          </motion.div>

        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 opacity-60">
          <span className="text-[10px] uppercase tracking-[0.25em] text-white font-semibold">Scroll</span>
          <div className="w-[1.5px] h-10 bg-white/30 rounded relative overflow-hidden">
            <motion.div
              animate={{ y: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-full h-1/2 bg-accent"
            />
          </div>
        </div>
      </section>

      {/* 2. WELCOME / PRINCIPAL MESSAGE */}
      <section className="py-24 bg-white px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative"
          >
            <div className="absolute -inset-4 border border-primary/10 rounded-2xl transform rotate-2 pointer-events-none" />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white hover-zoom-container">
              <img
                src={homeData.welcome.image}
                alt="Principal"
                className="w-full h-[450px] object-cover hover-zoom-img"
              />
            </div>
            <div className="absolute bottom-6 right-6 bg-secondary text-white py-4 px-6 rounded-xl shadow-xl">
              <p className="font-heading text-lg font-bold text-white leading-tight">{homeData.welcome.principalName}</p>
              <p className="text-xs text-white/70 mt-1 uppercase tracking-wider">{homeData.welcome.principalTitle}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            <span className="font-nav text-xs font-bold uppercase tracking-[0.3em] text-primary">Founders Message</span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              {homeData.welcome.title}
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
                  className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="w-12 h-12 bg-primary/5 group-hover:bg-primary text-primary group-hover:text-white rounded-xl flex items-center justify-center mb-6 transition-colors duration-300">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
                  <p className="font-body text-sm text-gray-500 leading-relaxed">{card.description}</p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. ACHIEVEMENTS / COUNTERS */}
      <section className="relative py-20 bg-secondary text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary to-indigo-950 opacity-90 z-10" />
        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          
          <div className="flex flex-col gap-2">
            <span className="font-heading text-5xl lg:text-6xl font-bold text-accent">{homeData.stats.yearsOfExcellence}+</span>
            <span className="font-nav text-xs font-semibold uppercase tracking-wider text-white/60">Years of Legacy</span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-heading text-5xl lg:text-6xl font-bold text-accent">{homeData.stats.students}+</span>
            <span className="font-nav text-xs font-semibold uppercase tracking-wider text-white/60">Enrolled Students</span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-heading text-5xl lg:text-6xl font-bold text-accent">{homeData.stats.teachers}+</span>
            <span className="font-nav text-xs font-semibold uppercase tracking-wider text-white/60">Expert Faculty</span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-heading text-5xl lg:text-6xl font-bold text-accent">{homeData.stats.awards}+</span>
            <span className="font-nav text-xs font-semibold uppercase tracking-wider text-white/60">National Awards</span>
          </div>

        </div>
      </section>

      {/* 5. NEWS & TIMELINE EVENTS */}
      <section className="py-24 bg-white px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Latest News Column */}
          <div className="lg:col-span-7">
            <div className="flex justify-between items-end mb-10">
              <div>
                <span className="font-nav text-xs font-bold uppercase tracking-[0.3em] text-primary">Media Bulletin</span>
                <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">Latest Campus News</h2>
              </div>
              <Link href="/blog" className="font-nav text-xs font-bold text-secondary hover:text-primary transition-colors flex items-center gap-1">
                View All Blog Posts
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            
            <div className="flex flex-col gap-8">
              {news.slice(0, 2).map((item) => (
                <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-6 bg-bg-light border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="sm:col-span-5 h-48 sm:h-auto relative overflow-hidden">
                    <img src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="sm:col-span-7 p-6 flex flex-col justify-between">
                    <div>
                      <span className="text-xs text-primary font-semibold">{new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      <h3 className="font-heading text-lg font-bold text-gray-900 mt-2 mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="font-body text-sm text-gray-500 line-clamp-3 leading-relaxed">{item.content.replace(/<[^>]*>/g, '')}</p>
                    </div>
                    <Link href={`/blog`} className="font-nav text-xs font-semibold text-secondary hover:text-primary inline-flex items-center gap-1.5 mt-4">
                      Read More
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events Column */}
          <div className="lg:col-span-5">
            <div className="mb-10">
              <span className="font-nav text-xs font-bold uppercase tracking-[0.3em] text-primary">Academic Calendar</span>
              <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">Upcoming Events</h2>
            </div>

            <div className="flex flex-col gap-6">
              {events.slice(0, 3).map((item) => {
                const eventDate = new Date(item.date);
                const day = eventDate.getDate();
                const month = eventDate.toLocaleDateString('en-US', { month: 'short' });
                return (
                  <div key={item.id} className="flex gap-5 items-start bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col items-center justify-center bg-primary text-white w-14 h-14 rounded-xl shrink-0">
                      <span className="font-heading text-xl font-bold leading-none">{day}</span>
                      <span className="font-nav text-[10px] uppercase font-semibold mt-1">{month}</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <h3 className="font-heading text-base font-bold text-gray-900 leading-snug">{item.title}</h3>
                      <p className="font-body text-xs text-gray-500 line-clamp-2 leading-relaxed">{item.description}</p>
                      <div className="flex items-center gap-4 text-[11px] text-gray-400 mt-1.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-accent" />
                          {item.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-accent" />
                          {item.location}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* 6. TESTIMONIAL SLIDER */}
      <section className="py-24 bg-bg-light px-6 lg:px-8 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-nav text-xs font-bold uppercase tracking-[0.3em] text-primary">Voices of LA</span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-2 mb-4 leading-tight">Testimonials</h2>
            <div className="w-12 h-[3px] bg-accent mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm flex flex-col justify-between relative">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10" />
              <p className="font-body text-sm text-gray-500 leading-relaxed mb-6 italic">
                "Our son's transformation at LA has been incredible. The focus on coding, debate, and outdoor sports has built a level of independence and analytical clarity that traditional syllabus schooling could never accomplish. Truly Karnal's premium school!"
              </p>
              <div>
                <h4 className="font-heading text-base font-bold text-gray-900">Dr. Sunita Mehta</h4>
                <p className="text-xs text-gray-400">Parent of Class XI Student</p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm flex flex-col justify-between relative">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10" />
              <p className="font-body text-sm text-gray-500 leading-relaxed mb-6 italic">
                "The residential life at LA feels like a cohesive global community. Faculty live on campus and are available to help with advanced math questions or chess strategies even at 8 PM. It has redefined student boarding for me."
              </p>
              <div>
                <h4 className="font-heading text-base font-bold text-gray-900">Kabir Chauhan</h4>
                <p className="text-xs text-gray-400">Class XII Student & Sports Captain</p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm flex flex-col justify-between relative">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10" />
              <p className="font-body text-sm text-gray-500 leading-relaxed mb-6 italic">
                "Coming from LA, transition to Google Research was seamless. The school taught me structured programming and academic discipline that set a rock-solid foundation for university and work. Proud of my roots."
              </p>
              <div>
                <h4 className="font-heading text-base font-bold text-gray-900">Aditya Sen</h4>
                <p className="text-xs text-gray-400">Alumni, Batch of 2012 (Senior Software Engineer, Google)</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. GALLERY PREVIEW */}
      <section className="py-24 bg-white px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
            <div>
              <span className="font-nav text-xs font-bold uppercase tracking-[0.3em] text-primary">Visual Narrative</span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-2">Campus Highlights</h2>
            </div>
            <div className="flex gap-4">
              {/* Fake upload button to preview CMS functionality */}
              <Link
                href="/admin/login"
                className="font-nav text-xs font-semibold uppercase tracking-wider border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-full flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-primary" />
                Upload Photo
              </Link>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {gallery.slice(0, 4).map((item) => (
              <div 
                key={item.id} 
                className="group relative h-72 rounded-2xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer hover-zoom-container"
                onClick={() => setActivePhoto(item.url)}
              >
                <img 
                  src={item.url} 
                  alt={item.category} 
                  className="absolute inset-0 w-full h-full object-cover hover-zoom-img"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6" />
                <span className="absolute bottom-6 left-6 z-10 font-nav text-xs font-bold uppercase tracking-widest text-white translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  {item.category}
                </span>
              </div>
            ))}
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
