// D:\Portfoltio_Projects\mango-store\src\components\OrderDetailsModal.jsx
import React from "react";
import { X, Ticket, ShieldCheck, Clock, Truck, Package, CheckCircle, Receipt } from "lucide-react";

export default function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-orange-100 p-6 space-y-6 relative">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-100 pb-4">
          <div className="space-y-1">
            <h3 className="text-xl font-heading font-bold text-brown flex items-center gap-2">
              <Receipt size={22} className="text-mango" /> Transaction Invoice
            </h3>
            <p className="text-xs font-mono text-gray-400 select-all break-all">ID: {order.id}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer">
            <X size={20} className="text-stone-500" />
          </button>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-2xl text-sm font-medium">
          <div>
            <span className="text-gray-400 text-xs block">Purchase Date</span>
            <span className="text-brown">
              {new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
            </span>
          </div>
          <div>
            <span className="text-gray-400 text-xs block">Customer Email</span>
            <span className="text-brown break-all">{order.customerEmail || "N/A"}</span>
          </div>
          <div>
            <span className="text-gray-400 text-xs block">Payment Gateway Status</span>
            <span className="mt-1 block">{order.paymentStatus === "Paid" ? "✅ Paid" : "⏳ Pending"}</span>
          </div>
          <div>
            <span className="text-gray-400 text-xs block">Fulfillment Tracking</span>
            <span className="mt-1 block font-bold text-mango-dark">{order.fulfillmentStatus || "Pending"}</span>
          </div>
        </div>

        {/* Itemized Breakdown */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-wider font-bold text-gray-400">Items Ordered</h4>
          <div className="border border-stone-100 rounded-2xl divide-y divide-stone-50 overflow-hidden">
            {order.items?.map((item, idx) => (
              <div key={idx} className="p-3.5 flex justify-between items-center text-sm bg-white">
                <div>
                  <p className="font-bold text-brown">{item.title}</p>
                  <p className="text-xs text-gray-400">₹{item.price} each</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-mango bg-orange-50 px-2 py-0.5 rounded-md mr-3">x{item.qty}</span>
                  <span className="font-bold text-brown">₹{item.price * item.qty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Remittance Ledger Summary */}
        <div className="border-t border-gray-100 pt-4 space-y-2.5 text-sm font-medium text-stone-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="text-brown font-bold">₹{order.subtotal || order.grandTotal}</span>
          </div>
          
          {order.discountApplied > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold bg-emerald-50/50 p-2 rounded-xl border border-emerald-100/40 text-xs">
              <span className="flex items-center gap-1"><Ticket size={14} /> Coupon Code ({order.couponCode})</span>
              <span>- ₹{order.discountApplied}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Shipping & Logistics Fee</span>
            <span className="text-brown font-bold">
              {order.shippingFee === 0 ? "FREE" : `₹${order.shippingFee}`}
            </span>
          </div>

          <div className="flex justify-between text-base font-bold text-brown pt-2 border-t border-dashed border-stone-200">
            <span>Grand Total Due</span>
            <span className="text-xl font-heading font-extrabold text-mango-dark">₹{order.grandTotal}</span>
          </div>
        </div>

      </div>
    </div>
  );
}