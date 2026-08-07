export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Fetch helper with standard timeout and error handling
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      next: { revalidate: 10 }, // ISR: Cache for 10 seconds
      ...options,
    });
    if (!res.ok) {
      throw new Error(`API fetch error: ${res.statusText}`);
    }
    return await res.json() as T;
  } catch (error) {
    console.error(`Failed to fetch from endpoint: ${endpoint}`, error);
    return null;
  }
}

// Interfaces
export interface HomepageData {
  hero: {
    tagline: string;
    subtitle: string;
    videoUrl: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  welcome: {
    title: string;
    text: string;
    image: string;
    principalName: string;
    principalTitle: string;
  };
  whyChooseUs: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  stats: {
    yearsOfExcellence: number;
    students: number;
    teachers: number;
    awards: number;
  };
}

export interface AboutpageData {
  history: string;
  mission: string;
  vision: string;
  philosophy: string;
  timeline: Array<{
    year: string;
    event: string;
  }>;
  infrastructure: Array<{
    title: string;
    description: string;
    image: string;
  }>;
}

export interface FacultyMember {
  id: number;
  name: string;
  department: string;
  qualification: string;
  experience: string;
  photoUrl: string;
  bio: string;
}

export interface AlumniRecord {
  id: number;
  name: string;
  batch: string;
  currentPosition: string;
  company: string;
  achievement: string;
  photoUrl: string;
  linkedin?: string;
}

export interface GalleryItem {
  id: number;
  type: string;
  url: string;
  category: string;
  orderIndex: number;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  slug: string;
  category: string;
  featuredImage: string;
  draft: boolean;
  publishedAt: string;
}

export interface SchoolEvent {
  id: number;
  title: string;
  date: string;
  description: string;
  location: string;
}

export interface SchoolNews {
  id: number;
  title: string;
  date: string;
  content: string;
  imageUrl: string;
}

export interface PaymentPageData {
  qrCodeUrl: string;
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    ifsc: string;
    branch: string;
    paymentModes: string;
  };
  feeCircularPdfUrl: string;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export interface ContactData {
  phone: string;
  email: string;
  address: string;
  mapsEmbedUrl: string;
  officeHours: string;
}

// Fetch endpoints
export const getHomepage = () => apiFetch<HomepageData>('/cms/page/home');
export const getAboutpage = () => apiFetch<AboutpageData>('/cms/page/about');
export const getFaculty = () => apiFetch<FacultyMember[]>('/cms/faculty');
export const getAlumni = () => apiFetch<AlumniRecord[]>('/cms/alumni');
export const getGallery = () => apiFetch<GalleryItem[]>('/cms/gallery');
export const getBlogs = () => apiFetch<BlogPost[]>('/cms/blog');
export const getBlogBySlug = (slug: string) => apiFetch<BlogPost>(`/cms/blog/${slug}`);
export const getEvents = () => apiFetch<SchoolEvent[]>('/cms/event');
export const getNews = () => apiFetch<SchoolNews[]>('/cms/news');
export const getPaymentPage = () => apiFetch<PaymentPageData>('/cms/page/payment');
export const getContact = () => apiFetch<ContactData>('/cms/page/contact');
