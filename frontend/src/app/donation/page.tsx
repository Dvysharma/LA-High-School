"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, Building, QrCode, Clipboard, CheckCircle, 
  Download, Award 
} from "lucide-react";
import { getDonationPage, DonationPageData } from "@/utils/api";

const fallbackDonation: DonationPageData = {
  slogan: 'Together, We Can Shape More Futures',
  description: 'Education has the power to inspire lives and build a better tomorrow. Your support can help Lather High School provide greater opportunities for students, strengthen learning resources, and continue nurturing future generations. Every contribution, big or small, can make a meaningful difference in a student’s journey.',
  qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=la.higherschool@sbi&pn=LA%20The%20Higher%20School&cu=INR',
  bankDetails: {
    bankName: 'State Bank of India',
    accountName: 'LATHER HIGH SCHOOL SOCIETY',
    accountNumber: '39485720194',
    ifsc: 'SBIN0001048',
    branch: 'Sector 12 Branch, Karnal',
  },
  causes: [
    { id: 'scholarship', title: 'Student Scholarships', description: 'Help talented students from economically weaker sections access quality education.' }
  ]
};

export default function DonationPage() {
  const [data, setData] = useState<DonationPageData>(fallbackDonation);
  const [selectedCause, setSelectedCause] = useState<string>("scholarship");
  const [selectedAmount, setSelectedAmount] = useState<number | string>(5000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      const res = await getDonationPage();
      if (res) setData(res);
    }
    loadData();
  }, []);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    setTimeout(() => {
      setIsSubmitLoading(false);
      setShowThankYou(true);
    }, 1200);
  };

  const currentAmount = selectedAmount === "custom" ? Number(customAmount) || 0 : Number(selectedAmount);

  return (
    <div className="pt-24 min-h-screen bg-white">
      
      {/* 1. Header Banner */}
      <section className="bg-bg-light border-b border-gray-100 py-16 px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-10 w-48 h-48 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-secondary/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="font-nav text-xs font-bold uppercase tracking-[0.3em] text-primary">Giving Back</span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mt-3 mb-6 leading-tight">
            {data.slogan}
          </h1>
          <div className="w-16 h-[3px] bg-accent mx-auto mb-6" />
          <p className="font-body text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {data.description}
          </p>
        </div>
      </section>

      {/* 2. Interactive Donation Form */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Form Side */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!showThankYou ? (
                <motion.div
                  key="donation-form"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl"
                >
                  <h2 className="font-heading text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Heart className="w-6 h-6 text-primary fill-primary/10" />
                    Donation Details
                  </h2>

                  <form onSubmit={handleDonateSubmit} className="flex flex-col gap-8">
                    
                    {/* Cause Selection */}
                    <div>
                      <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-500 block mb-4">
                        1. Select a Support Cause
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {data.causes.map((cause) => {
                          const isSelected = selectedCause === cause.id;
                          return (
                            <button
                              key={cause.id}
                              type="button"
                              onClick={() => setSelectedCause(cause.id)}
                              className={`text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                                isSelected 
                                  ? "border-primary bg-primary/5 shadow-md shadow-primary/5 text-gray-800" 
                                  : "border-gray-100 hover:border-gray-200 bg-white text-gray-850"
                              }`}
                            >
                              <div>
                                <span className={`font-heading font-bold text-base block mb-2 ${isSelected ? "text-primary" : "text-gray-900"}`}>
                                  {cause.title}
                                </span>
                                <span className="font-body text-xs text-gray-400 leading-normal block">
                                  {cause.description}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Amount Selection */}
                    <div>
                      <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-500 block mb-4">
                        2. Choose Donation Amount (INR)
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
                        {[1000, 5000, 10000, 25000].map((amt) => {
                          const isSelected = selectedAmount === amt;
                          return (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => { setSelectedAmount(amt); setCustomAmount(""); }}
                              className={`py-3.5 px-4 rounded-xl border text-center font-nav text-sm font-semibold tracking-wider transition-all cursor-pointer ${
                                isSelected 
                                  ? "border-primary bg-primary text-white shadow-lg shadow-primary/25" 
                                  : "border-gray-100 hover:border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              ₹{amt.toLocaleString()}
                            </button>
                          );
                        })}
                        <button
                          type="button"
                          onClick={() => setSelectedAmount("custom")}
                          className={`py-3.5 px-4 rounded-xl border text-center font-nav text-sm font-semibold tracking-wider transition-all cursor-pointer ${
                            selectedAmount === "custom"
                              ? "border-primary bg-primary text-white shadow-lg shadow-primary/25"
                              : "border-gray-100 hover:border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          Custom
                        </button>
                      </div>

                      {selectedAmount === "custom" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-3 relative"
                        >
                          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-semibold font-nav">₹</span>
                          <input
                            type="number"
                            required
                            placeholder="Enter custom amount..."
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            className="w-full bg-bg-light border border-gray-100 rounded-xl py-3 px-8 text-sm outline-none focus:border-primary font-semibold text-gray-800"
                          />
                        </motion.div>
                      )}
                    </div>

                    {/* Donor Details */}
                    <div>
                      <label className="font-nav text-xs font-bold uppercase tracking-wider text-gray-500 block mb-4">
                        3. Donor Information
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-xs text-gray-400 font-medium font-body">Full Name</span>
                          <input
                            type="text"
                            required
                            placeholder="Your Name"
                            value={donorName}
                            onChange={(e) => setDonorName(e.target.value)}
                            className="bg-bg-light border border-gray-100 rounded-xl py-3 px-4 text-sm outline-none focus:border-primary text-gray-800"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <span className="text-xs text-gray-400 font-medium font-body">Email Address</span>
                          <input
                            type="email"
                            required
                            placeholder="Your Email"
                            value={donorEmail}
                            onChange={(e) => setDonorEmail(e.target.value)}
                            className="bg-bg-light border border-gray-100 rounded-xl py-3 px-4 text-sm outline-none focus:border-primary text-gray-800"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Notification */}
                    <div className="bg-[#233F92]/5 border border-[#233F92]/10 rounded-2xl p-5 flex items-start gap-4">
                      <Clipboard className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <p className="font-body text-xs text-gray-500 leading-relaxed">
                        Please proceed by transferring the chosen amount of <strong>₹{currentAmount.toLocaleString()}</strong> using the UPI QR Code or Bank Details shown on the right panel. Once complete, click the verification button below to inform our accounts department.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitLoading || currentAmount <= 0}
                      className="w-full bg-primary hover:bg-primary/95 text-white py-4 rounded-xl font-nav text-sm font-bold uppercase tracking-wider shadow-lg shadow-primary/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitLoading ? "Verifying..." : "I have completed the transfer"}
                    </button>

                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="thank-you"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-primary/5 border border-primary/10 rounded-3xl p-12 text-center shadow-lg"
                >
                  <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
                  <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">Thank You for Your Generosity!</h2>
                  <p className="font-body text-base text-gray-600 leading-relaxed max-w-xl mx-auto mb-8">
                    Dear <strong>{donorName}</strong>, we have recorded your notification regarding the donation of <strong>₹{currentAmount.toLocaleString()}</strong>. Our accounts department will verify the transaction and issue your tax exemption receipt at <strong>{donorEmail}</strong> shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowThankYou(false);
                      setDonorName("");
                      setDonorEmail("");
                      setCustomAmount("");
                      setSelectedAmount(5000);
                    }}
                    className="font-nav text-xs font-bold uppercase tracking-wider border border-primary hover:bg-primary hover:text-white text-primary py-3 px-6 rounded-xl transition-all cursor-pointer"
                  >
                    Make Another Donation
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Payment Details Panel */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* QR Code Container */}
            <div className="bg-bg-light border border-gray-100 rounded-3xl p-8 flex flex-col items-center shadow-sm">
              <div className="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-6">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">Scan to Donate</h3>
              <p className="font-body text-xs text-gray-400 text-center mb-8 max-w-xs">
                Scan with GPay, PhonePe, Paytm, or any banking app to complete the transaction directly.
              </p>

              <div className="bg-white p-6 border border-gray-100 rounded-2xl shadow-md mb-6 relative group overflow-hidden">
                <img 
                  src={data.qrCodeUrl} 
                  alt="Payment QR Code" 
                  className="w-44 h-44 object-contain"
                />
              </div>

              <a 
                href={data.qrCodeUrl} 
                download="Lather_School_Donation_QR.png" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-nav text-xs font-bold uppercase tracking-wider bg-secondary hover:bg-secondary/95 text-white py-3 px-5 rounded-xl flex items-center gap-2 transition-all shadow-md shrink-0 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download QR Code
              </a>
            </div>

            {/* Bank Details Container */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <h3 className="font-heading text-xl font-bold text-gray-900 mb-6 flex items-center gap-3 border-b border-gray-50 pb-4">
                <Building className="w-5 h-5 text-primary" />
                Bank Transfer
              </h3>
              <div className="flex flex-col gap-5 font-body text-sm text-gray-600">
                <div className="relative group">
                  <span className="text-xs text-gray-400 block font-medium">Bank Name</span>
                  <span className="font-semibold text-gray-800">{data.bankDetails.bankName}</span>
                </div>
                <div className="relative group flex justify-between items-end">
                  <div>
                    <span className="text-xs text-gray-400 block font-medium">Account Name</span>
                    <span className="font-semibold text-gray-800">{data.bankDetails.accountName}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleCopy(data.bankDetails.accountName, "name")}
                    className="text-gray-400 hover:text-primary p-1 cursor-pointer transition-colors"
                  >
                    {copiedField === "name" ? <span className="text-[10px] text-primary font-bold uppercase font-nav">Copied!</span> : <Clipboard className="w-4 h-4" />}
                  </button>
                </div>
                <div className="relative group flex justify-between items-end border-t border-gray-50 pt-3">
                  <div>
                    <span className="text-xs text-gray-400 block font-medium">Account Number</span>
                    <span className="font-semibold text-gray-800 tracking-wider">{data.bankDetails.accountNumber}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleCopy(data.bankDetails.accountNumber, "number")}
                    className="text-gray-400 hover:text-primary p-1 cursor-pointer transition-colors"
                  >
                    {copiedField === "number" ? <span className="text-[10px] text-primary font-bold uppercase font-nav">Copied!</span> : <Clipboard className="w-4 h-4" />}
                  </button>
                </div>
                <div className="relative group flex justify-between items-end border-t border-gray-50 pt-3">
                  <div>
                    <span className="text-xs text-gray-400 block font-medium">IFSC Code</span>
                    <span className="font-semibold text-gray-800 tracking-wider">{data.bankDetails.ifsc}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleCopy(data.bankDetails.ifsc, "ifsc")}
                    className="text-gray-400 hover:text-primary p-1 cursor-pointer transition-colors"
                  >
                    {copiedField === "ifsc" ? <span className="text-[10px] text-primary font-bold uppercase font-nav">Copied!</span> : <Clipboard className="w-4 h-4" />}
                  </button>
                </div>
                <div className="border-t border-gray-50 pt-3">
                  <span className="text-xs text-gray-400 block font-medium">Branch Details</span>
                  <span className="font-semibold text-gray-800 text-xs">{data.bankDetails.branch}</span>
                </div>
              </div>
            </div>

            {/* Tax Exemption Note */}
            <div className="bg-bg-light border border-gray-100 rounded-3xl p-6 flex gap-4 items-start shadow-sm">
              <Award className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h4 className="font-heading text-sm font-bold text-gray-900 mb-1">80G Tax Exemption</h4>
                <p className="font-body text-xs text-gray-500 leading-relaxed">
                  Lather High School Society is a registered charitable organization. All donations are 50% tax exempt under Section 80G of the Income Tax Act.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
