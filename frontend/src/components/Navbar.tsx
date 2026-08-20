"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, User, ShieldAlert, GraduationCap } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Our Staff", href: "/staff" },
  { name: "Donate", href: "/donation" },
  { name: "FAQ", href: "/faq" },
  { name: "Blog", href: "/blog" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // On homepage, the navbar starts transparent and goes white on scroll.
  // On other pages, it is always white with border.
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Trigger initially

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navbarBg = "bg-white/95 backdrop-blur-md shadow-md py-4 border-b border-gray-100";

  const textColor = "text-gray-800";

  const activeColor = "text-primary font-semibold";
  const hoverColor = "hover:text-primary";

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${navbarBg}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo & School Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-12 w-auto flex items-center bg-white/10 rounded px-1 transition-all duration-300 group-hover:bg-white/20">
              {/* Load SVG logo */}
              <img 
                src="/schoollogo.png" 
                alt="Lather High School Logo" 
                className="h-10 w-auto object-contain" 
                onError={(e) => {
                  // Fallback to text logo if SVG fails to load
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            {/* Short brand title for narrow headers */}
            <div className="flex flex-col">
              <span className={`font-nav font-bold text-sm lg:text-base leading-tight tracking-wider transition-colors duration-300 ${textColor}`}>
                LATHER HIGH SCHOOL
              </span>
              <span className="font-body text-[10px] uppercase tracking-[0.2em] text-gray-500">
                Karnal • UKG to 12th Class
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-nav text-sm font-medium tracking-wide transition-colors duration-300 ${textColor} ${hoverColor} ${
                    isActive ? activeColor : ""
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Header CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/admission"
              className="font-nav text-xs font-semibold uppercase tracking-wider bg-primary hover:bg-primary/90 text-white py-2 px-5 rounded-full shadow-lg shadow-primary/20 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Admissions
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className={`w-6 h-6 ${isOpen ? "text-gray-800" : textColor}`} />
            ) : (
              <Menu className={`w-6 h-6 ${textColor}`} />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
              className="fixed right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-2xl z-55 md:hidden flex flex-col pt-24 px-8 pb-10"
            >
              {/* Mobile Drawer Links */}
              <div className="flex flex-col gap-6 mt-4">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`font-nav text-lg font-medium tracking-wide border-b border-gray-100 pb-2 transition-colors duration-300 text-gray-800 hover:text-primary ${
                        isActive ? "text-primary font-bold border-primary" : ""
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              {/* Extra Info & CTAs inside Drawer */}
              <div className="mt-auto flex flex-col gap-4">
                <Link
                  href="/admission"
                  className="flex items-center justify-center gap-2 font-nav text-sm font-semibold uppercase tracking-wider py-3 bg-primary hover:bg-primary/95 text-white rounded-xl shadow-lg shadow-primary/20 transition-all"
                >
                  Admissions Open
                </Link>
                <div className="text-center mt-6">
                  <p className="text-xs text-gray-400">Lather High School, Karnal</p>
                  <p className="text-[10px] text-gray-400 mt-1">© 2026. All rights reserved.</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
