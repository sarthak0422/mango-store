import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { Ticket, Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New input form conditions
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");

  const fetchCoupons = async () => {
    try {
      const snap = await getDocs(collection(db, "coupons"));
      setCoupons(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch {
      toast.error("Failed to load available coupons list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!code || !discount) return toast.error("Please insert valid configuration strings.");
    
    const formattedCode = code.toUpperCase().trim();
    const pct = parseInt(discount);

    if (pct < 1 || pct > 100) return toast.error("Discount bounds restricted between 1% and 100%.");

    try {
      const docRef = doc(db, "coupons", formattedCode);
      const payload = { code: formattedCode, discountPercentage: pct, isActive: true, createdAt: Date.now() };
      
      await setDoc(docRef, payload);
      toast.success(`Coupon node '${formattedCode}' is now live!`);
      setCode(""); setDiscount("");
      fetchCoupons();
    } catch {
      toast.error("Database structural validation reject block triggered.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "coupons", id));
      toast.success("Coupon code deprecated.");
      setCoupons(prev => prev.filter(c => c.id !== id));
    } catch {
      toast.error("Failed to delete the selected coupon code.");
    }
  };

  return (
    <div className="space-y-6 font-body">
      <div>
        <h1 className="text-3xl font-heading font-bold text-brown">Promotional Voucher Systems</h1>
        <p className="text-sm text-gray-500 mt-1">Configure active marketing tokens and markdown discount matrices.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Creation Input Dashboard Module Form Block */}
        <form onSubmit={handleCreateCoupon} className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs space-y-4">
          <h3 className="font-heading font-bold text-base text-brown flex items-center gap-1.5"><Plus size={18} className="text-mango" /> Mint New Voucher</h3>
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Voucher Code String</label>
            <input 
              type="text" 
              placeholder="e.g., MANGOBLISS20"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border border-orange-50 bg-gray-50/50 p-2.5 rounded-xl text-sm font-bold uppercase tracking-wider outline-none focus:border-mango"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Discount Markdown Percentage</label>
            <input 
              type="number" 
              placeholder="e.g., 20"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full border border-orange-50 bg-gray-50/50 p-2.5 rounded-xl text-sm font-semibold outline-none focus:border-mango"
            />
          </div>

          <button type="submit" className="w-full py-3 bg-[#3d1c00] text-white text-xs font-bold rounded-xl hover:bg-[#2B1B15] transition cursor-pointer shadow-xs">
            Push Promotion Live
          </button>
        </form>

        {/* Live Records Table Render Grid Frame */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="bg-white rounded-3xl p-12 text-center text-gray-400 font-medium animate-pulse border border-orange-50">Syncing ledger records...</div>
          ) : coupons.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-orange-200 p-12 text-center text-gray-400 text-sm">No promotional codes are currently configured.</div>
          ) : (
            <div className="bg-white border border-orange-100 rounded-2xl shadow-xs overflow-hidden">
              <div className="divide-y divide-gray-50">
                {coupons.map(cpn => (
                  <div key={cpn.id} className="p-4 flex items-center justify-between hover:bg-gray-50/30 transition">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-orange-50 text-mango rounded-xl"><Ticket size={18} /></div>
                      <div>
                        <p className="font-mono text-sm font-black text-brown tracking-wider">{cpn.code}</p>
                        <p className="text-xs text-green font-bold">{cpn.discountPercentage}% Flat Reduction</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(cpn.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}