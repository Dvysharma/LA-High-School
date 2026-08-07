"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Calendar, Link2, BookOpen, Clock 
} from "lucide-react";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { getBlogBySlug, getBlogs, BlogPost } from "@/utils/api";

const fallbackBlogs: BlogPost[] = [
  { id: 1, title: 'The Role of AI and Robotics in Modern Education', slug: 'role-of-ai-robotics-modern-education', content: '<p>Artificial Intelligence (AI) and robotics are no longer concepts confined to sci-fi novels. In today\'s pedagogical landscape, they play an essential role in training student minds to think computationally. At Lather High School, our advanced lab features automated robotic arms and IoT boards that let students code and build active solutions to real-world problems. Discover how this hands-on engineering is shaping future engineers.</p><p>We focus heavily on visual programming first, using Scratch and Blockly for younger classes, and gradually introduce Python and Arduino hardware in secondary sections. Our laboratory works on active projects including autonomous cleaning vehicles, automatic greenhouse moisture triggers, and line followers.</p>', category: 'Technology', featuredImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800', draft: false, publishedAt: new Date().toISOString() },
  { id: 2, title: 'Fostering a Culture of Reading: The LA Literary Program', slug: 'fostering-culture-of-reading-literary-program', content: '<p>In an age dominated by screens and prompt reels, deep-focus reading has become an endangered skill. Our library program at Lather High School challenges this trend. By scheduling dedicated reading hours and engaging students in literary debate, we help them develop strong analytical vocabulary and deep empathy. Read on to find out how our English faculty helps students love literature.</p><p>Students participate in our monthly book reviews and present analytical summaries to their houses. Our librarian maintains a dynamic leaderboard of reading logs, awarding prizes for diverse reading categories from historical fiction to physics journals.</p>', category: 'Academics', featuredImage: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=800', draft: false, publishedAt: new Date().toISOString() }
];

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      setLoading(true);
      const res = await getBlogBySlug(slug);
      if (res) {
        setPost(res);
      } else {
        // Fallback
        const mock = fallbackBlogs.find((b) => b.slug === slug);
        if (mock) setPost(mock);
      }

      const list = await getBlogs();
      if (list && list.length > 0) {
        setRecentPosts(list.filter(b => b.slug !== slug && !b.draft).slice(0, 3));
      } else {
        setRecentPosts(fallbackBlogs.filter(b => b.slug !== slug));
      }
      setLoading(false);
    }
    if (slug) loadPost();
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Article link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-24">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-24 px-6 text-center">
        <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="font-heading text-3xl font-bold text-gray-800">Article Not Found</h1>
        <p className="text-sm text-gray-400 mt-2">The article slug might have been updated or draft unpublished.</p>
        <Link href="/blog" className="mt-6 font-nav text-xs font-bold uppercase tracking-wider bg-primary text-white py-3 px-6 rounded-xl">
          Back to Blog List
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-white">
      
      {/* Article Header block */}
      <section className="bg-bg-light border-b border-gray-100 py-12 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          <Link 
            href="/blog" 
            className="font-nav text-xs font-semibold uppercase tracking-wider text-secondary hover:text-primary flex items-center gap-1.5 self-start"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Journal
          </Link>
          
          <div className="flex gap-3 mt-2">
            <span className="bg-primary text-white text-[10px] font-nav font-bold uppercase tracking-widest py-1.5 px-3.5 rounded-full">
              {post.category}
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mt-2">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-xs text-gray-500 font-body mt-2 border-t border-gray-200/50 pt-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary" />
              5 Mins Read
            </span>
          </div>
        </div>
      </section>

      {/* Featured Banner Image */}
      <section className="max-w-4xl mx-auto px-6 lg:px-8 mt-12">
        <div className="h-[450px] relative rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-gray-50">
          <img src={post.featuredImage} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
        </div>
      </section>

      {/* Main Content & Sidebar */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Article Body */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <article 
            className="font-body text-gray-700 text-base leading-relaxed whitespace-pre-line prose max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Social Share Buttons */}
          <div className="border-t border-gray-100 pt-8 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-nav font-bold uppercase tracking-wider text-gray-500">Share this article:</span>
            <div className="flex gap-3">
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 border border-gray-200 hover:border-primary hover:bg-primary/5 rounded-xl transition-all"
                aria-label="Share on Facebook"
              >
                <FaFacebook className="w-4 h-4 text-primary" />
              </a>
              <a 
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 border border-gray-200 hover:border-primary hover:bg-primary/5 rounded-xl transition-all"
                aria-label="Share on Twitter"
              >
                <FaTwitter className="w-4 h-4 text-primary" />
              </a>
              <a 
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 border border-gray-200 hover:border-primary hover:bg-primary/5 rounded-xl transition-all"
                aria-label="Share on LinkedIn"
              >
                <FaLinkedin className="w-4 h-4 text-primary" />
              </a>
              <button 
                onClick={handleCopyLink}
                className="p-3 border border-gray-200 hover:border-primary hover:bg-primary/5 rounded-xl transition-all cursor-pointer"
                aria-label="Copy article link"
              >
                <Link2 className="w-4 h-4 text-primary" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          {/* Recent Articles list */}
          <div className="bg-bg-light border border-gray-100 rounded-3xl p-6">
            <h3 className="font-heading text-lg font-bold text-gray-900 border-l-2 border-primary pl-3 mb-6">Recent Articles</h3>
            <div className="flex flex-col gap-5">
              {recentPosts.length === 0 ? (
                <p className="text-xs text-gray-400">No other recent posts found.</p>
              ) : (
                recentPosts.map((r) => (
                  <div key={r.id} className="flex gap-4 items-start group">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative bg-gray-100">
                      <img src={r.featuredImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-gray-400 font-body">{new Date(r.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      <h4 className="font-heading text-sm font-bold text-gray-800 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        <Link href={`/blog/${r.slug}`}>{r.title}</Link>
                      </h4>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </section>

    </div>
  );
}
