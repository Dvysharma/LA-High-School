"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for subscribing to our newsletter!");
  };

  return (
    <footer className="bg-[#1A1A1A] text-white/80 font-body border-t border-white/5">
      
      {/* Top Newsletter / CTA Bar */}
      <div className="border-b border-white/5 py-10 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-heading text-2xl font-bold text-white tracking-wide">Stay Connected</h3>
            <p className="text-sm text-white/50 mt-1">Subscribe to receive school notifications, circulars, and seasonal newsletters.</p>
          </div>
          <form onSubmit={handleNewsletterSubmit} className="flex w-full max-w-md bg-white/5 border border-white/10 rounded-xl p-1.5 focus-within:border-accent transition-colors duration-300">
            <input
              type="email"
              placeholder="Your email address"
              required
              className="flex-grow bg-transparent text-sm text-white placeholder-white/30 px-3 py-2 outline-none"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary/95 text-white py-2 px-6 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all duration-300 transform active:scale-95"
            >
              Subscribe
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Col 1: About & Logo */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-auto bg-white/10 p-1 rounded">
              <img src="/schoollogo.png" alt="Lather High School Logo" className="h-8 w-auto object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-nav font-bold text-sm leading-tight text-white tracking-wider">
                LATHER HIGH SCHOOL
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-white/50">
                Karnal • UKG to 12th Class
              </span>
            </div>
          </div>
          <p className="text-sm text-white/50 leading-relaxed">
            Lather High School is a premier co-educational boarding-cum-day school committed to academic mastery, athletic dominance, and nurturing empathetic, world-class leaders.
          </p>
          <div className="flex items-center gap-3.5 mt-2">
            <a href="https://www.facebook.com/share/19K3kuSf12/" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 hover:bg-primary hover:text-white rounded-full transition-all duration-300" aria-label="Facebook">
              <FaFacebook className="w-4 h-4" />
            </a>
            <a href="https://instagram.com/invites/contact/?igsh=13t5mrk5sq4so&utm_content=xj3u58k" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 hover:bg-primary hover:text-white rounded-full transition-all duration-300" aria-label="Instagram">
              <FaInstagram className="w-4 h-4" />
            </a>
            <a href="https://youtube.com/@latherhighschool306?si=wSC_0V9AerDG-jYh" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 hover:bg-primary hover:text-white rounded-full transition-all duration-300" aria-label="YouTube">
              <FaYoutube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="font-heading text-lg font-bold text-white mb-6 border-l-2 border-primary pl-3">Quick Links</h4>
          <ul className="flex flex-col gap-3.5 text-sm">
            <li>
              <Link href="/about" className="hover:text-primary transition-colors">Our History & Legacy</Link>
            </li>
            <li>
              <Link href="/alumni" className="hover:text-primary transition-colors">Alumni Network</Link>
            </li>
            <li>
              <Link href="/payment" className="hover:text-primary transition-colors">Fees & Billing</Link>
            </li>
            <li>
              <Link href="/donation" className="hover:text-primary transition-colors">Support & Donations</Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-primary transition-colors">School News & Blog</Link>
            </li>
            <li>
              <Link href="/admin/login" className="hover:text-primary transition-colors">CMS Staff Portal</Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Contact Details */}
        <div>
          <h4 className="font-heading text-lg font-bold text-white mb-6 border-l-2 border-primary pl-3">Contact Us</h4>
          <ul className="flex flex-col gap-4 text-sm text-white/70">
            <li className="flex gap-3">
              <MapPin className="w-5 h-5 text-accent shrink-0" />
              <span>Sector 12, GT Road Bypass, Karnal, Haryana - 132001</span>
            </li>
            <li className="flex gap-3 items-center">
              <Phone className="w-5 h-5 text-accent shrink-0" />
              <span>+91 94665 18003, +91 81686 53159</span>
            </li>
            <li className="flex gap-3 items-center">
              <Mail className="w-5 h-5 text-accent shrink-0" />
              <span className="break-all">info@latherhigherschool.edu.in</span>
            </li>
          </ul>
        </div>

        {/* Col 4: Location Map */}
        <div>
          <h4 className="font-heading text-lg font-bold text-white mb-6 border-l-2 border-primary pl-3">Find Us</h4>
          <div className="w-full h-40 rounded-xl overflow-hidden border border-white/10 shadow-lg group relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3466.527390977239!2d76.9740523!3d29.684128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390e719c8fba56cf%3A0xe54d8a1fc414589d!2sKarnal%2C%20Haryana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lather High School Location Map"
              className="grayscale brightness-90 group-hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="bg-[#111111] border-t border-white/5 py-6 px-6 lg:px-8 text-center text-xs text-white/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Lather High School, Karnal. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white/60 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>

    </footer>
  );
}
