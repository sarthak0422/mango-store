import React, { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { initializeRazorpayPayment } from "../services/payment";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Truck,
  CreditCard,
  ArrowLeft,
  Ticket,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function Cart() {
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [verifyingCoupon, setVerifyingCoupon] = useState(false);

  const user = useAppStore((state) => state.user);
  const cart = useAppStore((state) => state.cart) || [];
  const updateQty = useAppStore((state) => state.updateQty);
  const removeFromCart = useAppStore((state) => state.removeFromCart);
  const cartTotal = useAppStore((state) => state.cartTotal);
  const clearCart = useAppStore((state) => state.clearCart);

  const subtotal = cartTotal();
  

  // Coupon Store Actions
  const appliedCoupon = useAppStore((state) => state.appliedCoupon);
  const setAppliedCoupon = useAppStore((state) => state.setAppliedCoupon);
  const clearCoupon = useAppStore((state) => state.clearCoupon);

  // Calculate dynamic promotional discount
  const discountAmount = appliedCoupon 
    ? Math.round((subtotal * appliedCoupon.discountPercentage) / 100) 
    : 0;

  // Shipping logic adjusted on total value after discount
  const shippingFee = (subtotal - discountAmount) > 2000 || subtotal === 0 ? 0 : 150;
  const grandTotal = Math.round(subtotal - discountAmount + shippingFee);

  // 🔍 VALIDATE COUPON AGAINST FIRESTORE PROMOTIONAL COLLECTION
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setVerifyingCoupon(true);
    try {
      const q = query(
        collection(db, "coupons"), 
        where("code", "==", couponInput.trim().toUpperCase())
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("Invalid coupon code.");
        return;
      }

      const couponDoc = querySnapshot.docs[0].data();

      if (!couponDoc.isActive) {
        toast.error("This coupon code has expired or is disabled.");
        return;
      }

      // If valid, save it to store state
      setAppliedCoupon({
        code: couponDoc.code,
        discountPercentage: couponDoc.discountPercentage,
      });
      toast.success(`Coupon "${couponDoc.code}" applied! (${couponDoc.discountPercentage}% OFF)`);
      setCouponInput("");
    } catch (err) {
      console.error("Coupon verification failed:", err);
      toast.error("Error processing coupon data.");
    } finally {
      setVerifyingCoupon(false);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    if (!user) {
      toast.error("Please login to continue checkout");
      navigate("/login");
      return;
    }

    setCheckingOut(true);
    toast.loading("Initializing secure payment...", { id: "checkoutProcess" });

    await initializeRazorpayPayment({
      grandTotal,
      user,
      cartLength: cart.length,

      // ✅ SUCCESS FLOW (ONLY AFTER PAYMENT SUCCESS)
      onSuccess: async (paymentResponse) => {
        toast.loading("Payment successful! Saving order...", {
          id: "checkoutProcess",
        });

        try {
          const orderPayload = {
            userId: user.uid,
            customerEmail: user.email,
            items: cart.map((item) => ({
              id: item.id,
              title: item.title,
              price: Number(item.price),
              qty: Number(item.qty || 1),
            })),
            subtotal,
            discountApplied: discountAmount, // 👈 Saved discount balance tracking parameters
            couponCode: appliedCoupon ? appliedCoupon.code : null, // 👈 Linked code asset
            shippingFee,
            grandTotal,
            paymentStatus: "Paid", // Financial tracking gate flag
            fulfillmentStatus: "Pending", // Shipment execution tracking pipeline phase
            razorpayPaymentId: paymentResponse.razorpay_payment_id,
            razorpayOrderId: paymentResponse.razorpay_order_id,
            createdAt: Date.now(),
          };

          await addDoc(collection(db, "orders"), orderPayload);

          toast.success("Order placed successfully 🎉", {
            id: "checkoutProcess",
          });

          clearCart();
          navigate("/profile");
        } catch (err) {
          console.error("Firestore error:", err);
          toast.error("Payment done but order saving failed", {
            id: "checkoutProcess",
          });
        } finally {
          setCheckingOut(false);
        }
      },

      // ❌ FAILURE FLOW
      onFailure: (errorMessage) => {
        toast.error(`Payment failed: ${errorMessage}`, {
          id: "checkoutProcess",
        });
        setCheckingOut(false);
      },
    });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center p-6 bg-[#FFFDF5] text-center">
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-4xl mb-4">
          🛒
        </div>
        <h2 className="text-3xl font-bold text-brown mb-2">
          Your Cart is Empty
        </h2>
        <p className="text-gray-500 mb-6">
          Add some delicious mangoes to continue
        </p>
        <Link
          to="/shop"
          className="bg-mango text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
        >
          <ShoppingBag size={16} /> Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF5] pb-16">
      <div className="max-w-7xl mx-auto px-4 pt-10">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-gray-500 mb-6"
        >
          <ArrowLeft size={16} />
          Continue Shopping
        </Link>

        <h1 className="text-3xl font-bold mb-8">Shopping Cart 🥭</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CART ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-white p-4 rounded-xl"
              >
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm text-gray-500">₹{item.price}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      updateQty(item.id, Math.max(1, item.qty - 1))
                    }
                  >
                    <Minus size={16} />
                  </button>

                  <span>{item.qty || 1}</span>

                  <button
                    onClick={() => updateQty(item.id, (item.qty || 1) + 1)}
                  >
                    <Plus size={16} />
                  </button>

                  <button onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="font-bold">₹{item.price * (item.qty || 1)}</div>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div className="bg-white p-6 rounded-xl space-y-4">
            <h2 className="text-xl font-bold">Order Summary</h2>

            {/* 🏷️ COUPON OPERATION INTERACTION UNIT */}
            {!appliedCoupon ? (
              <form onSubmit={handleApplyCoupon} className="flex gap-2 pt-1">
                <div className="relative flex-1">
                  <Ticket size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="PROMO CODE"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold uppercase tracking-wider outline-none focus:border-mango"
                  />
                </div>
                <button
                  type="submit"
                  disabled={verifyingCoupon}
                  className="bg-brown text-white text-xs font-bold px-4 rounded-xl hover:bg-brown/90 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {verifyingCoupon ? "Validating..." : "Apply"}
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between bg-emerald-50/60 border border-emerald-100 px-3 py-2.5 rounded-xl text-emerald-800 text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <Ticket size={14} /> Code: {appliedCoupon.code} ({appliedCoupon.discountPercentage}% Off)
                </span>
                <button 
                  type="button" 
                  onClick={clearCoupon} 
                  title="Remove Coupon"
                  className="text-emerald-700 hover:text-rose-600 p-0.5 rounded transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <div className="space-y-2 text-sm text-stone-600 font-medium pt-2 border-t border-stone-50">

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            {/* Conditional Discount rendering line */}
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Promo Discount</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span>
              </div>
            </div>

            <div className="flex justify-between font-bold text-lg border-t pt-3">
              <span>Total due</span>
              <span>₹{grandTotal}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="w-full bg-mango text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <CreditCard size={16} />
              {checkingOut ? "Processing..." : "Pay Now"}
            </button>

            <div className="text-xs text-center text-gray-400">
              🔒 Secure Razorpay Payment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
