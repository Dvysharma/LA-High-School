"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, Phone, Mail, Clock, MapPin } from "lucide-react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What are the school timings?",
      answer: "Lather High School operates from Monday to Saturday, from 8:00 AM to 3:00 PM for all classes (UKG to Class 12)."
    },
    {
      question: "Where is Lather High School located?",
      answer: "Our campus is located at Pritam nagar karnal 132001. It is fully equipped with modern educational labs, smart classrooms, and secure spaces."
    },
    {
      question: "How can I apply for my child's admission?",
      answer: "You can navigate to our Admission page and fill out the online admission request form. You will need to provide basic details like Student Name, Gmail, Target Class, and Contact Number. Our admissions office will get in touch with you to finalize details."
    },
    {
      question: "Is Lather High School affiliated with a board?",
      answer: "Yes, Lather High School is a premier CBSE-affiliated school offering academic excellence from UKG up to Class 12, focusing on a holistic curriculum and critical computation."
    },
    {
      question: "Is the school co-educational?",
      answer: "Yes, Lather High School is a premier co-educational boarding-cum-day school committed to equal opportunity learning, academic mastery, and character development."
    },
    {
      question: "Who should I contact for support or general inquiries?",
      answer: "You can call our help desk at +91 94665 18003 or +91 81686 53159, or send an email to info@latherhigherschool.edu.in. Office hours are Monday through Saturday, 8:00 AM - 3:00 PM."
    },
    {
      question: "Are school fees paid quarterly?",
      answer: "Yes, school tuition and billing fees are payable quarterly. For billing support, transaction verification, or account questions, parents can contact our billing desk directly."
    }
  ];

  return (
    <div className="pt-24 min-h-screen bg-bg-light pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-nav text-xs font-bold uppercase tracking-[0.3em] text-primary flex items-center justify-center gap-2">
            <HelpCircle className="w-4 h-4" />
            Support Center
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-4 leading-tight">
            Frequently Asked Questions
          </h1>
          <div className="w-12 h-[3px] bg-accent mx-auto mb-4" />
          <p className="font-body text-gray-500 text-sm leading-relaxed">
            Find answers to common questions about admissions, timings, location, and academics at Lather High School. Can't find what you are looking for? Reach out to us below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* FAQ Accordions Column */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                  >
                    <span className="font-heading text-base sm:text-lg font-bold text-gray-800 pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? "transform rotate-180 text-primary" : ""}`} />
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 pt-1 border-t border-gray-50 text-sm font-body text-gray-500 leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Quick Help Desk Card Column */}
          <div className="lg:col-span-4 bg-white border border-gray-100 p-8 rounded-3xl shadow-lg flex flex-col gap-6">
            <h3 className="font-heading text-xl font-bold text-gray-900 border-b border-gray-50 pb-4">
              Still Need Help?
            </h3>
            
            <p className="font-body text-xs text-gray-400 leading-relaxed">
              If your query is not answered here, feel free to contact our administrative office during work hours.
            </p>

            <div className="flex flex-col gap-4 font-body text-xs text-gray-600">
              <div className="flex items-center gap-3 bg-bg-light border border-gray-50 p-4 rounded-xl">
                <Clock className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <span className="text-[9px] text-gray-400 block uppercase tracking-wider font-semibold">Timings</span>
                  <span className="font-semibold text-gray-800">Mon - Sat: 8:00 AM - 3:00 PM</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-bg-light border border-gray-50 p-4 rounded-xl">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <span className="text-[9px] text-gray-400 block uppercase tracking-wider font-semibold">Phone</span>
                  <span className="font-semibold text-gray-800">+91 94665 18003, +91 81686 53159</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-bg-light border border-gray-50 p-4 rounded-xl">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <span className="text-[9px] text-gray-400 block uppercase tracking-wider font-semibold">Email</span>
                  <span className="font-semibold text-gray-800 break-all">info@latherhigherschool.edu.in</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-bg-light border border-gray-50 p-4 rounded-xl">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <span className="text-[9px] text-gray-400 block uppercase tracking-wider font-semibold">Campus</span>
                  <span className="font-semibold text-gray-800">Pritam nagar karnal 132001</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
