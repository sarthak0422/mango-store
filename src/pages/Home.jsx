import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Leaf, Sparkles, Award, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFFDF5] font-body text-brown overflow-x-hidden animate-fadeIn">
      
      {/* 1. Hero Spotlight Theater Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 md:py-32 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 text-center md:text-left max-w-2xl mx-auto md:mx-0">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 text-mango-dark px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-xs animate-bounce">
            <Sparkles size={14} className="text-mango" />
            <span>Now shipping fresh 2026 crops!</span>
          </div>
          
          <h1 className="font-heading text-4xl sm:text-6xl font-extrabold text-brown leading-tight">
            Pure Devotion to the King of Fruits <span className="text-mango">Mango Bliss</span>
          </h1>
          
          <p className="text-sm sm:text-base text-gray-500 font-medium leading-relaxed">
            Experience chemically-unripened, organic, premium Alphonso and Kesari mangos sourced directly from local orchard trees. Cultivated with care, selected with meticulous precision, and delivered securely straight to your kitchen table.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start pt-2">
            <Link
              to="/shop"
              className="w-full sm:w-auto bg-mango hover:bg-mango-dark text-white font-extrabold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-95 group"
            >
              <span>Explore the Harvest Collection</span>
              <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="w-full sm:w-auto bg-white hover:bg-orange-50/40 border border-orange-100 text-brown font-bold px-8 py-4 rounded-2xl transition shadow-xs flex items-center justify-center"
            >
              Our Heritage Story
            </Link>
          </div>
        </div>

        {/* Hero Decorative Visual Illustration Canvas */}
        <div className="flex-1 relative w-full max-w-md mx-auto md:max-w-none flex justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-200/30 to-orange-300/20 rounded-full blur-3xl filter -z-10 animate-pulse"></div>
          <div className="bg-gradient-to-br from-orange-100/50 to-amber-50/30 border border-orange-100 rounded-[2.5rem] w-full aspect-square max-w-[400px] flex items-center justify-center text-[10rem] shadow-xl relative transform rotate-3 hover:rotate-0 transition duration-500 group select-none">
            🥭
            <span className="absolute top-6 left-6 text-4xl animate-pulse">✨</span>
            <span className="absolute bottom-8 right-8 text-3xl">🍃</span>
          </div>
        </div>
      </section>

      {/* 2. Value Propositions & Enterprise Trust Badges Grid */}
      <section className="bg-white border-y border-orange-100 shadow-xs py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="flex items-start gap-4 p-2">
            <div className="p-3 bg-orange-50 rounded-2xl text-mango flex-shrink-0"><Leaf size={24} /></div>
            <div>
              <h3 className="font-heading font-bold text-base text-brown">100% Naturally Grown</h3>
              <p className="text-xs text-gray-400 mt-1 font-medium leading-relaxed">Absolutely zero artificial ripening chemicals or carbide processing steps applied ever.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-2">
            <div className="p-3 bg-emerald-50 rounded-2xl text-green flex-shrink-0"><ShieldCheck size={24} /></div>
            <div>
              <h3 className="font-heading font-bold text-base text-brown">Rigorous Sorting Matrix</h3>
              <p className="text-xs text-gray-400 mt-1 font-medium leading-relaxed">Every individual batch box passes strict density, weight, and blemish tests before dispatch.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-2">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 flex-shrink-0"><Award size={24} /></div>
            <div>
              <h3 className="font-heading font-bold text-base text-brown">Direct Farm Transits</h3>
              <p className="text-xs text-gray-400 mt-1 font-medium leading-relaxed">By short-circuiting distribution channels, we return higher profits directly back to local growers.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-2">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-500 flex-shrink-0"><Sparkles size={24} /></div>
            <div>
              <h3 className="font-heading font-bold text-base text-brown">Secure Shockproof Packing</h3>
              <p className="text-xs text-gray-400 mt-1 font-medium leading-relaxed">Shipped inside specially ventilated boxes surrounded by defensive hay padding grids.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Narrative Timeline Sequence Map: Journey of the Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="font-heading text-3xl font-extrabold text-brown">From Tree Branches to Your Table</h2>
          <p className="text-sm text-gray-400 font-medium leading-relaxed">We maintain complete vertical oversight across our delivery supply chain lanes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          <div className="bg-white border border-orange-50 p-6 rounded-3xl shadow-xs space-y-4 relative">
            <div className="absolute top-4 right-6 text-5xl font-heading font-black text-orange-100/60 select-none">01</div>
            <div className="w-12 h-12 bg-orange-50 text-mango rounded-2xl font-heading font-bold flex items-center justify-center text-lg">🌳</div>
            <h4 className="font-heading font-bold text-lg text-brown">Sunrise Selection</h4>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">Local farmers manually pluck mature fruits at sunrise when temperatures are cool, locking in peak sugar concentration fields naturally.</p>
          </div>

          <div className="bg-white border border-orange-50 p-6 rounded-3xl shadow-xs space-y-4 relative">
            <div className="absolute top-4 right-6 text-5xl font-heading font-black text-orange-100/60 select-none">02</div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl font-heading font-bold flex items-center justify-center text-lg">📦</div>
            <h4 className="font-heading font-bold text-lg text-brown">Premium Cushion Crate</h4>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">Fruits are thoroughly cleaned, graded for size compliance, wrapped in soft protective sleeves, and layered inside dynamic breathable crates.</p>
          </div>

          <div className="bg-white border border-orange-50 p-6 rounded-3xl shadow-xs space-y-4 relative">
            <div className="absolute top-4 right-6 text-5xl font-heading font-black text-orange-100/60 select-none">03</div>
            <div className="w-12 h-12 bg-emerald-50 text-green rounded-2xl font-heading font-bold flex items-center justify-center text-lg">🚚</div>
            <h4 className="font-heading font-bold text-lg text-brown">Express Doorstep Logistics</h4>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">The crates are routed onto priority transport lanes, cutting out middle storage units to arrive pristine and aromatic at your front door.</p>
          </div>

        </div>
      </section>

      {/* 4. Social Proof & Customer Review Canvas */}
      <section className="bg-gradient-to-b from-white to-[#FFFDF5] border-t border-orange-50 py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <div className="flex justify-center gap-1 text-mango">
            {[1, 2, 3, 4, 5].map(star => <Star key={star} size={20} fill="currentColor" />)}
          </div>
          <blockquote className="font-heading text-xl sm:text-2xl font-bold text-brown max-w-2xl mx-auto leading-relaxed">
            "The Alphonso mangoes we received this season were sensational! Perfectly clean skin, deep golden pulp inside, and an intoxicating aroma that filled our living room. You can tell they were fully sun-ripened on the tree."
          </blockquote>
          <div>
            <p className="font-bold text-sm text-brown uppercase tracking-widest">Ananya Deshmukh</p>
            <p className="text-xs text-gray-400 mt-0.5 font-semibold">Verified Family Connoisseur • Thane, MH</p>
          </div>
        </div>
      </section>

      {/* 5. Bottom Conversion Call-to-Action Area */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="bg-gradient-to-br from-brown to-[#2B1B15] text-white p-8 sm:p-12 rounded-[2.5rem] shadow-xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 text-[12rem] opacity-10 pointer-events-none select-none">🥭</div>
          
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold max-w-xl mx-auto leading-tight">
            Ready to Taste Real Orchard Perfection?
          </h2>
          <p className="text-xs sm:text-sm text-orange-100/80 max-w-md mx-auto leading-relaxed">
            Order standard crates or customizable mix-and-match premium gift hampers. Free doorstep transit automatically kicks in on all bookings over ₹2,000.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex bg-mango hover:bg-mango-dark text-white font-extrabold px-8 py-4 rounded-xl shadow-md transition transform active:scale-95 text-sm"
            >
              Order Your Crate Online Now
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}