// D:\Portfoltio_Projects\mango-store\src\admin\Orders.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
  collection,
  doc,
  updateDoc,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import { formatPrice } from "../utils/formatPrice";
import { RefreshCw, ShieldCheck, Truck, Eye } from "lucide-react";
import OrderDetailsModal from "../components/OrderDetailsModal";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fulfillmentFilter, setFulfillmentFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = onSnapshot(
      collection(db, "orders"),
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setOrders(list);
        setLoading(false);
      },
      (error) => {
        console.error("Live sync error:", error);
        toast.error("Logistics synchronization interrupted.");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, "orders"));
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setOrders(list);
      toast.success("Orders refreshed successfully.");
    } catch {
      toast.error("Failed to compile master order buckets.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFulfillment = async (orderId, nextFulfillmentState) => {
    try {
      // Writes updates cleanly back to the fulfillment tracking parameter
      await updateDoc(doc(db, "orders", orderId), {
        fulfillmentStatus: nextFulfillmentState,
      });
      toast.success(`Fulfillment state toggled to ${nextFulfillmentState}`);
    } catch {
      toast.error("Failed to alter pipeline logistics state configuration.");
    }
  };

  // Safely fallback to evaluate older documents that only contain status: "Paid"
  const getPaymentStatus = (order) => {
    if (order.paymentStatus) return order.paymentStatus;
    if (order.status === "Paid") return "Paid";
    return "Pending";
  };

  const getFulfillmentStatus = (order) => {
    if (order.fulfillmentStatus) return order.fulfillmentStatus;
    if (order.status && order.status !== "Paid") return order.status;
    return "Pending";
  };

  const filteredOrders = orders.filter((o) => {
    const currentFulfillment = getFulfillmentStatus(o);
    return (
      fulfillmentFilter === "All" || currentFulfillment === fulfillmentFilter
    );
  });

  return (
    <div className="space-y-6 font-body">
      {/* Header Utilities */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-brown">
            Logistics Fulfillment Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            Coordinate customer packaging boxes, track shipments, and audit
            transaction clearing statuses in real-time.
          </p>
        </div>

        <button
          onClick={fetchAllOrders}
          title="Refresh Orders"
          className="p-2.5 bg-white border rounded-xl hover:bg-orange-50 hover:text-mango transition border-orange-100 shadow-xs text-mango cursor-pointer"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Fulfillment Status Sorting Row Control Tabs */}
      <div className="flex flex-wrap gap-2 bg-[#3c1d00] p-1.5 rounded-xl border w-fit shadow-xs border-gray-100">
        {["All", "Pending", "Processing", "Shipped", "Delivered"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFulfillmentFilter(status)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                fulfillmentFilter === status
                  ? "bg-white text-brown shadow-xs"
                  : "text-orange-100/70 hover:text-white"
              }`}
            >
              {status} (
              {status === "All"
                ? orders.length
                : orders.filter((o) => getFulfillmentStatus(o) === status)
                    .length}
              )
            </button>
          ),
        )}
      </div>

      {/* Orders Operational Data Table View Grid */}
      {loading ? (
        <div className="bg-white rounded-3xl p-16 text-center text-gray-400 font-medium animate-pulse">
          Assembling Logistics Feeds...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400 text-sm">
          No transaction instances recorded matching this tracking threshold.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b text-xs font-bold uppercase text-gray-500 tracking-wider">
                  <th className="p-4 pl-6">Order ID</th>
                  <th className="p-4 pr-6 text-center">Receipt</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items Summary</th>
                  <th className="p-4">Gross Due</th>
                  <th className="p-4 flex items-center gap-1">
                    <ShieldCheck size={14} /> Payment Status
                  </th>
                  <th className="p-4">
                    <Truck size={14} /> Delivery Phase
                  </th>
                  <th className="p-4 pr-6 text-right">Logistics Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50 text-xs sm:text-sm font-medium text-gray-700">
                {filteredOrders.map((order) => {
                  const paymentState = getPaymentStatus(order);
                  const fulfillmentState = getFulfillmentStatus(order);

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50/30 transition-colors"
                    >
                      {/* Order ID Column */}
                      <td className="p-4 pl-6 font-bold text-brown font-mono text-xs uppercase">
                        {order.id.substring(0, 8)}...
                      </td>

                      {/* VIEW INVOICE MODAL TRIGGER */}
                      <td className="p-4 text-center">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-xl text-xs font-bold transition"
                        >
                          <Eye size={14} />
                          View
                        </button>
                      </td>

                      {/* Customer Email Column */}
                      <td className="p-4 text-gray-500 font-medium">
                        <p className="text-gray-900">
                          {order.customerEmail || "Guest Shopper"}
                        </p>
                        {order.razorpayPaymentId && (
                          <span className="text-[10px] block text-stone-400 font-mono tracking-tight mt-0.5">
                            ID: {order.razorpayPaymentId}
                          </span>
                        )}
                      </td>

                      {/* Items Summary Column */}
                      <td className="p-4 max-w-xs">
                        <div className="space-y-0.5 text-xs">
                          {order.items?.map((item, i) => (
                            <p key={i} className="text-gray-600 font-semibold">
                              {item.title}{" "}
                              <span className="text-mango font-bold">
                                x{item.qty}
                              </span>
                            </p>
                          ))}
                        </div>
                      </td>

                      {/* Gross Due Column */}
                      <td className="p-4 text-base font-extrabold text-stone-900">
                        {formatPrice(order.grandTotal)}
                      </td>

                      {/* PAYMENT STATUS BADGE MODULE */}
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            paymentState === "Paid"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-600 border border-rose-100"
                          }`}
                        >
                          {paymentState}
                        </span>
                      </td>

                      {/* DELIVERY PHASE BADGE MODULE */}
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            fulfillmentState === "Delivered"
                              ? "bg-green-600 text-white shadow-xs"
                              : fulfillmentState === "Shipped"
                                ? "bg-blue-500 text-white shadow-xs"
                                : fulfillmentState === "Processing"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-stone-100 text-stone-500 border border-stone-200"
                          }`}
                        >
                          {fulfillmentState}
                        </span>
                      </td>

                      {/* PIPELINE LOGISTICS MANAGEMENT OPTIONS */}
                      <td className="p-4 pr-6 text-right">
                        <select
                          value={fulfillmentState}
                          onChange={(e) =>
                            handleUpdateFulfillment(order.id, e.target.value)
                          }
                          className="bg-white border border-stone-200 rounded-xl text-xs px-3 py-2 outline-none focus:border-mango font-bold text-brown cursor-pointer shadow-xs"
                        >
                          <option value="Pending">🕒 Set to Pending</option>
                          <option value="Processing">
                            📦 Set to Processing
                          </option>
                          <option value="Shipped">🚚 Set to Shipped</option>
                          <option value="Delivered">✅ Set to Delivered</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
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
