"use client";

import { useEffect, useState } from "react";
import { Search, User, ShieldAlert, Award, GraduationCap, Briefcase } from "lucide-react";
import { getFaculty, FacultyMember } from "@/utils/api";

const fallbackFaculty: FacultyMember[] = [
  {
    id: 1,
    name: 'Mr. Arvind Saxena',
    department: 'Mathematics',
    qualification: 'M.Sc, B.Ed (Delhi University)',
    experience: '15 Years',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    bio: 'Mr. Saxena specializes in Calculus and Algebra. He has pioneered interactive visual geometry techniques that help students easily grasp complex three-dimensional curves.'
  },
  {
    id: 2,
    name: 'Dr. Meera Nanda',
    department: 'Science',
    qualification: 'Ph.D in Chemistry, Net Qualified',
    experience: '12 Years',
    photoUrl: 'https://images.unsplash.com/photo-1580894732444-8fecef2271ff?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. Nanda handles senior secondary Chemistry. She is the supervisor of our award-winning organic chemistry lab and actively inspires students toward research in bio-plastics.'
  },
  {
    id: 3,
    name: 'Mrs. Sarah D\'Souza',
    department: 'English Literature',
    qualification: 'M.A. English (JNU), M.Phil',
    experience: '18 Years',
    photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400',
    bio: 'Mrs. D\'Souza coaches the debating society and teaches literature. She emphasizes critical essay writing and organizes our prestigious annual inter-school lit-fest.'
  }
];

export default function StaffPage() {
  const [faculty, setFaculty] = useState<FacultyMember[]>(fallbackFaculty);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");

  useEffect(() => {
    async function loadFaculty() {
      const res = await getFaculty();
      if (res && res.length > 0) setFaculty(res);
    }
    loadFaculty();
  }, []);

  // Filter departments
  const departments = ["All", ...Array.from(new Set(faculty.map((f) => f.department)))].sort();

  const filteredFaculty = faculty.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) || 
                          f.qualification.toLowerCase().includes(search.toLowerCase()) ||
                          f.bio.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === "All" || f.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="pt-24 min-h-screen bg-white">
      
      {/* 1. Header Banner */}
      <section className="bg-bg-light border-b border-gray-100 py-16 px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-10 w-48 h-48 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-secondary/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="font-nav text-xs font-bold uppercase tracking-[0.3em] text-primary">Academic Leaders</span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mt-3 mb-6 leading-tight">
            Our Experienced Staff
          </h1>
          <div className="w-16 h-[3px] bg-accent mx-auto mb-6" />
          <p className="font-body text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Meet the dedicated, highly qualified educators committed to nurturing character, computational focus, and academic mastery in every student at Lather High School.
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
            placeholder="Search staff by name, qualification, or bio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 py-2"
          />
        </div>

        {/* Department Filter */}
        <div className="w-full sm:w-auto flex items-center gap-3 shrink-0">
          <span className="text-xs font-nav font-bold uppercase tracking-wider text-gray-500">Filter Department:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-bg-light border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-primary cursor-pointer"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === "All" ? "All Departments" : d}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* 3. Faculty Listing Cards */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {filteredFaculty.length === 0 ? (
          <div className="text-center py-20 bg-bg-light border border-gray-100 rounded-2xl max-w-lg mx-auto">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="font-heading text-lg font-bold text-gray-800">No Staff Found</p>
            <p className="text-sm text-gray-400 mt-1">Try modifying your search or department filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFaculty.map((fac) => (
              <div 
                key={fac.id} 
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover-zoom-container flex flex-col"
              >
                {/* Photo Header */}
                <div className="h-64 relative overflow-hidden bg-gray-50 border-b border-gray-100">
                  <img src={fac.photoUrl} alt={fac.name} className="absolute inset-0 w-full h-full object-cover hover-zoom-img" />
                  <span className="absolute top-4 left-4 bg-primary text-white text-[10px] font-nav font-bold uppercase tracking-wider py-1.5 px-3 rounded-full shadow-md">
                    {fac.department}
                  </span>
                </div>
                {/* Content */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div className="flex flex-col gap-3">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-gray-900 mb-1">{fac.name}</h3>
                      
                      {/* Qualification info */}
                      <span className="inline-flex items-center gap-1.5 text-xs text-secondary font-semibold font-body tracking-wide mb-3">
                        <GraduationCap className="w-4 h-4 text-secondary shrink-0" />
                        {fac.qualification}
                      </span>
                    </div>

                    {/* Experience badge */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-body border-y border-gray-50 py-2">
                      <Briefcase className="w-4 h-4 text-accent" />
                      <span><strong>Experience:</strong> {fac.experience}</span>
                    </div>

                    {/* Bio */}
                    <div className="bg-bg-light border border-gray-50 rounded-xl p-4 flex gap-3 mt-1">
                      <Award className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <p className="font-body text-xs text-gray-500 leading-relaxed italic">
                        "{fac.bio}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
