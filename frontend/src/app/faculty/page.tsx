"use client";

import { useEffect, useState } from "react";
import { Search, GraduationCap, Clock, Award, X, BookOpen, User } from "lucide-react";
import { getFaculty, FacultyMember } from "@/utils/api";

const fallbackFaculty: FacultyMember[] = [
  { id: 1, name: 'Mr. Arvind Saxena', department: 'Mathematics', qualification: 'M.Sc, B.Ed (Delhi University)', experience: '15 Years', photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400', bio: 'Mr. Saxena specializes in Calculus and Algebra. He has pioneered interactive visual geometry techniques that help students easily grasp complex three-dimensional curves.' },
  { id: 2, name: 'Dr. Meera Nanda', department: 'Science', qualification: 'Ph.D in Chemistry, NET Qualified', experience: '12 Years', photoUrl: 'https://images.unsplash.com/photo-1580894732444-8fecef2271ff?auto=format&fit=crop&q=80&w=400', bio: 'Dr. Nanda handles senior secondary Chemistry. She is the supervisor of our award-winning organic chemistry lab and actively inspires students toward research in bio-plastics.' },
  { id: 3, name: 'Mrs. Sarah D\'Souza', department: 'English Literature', qualification: 'M.A. English (JNU), M.Phil', experience: '18 Years', photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400', bio: 'Mrs. D\'Souza coaches the debating society and teaches literature. She emphasizes critical essay writing and organizes our prestigious annual inter-school lit-fest.' }
];

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<FacultyMember[]>(fallbackFaculty);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [activeBio, setActiveBio] = useState<FacultyMember | null>(null);

  useEffect(() => {
    async function loadFaculty() {
      const res = await getFaculty();
      if (res && res.length > 0) setFaculty(res);
    }
    loadFaculty();
  }, []);

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
          <span className="font-nav text-xs font-bold uppercase tracking-[0.3em] text-primary">Academic Mentors</span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mt-3 mb-6 leading-tight">
            Our Expert Faculty
          </h1>
          <div className="w-16 h-[3px] bg-accent mx-auto mb-6" />
          <p className="font-body text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Our educators are pedagogical innovators, active scholars, and coaches dedicated to shaping independent thinkers and high achievers.
          </p>
        </div>
      </section>

      {/* 2. Search & Filters Bar */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-10 flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-gray-100">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-md bg-bg-light border border-gray-100 rounded-xl p-1.5 focus-within:border-primary transition-colors flex items-center">
          <Search className="w-4 h-4 text-gray-400 mx-3" />
          <input
            type="text"
            placeholder="Search faculty by name, qualification, or bio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 py-2"
          />
        </div>

        {/* Department Filter */}
        <div className="w-full sm:w-auto flex items-center gap-3 shrink-0">
          <span className="text-xs font-nav font-bold uppercase tracking-wider text-gray-500">Department:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-bg-light border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-primary cursor-pointer"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === "All" ? "All Departments" : dept}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* 3. Faculty Grid Listing */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {filteredFaculty.length === 0 ? (
          <div className="text-center py-20 bg-bg-light border border-gray-100 rounded-2xl max-w-lg mx-auto">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="font-heading text-lg font-bold text-gray-800">No Faculty Found</p>
            <p className="text-sm text-gray-400 mt-1">Try modifying your department filter or search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFaculty.map((member) => (
              <div 
                key={member.id} 
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover-zoom-container flex flex-col justify-between"
              >
                {/* Photo header */}
                <div className="h-72 relative overflow-hidden bg-gray-50 border-b border-gray-100">
                  <img src={member.photoUrl} alt={member.name} className="absolute inset-0 w-full h-full object-cover hover-zoom-img" />
                  <span className="absolute top-4 left-4 bg-secondary text-white text-[10px] font-nav font-bold uppercase tracking-wider py-1.5 px-3 rounded-full shadow-md">
                    {member.department}
                  </span>
                </div>
                {/* Info Content */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div className="mb-4">
                    <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                    
                    <div className="flex flex-col gap-2 text-xs text-gray-500 font-body mb-4">
                      <span className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-primary shrink-0" />
                        {member.qualification}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary shrink-0" />
                        {member.experience} Experience
                      </span>
                    </div>

                    <p className="font-body text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {member.bio}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveBio(member)}
                    className="w-full font-nav text-xs font-bold uppercase tracking-wider bg-primary/5 hover:bg-primary text-primary hover:text-white py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300"
                  >
                    <BookOpen className="w-4 h-4" />
                    View Biography
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Biography Popup Modal */}
      {activeBio && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setActiveBio(null)}>
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative border border-gray-100 flex flex-col md:flex-row cursor-default animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button 
              onClick={() => setActiveBio(null)} 
              className="absolute top-4 right-4 z-10 p-2 bg-black/60 hover:bg-primary text-white rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Image */}
            <div className="w-full md:w-2/5 h-64 md:h-auto relative bg-gray-50 shrink-0">
              <img src={activeBio.photoUrl} alt={activeBio.name} className="absolute inset-0 w-full h-full object-cover" />
            </div>

            {/* Modal Content */}
            <div className="w-full md:w-3/5 p-8 flex flex-col justify-between">
              <div>
                <span className="font-nav text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/20 px-2.5 py-1 rounded-full">{activeBio.department}</span>
                <h3 className="font-heading text-2xl font-bold text-gray-900 mt-4 mb-2">{activeBio.name}</h3>
                
                <div className="flex flex-col gap-2.5 text-xs text-gray-500 font-body border-y border-gray-100 py-4 my-4">
                  <span className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-primary shrink-0" />
                    <strong>Degree:</strong> {activeBio.qualification}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                    <strong>Experience:</strong> {activeBio.experience}
                  </span>
                </div>

                <p className="font-body text-sm text-gray-600 leading-relaxed max-h-48 overflow-y-auto pr-2">
                  {activeBio.bio}
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
