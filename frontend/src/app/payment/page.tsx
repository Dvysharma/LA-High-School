"use client";

import { useEffect, useState } from "react";
import { 
  Download, QrCode, Building, Info, Phone, 
  HelpCircle, ChevronDown, CheckCircle, Mail, Clock 
} from "lucide-react";
import { getPaymentPage, getContact, PaymentPageData, ContactData } from "@/utils/api";

const fallbackPayment: PaymentPageData = {
  qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=la.higherschool@sbi&pn=LA%20The%20Higher%20School&cu=INR',
  bankDetails: {
    bankName: 'State Bank of India',
    accountName: 'LA THE HIGHER SCHOOL SOCIETY',
    accountNumber: '39485720194',
    ifsc: 'SBIN0001048',
    branch: 'Sector 12 Branch, Karnal',
    paymentModes: 'UPI, NEFT, IMPS, RTGS, Net Banking, and demand drafts'
  },
  feeCircularPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  faqs: [
    { question: 'What is the schedule of quarterly fee payment?', answer: 'Fees must be paid on or before the 10th of April, July, October, and January.' },
    { question: 'Are there any late fee penalties?', answer: 'A late fee penalty of Rs. 100 per day will be applicable after the due date.' },
    { question: 'Can I pay online using credit cards?', answer: 'Yes, online card payments can be made by scanning our QR Code or via our direct bank portal transfers.' },
    { question: 'Who should I contact for billing discrepancies?', answer: 'You can email accounts@lathehigherschool.edu.in or call our billing desk at +91 184 2252531.' }
  ]
};

const fallbackContact: ContactData = {
  phone: '+91 184 2252531, +91 98960 12345',
  email: 'info@lathehigherschool.edu.in, admissions@lathehigherschool.edu.in',
  address: 'Sector 12, GT Road Bypass, Karnal, Haryana - 132001',
  mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3466.527390977239!2d76.9740523!3d29.684128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390e719c8fba56cf%3A0xe54d8a1fc414589d!2sKarnal%2C%20Haryana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  officeHours: 'Monday - Saturday: 8:00 AM - 3:00 PM'
};

export default function PaymentPage() {
  const [payData, setPayData] = useState<PaymentPageData>(fallbackPayment);
  const [contact, setContact] = useState<ContactData>(fallbackContact);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    async function loadPage() {
      const pay = await getPaymentPage();
      if (pay) setPayData(pay);

      const conn = await getContact();
      if (conn) setContact(conn);
    }
    loadPage();
  }, []);

  return (
    <div className="pt-24 min-h-screen bg-white">
      
      {/* 1. Header Banner */}
      <section className="bg-bg-light border-b border-gray-100 py-16 px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-10 w-48 h-48 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-secondary/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="font-nav text-xs font-bold uppercase tracking-[0.3em] text-primary">Student Support</span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mt-3 mb-6 leading-tight">
            Fees & Billing Portal
          </h1>
          <div className="w-16 h-[3px] bg-accent mx-auto mb-6" />
          <p className="font-body text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Access secure billing options, review bank accounts, scan QR codes, download quarterly fee circular circulars, and find support numbers.
          </p>
        </div>
      </section>

      {/* 2. QR Code & Bank Accounts */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* QR Code Container */}
        <div className="lg:col-span-5 bg-bg-light border border-gray-100 rounded-3xl p-8 flex flex-col items-center shadow-sm">
          <div className="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-6">
            <QrCode className="w-6 h-6" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">Scan & Pay via UPI</h2>
          <p className="font-body text-xs text-gray-400 text-center mb-8 max-w-xs">
            Open any banking or payment app (GPay, PhonePe, Paytm, SBI Pay) and scan to transfer securely.
          </p>

          <div className="bg-white p-6 border border-gray-100 rounded-2xl shadow-md mb-6 relative group overflow-hidden">
            <img 
              src={payData.qrCodeUrl} 
              alt="Payment QR Code" 
              className="w-48 h-48 object-contain"
            />
          </div>

          <a 
            href={payData.qrCodeUrl} 
            download="LA_School_Fee_QR.png" 
            target="_blank"
            rel="noopener noreferrer"
            className="font-nav text-xs font-bold uppercase tracking-wider bg-secondary hover:bg-secondary/95 text-white py-3.5 px-6 rounded-xl flex items-center gap-2 transition-all shadow-md"
          >
            <Download className="w-4 h-4" />
            Download QR Code
          </a>
        </div>

        {/* Bank Account Details */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Building className="w-6 h-6 text-primary" />
              Direct Bank Transfers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-body text-sm text-gray-600">
              <div className="border-b border-gray-50 pb-3">
                <span className="text-xs text-gray-400 block font-medium">Bank Name</span>
                <span className="font-semibold text-gray-800 text-base">{payData.bankDetails.bankName}</span>
              </div>
              <div className="border-b border-gray-50 pb-3">
                <span className="text-xs text-gray-400 block font-medium">Account Name</span>
                <span className="font-semibold text-gray-800 text-base">{payData.bankDetails.accountName}</span>
              </div>
              <div className="border-b border-gray-50 pb-3">
                <span className="text-xs text-gray-400 block font-medium">Account Number</span>
                <span className="font-semibold text-gray-800 text-base tracking-wider">{payData.bankDetails.accountNumber}</span>
              </div>
              <div className="border-b border-gray-50 pb-3">
                <span className="text-xs text-gray-400 block font-medium">IFSC Code</span>
                <span className="font-semibold text-gray-800 text-base tracking-wider">{payData.bankDetails.ifsc}</span>
              </div>
              <div className="sm:col-span-2 border-b border-gray-50 pb-3">
                <span className="text-xs text-gray-400 block font-medium">Branch Details</span>
                <span className="font-semibold text-gray-800">{payData.bankDetails.branch}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-xs text-gray-400 block font-medium">Accepted Payment Modes</span>
                <span className="font-body text-xs text-gray-500 mt-1 block">{payData.bankDetails.paymentModes}</span>
              </div>
            </div>
          </div>

          {/* Quick PDF downloads */}
          <div className="bg-[#B52A2A]/5 border border-primary/10 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-gray-900 mb-1">Fee Circular 2026-27</h3>
                <p className="font-body text-xs text-gray-500">Read details about school term plans, rules, and billing schedules.</p>
              </div>
            </div>
            <a 
              href={payData.feeCircularPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-nav text-xs font-bold uppercase tracking-wider bg-primary hover:bg-primary/95 text-white py-3.5 px-6 rounded-xl flex items-center gap-2 transition-all shrink-0 shadow-md"
            >
              <Download className="w-4 h-4" />
              Download Circular PDF
            </a>
          </div>
        </div>

      </section>

      {/* 3. Support Details & FAQ */}
      <section className="py-24 bg-bg-light border-t border-gray-100 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Help Desk contacts */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <span className="font-nav text-xs font-bold uppercase tracking-[0.3em] text-primary">Office Hours Support</span>
            <h2 className="font-heading text-3xl font-bold text-gray-900">Billing Help Desk</h2>
            <div className="w-12 h-[3px] bg-accent" />
            <p className="font-body text-sm text-gray-500 leading-relaxed mb-4">
              For parent inquiries regarding invoice details, transport fee additions, or online transaction failure validations, connect directly with our desk.
            </p>

            <div className="flex flex-col gap-4 font-body text-sm text-gray-700">
              <div className="flex items-center gap-4 bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">Phone Support</span>
                  <span className="font-semibold text-gray-800">{contact.phone}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">Accounts Email</span>
                  <span className="font-semibold text-gray-800 break-all">{contact.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                <Clock className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">Office Timings</span>
                  <span className="font-semibold text-gray-800">{contact.officeHours}</span>
                </div>
              </div>
            </div>
          </div>

          {/* FAQs Accordion */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-primary" />
              Frequently Asked Questions
            </h2>
            
            <div className="flex flex-col gap-4">
              {payData.faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                    >
                      <span className="font-heading text-base font-bold text-gray-800 pr-4">{faq.question}</span>
                      <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? "transform rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 border-t border-gray-50 text-sm font-body text-gray-500 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
