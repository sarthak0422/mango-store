import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { User, Mail, Calendar, Shield, Search } from "lucide-react";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const snap = await getDocs(collection(db, "users"));
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCustomers(list);
      } catch (err) {
        console.error("Error pulling database profiles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter(c => 
    c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-body">
      <div>
        <h1 className="text-3xl font-heading font-bold text-brown">Consumer Demographics Ledger</h1>
        <p className="text-sm text-gray-500 mt-1">Monitor registered buyers and store account configurations.</p>
      </div>

      {/* Filter Utility search card bar */}
      <div className="relative max-w-md bg-white rounded-xl shadow-xs">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
          <Search size={16} />
        </span>
        <input 
          type="text" 
          placeholder="Search by name or email address..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-orange-100 rounded-xl outline-none focus:border-mango text-sm font-medium"
        />
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-16 text-center text-gray-400 font-medium animate-pulse border border-orange-50">Syncing user directory records...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-orange-200 p-12 text-center text-gray-400 text-sm">No consumer matches found.</div>
      ) : (
        <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b text-xs font-bold uppercase text-gray-500 tracking-wider">
                  <th className="p-4 pl-6">Profile</th>
                  <th className="p-4">Contact Email</th>
                  <th className="p-4">Registered On</th>
                  <th className="p-4 pr-6 text-right">System Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-700">
                {filtered.map(cust => (
                  <tr key={cust.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="p-4 pl-6 flex items-center gap-3">
                      <div className="w-9 h-9 bg-mango/10 text-mango rounded-xl flex items-center justify-center font-bold">
                        {cust.displayName ? cust.displayName.charAt(0).toUpperCase() : <User size={16} />}
                      </div>
                      <span className="font-bold text-brown">{cust.displayName || "Anonymous Buyer"}</span>
                    </td>
                    <td className="p-4 text-gray-500 text-xs font-mono">{cust.email}</td>
                    <td className="p-4 text-xs text-gray-400">
                      {cust.createdAt ? new Date(cust.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "N/A"}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase ${cust.isAdmin || cust.email === 'w@gmail.com' ? 'bg-mango text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {cust.isAdmin || cust.email === 'w@gmail.com' ? "Admin Executive" : "Standard Buyer"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}