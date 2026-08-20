"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, ClipboardList, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { submitAdmissionForm } from "@/utils/api";

export default function AdmissionPage() {
  const [formData, setFormData] = useState({
    name: "",
    parentName: "",
    gmail: "",
    className: "UKG",
    contactNumber: "",
    emailId: "",
    gender: "Male",
    basicInfo: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const classes = [
    "UKG", "LKG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
    "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simple validation
    if (!formData.name || !formData.gmail || !formData.contactNumber || !formData.parentName) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await submitAdmissionForm(formData);
      if (response && response.success) {
        setIsSuccess(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Failed to submit. Please check your network connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-bg-light pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-nav text-xs font-bold uppercase tracking-[0.3em] text-primary flex items-center justify-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Admissions Open 2026-27
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-4 leading-tight">
            Online Admission Request
          </h1>
          <div className="w-12 h-[3px] bg-accent mx-auto mb-4" />
          <p className="font-body text-gray-500 text-sm leading-relaxed">
            Fill out the form below with your child's information. Our admissions desk will review the details and contact you via phone or Gmail for next steps.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="admission-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white border border-gray-100 rounded-3xl p-8 lg:p-12 shadow-xl shadow-gray-150/30"
            >
              <h2 className="font-heading text-xl font-bold text-gray-900 mb-8 flex items-center gap-3 border-b border-gray-50 pb-4">
                <ClipboardList className="w-5.5 h-5.5 text-primary" />
                Student & Contact Details
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-4 flex items-start gap-3 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Row 1: Student Name & Parent Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 font-nav">
                      Student's Full Name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter student's full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light text-sm outline-none focus:border-primary text-gray-800 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 font-nav">
                      Parent / Guardian Name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter parent's or guardian's name"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light text-sm outline-none focus:border-primary text-gray-800 transition-colors"
                    />
                  </div>
                </div>

                {/* Row 2: Gmail Address & Alternate Email ID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 font-nav">
                      Gmail Address <span className="text-primary">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="example@gmail.com"
                      value={formData.gmail}
                      onChange={(e) => setFormData({ ...formData, gmail: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light text-sm outline-none focus:border-primary text-gray-800 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 font-nav">
                      Alternate Email ID
                    </label>
                    <input
                      type="email"
                      placeholder="optional@domain.com"
                      value={formData.emailId}
                      onChange={(e) => setFormData({ ...formData, emailId: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light text-sm outline-none focus:border-primary text-gray-800 transition-colors"
                    />
                  </div>
                </div>

                {/* Row 3: Class & Gender */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 font-nav">
                      Class Level <span className="text-primary">*</span>
                    </label>
                    <select
                      value={formData.className}
                      onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light text-sm outline-none focus:border-primary text-gray-800 transition-colors"
                    >
                      {classes.map((cls) => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 font-nav">
                      Gender <span className="text-primary">*</span>
                    </label>
                    <div className="flex gap-4 items-center h-11 border border-gray-200 rounded-xl px-4 bg-bg-light">
                      {["Male", "Female", "Other"].map((gnd) => (
                        <label key={gnd} className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            value={gnd}
                            checked={formData.gender === gnd}
                            onChange={() => setFormData({ ...formData, gender: gnd })}
                            className="text-primary focus:ring-primary h-3.5 w-3.5"
                          />
                          {gnd}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 font-nav">
                      Contact Number <span className="text-primary">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit phone number"
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light text-sm outline-none focus:border-primary text-gray-800 transition-colors"
                    />
                  </div>
                </div>

                {/* Remarks / Basic Info */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 font-nav">
                    Basic Info / Remarks / Previous School Details
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Enter any additional info, previous school details, or specific learning concerns..."
                    value={formData.basicInfo}
                    onChange={(e) => setFormData({ ...formData, basicInfo: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-3 bg-bg-light text-sm outline-none focus:border-primary text-gray-800 transition-colors resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/95 text-white py-4 rounded-xl font-nav text-sm font-bold uppercase tracking-wider shadow-lg shadow-primary/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                >
                  {isLoading ? "Submitting..." : "Submit Admission Request"}
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </button>

              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-gray-150/40 rounded-3xl p-8 lg:p-12 shadow-2xl text-center flex flex-col items-center max-w-xl mx-auto"
            >
              <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-3">
                Request Submitted Successfully!
              </h2>
              <p className="font-body text-sm text-gray-500 leading-relaxed mb-6">
                Thank you for applying. We have registered the admission request for <strong>{formData.name}</strong> for <strong>{formData.className}</strong>.
              </p>
              
              <div className="bg-bg-light border border-gray-100 rounded-2xl p-5 text-left w-full text-xs font-body text-gray-500 flex flex-col gap-2.5 mb-8">
                <div>
                  <span className="text-gray-400 block font-nav font-semibold uppercase tracking-wider text-[10px]">Gmail Address</span>
                  <span className="font-semibold text-gray-800 text-sm">{formData.gmail}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-nav font-semibold uppercase tracking-wider text-[10px]">Contact Number</span>
                  <span className="font-semibold text-gray-800 text-sm">{formData.contactNumber}</span>
                </div>
              </div>

              <p className="font-body text-xs text-gray-400">
                Our admissions department will review your child's eligibility criteria and reach out to you within 2-3 business days.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
      </div>
    </div>
  );
}
