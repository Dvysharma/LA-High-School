"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Calendar, ChevronRight, User, BookOpen } from "lucide-react";
import { getBlogs, BlogPost } from "@/utils/api";

const fallbackBlogs: BlogPost[] = [
  { id: 1, title: 'The Role of AI and Robotics in Modern Education', slug: 'role-of-ai-robotics-modern-education', content: '<p>Artificial Intelligence (AI) and robotics are no longer concepts confined to sci-fi novels. In today\'s pedagogical landscape, they play an essential role in training student minds to think computationally. At Lather High School, our advanced lab features automated robotic arms and IoT boards that let students code and build active solutions to real-world problems. Discover how this hands-on engineering is shaping future engineers.</p>', category: 'Technology', featuredImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800', draft: false, publishedAt: new Date().toISOString() },
  { id: 2, title: 'Fostering a Culture of Reading: The LA Literary Program', slug: 'fostering-culture-of-reading-literary-program', content: '<p>In an age dominated by screens and prompt reels, deep-focus reading has become an endangered skill. Our library program at Lather High School challenges this trend. By scheduling dedicated reading hours and engaging students in literary debate, we help them develop strong analytical vocabulary and deep empathy. Read on to find out how our English faculty helps students love literature.</p>', category: 'Academics', featuredImage: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=800', draft: false, publishedAt: new Date().toISOString() }
];

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>(fallbackBlogs);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function loadBlogs() {
      const res = await getBlogs();
      // Only filter non-drafts for public listing
      if (res && res.length > 0) {
        setBlogs(res.filter(b => !b.draft));
      }
    }
    loadBlogs();
  }, []);

  const categories = ["All", ...Array.from(new Set(blogs.map((b) => b.category)))].sort();

  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) || 
                          b.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || b.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Split featured post and remaining posts
  const featuredPost = filteredBlogs[0];
  const listPosts = filteredBlogs.slice(1);

  return (
    <div className="pt-24 min-h-screen bg-white">
      
      {/* 1. Header Banner */}
      <section className="bg-bg-light border-b border-gray-100 py-16 px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-10 w-48 h-48 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-secondary/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="font-nav text-xs font-bold uppercase tracking-[0.3em] text-primary">Academic Journal</span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mt-3 mb-6 leading-tight">
            School Blog & News
          </h1>
          <div className="w-16 h-[3px] bg-accent mx-auto mb-6" />
          <p className="font-body text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Stay updated with school projects, scientific achievements, literary updates, campus journals, and seasonal events.
          </p>
        </div>
      </section>

      {/* 2. Filters & Search Box */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-10 flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-gray-100">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-md bg-bg-light border border-gray-100 rounded-xl p-1.5 focus-within:border-primary transition-colors flex items-center">
          <Search className="w-4 h-4 text-gray-400 mx-3" />
          <input
            type="text"
            placeholder="Search articles by keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 py-2"
          />
        </div>

        {/* Category List */}
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`font-nav text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full border transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-primary border-primary text-white"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Blog Posts Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-20 bg-bg-light border border-gray-100 rounded-2xl max-w-lg mx-auto">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="font-heading text-lg font-bold text-gray-800">No Articles Found</p>
            <p className="text-sm text-gray-400 mt-1">Try modifying your query or category filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main posts column */}
            <div className="lg:col-span-8 flex flex-col gap-12">
              
              {/* Featured Top Post */}
              {featuredPost && (
                <div className="group border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="h-96 relative overflow-hidden bg-gray-50">
                    <img 
                      src={featuredPost.featuredImage} 
                      alt={featuredPost.title} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" 
                    />
                    <span className="absolute top-6 left-6 bg-primary text-white text-[10px] font-nav font-bold uppercase tracking-widest py-1.5 px-4 rounded-full">
                      Featured: {featuredPost.category}
                    </span>
                  </div>
                  <div className="p-8">
                    <span className="flex items-center gap-2 text-xs text-gray-400 font-body mb-3">
                      <Calendar className="w-4 h-4 text-primary" />
                      {new Date(featuredPost.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                    <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 group-hover:text-primary transition-colors leading-tight mb-4">
                      <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                    </h2>
                    <p className="font-body text-sm text-gray-500 leading-relaxed line-clamp-3 mb-6">
                      {featuredPost.content.replace(/<[^>]*>/g, '')}
                    </p>
                    <Link 
                      href={`/blog/${featuredPost.slug}`}
                      className="font-nav text-xs font-bold uppercase tracking-wider bg-secondary hover:bg-secondary/95 text-white py-3.5 px-6 rounded-xl inline-flex items-center gap-1.5 shadow-md"
                    >
                      Read Full Article
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Remaining Posts Grid */}
              {listPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {listPosts.map((post) => (
                    <div 
                      key={post.id} 
                      className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover-zoom-container flex flex-col justify-between"
                    >
                      <div>
                        <div className="h-56 relative overflow-hidden bg-gray-50">
                          <img src={post.featuredImage} alt={post.title} className="absolute inset-0 w-full h-full object-cover hover-zoom-img" />
                          <span className="absolute top-4 left-4 bg-secondary text-white text-[9px] font-nav font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                            {post.category}
                          </span>
                        </div>
                        <div className="p-6">
                          <span className="flex items-center gap-2 text-xs text-gray-400 font-body mb-3">
                            <Calendar className="w-4 h-4 text-primary" />
                            {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <h3 className="font-heading text-lg font-bold text-gray-900 leading-snug line-clamp-2 mb-3">
                            <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">{post.title}</Link>
                          </h3>
                          <p className="font-body text-xs text-gray-500 leading-relaxed line-clamp-3">
                            {post.content.replace(/<[^>]*>/g, '')}
                          </p>
                        </div>
                      </div>
                      <div className="p-6 pt-0">
                        <Link 
                          href={`/blog/${post.slug}`}
                          className="font-nav text-xs font-bold uppercase tracking-wider text-secondary hover:text-primary inline-flex items-center gap-1.5 mt-2"
                        >
                          Read Article
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              
              {/* Recent Posts widget */}
              <div className="bg-bg-light border border-gray-100 rounded-3xl p-6">
                <h3 className="font-heading text-lg font-bold text-gray-900 border-l-2 border-primary pl-3 mb-6">Recent Articles</h3>
                <div className="flex flex-col gap-5">
                  {blogs.slice(0, 4).map((post) => (
                    <div key={post.id} className="flex gap-4 items-start group">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative bg-gray-100">
                        <img src={post.featuredImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-gray-400 font-body">{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <h4 className="font-heading text-sm font-bold text-gray-800 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tagline / CTA Widget */}
              <div className="bg-secondary text-white rounded-3xl p-8 relative overflow-hidden shadow-lg shadow-secondary/15">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary to-indigo-950 opacity-90" />
                <div className="relative z-10 text-center">
                  <h3 className="font-heading text-xl font-bold text-white mb-3">Looking to Join Us?</h3>
                  <p className="font-body text-xs text-white/70 leading-relaxed mb-6">
                    Our admissions for academic cycle 2026-27 are currently open. Submit an online application form or visit our campus.
                  </p>
                  <Link 
                    href="/admission"
                    className="font-nav text-[10px] font-bold uppercase tracking-widest bg-accent hover:bg-accent/95 text-white py-3 px-6 rounded-xl inline-block shadow-md"
                  >
                    Admissions Form
                  </Link>
                </div>
              </div>

            </div>

          </div>
        )}
      </section>

    </div>
  );
}
