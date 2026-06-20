import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { formatPrice } from "../utils/formatPrice";
import { toast } from "react-hot-toast";
import { BarChart3, ShieldCheck, DollarSign, Package, MessageSquare, AlertCircle, IndianRupee } from "lucide-react";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    grossRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    activeComplaints: 0
  });

  const [reviews, setReviews] = useState([]);
  const [complaints, setComplaints] = useState([]);

  const loadAdminMetricsPipeline = async () => {
    setLoading(true);
    try {
      // Query operational snapshot nodes from Firestore
      const ordersSnap = await getDocs(collection(db, "orders"));
      const productsSnap = await getDocs(collection(db, "products"));
      const complaintsSnap = await getDocs(collection(db, "complaints"));
      const reviewsSnap = await getDocs(collection(db, "reviews"));

      // Calculate total earnings from orders
      let totalRevenue = 0;
      ordersSnap.forEach((orderDoc) => {
        const orderData = orderDoc.data();
        totalRevenue += Number(orderData.total || orderData.price * (orderData.qty || 1) || 0);
      });

      setAnalytics({
        grossRevenue: totalRevenue,
        totalOrders: ordersSnap.size,
        totalProducts: productsSnap.size,
        activeComplaints: complaintsSnap.docs.filter(d => d.data().status === "Open").length
      });

      // Populate review moderation stream logs
      setReviews(reviewsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      // Populate support tickets list
      setComplaints(complaintsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

    } catch (err) {
      console.error("Dashboard metric retrieval failure:", err);
      toast.error("Error accessing operational firestore metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminMetricsPipeline();
  }, []);

  // Moderation Logic: Approve reviews
  const handleApproveReview = async (reviewId) => {
    try {
      await updateDoc(doc(db, "reviews", reviewId), { approved: true });
      toast.success("Review approved for display!");
      loadAdminMetricsPipeline();
    } catch {
      toast.error("Failed to approve review.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center text-brown animate-pulse font-body font-bold">
        Aggregating Secure Back-Office Analytical Feeds...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-body space-y-10">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-brown">Command Central Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Live tracking of orchard production, customer tickets, and payments.</p>
        </div>
        <button 
          onClick={loadAdminMetricsPipeline}
          className="bg-mango text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-mango-dark transition shadow-sm h-fit"
        >
          Refresh Feed Analytics
        </button>
      </div>

      {/* KPI Highlight Rows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-orange-100 p-6 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Gross Revenues</p>
            <h3 className="text-2xl font-bold text-brown mt-1">{formatPrice(analytics.grossRevenue)}</h3>
          </div>
          <div className="bg-orange-50 text-mango p-3 rounded-xl"><IndianRupee size={22} /></div>
        </div>

        <div className="bg-white border border-orange-100 p-6 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Orders Dispatched</p>
            <h3 className="text-2xl font-bold text-brown mt-1">{analytics.totalOrders} boxes</h3>
          </div>
          <div className="bg-emerald-50 text-green p-3 rounded-xl"><Package size={22} /></div>
        </div>

        <div className="bg-white border border-orange-100 p-6 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Catalog Varieties</p>
            <h3 className="text-2xl font-bold text-brown mt-1">{analytics.totalProducts} Types</h3>
          </div>
          <div className="bg-blue-50 text-blue-500 p-3 rounded-xl"><BarChart3 size={22} /></div>
        </div>

        <div className="bg-white border border-orange-100 p-6 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Unresolved Disputes</p>
            <h3 className="text-2xl font-bold text-red-500 mt-1">{analytics.activeComplaints} Open</h3>
          </div>
          <div className="bg-red-50 text-red-500 p-3 rounded-xl"><AlertCircle size={22} /></div>
        </div>
      </div>

      {/* Dashboard Subgrids: Tickets Tracker and Review Moderation Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Helpdesk Ticket Monitoring Desk */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-lg font-heading font-bold text-brown flex items-center gap-2">
            <AlertCircle size={18} className="text-red-500" /> Recent Customer Tickets Logs
          </h3>
          <div className="overflow-y-auto max-h-72 space-y-3 pr-1">
            {complaints.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No service disputes filed yet.</p>
            ) : (
              complaints.map(ticket => (
                <div key={ticket.id} className="border border-gray-100 bg-gray-50/50 p-4 rounded-xl flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-mango-dark">{ticket.ticketNumber}</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${ticket.status === "Open" ? "bg-red-100 text-red-600" : "bg-green/10 text-green"}`}>
                        {ticket.status}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-brown">Order ID: <span className="text-gray-500 font-normal">{ticket.orderId}</span></p>
                    <p className="text-xs text-gray-600 italic">"{ticket.issue}"</p>
                    {ticket.attachmentUrl && (
                      <a href={ticket.attachmentUrl} target="_blank" rel="noreferrer" className="text-[11px] font-bold text-blue-500 underline block mt-1">
                        View Attached Snapshot File 🖼️
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Store Review Moderation Desk */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-lg font-heading font-bold text-brown flex items-center gap-2">
            <MessageSquare size={18} className="text-mango" /> Feedback Testimonial Moderation Queue
          </h3>
          <div className="overflow-y-auto max-h-72 space-y-3 pr-1">
            {reviews.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No customer reviews submitted yet.</p>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="border border-gray-100 bg-gray-50/50 p-4 rounded-xl flex justify-between items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-brown">{review.userName}</span>
                      <span className="text-xs text-mango font-bold">★ {review.rating}</span>
                    </div>
                    <p className="text-xs text-gray-600">"{review.comment}"</p>
                  </div>
                  {!review.approved ? (
                    <button
                      onClick={() => handleApproveReview(review.id)}
                      className="bg-green text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-emerald-800 transition shadow-xs flex-shrink-0"
                    >
                      Approve Display
                    </button>
                  ) : (
                    <span className="text-[10px] bg-green/10 text-green font-bold px-2 py-1 rounded-md uppercase">Live</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}