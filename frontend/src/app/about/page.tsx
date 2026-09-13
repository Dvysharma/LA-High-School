"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Compass, Eye, ShieldCheck, Library, Globe, Heart } from "lucide-react";
import { getAboutpage, AboutpageData } from "@/utils/api";

const fallbackAbout: AboutpageData = {
  history: 'Lather High School was founded in 1985 with a visionary spirit to establish a premier co-educational residential-cum-day school in Karnal, Haryana. Over the last four decades, the school has evolved into an educational powerhouse, setting standards in progressive learning pedagogy, modern labs, and high-performance sports environments.',
  mission: 'To provide a stimulating learning environment that encourages curiosity, critical thinking, creative expression, and moral character. We strive to mold students into confident, responsible, and skilled leaders of tomorrow.',
  vision: 'To make quality education accessible to every child, regardless of their financial circumstances. We believe that a child’s dreams and potential should never be limited by their ability to afford education. Our vision is to create an inclusive and nurturing environment where every student has the opportunity to learn, grow, and build a brighter future.',
  philosophy: 'Our academic philosophy, "Learning by Doing," is inspired by the best editorial schools. We combine traditional academic discipline with design thinking, collaborative group problem solving, and technological integration. Every student is mentored to pursue intellectual excellence alongside physical well-being, creative exploration, and social responsibility.',
  timeline: [
    { year: '1985', event: 'Lather High School established in Karnal with 150 students.' },
    { year: '2007', event: 'Inauguration of the state-of-the-art Science Wing and Library.' },
    { year: '2012', event: 'Received State Award for Academic Excellence.' },
    { year: '2018', event: 'Completion of the Sports Complex, featuring an indoor swimming pool.' },
    { year: '2023', event: 'Launched AI & Robotics center and implemented clean green solar-powered campus.' },
    { year: '2026', event: 'Celebrating 41 years of educational excellence.' }
  ],
  infrastructure: [
    { title: 'Smart Classrooms', description: 'Interactive touch panels, ergonomic seating, and individual smart devices integration.', image: '/images/classroom.jpg' },
    { title: 'Research-Grade Labs', description: 'Fully equipped Physics, Chemistry, Biology, and computer sciences centers.', image: '/images/computer-lab.jpg' },
    { title: 'Elite Library', description: 'A repository of over 20,000 physical books, digital catalogs, and international journals.', image: '/images/library.jpg' }
  ]
};

export default function AboutPage() {
  const [data, setData] = useState<AboutpageData>(fallbackAbout);

  useEffect(() => {
    async function loadData() {
      const res = await getAboutpage();
      if (res) setData(res);
    }
    loadData();
  }, []);

  return (
    <div className="pt-24 min-h-screen bg-white">
      
      {/* 1. Header banner */}
      <section className="bg-bg-light border-b border-gray-100 py-16 px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-10 w-48 h-48 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-secondary/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="font-nav text-xs font-bold uppercase tracking-[0.3em] text-primary">About Our School</span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mt-3 mb-6 leading-tight">
            Our Legacy & Philosophy
          </h1>
          <div className="w-16 h-[3px] bg-accent mx-auto mb-6" />
          <p className="font-body text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Lather High School is built on a quarter-century of pioneering academic delivery, <span className="whitespace-nowrap">high-performance</span> coaching, and deep community roots.
          </p>
        </div>
      </section>

      {/* 2. Main History & Philosophy */}
      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* History Block */}
        <div className="flex flex-col gap-6">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 border-l-4 border-primary pl-4">Our History</h2>
          <p className="font-body text-gray-600 leading-relaxed text-base">
            {data.history}
          </p>
          <div className="bg-bg-light border border-gray-100 rounded-2xl p-8 mt-4">
            <h3 className="font-heading text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Compass className="w-5 h-5 text-primary" />
              Academic Philosophy
            </h3>
            <p className="font-body text-sm text-gray-500 leading-relaxed">
              {data.philosophy}
            </p>
          </div>
        </div>

        {/* Mission & Vision Block */}
        <div className="flex flex-col gap-8">
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm flex items-start gap-5 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
              <p className="font-body text-sm text-gray-500 leading-relaxed">{data.mission}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm flex items-start gap-5 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-secondary/5 text-secondary rounded-xl flex items-center justify-center shrink-0">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
              <p className="font-body text-sm text-gray-500 leading-relaxed">{data.vision}</p>
            </div>
          </div>
        </div>

      </section>



      {/* 3. Leadership Messages: Director & Principal */}
      <section className="py-20 px-6 lg:px-8 bg-bg-light border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-nav text-xs font-bold uppercase tracking-[0.3em] text-primary">Guiding Leadership</span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Messages from our Leadership
            </h2>
            <div className="w-12 h-[3px] bg-accent mx-auto" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            
            {/* Director's Message */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md border-2 border-primary/20 shrink-0 bg-gray-100">
                    <img 
                      src="/images/director.jpg" 
                      alt="Mr. Kanwar Singh Lather - Director" 
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-nav font-bold uppercase tracking-wider text-primary block">Leadership Note</span>
                    <h3 className="font-heading text-2xl font-bold text-gray-900">A Message from the Director</h3>
                  </div>
                </div>
                
                <p className="font-body text-gray-600 text-base leading-relaxed italic mb-8 border-l-4 border-primary pl-5 py-1">
                  "Since 1983, our journey has been guided by a simple belief: quality education can transform lives. As we carry this legacy forward, our commitment remains to provide every child with a strong foundation of knowledge, values, and opportunity for a brighter future."
                </p>
              </div>

              <div className="border-t border-gray-100 pt-5 flex items-center justify-between">
                <div>
                  <h4 className="font-heading text-lg font-bold text-gray-900">Mr. Kanwar Singh Lather</h4>
                  <p className="text-xs text-primary font-nav font-semibold uppercase tracking-wider">Director, Lather High School</p>
                </div>
              </div>
            </div>

            {/* Principal's Message */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md border-2 border-primary/20 shrink-0 bg-gray-100">
                    <img 
                      src="/images/principal.jpg" 
                      alt="Ms. Poonam Lather - Principal" 
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-nav font-bold uppercase tracking-wider text-primary block">Leadership Note</span>
                    <h3 className="font-heading text-2xl font-bold text-gray-900">A Message from the Principal</h3>
                  </div>
                </div>
                
                <p className="font-body text-gray-600 text-base leading-relaxed italic mb-8 border-l-4 border-accent pl-5 py-1">
                  "We believe every child has the potential to achieve great things when given the right guidance, encouragement, and opportunities. Our aim is to create a nurturing environment where students learn with curiosity, grow with confidence, and develop the values they need to succeed in life."
                </p>
              </div>

              <div className="border-t border-gray-100 pt-5 flex items-center justify-between">
                <div>
                  <h4 className="font-heading text-lg font-bold text-gray-900">Ms. Poonam Lather</h4>
                  <p className="text-xs text-primary font-nav font-semibold uppercase tracking-wider">Principal, Lather High School</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Infrastructure Showcase */}
      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-nav text-xs font-bold uppercase tracking-[0.3em] text-primary">Campus Spaces</span>
          <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">Premium Infrastructure</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.infrastructure.map((infra) => (
            <div key={infra.title} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover-zoom-container">
              <div className="h-48 relative overflow-hidden">
                <img src={infra.image} alt={infra.title} className="absolute inset-0 w-full h-full object-cover hover-zoom-img" />
              </div>
              <div className="p-6">
                <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">{infra.title}</h3>
                <p className="font-body text-xs text-gray-500 leading-relaxed">{infra.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
