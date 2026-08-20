"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Compass, Eye, ShieldCheck, Library, Globe, Heart } from "lucide-react";
import { getAboutpage, AboutpageData } from "@/utils/api";

const fallbackAbout: AboutpageData = {
  history: 'Lather High School was founded in 1985 with a visionary spirit to establish a premier co-educational residential-cum-day school in Karnal, Haryana. Over the last four decades, the school has evolved into an educational powerhouse, setting standards in progressive learning pedagogy, modern labs, and high-performance sports environments.',
  mission: 'To provide a stimulating learning environment that encourages curiosity, critical thinking, creative expression, and moral character. We strive to mold students into confident, responsible, and skilled leaders of tomorrow.',
  vision: 'To be a globally recognized center of learning where academic rigor, ethical values, and holistic development prepare students to excel in a dynamic and interconnected world.',
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
    { title: 'Smart Classrooms', description: 'Interactive touch panels, ergonomic seating, and individual smart devices integration.', image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=800' },
    { title: 'Research-Grade Labs', description: 'Fully equipped Physics, Chemistry, Biology, and computer sciences centers.', image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800' },
    { title: 'Elite Library', description: 'A repository of over 20,000 physical books, digital catalogs, and international journals.', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800' }
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
            Lather High School is built on a quarter-century of pioneering academic delivery, high-performance coaching, and deep community roots.
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
