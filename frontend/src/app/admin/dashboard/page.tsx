"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldAlert, LogOut, LayoutDashboard, Home, BookOpen, 
  Users, Images, FileText, Calendar, DollarSign, Globe, 
  Trash2, Edit, Plus, Upload, Download, Check, AlertCircle, Eye, EyeOff 
} from "lucide-react";
import { API_BASE_URL } from "@/utils/api";

type TabType = "stats" | "home" | "about" | "faculty" | "alumni" | "gallery" | "blog" | "events" | "billing" | "seo" | "backup";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState("Staff");
  const [activeTab, setActiveTab] = useState<TabType>("stats");
  const [loading, setLoading] = useState(true);

  // --- CMS Data States ---
  const [faculties, setFaculties] = useState<any[]>([]);
  const [alumniList, setAlumniList] = useState<any[]>([]);
  const [galleryList, setGalleryList] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [newsList, setNewsList] = useState<any[]>([]);

  // Page Content Settings States (JSON inputs)
  const [homeSetting, setHomeSetting] = useState<any>({ hero: {}, welcome: {}, stats: {} });
  const [aboutSetting, setAboutSetting] = useState<any>({ history: "", mission: "", vision: "", philosophy: "", timeline: [], infrastructure: [] });
  const [billingSetting, setBillingSetting] = useState<any>({ qrCodeUrl: "", bankDetails: {}, faqs: [] });
  const [contactSetting, setContactSetting] = useState<any>({ phone: "", email: "", address: "", mapsEmbedUrl: "", officeHours: "" });
  const [seoSetting, setSeoSetting] = useState<any>({ metaTitle: "", metaDescription: "", metaKeywords: "" });

  // --- Edit Form States (CRUD) ---
  const [editingFaculty, setEditingFaculty] = useState<any | null>(null);
  const [editingAlumni, setEditingAlumni] = useState<any | null>(null);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
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
      const headers = { "Authorization": `Bearer ${authToken}` };

      // Page Contents
      const [home, about, billing, contact, seo] = await Promise.all([
        fetch(`${API_BASE_URL}/cms/page/home`).then(res => res.json()),
        fetch(`${API_BASE_URL}/cms/page/about`).then(res => res.json()),
        fetch(`${API_BASE_URL}/cms/page/payment`).then(res => res.json()),
        fetch(`${API_BASE_URL}/cms/page/contact`).then(res => res.json()),
        fetch(`${API_BASE_URL}/cms/page/seo`).then(res => res.json()),
      ]);

      if (home && !home.error) setHomeSetting(home);
      if (about && !about.error) setAboutSetting(about);
      if (billing && !billing.error) setBillingSetting(billing);
      if (contact && !contact.error) setContactSetting(contact);
      if (seo && !seo.error) setSeoSetting(seo);

      // Collections list
      const [facRes, alRes, galRes, blogRes, evRes, newsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/cms/faculty`).then(res => res.json()),
        fetch(`${API_BASE_URL}/cms/alumni`).then(res => res.json()),
        fetch(`${API_BASE_URL}/cms/gallery`).then(res => res.json()),
        fetch(`${API_BASE_URL}/cms/blog`).then(res => res.json()),
        fetch(`${API_BASE_URL}/cms/event`).then(res => res.json()),
        fetch(`${API_BASE_URL}/cms/news`).then(res => res.json()),
      ]);

      if (Array.isArray(facRes)) setFaculties(facRes);
      if (Array.isArray(alRes)) setAlumniList(alRes);
      if (Array.isArray(galRes)) setGalleryList(galRes);
      if (Array.isArray(blogRes)) setBlogs(blogRes);
      if (Array.isArray(evRes)) setEvents(evRes);
      if (Array.isArray(newsRes)) setNewsList(newsRes);

    } catch (err) {
      console.error(err);
      setStatusErr("Error loading CMS content from backend. Visual fallbacks active.");
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
      triggerStatus("File uploaded successfully to static directory.");
    } catch (err: any) {
      triggerStatus(err.message, true);
    }
  };

  // --- SAVE PAGE SETTINGS (POST) ---
  const handleSavePageSetting = async (key: string, data: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/cms/page/${key}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update settings.");
      triggerStatus(`Settings for ${key} page saved successfully.`);
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

  // --- ALUMNI SUBMISSIONS ---
  const handleSaveAlumni = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !editingAlumni.id;
    const url = isNew ? `${API_BASE_URL}/cms/alumni` : `${API_BASE_URL}/cms/alumni/${editingAlumni.id}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(editingAlumni),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Error saving alumni record.");

      if (isNew) {
        setAlumniList([...alumniList, data]);
      } else {
        setAlumniList(alumniList.map(a => a.id === data.id ? data : a));
      }
      setEditingAlumni(null);
      triggerStatus("Alumni record saved successfully.");
    } catch (err: any) {
      triggerStatus(err.message, true);
    }
  };

  const handleDeleteAlumni = async (id: number) => {
    if (!confirm("Are you sure you want to remove this alumni?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/cms/alumni/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete.");
      setAlumniList(alumniList.filter(a => a.id !== id));
      triggerStatus("Alumni record removed.");
    } catch (err: any) {
      triggerStatus(err.message, true);
    }
  };

  // --- GALLERY SUBMISSIONS ---
  const handleAddGalleryItem = async (url: string, category: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/cms/gallery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ type: "image", url, category, orderIndex: galleryList.length + 1 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to add image to gallery.");
      setGalleryList([...galleryList, data]);
      triggerStatus("Image appended to school highlights gallery.");
    } catch (err: any) {
      triggerStatus(err.message, true);
    }
  };

  const handleDeleteGallery = async (id: number) => {
    if (!confirm("Are you sure you want to delete this highlight?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/cms/gallery/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed.");
      setGalleryList(galleryList.filter(g => g.id !== id));
      triggerStatus("Image removed from gallery.");
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
      // Auto generate slug from title if missing
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
      triggerStatus("Blog article database updated.");
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

  // --- EVENT SUBMISSIONS ---
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !editingEvent.id;
    const url = isNew ? `${API_BASE_URL}/cms/event` : `${API_BASE_URL}/cms/event/${editingEvent.id}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(editingEvent),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Error saving event.");

      if (isNew) {
        setEvents([...events, data]);
      } else {
        setEvents(events.map(ev => ev.id === data.id ? data : ev));
      }
      setEditingEvent(null);
      triggerStatus("Calendar event recorded.");
    } catch (err: any) {
      triggerStatus(err.message, true);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/cms/event/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed.");
      setEvents(events.filter(ev => ev.id !== id));
      triggerStatus("Event deleted.");
    } catch (err: any) {
      triggerStatus(err.message, true);
    }
  };

  // --- SYSTEM BACKUP / EXPORT ---
  const handleExportBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      faculties,
      alumniList,
      galleryList,
      blogs,
      events,
      homeSetting,
      aboutSetting,
      billingSetting,
      contactSetting,
      seoSetting
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `la_school_cms_backup_${Date.now()}.json`;
    link.click();
    triggerStatus("JSON Backup file generated and downloaded successfully.");
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (!imported.homeSetting || !imported.aboutSetting) {
          throw new Error("Invalid backup JSON format.");
        }
        
        // Import data
        setHomeSetting(imported.homeSetting);
        setAboutSetting(imported.aboutSetting);
        setBillingSetting(imported.billingSetting || billingSetting);
        setContactSetting(imported.contactSetting || contactSetting);
        setSeoSetting(imported.seoSetting || seoSetting);
        
        // Save imported page content settings to DB
        await handleSavePageSetting("home", imported.homeSetting);
        await handleSavePageSetting("about", imported.aboutSetting);
        if (imported.billingSetting) await handleSavePageSetting("payment", imported.billingSetting);
        if (imported.contactSetting) await handleSavePageSetting("contact", imported.contactSetting);
        if (imported.seoSetting) await handleSavePageSetting("seo", imported.seoSetting);

        triggerStatus("Data backup configuration imported successfully.");
      } catch (err: any) {
        triggerStatus("Import failed: " + err.message, true);
      }
    };
    reader.readAsText(file);
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
            onClick={() => setActiveTab("stats")}
            className={`w-full text-left py-3 px-4 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === "stats" ? "bg-primary text-white" : "text-white/60 hover:bg-white/5"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Control Center
          </button>
          
          <button
            onClick={() => setActiveTab("home")}
            className={`w-full text-left py-3 px-4 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === "home" ? "bg-primary text-white" : "text-white/60 hover:bg-white/5"
            }`}
          >
            <Home className="w-4 h-4" />
            Home Manager
          </button>
          
          <button
            onClick={() => setActiveTab("about")}
            className={`w-full text-left py-3 px-4 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === "about" ? "bg-primary text-white" : "text-white/60 hover:bg-white/5"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            About Legacy
          </button>
          

          <button
            onClick={() => setActiveTab("alumni")}
            className={`w-full text-left py-3 px-4 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === "alumni" ? "bg-primary text-white" : "text-white/60 hover:bg-white/5"
            }`}
          >
            <Users className="w-4 h-4" />
            Alumni Showcase
          </button>
          
          <button
            onClick={() => setActiveTab("gallery")}
            className={`w-full text-left py-3 px-4 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === "gallery" ? "bg-primary text-white" : "text-white/60 hover:bg-white/5"
            }`}
          >
            <Images className="w-4 h-4" />
            Photo Gallery
          </button>
          
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
            onClick={() => setActiveTab("events")}
            className={`w-full text-left py-3 px-4 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === "events" ? "bg-primary text-white" : "text-white/60 hover:bg-white/5"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Events / Calendar
          </button>

          <button
            onClick={() => setActiveTab("billing")}
            className={`w-full text-left py-3 px-4 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === "billing" ? "bg-primary text-white" : "text-white/60 hover:bg-white/5"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Billing & Contacts
          </button>

          <button
            onClick={() => setActiveTab("seo")}
            className={`w-full text-left py-3 px-4 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === "seo" ? "bg-primary text-white" : "text-white/60 hover:bg-white/5"
            }`}
          >
            <Globe className="w-4 h-4" />
            SEO Settings
          </button>

          <button
            onClick={() => setActiveTab("backup")}
            className={`w-full text-left py-3 px-4 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === "backup" ? "bg-primary text-white" : "text-white/60 hover:bg-white/5"
            }`}
          >
            <Upload className="w-4 h-4" />
            Backup Manager
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

        {/* --- CONTROL CENTER TAB --- */}
        {activeTab === "stats" && (
          <div className="flex flex-col gap-8">
            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
              <h1 className="font-heading text-3xl font-bold text-gray-900 leading-tight">Control Center</h1>
              <p className="font-body text-sm text-gray-500 mt-1">Overall statistics of the database content managed through this CMS.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <span className="text-gray-400 text-xs font-bold font-nav uppercase tracking-wider block">Faculty Count</span>
                <span className="text-4xl font-heading font-bold text-gray-900 mt-2 block">{faculties.length}</span>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <span className="text-gray-400 text-xs font-bold font-nav uppercase tracking-wider block">Alumni Records</span>
                <span className="text-4xl font-heading font-bold text-gray-900 mt-2 block">{alumniList.length}</span>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <span className="text-gray-400 text-xs font-bold font-nav uppercase tracking-wider block">Blog Articles</span>
                <span className="text-4xl font-heading font-bold text-gray-900 mt-2 block">{blogs.length}</span>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <span className="text-gray-400 text-xs font-bold font-nav uppercase tracking-wider block">Gallery Highlights</span>
                <span className="text-4xl font-heading font-bold text-gray-900 mt-2 block">{galleryList.length}</span>
              </div>
            </div>

            <div className="bg-[#B52A2A]/5 border border-primary/10 p-6 rounded-3xl flex items-center gap-4">
              <ShieldAlert className="w-10 h-10 text-primary shrink-0" />
              <div>
                <h3 className="font-heading text-lg font-bold text-gray-900">Zero Technical Knowledge Required</h3>
                <p className="font-body text-xs text-gray-500 leading-relaxed mt-1">
                  This panel updates files and configurations in real time. Simply fill out the forms or press delete. To replace images, select local files using the upload fields or paste clean external links.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --- HOME PAGE MANAGER TAB --- */}
        {activeTab === "home" && (
          <div className="flex flex-col gap-8">
            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
              <h1 className="font-heading text-2xl font-bold text-gray-900">Home Page Manager</h1>
              <p className="font-body text-xs text-gray-400 mt-1">Change background videos, welcome messages, taglines, and numeric counters.</p>
            </div>

            {/* Hero text */}
            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm flex flex-col gap-6">
              <h2 className="font-heading text-lg font-bold text-gray-900 border-b border-gray-50 pb-3">Hero Section Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-body text-sm">
                <div className="flex flex-col gap-1.5">
                  <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Tagline Title</label>
                  <input
                    type="text"
                    value={homeSetting.hero?.tagline || ""}
                    onChange={(e) => setHomeSetting({ ...homeSetting, hero: { ...homeSetting.hero, tagline: e.target.value } })}
                    className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none focus:border-primary text-gray-800"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Hero Subtitle</label>
                  <input
                    type="text"
                    value={homeSetting.hero?.subtitle || ""}
                    onChange={(e) => setHomeSetting({ ...homeSetting, hero: { ...homeSetting.hero, subtitle: e.target.value } })}
                    className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none focus:border-primary text-gray-800"
                  />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Hero Video Link (MP4/WebM URL)</label>
                  <input
                    type="text"
                    value={homeSetting.hero?.videoUrl || ""}
                    onChange={(e) => setHomeSetting({ ...homeSetting, hero: { ...homeSetting.hero, videoUrl: e.target.value } })}
                    className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none focus:border-primary text-gray-800"
                  />
                </div>
              </div>
            </div>

            {/* Principal details */}
            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm flex flex-col gap-6">
              <h2 className="font-heading text-lg font-bold text-gray-900 border-b border-gray-50 pb-3">Principal message details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-body text-sm">
                <div className="flex flex-col gap-1.5">
                  <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Welcome Section Title</label>
                  <input
                    type="text"
                    value={homeSetting.welcome?.title || ""}
                    onChange={(e) => setHomeSetting({ ...homeSetting, welcome: { ...homeSetting.welcome, title: e.target.value } })}
                    className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none focus:border-primary text-gray-800"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Principal Name</label>
                  <input
                    type="text"
                    value={homeSetting.welcome?.principalName || ""}
                    onChange={(e) => setHomeSetting({ ...homeSetting, welcome: { ...homeSetting.welcome, principalName: e.target.value } })}
                    className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none focus:border-primary text-gray-800"
                  />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Welcome Text Content</label>
                  <textarea
                    rows={4}
                    value={homeSetting.welcome?.text || ""}
                    onChange={(e) => setHomeSetting({ ...homeSetting, welcome: { ...homeSetting.welcome, text: e.target.value } })}
                    className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none focus:border-primary text-gray-800 resize-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Principal Photo (Local upload or link)</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      value={homeSetting.welcome?.image || ""}
                      onChange={(e) => setHomeSetting({ ...homeSetting, welcome: { ...homeSetting.welcome, image: e.target.value } })}
                      className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none focus:border-primary text-gray-800 flex-grow"
                    />
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        id="welcome-photo-uploader"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, (url) => setHomeSetting({ ...homeSetting, welcome: { ...homeSetting.welcome, image: url } }))}
                      />
                      <label htmlFor="welcome-photo-uploader" className="font-nav text-xs font-bold bg-secondary text-white py-3.5 px-6 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md">
                        <Upload className="w-3.5 h-3.5" />
                        Upload
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Counters */}
            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm flex flex-col gap-6">
              <h2 className="font-heading text-lg font-bold text-gray-900 border-b border-gray-50 pb-3">Stat Counters</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 font-body text-sm">
                <div className="flex flex-col gap-1.5">
                  <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Years of Legacy</label>
                  <input
                    type="number"
                    value={homeSetting.stats?.yearsOfExcellence || 0}
                    onChange={(e) => setHomeSetting({ ...homeSetting, stats: { ...homeSetting.stats, yearsOfExcellence: parseInt(e.target.value) } })}
                    className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none focus:border-primary text-gray-800"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Enrolled Students</label>
                  <input
                    type="number"
                    value={homeSetting.stats?.students || 0}
                    onChange={(e) => setHomeSetting({ ...homeSetting, stats: { ...homeSetting.stats, students: parseInt(e.target.value) } })}
                    className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none focus:border-primary text-gray-800"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Expert Teachers</label>
                  <input
                    type="number"
                    value={homeSetting.stats?.teachers || 0}
                    onChange={(e) => setHomeSetting({ ...homeSetting, stats: { ...homeSetting.stats, teachers: parseInt(e.target.value) } })}
                    className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none focus:border-primary text-gray-800"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">National Awards</label>
                  <input
                    type="number"
                    value={homeSetting.stats?.awards || 0}
                    onChange={(e) => setHomeSetting({ ...homeSetting, stats: { ...homeSetting.stats, awards: parseInt(e.target.value) } })}
                    className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none focus:border-primary text-gray-800"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSavePageSetting("home", homeSetting)}
              className="font-nav text-sm font-semibold uppercase tracking-wider bg-primary hover:bg-primary/95 text-white py-4 px-8 rounded-xl shadow-lg shadow-primary/20 transition-all self-end cursor-pointer"
            >
              Save Homepage Changes
            </button>
          </div>
        )}

        {/* --- ABOUT PAGE MANAGER TAB --- */}
        {activeTab === "about" && (
          <div className="flex flex-col gap-8">
            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
              <h1 className="font-heading text-2xl font-bold text-gray-900">About Page Content</h1>
              <p className="font-body text-xs text-gray-400 mt-1">Manage school history, vision, and mission statement settings.</p>
            </div>

            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm flex flex-col gap-6">
              <div className="flex flex-col gap-5 font-body text-sm">
                <div className="flex flex-col gap-1.5">
                  <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">History Text</label>
                  <textarea
                    rows={4}
                    value={aboutSetting.history || ""}
                    onChange={(e) => setAboutSetting({ ...aboutSetting, history: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none focus:border-primary text-gray-800 resize-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Academic Philosophy Text</label>
                  <textarea
                    rows={3}
                    value={aboutSetting.philosophy || ""}
                    onChange={(e) => setAboutSetting({ ...aboutSetting, philosophy: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none focus:border-primary text-gray-800 resize-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Mission Statement</label>
                    <textarea
                      rows={3}
                      value={aboutSetting.mission || ""}
                      onChange={(e) => setAboutSetting({ ...aboutSetting, mission: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none focus:border-primary text-gray-800 resize-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Vision Statement</label>
                    <textarea
                      rows={3}
                      value={aboutSetting.vision || ""}
                      onChange={(e) => setAboutSetting({ ...aboutSetting, vision: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none focus:border-primary text-gray-800 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSavePageSetting("about", aboutSetting)}
              className="font-nav text-sm font-semibold uppercase tracking-wider bg-primary hover:bg-primary/95 text-white py-4 px-8 rounded-xl shadow-lg shadow-primary/20 transition-all self-end cursor-pointer"
            >
              Save Legacy Content
            </button>
          </div>
        )}

        {/* --- FACULTY TAB (CRUD LIST & FORMS) --- */}
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

        {/* --- ALUMNI REGISTRY TAB --- */}
        {activeTab === "alumni" && (
          <div className="flex flex-col gap-8">
            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-heading text-2xl font-bold text-gray-900">Alumni Registry CMS</h1>
                <p className="font-body text-xs text-gray-400 mt-1">Manage school alumni listings, batches, positions, and LinkedIn coordinates.</p>
              </div>
              <button
                onClick={() => setEditingAlumni({ name: "", batch: "", currentPosition: "", company: "", achievement: "", photoUrl: "", linkedin: "" })}
                className="font-nav text-xs font-bold uppercase tracking-wider bg-primary hover:bg-primary/95 text-white py-3 px-6 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                Add Record
              </button>
            </div>

            {/* New / Edit Alumni Form */}
            {editingAlumni && (
              <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-lg animate-fade-in">
                <h2 className="font-heading text-lg font-bold text-gray-900 border-b border-gray-50 pb-3 mb-6">
                  {editingAlumni.id ? "Edit Alumni Profile" : "Record New Graduate Profile"}
                </h2>
                <form onSubmit={handleSaveAlumni} className="grid grid-cols-1 md:grid-cols-2 gap-6 font-body text-sm">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Graduate Name</label>
                    <input
                      type="text"
                      required
                      value={editingAlumni.name}
                      onChange={(e) => setEditingAlumni({ ...editingAlumni, name: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Graduation Batch Year (e.g. 2018)</label>
                    <input
                      type="text"
                      required
                      value={editingAlumni.batch}
                      onChange={(e) => setEditingAlumni({ ...editingAlumni, batch: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Current Position / Role (e.g. CEO)</label>
                    <input
                      type="text"
                      required
                      value={editingAlumni.currentPosition}
                      onChange={(e) => setEditingAlumni({ ...editingAlumni, currentPosition: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Current Corporate / Company</label>
                    <input
                      type="text"
                      required
                      value={editingAlumni.company}
                      onChange={(e) => setEditingAlumni({ ...editingAlumni, company: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Photo URL (Link or Local File Upload)</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="text"
                        value={editingAlumni.photoUrl}
                        onChange={(e) => setEditingAlumni({ ...editingAlumni, photoUrl: e.target.value })}
                        className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none flex-grow"
                      />
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          id="al-photo-uploader"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, (url) => setEditingAlumni({ ...editingAlumni, photoUrl: url }))}
                        />
                        <label htmlFor="al-photo-uploader" className="font-nav text-xs font-bold bg-secondary text-white py-3.5 px-6 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md">
                          <Upload className="w-3.5 h-3.5" />
                          Upload
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">LinkedIn Profile Link (Optional)</label>
                    <input
                      type="text"
                      value={editingAlumni.linkedin || ""}
                      onChange={(e) => setEditingAlumni({ ...editingAlumni, linkedin: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Key Achievement Statement</label>
                    <textarea
                      rows={3}
                      value={editingAlumni.achievement}
                      onChange={(e) => setEditingAlumni({ ...editingAlumni, achievement: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none resize-none"
                    />
                  </div>
                  <div className="flex justify-end gap-3 md:col-span-2 mt-4">
                    <button
                      type="button"
                      onClick={() => setEditingAlumni(null)}
                      className="font-nav text-xs font-bold uppercase tracking-wider border border-gray-200 py-3.5 px-6 rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="font-nav text-xs font-bold uppercase tracking-wider bg-primary text-white py-3.5 px-6 rounded-xl cursor-pointer shadow-md"
                    >
                      Record Alumni
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Alumni Registry Table */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-body text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-nav text-xs uppercase tracking-wider">
                      <th className="py-4 px-4 font-semibold">Alumni</th>
                      <th className="py-4 px-4 font-semibold">Batch</th>
                      <th className="py-4 px-4 font-semibold">Role & Firm</th>
                      <th className="py-4 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-700">
                    {alumniList.map((al) => (
                      <tr key={al.id} className="hover:bg-bg-light/40 transition-colors">
                        <td className="py-4 px-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50">
                            <img src={al.photoUrl} alt="" className="w-full h-full object-cover" />
                          </div>
                          <span className="font-semibold text-gray-900">{al.name}</span>
                        </td>
                        <td className="py-4 px-4 font-semibold text-xs text-primary">Class of {al.batch}</td>
                        <td className="py-4 px-4 text-xs text-gray-500">
                          {al.currentPosition} ({al.company})
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => setEditingAlumni(al)}
                              className="p-2 border border-gray-100 hover:border-secondary hover:bg-secondary/5 rounded-lg text-secondary transition-colors cursor-pointer"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAlumni(al.id)}
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

        {/* --- PHOTO GALLERY TAB --- */}
        {activeTab === "gallery" && (
          <div className="flex flex-col gap-8">
            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-heading text-2xl font-bold text-gray-900">Photo Highlights Gallery</h1>
                <p className="font-body text-xs text-gray-400 mt-1">Upload unlimited school environment highlights, class photos, sports meets, and laboratories.</p>
              </div>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  id="direct-gallery-uploader"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, (url) => handleAddGalleryItem(url, "Campus"))}
                />
                <label htmlFor="direct-gallery-uploader" className="font-nav text-xs font-bold uppercase tracking-wider bg-primary hover:bg-primary/95 text-white py-3.5 px-6 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md">
                  <Upload className="w-4 h-4" />
                  Upload Image
                </label>
              </div>
            </div>

            {/* Grid List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              {galleryList.map((item) => (
                <div key={item.id} className="relative h-48 border border-gray-100 rounded-2xl overflow-hidden group">
                  <img src={item.url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 z-10 bg-black/60 text-white text-[9px] font-nav font-bold uppercase tracking-wider py-1 px-2.5 rounded-full">
                    {item.category}
                  </span>
                  
                  {/* Category editor dropdown overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleDeleteGallery(item.id)}
                      className="p-3 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-md transition-all cursor-pointer"
                      title="Delete Image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- BLOG PUBLISHER TAB --- */}
        {activeTab === "blog" && (
          <div className="flex flex-col gap-8">
            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-heading text-2xl font-bold text-gray-900">Blog Publisher CMS</h1>
                <p className="font-body text-xs text-gray-400 mt-1">Compose, save as draft, or publish academic articles and district rank notifications.</p>
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

        {/* --- EVENTS / CALENDAR TAB (CRUD) --- */}
        {activeTab === "events" && (
          <div className="flex flex-col gap-8">
            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-heading text-2xl font-bold text-gray-900">Events & News CMS</h1>
                <p className="font-body text-xs text-gray-400 mt-1">Manage school events calendar schedule dates, descriptions, and locations.</p>
              </div>
              <button
                onClick={() => setEditingEvent({ title: "", date: "", description: "", location: "" })}
                className="font-nav text-xs font-bold uppercase tracking-wider bg-primary hover:bg-primary/95 text-white py-3 px-6 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                Schedule Event
              </button>
            </div>

            {/* Event Form */}
            {editingEvent && (
              <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-lg animate-fade-in">
                <h2 className="font-heading text-lg font-bold text-gray-900 border-b border-gray-50 pb-3 mb-6">
                  {editingEvent.id ? "Edit Event" : "Create Calendar Event"}
                </h2>
                <form onSubmit={handleSaveEvent} className="grid grid-cols-1 md:grid-cols-2 gap-6 font-body text-sm">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Event Title</label>
                    <input
                      type="text"
                      required
                      value={editingEvent.title}
                      onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Event Date (YYYY-MM-DD)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2026-10-15"
                      value={editingEvent.date}
                      onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Event Location (Room/Ground)</label>
                    <input
                      type="text"
                      required
                      value={editingEvent.location}
                      onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Short Description</label>
                    <textarea
                      rows={2}
                      value={editingEvent.description}
                      onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none resize-none"
                    />
                  </div>
                  <div className="flex justify-end gap-3 md:col-span-2 mt-4">
                    <button
                      type="button"
                      onClick={() => setEditingEvent(null)}
                      className="font-nav text-xs font-bold uppercase tracking-wider border border-gray-200 py-3.5 px-6 rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="font-nav text-xs font-bold uppercase tracking-wider bg-primary text-white py-3.5 px-6 rounded-xl cursor-pointer shadow-md"
                    >
                      Save Event
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Events list table */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-body text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-nav text-xs uppercase tracking-wider">
                      <th className="py-4 px-4 font-semibold">Event Title</th>
                      <th className="py-4 px-4 font-semibold">Date</th>
                      <th className="py-4 px-4 font-semibold">Location</th>
                      <th className="py-4 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-700">
                    {events.map((ev) => (
                      <tr key={ev.id} className="hover:bg-bg-light/40 transition-colors">
                        <td className="py-4 px-4 font-semibold text-gray-900">{ev.title}</td>
                        <td className="py-4 px-4 font-semibold text-xs text-primary">{ev.date}</td>
                        <td className="py-4 px-4 text-xs text-gray-500">{ev.location}</td>
                        <td className="py-4 px-4 text-right">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => setEditingEvent(ev)}
                              className="p-2 border border-gray-100 hover:border-secondary hover:bg-secondary/5 rounded-lg text-secondary transition-colors cursor-pointer"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(ev.id)}
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

        {/* --- BILLING & CONTACTS TAB --- */}
        {activeTab === "billing" && (
          <div className="flex flex-col gap-8">
            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
              <h1 className="font-heading text-2xl font-bold text-gray-900">Billing & Contacts Editor</h1>
              <p className="font-body text-xs text-gray-400 mt-1">Configure UPI QR codes, account numbers, and support email details.</p>
            </div>

            {/* Bank details settings */}
            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm flex flex-col gap-6">
              <h2 className="font-heading text-lg font-bold text-gray-900 border-b border-gray-50 pb-3">Bank Transfer & QR details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-body text-sm">
                <div className="flex flex-col gap-1.5">
                  <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Bank Name</label>
                  <input
                    type="text"
                    value={billingSetting.bankDetails?.bankName || ""}
                    onChange={(e) => setBillingSetting({ ...billingSetting, bankDetails: { ...billingSetting.bankDetails, bankName: e.target.value } })}
                    className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Account Name</label>
                  <input
                    type="text"
                    value={billingSetting.bankDetails?.accountName || ""}
                    onChange={(e) => setBillingSetting({ ...billingSetting, bankDetails: { ...billingSetting.bankDetails, accountName: e.target.value } })}
                    className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Account Number</label>
                  <input
                    type="text"
                    value={billingSetting.bankDetails?.accountNumber || ""}
                    onChange={(e) => setBillingSetting({ ...billingSetting, bankDetails: { ...billingSetting.bankDetails, accountNumber: e.target.value } })}
                    className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">IFSC Code</label>
                  <input
                    type="text"
                    value={billingSetting.bankDetails?.ifsc || ""}
                    onChange={(e) => setBillingSetting({ ...billingSetting, bankDetails: { ...billingSetting.bankDetails, ifsc: e.target.value } })}
                    className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">UPI Payment QR Link (Scan to pay image url)</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      value={billingSetting.qrCodeUrl || ""}
                      onChange={(e) => setBillingSetting({ ...billingSetting, qrCodeUrl: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none flex-grow"
                    />
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        id="qr-photo-uploader"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, (url) => setBillingSetting({ ...billingSetting, qrCodeUrl: url }))}
                      />
                      <label htmlFor="qr-photo-uploader" className="font-nav text-xs font-bold bg-secondary text-white py-3.5 px-6 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md">
                        <Upload className="w-3.5 h-3.5" />
                        Upload
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Fee Circular PDF Link (Upload PDF or URL)</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      value={billingSetting.feeCircularPdfUrl || ""}
                      onChange={(e) => setBillingSetting({ ...billingSetting, feeCircularPdfUrl: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none flex-grow"
                    />
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf"
                        id="pdf-circular-uploader"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, (url) => setBillingSetting({ ...billingSetting, feeCircularPdfUrl: url }))}
                      />
                      <label htmlFor="pdf-circular-uploader" className="font-nav text-xs font-bold bg-secondary text-white py-3.5 px-6 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md">
                        <Upload className="w-3.5 h-3.5" />
                        Upload
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* School Contacts details settings */}
            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm flex flex-col gap-6">
              <h2 className="font-heading text-lg font-bold text-gray-900 border-b border-gray-50 pb-3">School Contacts details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-body text-sm">
                <div className="flex flex-col gap-1.5">
                  <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Phone Support Contacts</label>
                  <input
                    type="text"
                    value={contactSetting.phone || ""}
                    onChange={(e) => setContactSetting({ ...contactSetting, phone: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Official Email Addresses</label>
                  <input
                    type="text"
                    value={contactSetting.email || ""}
                    onChange={(e) => setContactSetting({ ...contactSetting, email: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">School Physical Address</label>
                  <input
                    type="text"
                    value={contactSetting.address || ""}
                    onChange={(e) => setContactSetting({ ...contactSetting, address: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  handleSavePageSetting("payment", billingSetting);
                  handleSavePageSetting("contact", contactSetting);
                }}
                className="font-nav text-sm font-semibold uppercase tracking-wider bg-primary hover:bg-primary/95 text-white py-4 px-8 rounded-xl shadow-lg shadow-primary/20 transition-all cursor-pointer"
              >
                Save Billing & Contacts
              </button>
            </div>
          </div>
        )}

        {/* --- SEO TAB --- */}
        {activeTab === "seo" && (
          <div className="flex flex-col gap-8">
            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
              <h1 className="font-heading text-2xl font-bold text-gray-900">SEO Settings Editor</h1>
              <p className="font-body text-xs text-gray-400 mt-1">Configure search index tags, Google title displays, meta keywords, and page indexing tags.</p>
            </div>

            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm flex flex-col gap-6">
              <div className="flex flex-col gap-5 font-body text-sm">
                <div className="flex flex-col gap-1.5">
                  <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Google Title Display (Meta Title)</label>
                  <input
                    type="text"
                    value={seoSetting.metaTitle || ""}
                    onChange={(e) => setSeoSetting({ ...seoSetting, metaTitle: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none focus:border-primary text-gray-800"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Meta Description</label>
                  <textarea
                    rows={3}
                    value={seoSetting.metaDescription || ""}
                    onChange={(e) => setSeoSetting({ ...seoSetting, metaDescription: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none focus:border-primary text-gray-800 resize-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-400">Meta Keywords (comma-separated)</label>
                  <input
                    type="text"
                    value={seoSetting.metaKeywords || ""}
                    onChange={(e) => setSeoSetting({ ...seoSetting, metaKeywords: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light outline-none focus:border-primary text-gray-800"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSavePageSetting("seo", seoSetting)}
              className="font-nav text-sm font-semibold uppercase tracking-wider bg-primary hover:bg-primary/95 text-white py-4 px-8 rounded-xl shadow-lg shadow-primary/20 transition-all self-end cursor-pointer"
            >
              Update SEO Configuration
            </button>
          </div>
        )}

        {/* --- BACKUP & RESTORE TAB --- */}
        {activeTab === "backup" && (
          <div className="flex flex-col gap-8">
            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
              <h1 className="font-heading text-2xl font-bold text-gray-900">Backup & Restore Manager</h1>
              <p className="font-body text-xs text-gray-400 mt-1">Export your complete school configuration and database setup to a JSON file, or restore configurations instantly.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Export Panel */}
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col justify-between items-start gap-4">
                <div>
                  <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">Export Data Backup</h3>
                  <p className="font-body text-xs text-gray-400 leading-relaxed">
                    Downloads a local `.json` file containing all text records, settings layouts, faculty logs, gallery links, and blog contents. Keeps your data completely portable.
                  </p>
                </div>
                <button
                  onClick={handleExportBackup}
                  className="font-nav text-xs font-bold uppercase tracking-wider bg-primary hover:bg-primary/95 text-white py-3.5 px-6 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Download className="w-4 h-4" />
                  Generate Backup
                </button>
              </div>

              {/* Import Panel */}
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col justify-between items-start gap-4">
                <div>
                  <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">Restore Backup File</h3>
                  <p className="font-body text-xs text-gray-400 leading-relaxed">
                    Select a previously exported `.json` file. This action will overwrite page details, settings, and tables in the database with the backups values.
                  </p>
                </div>
                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    id="system-backup-importer"
                    className="hidden"
                    onChange={handleImportBackup}
                  />
                  <label htmlFor="system-backup-importer" className="font-nav text-xs font-bold uppercase tracking-wider bg-secondary hover:bg-secondary/95 text-white py-3.5 px-6 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md">
                    <Upload className="w-4 h-4" />
                    Load Backup File
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
