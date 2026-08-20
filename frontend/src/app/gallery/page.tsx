"use client";

import { useEffect, useState, useCallback } from "react";
import { getGallery, GalleryItem } from "@/utils/api";
import { X, ChevronLeft, ChevronRight, ImageIcon, Loader2, Sparkles } from "lucide-react";

// Fallback images in case the API backend is not running/accessible
const fallbackGallery: GalleryItem[] = Array.from({ length: 76 }, (_, i) => ({
  id: -(i + 1),
  type: "image",
  url: `/gallery/gallery-image-${i + 1}.jpeg`,
  category: "Highlight",
  orderIndex: i + 1
}));

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>(fallbackGallery);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(16);
  
  // Lightbox States
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  // Fetch images from database backend
  useEffect(() => {
    async function loadGallery() {
      try {
        setLoading(true);
        const data = await getGallery();
        if (data && data.length > 0) {
          // Sort gallery items by order index
          const sortedData = [...data].sort((a, b) => a.orderIndex - b.orderIndex);
          setGallery(sortedData);
        }
      } catch (err) {
        console.error("Failed to load gallery items from backend, using fallbacks.", err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  // Lightbox Navigation Functions
  const handleCloseLightbox = () => {
    setActivePhotoIndex(null);
  };

  const handleNextPhoto = useCallback(() => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prevIndex) => 
      prevIndex !== null && prevIndex < gallery.length - 1 ? prevIndex + 1 : 0
    );
  }, [activePhotoIndex, gallery.length]);

  const handlePrevPhoto = useCallback(() => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prevIndex) => 
      prevIndex !== null && prevIndex > 0 ? prevIndex - 1 : gallery.length - 1
    );
  }, [activePhotoIndex, gallery.length]);

  // Bind Keyboard Navigation (Left / Right / Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (e.key === "Escape") handleCloseLightbox();
      if (e.key === "ArrowRight") handleNextPhoto();
      if (e.key === "ArrowLeft") handlePrevPhoto();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhotoIndex, handleNextPhoto, handlePrevPhoto]);

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 16, gallery.length));
  };

  const visibleItems = gallery.slice(0, visibleCount);

  return (
    <div className="pt-24 min-h-screen bg-[#fafafa]">
      
      {/* 1. HERO HEADER */}
      <section className="bg-white border-b border-gray-100 py-20 px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-10 w-48 h-48 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-secondary/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="font-nav text-xs font-bold uppercase tracking-[0.3em] text-primary flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> Lather Life Chronicles
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mt-4 mb-6 leading-tight">
            Our Shared Memories
          </h1>
          <div className="w-16 h-[3px] bg-accent mx-auto mb-6" />
          <p className="font-body text-base text-gray-500 max-w-2xl mx-auto leading-relaxed font-light">
            A beautiful, unstructured stream of moments, academic endeavors, sporting achievements, and student life milestones.
          </p>
        </div>
      </section>

      {/* 2. CREATIVE MASONRY GRID */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {loading && gallery.length === fallbackGallery.length ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
            <p className="font-body text-sm text-gray-400">Assembling visual board...</p>
          </div>
        ) : gallery.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl max-w-lg mx-auto">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="font-heading text-lg font-bold text-gray-800">No Memories Available</p>
            <p className="text-sm text-gray-400 mt-1">Please upload photos to the gallery database.</p>
          </div>
        ) : (
          <div>
            {/* Masonry Columns */}
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
              {visibleItems.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => setActivePhotoIndex(index)}
                  className="break-inside-avoid group relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white flex flex-col hover:-translate-y-1"
                >
                  <img
                    src={item.url}
                    alt="School Highlight"
                    className="w-full h-auto object-cover hover-zoom-img rounded-2xl"
                    loading="lazy"
                  />
                  
                  {/* Subtle Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 rounded-2xl">
                    <span className="font-nav text-[10px] font-bold uppercase tracking-widest text-accent mb-1 block">
                      Memories
                    </span>
                    <h3 className="font-heading text-base font-bold text-white leading-tight">
                      Lather School Narrative
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {visibleCount < gallery.length && (
              <div className="flex justify-center mt-16">
                <button
                  onClick={loadMore}
                  className="font-nav text-xs font-bold uppercase tracking-widest bg-primary hover:bg-primary/95 text-white py-4 px-10 rounded-full shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  Explore More Memories
                </button>
              </div>
            )}
            
            <div className="text-center text-xs text-gray-400 mt-12 font-body font-light">
              Displaying {visibleItems.length} of {gallery.length} photos
            </div>
          </div>
        )}
      </section>

      {/* 3. LIGHTBOX MODAL */}
      {activePhotoIndex !== null && gallery[activePhotoIndex] && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out select-none"
          onClick={handleCloseLightbox}
        >
          {/* Close Button */}
          <button 
            onClick={handleCloseLightbox}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all duration-300 cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Arrows */}
          <button 
            onClick={(e) => { e.stopPropagation(); handlePrevPhoto(); }}
            className="absolute left-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/25 p-4 rounded-full transition-all duration-300 cursor-pointer z-10 hidden sm:block"
            aria-label="Previous Photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); handleNextPhoto(); }}
            className="absolute right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/25 p-4 rounded-full transition-all duration-300 cursor-pointer z-10 hidden sm:block"
            aria-label="Next Photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Lightbox Main Image & Details Container */}
          <div 
            className="relative max-w-5xl max-h-[85vh] flex flex-col items-center animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={gallery[activePhotoIndex].url} 
              alt="School Highlight Zoomed" 
              className="max-w-full max-h-[75vh] rounded-xl shadow-2xl object-contain border border-white/5"
            />
            
            {/* Image Details Bar */}
            <div className="w-full flex items-center justify-between text-white mt-4 px-2">
              <div className="flex items-center gap-3">
                <span className="font-nav text-[10px] font-bold uppercase tracking-wider text-accent">
                  Lather High School Highlights
                </span>
              </div>
              
              <div className="font-nav text-xs text-white/50 font-bold uppercase tracking-widest">
                Photo {activePhotoIndex + 1} of {gallery.length}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
