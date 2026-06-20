import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { formatPrice } from "../utils/formatPrice";
import { BarChart3, TrendingUp, ShoppingBag, DollarSign, IndianRupee } from "lucide-react";

export default function Analytics() {
  const [metrics, setMetrics] = useState({
    grossRevenue: 0,
    totalOrders: 0,
    averageValue: 0,
    totalItemsSold: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processAnalytics = async () => {
      try {
        const snap = await getDocs(collection(db, "orders"));
        const ordersList = snap.docs.map(doc => doc.data());

        let totalRev = 0;
        let itemsCount = 0;

        ordersList.forEach(order => {
          totalRev += Number(order.grandTotal || 0);
          order.items?.forEach(item => {
            itemsCount += Number(item.qty || 0);
          });
        });

        const totalOrdersCount = ordersList.length;
        // Average Order Value calculation
        const aov = totalOrdersCount > 0 ? Math.round(totalRev / totalOrdersCount) : 0;

        setMetrics({
          grossRevenue: totalRev,
          totalOrders: totalOrdersCount,
          averageValue: aov,
          totalItemsSold: itemsCount
        });
      } catch (err) {
        console.error("Analytical calculation failure:", err);
      } finally {
        setLoading(false);
      }
    };

    processAnalytics();
  }, []);

  if (loading) {
    return <div className="bg-white rounded-3xl p-16 text-center text-gray-400 font-medium animate-pulse font-body border border-orange-50">Compiling financial performance dashboards...</div>;
  }

  return (
    <div className="space-y-6 font-body">
      <div>
        <h1 className="text-3xl font-heading font-bold text-brown">Financial Analytics Console</h1>
        <p className="text-sm text-gray-500 mt-1">Audit net operations data vectors and crop sales trends.</p>
      </div>

      {/* KPI Performance Metric Grid Cards Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Remittance Revenue</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><IndianRupee size={16} /></div>
          </div>
          <p className="text-2xl font-heading font-black text-brown">{formatPrice(metrics.grossRevenue)}</p>
          <div className="text-[10px] text-green font-bold flex items-center gap-1"><TrendingUp size={12}/> Live storefront tally</div>
        </div>

        <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Volume Orders Logged</span>
            <div className="p-2 bg-orange-50 text-mango rounded-xl"><ShoppingBag size={16} /></div>
          </div>
          <p className="text-2xl font-heading font-black text-brown">{metrics.totalOrders} Invoices</p>
          <div className="text-[10px] text-gray-400 font-semibold">Total checkout conversions</div>
        </div>

        <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Average Order Value (AOV)</span>
            <div className="p-2 bg-emerald-50 text-green rounded-xl"><BarChart3 size={16} /></div>
          </div>
          <p className="text-2xl font-heading font-black text-brown">{formatPrice(metrics.averageValue)}</p>
          <div className="text-[10px] text-gray-400 font-semibold">Mean calculation balance density</div>
        </div>

        <div className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Fruit Units Dispatched</span>
            <div className="p-2 bg-blue-50 text-blue-500 rounded-xl">🥭</div>
          </div>
          <p className="text-2xl font-heading font-black text-brown">{metrics.totalItemsSold} Units</p>
          <div className="text-[10px] text-gray-400 font-semibold">Individual harvest batch counts</div>
        </div>

      </div>

      {/* Analytical Narrative Context Callout Block */}
      <div className="bg-mango text-white p-5 rounded-2xl shadow-md text-xs font-medium leading-relaxed">
        <strong>Operation Report Stream Note:</strong> These statistics are compiled directly from raw transaction records generated within the database. Average transaction values are determined by: AOV = Gross Revenue / Total Orders
        Use these vectors to coordinate seasonal wholesale supply projections and marketing strategies.
      </div>
    </div>
  );
}