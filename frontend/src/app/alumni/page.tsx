"use client";

import { useEffect, useState } from "react";
import { Search, GraduationCap, Award, User } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { getAlumni, AlumniRecord } from "@/utils/api";

const fallbackAlumni: AlumniRecord[] = [
  { id: 1, name: 'Aditya Sen', batch: '2012', currentPosition: 'Senior Software Engineer', company: 'Google, Mountain View', achievement: 'Pioneered AI models in search and mentored junior engineers.', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400', linkedin: 'https://linkedin.com' },
  { id: 2, name: 'Priyanka Chopra', batch: '2015', currentPosition: 'Consultant Cardiologist', company: 'Max Healthcare, Delhi', achievement: 'Top ranker in NEET PG and published research in international cardiology journals.', photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400', linkedin: 'https://linkedin.com' },
  { id: 3, name: 'Ranveer Singh', batch: '2018', currentPosition: 'Founder & CEO', company: 'GreenDrive Mobility', achievement: 'Successfully raised $3M in seed funding for EV logistics startup in India.', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400', linkedin: 'https://linkedin.com' }
];

export default function AlumniPage() {
  const [alumni, setAlumni] = useState<AlumniRecord[]>(fallbackAlumni);
  const [search, setSearch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("All");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    async function loadAlumni() {
      const res = await getAlumni();
      if (res && res.length > 0) setAlumni(res);
    }
    loadAlumni();
  }, []);

  // Filter batches
  const batches = ["All", ...Array.from(new Set(alumni.map((a) => a.batch)))].sort();

  const filteredAlumni = alumni.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || 
                          a.company.toLowerCase().includes(search.toLowerCase()) ||
                          a.currentPosition.toLowerCase().includes(search.toLowerCase());
    const matchesBatch = selectedBatch === "All" || a.batch === selectedBatch;
    return matchesSearch && matchesBatch;
  });

  // Calculate paginated alumni
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAlumni = filteredAlumni.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAlumni.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  return (
    <div className="pt-24 min-h-screen bg-white">
      
      {/* 1. Header Banner */}
      <section className="bg-bg-light border-b border-gray-100 py-16 px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-10 w-48 h-48 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-secondary/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="font-nav text-xs font-bold uppercase tracking-[0.3em] text-primary">Global Network</span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mt-3 mb-6 leading-tight">
            Our Alumni Showcase
          </h1>
          <div className="w-16 h-[3px] bg-accent mx-auto mb-6" />
          <p className="font-body text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            LA graduates have gone on to shape fields from AI research at Google to specialized healthcare, entrepreneurship, and public service.
          </p>
        </div>
      </section>

      {/* 2. Filters & Search Box */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-10 flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-gray-100">
        {/* Search */}
        <div className="relative w-full sm:max-w-md bg-bg-light border border-gray-100 rounded-xl p-1.5 focus-within:border-primary transition-colors flex items-center">
          <Search className="w-4 h-4 text-gray-400 mx-3" />
          <input
            type="text"
            placeholder="Search alumni by name, company, or role..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 py-2"
          />
        </div>

        {/* Batch Filter */}
        <div className="w-full sm:w-auto flex items-center gap-3 shrink-0">
          <span className="text-xs font-nav font-bold uppercase tracking-wider text-gray-500">Filter Batch:</span>
          <select
            value={selectedBatch}
            onChange={(e) => { setSelectedBatch(e.target.value); setCurrentPage(1); }}
            className="bg-bg-light border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-primary cursor-pointer"
          >
            {batches.map((b) => (
              <option key={b} value={b}>
                {b === "All" ? "All Batches" : `Class of ${b}`}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* 3. Alumni Listing Cards */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {currentAlumni.length === 0 ? (
          <div className="text-center py-20 bg-bg-light border border-gray-100 rounded-2xl max-w-lg mx-auto">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="font-heading text-lg font-bold text-gray-800">No Alumni Found</p>
            <p className="text-sm text-gray-400 mt-1">Try modifying your search or batch query filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentAlumni.map((al) => (
              <div 
                key={al.id} 
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover-zoom-container flex flex-col"
              >
                {/* Photo Header */}
                <div className="h-64 relative overflow-hidden bg-gray-50 border-b border-gray-100">
                  <img src={al.photoUrl} alt={al.name} className="absolute inset-0 w-full h-full object-cover hover-zoom-img" />
                  <span className="absolute top-4 left-4 bg-primary text-white text-[10px] font-nav font-bold uppercase tracking-wider py-1.5 px-3 rounded-full shadow-md">
                    Class of {al.batch}
                  </span>
                </div>
                {/* Content */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading text-xl font-bold text-gray-900 mb-1">{al.name}</h3>
                    <p className="font-body text-xs font-semibold text-secondary mb-4 uppercase tracking-wider">{al.currentPosition} at {al.company}</p>
                    
                    <div className="bg-bg-light border border-gray-50 rounded-xl p-4 mb-4 flex gap-3">
                      <Award className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <p className="font-body text-xs text-gray-500 leading-relaxed italic">
                        "{al.achievement}"
                      </p>
                    </div>
                  </div>

                  {al.linkedin && (
                    <a 
                      href={al.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-nav text-xs font-bold uppercase tracking-wider border border-gray-200 hover:border-secondary hover:bg-secondary/5 text-gray-600 hover:text-secondary py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-2"
                    >
                      <FaLinkedin className="w-4 h-4 text-[#0A66C2]" />
                      Connect on LinkedIn
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-16">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold uppercase tracking-wider hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 border rounded-xl text-sm font-semibold transition-all ${
                  page === currentPage
                    ? "bg-primary border-primary text-white"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold uppercase tracking-wider hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </section>

    </div>
  );
}
