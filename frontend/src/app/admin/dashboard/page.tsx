"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  LogOut, Users, FileText, Newspaper, Trash2, Edit, Plus, Upload, Check, AlertCircle, Eye, EyeOff, Camera
} from "lucide-react";
import { API_BASE_URL } from "@/utils/api";

type TabType = "blog" | "faculty" | "news" | "gallery";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState("Staff");
  const [activeTab, setActiveTab] = useState<TabType>("blog");
  const [loading, setLoading] = useState(true);

  // --- CMS Data States ---
  const [faculties, setFaculties] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [newsList, setNewsList] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);

  // --- Edit Form States (CRUD) ---
  const [editingFaculty, setEditingFaculty] = useState<any | null>(null);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const [editingNews, setEditingNews] = useState<any | null>(null);

  // Status indicators
  const [statusMsg, setStatusMsg] = useState("");
  const [statusErr, setStatusErr] = useState("");

  // Check login validation
  useEffect(() => {
    const t = localStorage.getItem("la_school_token");
    const u = localStorage.getItem("la_school_username");
    if (!t) {
      router.push("/admin/login");
    } else {
      setToken(t);
      if (u) setUsername(u);
      loadAllCmsData(t);
    }
  }, []);

  const loadAllCmsData = async (authToken: string) => {
    try {
      setLoading(true);
      const [facRes, blogRes, newsRes, galleryRes] = await Promise.all([
        fetch(`${API_BASE_URL}/cms/faculty`).then(res => res.json()),
        fetch(`${API_BASE_URL}/cms/blog`).then(res => res.json()),
        fetch(`${API_BASE_URL}/cms/news`).then(res => res.json()),
        fetch(`${API_BASE_URL}/cms/gallery`).then(res => res.json()),
      ]);

      if (Array.isArray(facRes)) setFaculties(facRes);
      if (Array.isArray(blogRes)) setBlogs(blogRes);
      if (Array.isArray(newsRes)) setNewsList(newsRes);
      if (Array.isArray(galleryRes)) setGallery(galleryRes);

    } catch (err) {
      console.error(err);
      setStatusErr("Error loading CMS content from backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("la_school_token");
    localStorage.removeItem("la_school_username");
    router.push("/admin/login");
  };

  const triggerStatus = (msg: string, isErr = false) => {
    if (isErr) {
      setStatusErr(msg);
      setTimeout(() => setStatusErr(""), 4000);
    } else {
      setStatusMsg(msg);
      setTimeout(() => setStatusMsg(""), 4000);
    }
  };

  // --- FILE UPLOADER helper ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, onComplete: (url: string) => void) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE_URL}/cms/upload`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "File upload failed");
      
      onComplete(data.url);
      triggerStatus("File uploaded successfully.");
    } catch (err: any) {
      triggerStatus(err.message, true);
    }
  };

  // --- FACULTY SUBMISSIONS ---
  const handleSaveFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !editingFaculty.id;
    const url = isNew ? `${API_BASE_URL}/cms/faculty` : `${API_BASE_URL}/cms/faculty/${editingFaculty.id}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(editingFaculty),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Error saving faculty member.");

      if (isNew) {
        setFaculties([...faculties, data]);
      } else {
        setFaculties(faculties.map(f => f.id === data.id ? data : f));
      }
      setEditingFaculty(null);
      triggerStatus("Faculty member details recorded.");
    } catch (err: any) {
      triggerStatus(err.message, true);
    }
  };

  const handleDeleteFaculty = async (id: number) => {
    if (!confirm("Are you sure you want to remove this faculty member?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/cms/faculty/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete.");
      setFaculties(faculties.filter(f => f.id !== id));
      triggerStatus("Faculty member removed.");
    } catch (err: any) {
      triggerStatus(err.message, true);
    }
  };

  // --- BLOG SUBMISSIONS ---
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !editingBlog.id;
    const url = isNew ? `${API_BASE_URL}/cms/blog` : `${API_BASE_URL}/cms/blog/${editingBlog.id}`;
    const method = isNew ? "POST" : "PUT";

    try {
      if (!editingBlog.slug) {
        editingBlog.slug = editingBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(editingBlog),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Error recording blog post.");

      if (isNew) {
        setBlogs([data, ...blogs]);
      } else {
        setBlogs(blogs.map(b => b.id === data.id ? data : b));
      }
      setEditingBlog(null);
      triggerStatus("Blog article updated.");
    } catch (err: any) {
      triggerStatus(err.message, true);
    }
  };

  const handleDeleteBlog = async (id: number) => {
    if (!confirm("Are you sure you want to remove this article?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/cms/blog/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete.");
      setBlogs(blogs.filter(b => b.id !== id));
      triggerStatus("Blog article removed.");
    } catch (err: any) {
      triggerStatus(err.message, true);
    }
  };

  // --- NEWS SUBMISSIONS ---
  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !editingNews.id;
    const url = isNew ? `${API_BASE_URL}/cms/news` : `${API_BASE_URL}/cms/news/${editingNews.id}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(editingNews),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Error saving news post.");

      if (isNew) {
        setNewsList([data, ...newsList]);
      } else {
        setNewsList(newsList.map(n => n.id === data.id ? data : n));
      }
      setEditingNews(null);
      triggerStatus("News post saved successfully.");
    } catch (err: any) {
      triggerStatus(err.message, true);
    }
  };

  const handleDeleteNews = async (id: number) => {
    if (!confirm("Are you sure you want to remove this news item?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/cms/news/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete.");
      setNewsList(newsList.filter(n => n.id !== id));
      triggerStatus("News item removed.");
    } catch (err: any) {
      triggerStatus(err.message, true);
    }
  };

  // --- GALLERY HANDLERS ---
  const handleUpdateGalleryCategory = async (id: number, newCategory: string) => {
    try {
      const item = gallery.find(g => g.id === id);
      if (!item) return;

      const res = await fetch(`${API_BASE_URL}/cms/gallery/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ ...item, category: newCategory }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Error updating gallery category.");
      setGallery(gallery.map(g => g.id === id ? data : g));
      triggerStatus("Category updated successfully.");
    } catch (err: any) {
      triggerStatus(err.message, true);
    }
  };

  const handleDeleteGallery = async (id: number) => {
    if (!confirm("Are you sure you want to remove this photo from the gallery?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/cms/gallery/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete.");
      setGallery(gallery.filter(g => g.id !== id));
      triggerStatus("Gallery photo removed.");
    } catch (err: any) {
      triggerStatus(err.message, true);
    }
  };

  const handleAddGalleryImage = async (url: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/cms/gallery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "image",
          url,
          category: "Campus",
          orderIndex: gallery.length + 1
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Error saving gallery item.");
      setGallery([...gallery, data]);
      triggerStatus("New image added to gallery.");
    } catch (err: any) {
      triggerStatus(err.message, true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-light flex flex-col justify-center items-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-nav text-xs font-bold uppercase tracking-wider text-gray-500">Checking credentials & loading CMS...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-light pt-20 flex flex-col lg:flex-row">
      
      {/* 1. Sidebar Panel */}
      <aside className="w-full lg:w-72 bg-[#1A1A1A] text-white shrink-0 lg:fixed lg:h-[calc(100vh-80px)] flex flex-col p-6 z-30">
        
        {/* Welcome Admin */}
        <div className="border-b border-white/10 pb-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 text-primary border border-primary/20 rounded-xl flex items-center justify-center font-bold text-lg uppercase">
              {username.charAt(0)}
            </div>
            <div>
              <span className="text-xs text-white/40 block">Portal Active</span>
              <span className="font-heading text-sm font-bold text-white">{username}</span>
            </div>
          </div>
        </div>

        {/* Tab Items */}
        <nav className="flex flex-col gap-2 font-nav text-xs font-semibold uppercase tracking-wider flex-grow">
          
          <button
            onClick={() => setActiveTab("blog")}
            className={`w-full text-left py-3 px-4 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === "blog" ? "bg-primary text-white" : "text-white/60 hover:bg-white/5"
            }`}
          >
            <FileText className="w-4 h-4" />
            Blog Publisher
          </button>

          <button
            onClick={() => setActiveTab("faculty")}
            className={`w-full text-left py-3 px-4 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === "faculty" ? "bg-primary text-white" : "text-white/60 hover:bg-white/5"
            }`}
          >
            <Users className="w-4 h-4" />
            Faculty / Staff
          </button>

          <button
            onClick={() => setActiveTab("news")}
            className={`w-full text-left py-3 px-4 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === "news" ? "bg-primary text-white" : "text-white/60 hover:bg-white/5"
            }`}
          >
            <Newspaper className="w-4 h-4" />
            Campus News
          </button>

          <button
            onClick={() => setActiveTab("gallery")}
            className={`w-full text-left py-3 px-4 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === "gallery" ? "bg-primary text-white" : "text-white/60 hover:bg-white/5"
            }`}
          >
            <Camera className="w-4 h-4" />
            Gallery Manager
          </button>

        </nav>

        {/* Logout */}
        <div className="border-t border-white/10 pt-6 mt-6">
          <button
            onClick={handleLogout}
            className="w-full text-left py-3.5 px-4 rounded-xl flex items-center gap-3 text-red-400 hover:bg-red-950/20 transition-colors font-nav text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

      </aside>

      {/* 2. Main Dashboard Form Workspace */}
      <main className="flex-grow lg:pl-76 p-6 lg:p-8 min-h-screen">
        
        {/* Status Messages */}
        {statusMsg && (
          <div className="fixed bottom-6 right-6 z-[100] bg-emerald-600 text-white flex items-center gap-2 py-3.5 px-6 rounded-2xl shadow-xl font-body text-sm animate-slide-in">
            <Check className="w-4 h-4" />
            {statusMsg}
          </div>
        )}

        {statusErr && (
          <div className="fixed bottom-6 right-6 z-[100] bg-primary text-white flex items-center gap-2 py-3.5 px-6 rounded-2xl shadow-xl font-body text-sm animate-slide-in">
            <AlertCircle className="w-4 h-4" />
            {statusErr}
          </div>
        )}

        {/* --- BLOG PUBLISHER TAB --- */}
        {activeTab === "blog" && (
          <div className="flex flex-col gap-8">
            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-heading text-2xl font-bold text-gray-900">Blog Publisher CMS</h1>
                <p className="font-body text-xs text-gray-400 mt-1">Compose, save as draft, or publish academic articles and school updates.</p>
              </div>
              <button
                onClick={() => setEditingBlog({ title: "", category: "Academics", content: "", featuredImage: "", draft: true })}
                className="font-nav text-xs font-bold uppercase tracking-wider bg-primary hover:bg-primary/95 text-white py-3 px-6 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                Write Article
              </button>
            </div>

            {/* Edit / New Blog Form */}
            {editingBlog && (
              <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-lg animate-fade-in">
                <h2 className="font-heading text-lg font-bold text-gray-900 border-b border-gray-50 pb-3 mb-6">
                  {editingBlog.id ? "Edit Article Contents" : "Compose Journal Entry"}
                </h2>
                <form onSubmit={handleSaveBlog} className="grid grid-cols-1 gap-6 font-body text-sm">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Article Title</label>
                      <input
                        type="text"
                        required
                        value={editingBlog.title}
                        onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                        className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none focus:border-primary text-gray-800"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Category Tag</label>
                      <select
                        value={editingBlog.category}
                        onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                        className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none cursor-pointer text-gray-800"
                      >
                        <option value="Academics">Academics</option>
                        <option value="Technology">Technology</option>
                        <option value="Sports">Sports</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Notifications">Notifications</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">URL Slug (e.g. my-awesome-post)</label>
                      <input
                        type="text"
                        placeholder="Auto-generated from title if blank"
                        value={editingBlog.slug || ""}
                        onChange={(e) => setEditingBlog({ ...editingBlog, slug: e.target.value })}
                        className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Publishing Status</label>
                      <div className="flex items-center gap-4 mt-2">
                        <button
                          type="button"
                          onClick={() => setEditingBlog({ ...editingBlog, draft: false })}
                          className={`font-nav text-xs font-bold px-5 py-2.5 rounded-xl border flex items-center gap-1.5 cursor-pointer ${
                            !editingBlog.draft ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <Eye className="w-4 h-4" />
                          Publish Publicly
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingBlog({ ...editingBlog, draft: true })}
                          className={`font-nav text-xs font-bold px-5 py-2.5 rounded-xl border flex items-center gap-1.5 cursor-pointer ${
                            editingBlog.draft ? "bg-primary border-primary text-white" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <EyeOff className="w-4 h-4" />
                          Save as Draft
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Featured Banner Image (Upload or URL)</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="text"
                        value={editingBlog.featuredImage}
                        onChange={(e) => setEditingBlog({ ...editingBlog, featuredImage: e.target.value })}
                        className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none flex-grow"
                      />
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          id="blog-image-uploader"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, (url) => setEditingBlog({ ...editingBlog, featuredImage: url }))}
                        />
                        <label htmlFor="blog-image-uploader" className="font-nav text-xs font-bold bg-secondary text-white py-3.5 px-6 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md">
                          <Upload className="w-3.5 h-3.5" />
                          Upload
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Rich Text HTML Content (Use simple HTML tags like &lt;p&gt;, &lt;strong&gt;, etc.)</label>
                    <textarea
                      rows={8}
                      required
                      value={editingBlog.content}
                      onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none font-mono text-xs leading-relaxed"
                      placeholder="<p>Write your article here...</p>"
                    />
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setEditingBlog(null)}
                      className="font-nav text-xs font-bold uppercase tracking-wider border border-gray-200 py-3.5 px-6 rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="font-nav text-xs font-bold uppercase tracking-wider bg-primary text-white py-3.5 px-6 rounded-xl cursor-pointer shadow-md"
                    >
                      Publish / Save Post
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* Blogs list */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-body text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-nav text-xs uppercase tracking-wider">
                      <th className="py-4 px-4 font-semibold">Article Title</th>
                      <th className="py-4 px-4 font-semibold">Category</th>
                      <th className="py-4 px-4 font-semibold">Status</th>
                      <th className="py-4 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-700">
                    {blogs.map((b) => (
                      <tr key={b.id} className="hover:bg-bg-light/40 transition-colors">
                        <td className="py-4 px-4 font-semibold text-gray-900 max-w-sm truncate">{b.title}</td>
                        <td className="py-4 px-4 font-semibold text-xs text-primary">{b.category}</td>
                        <td className="py-4 px-4">
                          <span className={`text-[10px] font-nav font-bold uppercase tracking-wider py-1 px-2.5 rounded-full ${
                            b.draft ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                          }`}>
                            {b.draft ? "Draft" : "Published"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => setEditingBlog(b)}
                              className="p-2 border border-gray-100 hover:border-secondary hover:bg-secondary/5 rounded-lg text-secondary transition-colors cursor-pointer"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBlog(b.id)}
                              className="p-2 border border-gray-100 hover:border-primary hover:bg-primary/5 rounded-lg text-primary transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- FACULTY TAB --- */}
        {activeTab === "faculty" && (
          <div className="flex flex-col gap-8">
            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-heading text-2xl font-bold text-gray-900">Faculty Directory Manager</h1>
                <p className="font-body text-xs text-gray-400 mt-1">Manage school teacher cards, update descriptions, qualifications, and experiences.</p>
              </div>
              <button
                onClick={() => setEditingFaculty({ name: "", department: "Mathematics", qualification: "", experience: "", photoUrl: "", bio: "" })}
                className="font-nav text-xs font-bold uppercase tracking-wider bg-primary hover:bg-primary/95 text-white py-3 px-6 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                Add Educator
              </button>
            </div>

            {/* Edit / New Faculty Form */}
            {editingFaculty && (
              <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-lg animate-fade-in">
                <h2 className="font-heading text-lg font-bold text-gray-900 border-b border-gray-50 pb-3 mb-6">
                  {editingFaculty.id ? "Edit Educator Details" : "Record New Faculty Member"}
                </h2>
                <form onSubmit={handleSaveFaculty} className="grid grid-cols-1 md:grid-cols-2 gap-6 font-body text-sm">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Educator Name</label>
                    <input
                      type="text"
                      required
                      value={editingFaculty.name}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, name: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Department</label>
                    <select
                      value={editingFaculty.department}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, department: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none cursor-pointer"
                    >
                      <option value="Mathematics">Mathematics</option>
                      <option value="Science">Science</option>
                      <option value="English Literature">English Literature</option>
                      <option value="Social Studies">Social Studies</option>
                      <option value="Physical Education">Physical Education</option>
                      <option value="Computer Science">Computer Science</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Qualifications (Degree & Institution)</label>
                    <input
                      type="text"
                      required
                      value={editingFaculty.qualification}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, qualification: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Teaching Experience (e.g. 10 Years)</label>
                    <input
                      type="text"
                      required
                      value={editingFaculty.experience}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, experience: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Photo URL (Link or Local File Upload)</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="text"
                        value={editingFaculty.photoUrl}
                        onChange={(e) => setEditingFaculty({ ...editingFaculty, photoUrl: e.target.value })}
                        className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none flex-grow"
                      />
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          id="fac-photo-uploader"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, (url) => setEditingFaculty({ ...editingFaculty, photoUrl: url }))}
                        />
                        <label htmlFor="fac-photo-uploader" className="font-nav text-xs font-bold bg-secondary text-white py-3.5 px-6 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md">
                          <Upload className="w-3.5 h-3.5" />
                          Upload
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Biography Summary</label>
                    <textarea
                      rows={3}
                      value={editingFaculty.bio}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, bio: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none resize-none"
                    />
                  </div>
                  <div className="flex justify-end gap-3 md:col-span-2 mt-4">
                    <button
                      type="button"
                      onClick={() => setEditingFaculty(null)}
                      className="font-nav text-xs font-bold uppercase tracking-wider border border-gray-200 py-3.5 px-6 rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="font-nav text-xs font-bold uppercase tracking-wider bg-primary text-white py-3.5 px-6 rounded-xl cursor-pointer shadow-md"
                    >
                      Record Details
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Faculties List */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-body text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-nav text-xs uppercase tracking-wider">
                      <th className="py-4 px-4 font-semibold">Educator</th>
                      <th className="py-4 px-4 font-semibold">Department</th>
                      <th className="py-4 px-4 font-semibold">Degree / Experience</th>
                      <th className="py-4 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-700">
                    {faculties.map((fac) => (
                      <tr key={fac.id} className="hover:bg-bg-light/40 transition-colors">
                        <td className="py-4 px-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50">
                            <img src={fac.photoUrl} alt="" className="w-full h-full object-cover" />
                          </div>
                          <span className="font-semibold text-gray-900">{fac.name}</span>
                        </td>
                        <td className="py-4 px-4 font-semibold text-xs text-primary">{fac.department}</td>
                        <td className="py-4 px-4 text-xs text-gray-500">
                          {fac.qualification} ({fac.experience})
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => setEditingFaculty(fac)}
                              className="p-2 border border-gray-100 hover:border-secondary hover:bg-secondary/5 rounded-lg text-secondary transition-colors cursor-pointer"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteFaculty(fac.id)}
                              className="p-2 border border-gray-100 hover:border-primary hover:bg-primary/5 rounded-lg text-primary transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- CAMPUS NEWS TAB --- */}
        {activeTab === "news" && (
          <div className="flex flex-col gap-8">
            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-heading text-2xl font-bold text-gray-900">Campus News Manager</h1>
                <p className="font-body text-xs text-gray-400 mt-1">Add, update, and manage the latest announcements and happenings on the campus.</p>
              </div>
              <button
                onClick={() => setEditingNews({ title: "", date: new Date().toISOString().split("T")[0], content: "", imageUrl: "" })}
                className="font-nav text-xs font-bold uppercase tracking-wider bg-primary hover:bg-primary/95 text-white py-3 px-6 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                Add News Post
              </button>
            </div>

            {/* Edit / New News Form */}
            {editingNews && (
              <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-lg animate-fade-in">
                <h2 className="font-heading text-lg font-bold text-gray-900 border-b border-gray-50 pb-3 mb-6">
                  {editingNews.id ? "Edit News Post" : "Post New Campus News"}
                </h2>
                <form onSubmit={handleSaveNews} className="grid grid-cols-1 md:grid-cols-2 gap-6 font-body text-sm">
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">News Title</label>
                    <input
                      type="text"
                      required
                      value={editingNews.title}
                      onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none focus:border-primary text-gray-800"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Date (YYYY-MM-DD)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2026-08-20"
                      value={editingNews.date}
                      onChange={(e) => setEditingNews({ ...editingNews, date: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none focus:border-primary text-gray-800"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Featured Image URL (Link or Local File Upload)</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="text"
                        value={editingNews.imageUrl}
                        onChange={(e) => setEditingNews({ ...editingNews, imageUrl: e.target.value })}
                        className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none flex-grow"
                      />
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          id="news-image-uploader"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, (url) => setEditingNews({ ...editingNews, imageUrl: url }))}
                        />
                        <label htmlFor="news-image-uploader" className="font-nav text-xs font-bold bg-secondary text-white py-3.5 px-6 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md">
                          <Upload className="w-3.5 h-3.5" />
                          Upload
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">News Content Description</label>
                    <textarea
                      rows={4}
                      required
                      value={editingNews.content}
                      onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 md:col-span-2 mt-4">
                    <button
                      type="button"
                      onClick={() => setEditingNews(null)}
                      className="font-nav text-xs font-bold uppercase tracking-wider border border-gray-200 py-3.5 px-6 rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="font-nav text-xs font-bold uppercase tracking-wider bg-primary text-white py-3.5 px-6 rounded-xl cursor-pointer shadow-md"
                    >
                      Post News
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* News List Table */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-body text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-nav text-xs uppercase tracking-wider">
                      <th className="py-4 px-4 font-semibold">News Post</th>
                      <th className="py-4 px-4 font-semibold">Published Date</th>
                      <th className="py-4 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-700">
                    {newsList.map((item) => (
                      <tr key={item.id} className="hover:bg-bg-light/40 transition-colors">
                        <td className="py-4 px-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                            <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                          </div>
                          <span className="font-semibold text-gray-900 truncate max-w-md">{item.title}</span>
                        </td>
                        <td className="py-4 px-4 text-xs font-semibold text-primary">{item.date}</td>
                        <td className="py-4 px-4 text-right">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => setEditingNews(item)}
                              className="p-2 border border-gray-100 hover:border-secondary hover:bg-secondary/5 rounded-lg text-secondary transition-colors cursor-pointer"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteNews(item.id)}
                              className="p-2 border border-gray-100 hover:border-primary hover:bg-primary/5 rounded-lg text-primary transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- GALLERY CMS TAB --- */}
        {activeTab === "gallery" && (
          <div className="flex flex-col gap-8">
            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-heading text-2xl font-bold text-gray-900">Gallery Asset Manager</h1>
                <p className="font-body text-xs text-gray-400 mt-1">Upload new images, update photo categories, or delete outdated assets.</p>
              </div>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  id="gallery-image-uploader"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, handleAddGalleryImage)}
                />
                <label htmlFor="gallery-image-uploader" className="font-nav text-xs font-bold uppercase tracking-wider bg-primary hover:bg-primary/95 text-white py-3.5 px-6 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md">
                  <Plus className="w-4 h-4" />
                  Upload Photo
                </label>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <div className="text-xs text-gray-400 mb-6 font-body font-light">
                Total {gallery.length} images found in database. Change selection in the dropdown to reclassify.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {gallery.map((item) => (
                  <div key={item.id} className="border border-gray-100 rounded-2xl p-4 bg-bg-light/30 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-40 rounded-xl overflow-hidden bg-gray-100 relative group">
                      <img src={item.url} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleDeleteGallery(item.id)}
                        className="absolute top-3 right-3 bg-red-600 hover:bg-red-750 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md cursor-pointer"
                        title="Remove Photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="font-nav text-[10px] font-bold uppercase tracking-wider text-gray-400">Classify Category</label>
                      <select
                        value={item.category}
                        onChange={(e) => handleUpdateGalleryCategory(item.id, e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none cursor-pointer text-xs font-body text-gray-700 focus:border-primary"
                      >
                        <option value="Campus">Campus</option>
                        <option value="Labs">Labs</option>
                        <option value="Sports">Sports</option>
                        <option value="Events">Events</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
