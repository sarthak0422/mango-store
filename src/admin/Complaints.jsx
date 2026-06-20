import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { ShieldAlert, CheckCircle, Clock, Eye, RefreshCw } from "lucide-react";

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [activeModalImage, setActiveModalImage] = useState(null);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "complaints"));
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      // Sort items dynamically by newest timeline log entries first
      items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setComplaints(items);
    } catch (error) {
      console.error("Error retrieving complaints:", error);
      toast.error("Failed to pull fresh helpdesk dispute logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleToggleStatus = async (ticketId, currentStatus) => {
    const nextStatus = currentStatus === "Open" ? "Resolved" : "Open";
    try {
      await updateDoc(doc(db, "complaints", ticketId), { status: nextStatus });
      toast.success(`Ticket marked as ${nextStatus}!`);
      
      setComplaints((prev) =>
        prev.map((item) => (item.id === ticketId ? { ...item, status: nextStatus } : item))
      );
    } catch (err) {
      toast.error("Could not write status update translation to database.");
    }
  };

  const filteredTickets = complaints.filter((ticket) => {
    if (filterStatus === "All") return true;
    return ticket.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Component Subsection Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-mango-dark uppercase tracking-wider mb-1">
            <ShieldAlert size={14} /> Quality Operations Control
          </div>
          <h1 className="font-heading text-3xl font-bold text-brown">Fulfillment Helpdesk Tracker</h1>
        </div>
        
        <button 
          onClick={fetchTickets}
          className="flex items-center gap-2 p-2.5 bg-white hover:bg-orange-50 text-mango border border-orange-100 rounded-xl transition font-semibold text-sm shadow-xs"
        >
          <RefreshCw size={16} /> Sync Live Data Logs
        </button>
      </div>

      {/* Sorting / Status Filters Module Bar */}
      <div className="flex gap-2 bg-white p-1.5 rounded-xl border border-gray-200 w-fit shadow-xs">
        {["All", "Open", "Resolved"].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              filterStatus === status 
                ? "bg-brown text-white shadow-sm" 
                : "text-gray-500 hover:text-brown hover:bg-gray-50"
            }`}
          >
            {status} ({status === "All" ? complaints.length : complaints.filter(c => c.status === status).length})
          </button>
        ))}
      </div>

      {/* Data Layout Table Canvas Elements */}
      {loading ? (
        <div className="bg-white rounded-3xl p-16 text-center text-gray-400 font-medium animate-pulse border border-orange-50">
          Syncing Core Infrastructure Records...
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
          <p className="text-gray-400 font-medium text-sm">No complaints logging index found matching this status.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <th className="p-4 pl-6">Ticket ID</th>
                  <th className="p-4">Fulfillment Order ID</th>
                  <th className="p-4 max-w-xs">Message Context</th>
                  <th className="p-4 text-center">Attached Media Asset</th>
                  <th className="p-4">Current Status</th>
                  <th className="p-4 pr-6 text-right">Operational Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50/40 transition-colors">
                    
                    <td className="p-4 pl-6 font-bold text-brown font-heading text-base">
                      {ticket.ticketNumber}
                    </td>
                    
                    <td className="p-4 font-semibold text-gray-700 font-mono text-xs">
                      {ticket.orderId}
                    </td>

                    <td className="p-4 max-w-xs">
                      <p className="text-gray-600 text-xs md:text-sm whitespace-pre-wrap leading-relaxed">
                        {ticket.issue}
                      </p>
                    </td>

                    <td className="p-4 text-center">
                      {ticket.attachmentUrl ? (
                        <button
                          type="button"
                          onClick={() => setActiveModalImage(ticket.attachmentUrl)}
                          className="inline-flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 text-mango-dark px-3 py-1.5 rounded-lg text-xs font-bold transition"
                        >
                          <Eye size={14} /> Open Photo Asset
                        </button>
                      ) : (
                        <span className="text-xs text-gray-300 italic font-normal">None attached</span>
                      )}
                    </td>

                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        ticket.status === "Open" 
                          ? "bg-rose-50 text-rose-600 border border-rose-100" 
                          : "bg-emerald-50 text-green border border-emerald-100"
                      }`}>
                        {ticket.status === "Open" ? <Clock size={12} /> : <CheckCircle size={12} />}
                        {ticket.status}
                      </span>
                    </td>

                    <td className="p-4 pr-6 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(ticket.id, ticket.status)}
                        className={`text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-xs ${
                          ticket.status === "Open"
                            ? "bg-mango hover:bg-emerald-800 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {ticket.status === "Open" ? "Mark Resolved" : "Reopen Dispute"}
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Interactive Photo inspection lightbox overlay module modal window */}
      {activeModalImage && (
        <div 
          className="fixed inset-0 bg-brown/70 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setActiveModalImage(null)}
        >
          <div className="bg-white p-2 rounded-2xl max-w-lg w-full shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            <img 
              src={activeModalImage} 
              alt="Fulfillment evidence overview snapshot" 
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
            />
            <p className="text-center text-xs text-gray-400 pt-3 pb-1 font-medium">Click outside the image boundaries to close viewport</p>
          </div>
        </div>
      )}

    </div>
  );
}