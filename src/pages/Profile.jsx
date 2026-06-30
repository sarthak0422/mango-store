// D:\Portfoltio_Projects\mango-store\src\pages\Profile.jsx
import React, { useEffect, useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { db } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { toast } from "react-hot-toast";
import OrderDetailsModal from "../components/OrderDetailsModal";
import {
  User,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  Package,
  ShieldCheck,
  Ticket,
  Eye,
} from "lucide-react";

export default function Profile() {
  const user = useAppStore((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
        );
        const snap = await getDocs(q);
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        // Sort chronologically (newest first)
        list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setOrders(list);
      } catch (err) {
        console.error("Profile history pull crash:", err);
        toast.error("Failed to load your purchase history parameters.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [user]);

  // 💳 SAFE RESOLVER FOR PAYMENT STATUS (With Legacy Fallback)
  const getPaymentBadge = (order) => {
    const isPaid = order.paymentStatus === "Paid" || order.status === "Paid";

    if (isPaid) {
      return (
        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider w-fit">
          <ShieldCheck size={12} /> Paid
        </span>
      );
    }
    return (
      <span className="bg-rose-50 text-rose-600 border border-rose-100 text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider w-fit">
        <Clock size={12} /> Pending
      </span>
    );
  };

  // 🚚 SAFE RESOLVER FOR TRACKING / LOGISTICS STATUS (With Legacy Fallback)
  const getFulfillmentBadge = (order) => {
    // If the new key doesn't exist yet but the old field contains logistical state info
    const fulfillmentState =
      order.fulfillmentStatus ||
      (order.status !== "Paid" ? order.status : "Pending");

    switch (fulfillmentState) {
      case "Delivered":
        return (
          <span className="bg-green-600 text-white shadow-xs text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit uppercase">
            <CheckCircle size={12} /> Delivered
          </span>
        );
      case "Shipped":
        return (
          <span className="bg-blue-500 text-white shadow-xs text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit uppercase">
            <Truck size={12} /> Shipped
          </span>
        );
      case "Processing":
        return (
          <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit uppercase">
            <Package size={12} /> Processing
          </span>
        );
      default:
        return (
          <span className="bg-stone-100 text-stone-500 border border-stone-200 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit uppercase">
            <Clock size={12} /> Pending
          </span>
        );
    }
  };

  if (!user) {
    return (
      <div className="text-center py-20 text-gray-400 font-medium font-body">
        Please sign in to view account configuration structures.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 font-body space-y-10 animate-fadeIn">
      {/* Profile Info Header Panel */}
      <div className="bg-white border border-orange-100 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <div className="w-16 h-16 bg-mango/10 rounded-2xl flex items-center justify-center text-mango">
          <User size={32} />
        </div>
        <div className="text-center sm:text-left space-y-0.5">
          <h2 className="text-2xl font-heading font-bold text-brown">
            {user.displayName || "Bliss Customer"}
          </h2>
          <p className="text-sm text-gray-400 font-medium">{user.email}</p>
        </div>
      </div>

      {/* Historical Purchases Log Tree */}
      <div className="space-y-4">
        <h3 className="text-xl font-heading font-bold text-brown flex items-center gap-2">
          <ShoppingBag size={20} /> Your Orchard Orders
        </h3>

        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center text-gray-400 font-medium animate-pulse border border-orange-50">
            Syncing Transaction Ledgers...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-orange-200 p-12 text-center text-gray-400 text-sm">
            You haven't initialized any bulk mango purchases yet!
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-50 pb-3 gap-3">
                  <div>
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                      Invoice Code:
                    </span>
                    <p className="font-mono text-sm font-bold text-brown uppercase">
                      {order.id.substring(0, 10)}...
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block text-left sm:text-right">
                      Purchase Date:
                    </span>
                    <p className="text-xs text-gray-500 font-semibold">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* UTILITY: Dual Badges Grid for distinct Payment and Logistics context */}
                  <div className="flex flex-wrap sm:justify-end gap-2">
                    {getPaymentBadge(order)}
                    {getFulfillmentBadge(order)}
                    {/* 👁️ FULL INVOICE TRIGGERS */}
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="ml-2 p-1.5 bg-stone-50 hover:bg-mango/10 hover:text-mango text-stone-500 rounded-xl transition-all border border-stone-200/60 cursor-pointer flex items-center gap-1 text-xs font-bold"
                    >
                      <Eye size={14} /> Details
                    </button>
                  </div>
                </div>

                {/* Short View Items Mapping Sub-Row Block */}
                <div className="space-y-2">
                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-sm font-medium"
                    >
                      <span className="text-gray-600">
                        {item.title}{" "}
                        <span className="text-xs font-bold text-mango-dark">
                          x{item.qty}
                        </span>
                      </span>
                      <span className="text-brown font-bold">
                        ₹{item.price * item.qty}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon Trace */}
                {(order.discountApplied ?? 0) > 0 && (
                  <div className="pt-2 flex justify-between items-center text-xs font-bold text-emerald-600 bg-emerald-50/40 p-2 rounded-xl border border-emerald-100/60">
                    <span className="flex items-center gap-1">
                      <Ticket size={12} />
                      Coupon Applied ({order.couponCode})
                    </span>
                    <span>- ₹{order.discountApplied}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-50 flex justify-between items-center text-sm font-bold">
                  <span className="text-gray-400 uppercase tracking-wider text-xs">
                    Total Remittance:
                  </span>
                  <span className="text-lg text-brown font-heading font-extrabold">
                    ₹{order.grandTotal}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* 🧾 INJECT DETAILS MODAL GATE */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
