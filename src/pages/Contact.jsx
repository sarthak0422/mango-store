import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill out all contact information fields.");
      return;
    }
    
    // Simulating message transmission pipeline
    setSubmitted(true);
    toast.success("Message dispatched successfully!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-body">
      
      {/* Page Heading Headers */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="font-heading text-4xl font-bold text-brown">Get in Touch With Us 🗺️</h1>
        <p className="text-gray-500 mt-2">
          Have questions about seasonal corporate orders or regional delivery timelines? Send us a line.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Form Canvas Container Area */}
        <div className="bg-white p-8 rounded-3xl border border-orange-100 shadow-sm space-y-6">
          <h3 className="text-xl font-heading font-bold text-brown mb-2">Drop a Message</h3>
          
          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl text-center space-y-3">
              <CheckCircle className="text-green mx-auto" size={40} />
              <h4 className="font-bold text-emerald-900">Thank You!</h4>
              <p className="text-sm text-emerald-700">Our customer fulfillment experts will review your note and get back to you within 24 hours.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-2 text-sm font-semibold text-green underline hover:text-emerald-800"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  placeholder="Sarthak Tambde"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-mango transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  placeholder="sarthak@example.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-mango transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Your Message</label>
                <textarea 
                  rows="4"
                  value={form.message}
                  onChange={(e) => setForm({...form, message: e.target.value})}
                  placeholder="Inquire about custom bulk deliveries or farm partnerships..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-mango transition resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-mango hover:bg-mango-dark text-white font-semibold py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <Send size={16} /> Send Inquiries
              </button>
            </form>
          )}
        </div>

        {/* Right Info Details & Google Maps Embedded View */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-orange-50 shadow-sm space-y-4">
            <h3 className="text-xl font-heading font-bold text-brown mb-2">Our Fulfillment Hubs</h3>
            
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <MapPin className="text-mango mt-0.5 flex-shrink-0" size={18} />
              <div>
                <p className="font-semibold text-brown">Main Logistics Depot</p>
                <p>Thane / Chiplun Distribution Center, Maharashtra, India</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Phone className="text-green flex-shrink-0" size={18} />
              <span>+91 98765 43210</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Mail className="text-blue-500 flex-shrink-0" size={18} />
              <span>support@mangobliss.com</span>
            </div>
          </div>

          {/* Fully Functional Interactive Google Maps iFrame Wrapper */}
          <div className="w-full h-64 bg-white p-2 rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
            <iframe 
              title="Mango Bliss Hub Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120563.2965416047!2d72.931295!3d19.218331!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b8fcfe76fd59%3A0xcf367e84c67cdb0a!2sThane%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
              className="w-full h-full rounded-2xl border-0"
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

      </div>
    </div>
  );
}