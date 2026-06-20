import { getFunctions, httpsCallable } from "firebase/functions";

export const initializeRazorpayPayment = async ({
  grandTotal,
  user,
  cartLength,
  onSuccess,
  onFailure,
}) => {
  try {
    const functionsInstance = getFunctions();
    const createOrderCloudTrigger = httpsCallable(
      functionsInstance,
      "createRazorpayOrder"
    );

    // 1. Create order from backend
    const backendResponse = await createOrderCloudTrigger({
      amount: grandTotal,
    });

    const { order_id, amount, currency } = backendResponse.data;

    // 2. Razorpay options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // ✅ IMPORTANT (Vite safe env)
      amount,
      currency,
      name: "The Mango Store 🥭",
      description: `Order - ${cartLength} items`,
      order_id,
      handler: async (response) => {
        if (onSuccess) await onSuccess(response);
      },
      prefill: {
        email: user?.email || "",
      },
      theme: {
        color: "#F59E0B",
      },
    };

    // 3. Ensure Razorpay script is loaded
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        const rzp = new window.Razorpay(options);

        rzp.on("payment.failed", function (res) {
          if (onFailure) onFailure(res.error.description);
        });

        rzp.open();
      };
      document.body.appendChild(script);
    } else {
      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (res) {
        if (onFailure) onFailure(res.error.description);
      });

      rzp.open();
    }
  } catch (error) {
    console.error("Payment error:", error);
    if (onFailure) onFailure("Payment initialization failed");
  }
};