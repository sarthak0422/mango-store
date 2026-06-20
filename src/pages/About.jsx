import React from "react";
import { Leaf, ShieldCheck, Users, Award } from "lucide-react";

export default function About() {
  const stats = [
    { label: "Satisfied Customers", value: "50K+" },
    { label: "Years of Harvest Legacy", value: "5 Yrs" },
    { label: "Partner Orchards Managed", value: "24 Farms" },
    { label: "Quality Checks Passed", value: "100%" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-body">
      {/* Brand Story Hero Banner */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-green font-semibold tracking-widest uppercase text-xs">Our Organic Heritage</span>
        <h1 className="font-heading text-4xl md:text-6xl font-bold text-brown mt-2 mb-6">
          The Journey of <span className="text-mango">Mango Bliss</span>
        </h1>
        <p className="text-gray-600 text-base md:text-lg leading-relaxed">
          Born out of a deep love for the coastal orchards of Konkan, Mango Bliss bridges the gap between premium, naturally matured mangoes and fruit lovers across the region. We bypass artificial ripening agents to deliver unblemished quality straight to your home.
        </p>
      </div>

      {/* Business Performance Metric Analytics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-orange-100 text-center shadow-sm">
            <h2 className="text-3xl md:text-4xl font-bold text-mango-dark font-heading">{stat.value}</h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Core Operational Values Presentation Section */}
      <div className="space-y-6">
        <h2 className="font-heading text-3xl font-bold text-brown text-center mb-12">Our Cultivation Pillars</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-8 rounded-2xl border border-orange-50 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-orange-50 text-mango rounded-xl flex items-center justify-center"><Leaf size={24} /></div>
            <h3 className="font-heading font-bold text-xl text-brown">Chemical-Free Maturation</h3>
            <p className="text-sm text-gray-600 leading-relaxed">We strictly prohibit calcium carbide or synthetic quick-ripening washes. Our fruits ripen naturally on the branch and in hay beds.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-orange-50 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-emerald-50 text-green rounded-xl flex items-center justify-center"><ShieldCheck size={24} /></div>
            <h3 className="font-heading font-bold text-xl text-brown">Fair Farming Trade</h3>
            <p className="text-sm text-gray-600 leading-relaxed">By partnering directly with farmers across Ratnagiri and Devgad, we ensure they receive equitable value for their meticulous labor.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-orange-50 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><Award size={24} /></div>
            <h3 className="font-heading font-bold text-xl text-brown">Rigorous Grade Testing</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Every piece is verified for optimal weight, blemish constraints, and appropriate internal sugar brix ratios before shipping.</p>
          </div>

        </div>
      </div>
    </div>
  );
}