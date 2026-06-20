import React, { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { initializeRazorpayPayment } from "../services/payment";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Truck,
  CreditCard,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function Cart() {
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);

  const user = useAppStore((state) => state.user);
  const cart = useAppStore((state) => state.cart) || [];
  const updateQty = useAppStore((state) => state.updateQty);
  const removeFromCart = useAppStore((state) => state.removeFromCart);
  const cartTotal = useAppStore((state) => state.cartTotal);
  const clearCart = useAppStore((state) => state.clearCart);

  const subtotal = cartTotal();
  const shippingFee = subtotal > 2000 || subtotal === 0 ? 0 : 150;
  const grandTotal = subtotal + shippingFee;

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

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span>
            </div>

            <div className="flex justify-between font-bold text-lg border-t pt-3">
              <span>Total</span>
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
