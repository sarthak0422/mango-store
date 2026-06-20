/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const logger = require("firebase-functions/logger");
const Razorpay = require("razorpay");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


exports.createRazorpayOrder = onCall({
  cors: ["http://localhost:5173", "https://mango-store-176aa.web.app"],
  maxInstances: 10
}, async (request) => {
  // 1. Auth check
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "Login required to create payment order."
    );
  }

  // 2. Validate incoming amount input parameters
  const amountInRupees = request.data.amount;
  if (!amountInRupees || amountInRupees <= 0) {
    throw new HttpsError("invalid-argument", "Invalid amount.");
  }

  // 3. Extract environment variable keys safely
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  // Local development backup helper loop logic
  if (!keyId || !keySecret) {
    logger.error("Environment check failed. RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing.");
    throw new HttpsError(
      "failed-precondition",
      "Payment gateway keys are missing from server configurations."
    );
  }

  // 4. Initialize Razorpay safely INSIDE the executable block container
  const razorpayInstance = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  const options = {
    amount: Math.round(amountInRupees * 100), // INR → paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpayInstance.orders.create(options);

    return {
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  } catch (error) {
    logger.error("Razorpay Error Details:", error);
    throw new HttpsError(
      "internal",
      `Failed to create Razorpay order: ${error.message || error}`
    );
  }
});