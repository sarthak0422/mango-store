import React, { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { db, storage } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { generateTicket } from "../utils/generateTicket";
import { toast } from "react-hot-toast";
import { Star, MessageSquare, AlertTriangle, Camera, Upload } from "lucide-react";

export default function Feedback() {
  const user = useAppStore((state) => state.user);
  const [activeTab, setActiveTab] = useState("review"); // 'review' or 'complaint'
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [orderId, setOrderId] = useState("");
  const [base64Image, setBase64Image] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB Guard Limit for Firestore Documents
        toast.error("Please select an image smaller than 1MB.");
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result); // This is your file payload string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please log in to submit feedback.");
    if (!text.trim()) return toast.error("Please add a brief message.");

    setLoading(true);
    try {
      if (activeTab === "complaint") {
        if (!orderId.trim()) {
          toast.error("Please provide a valid Order ID.");
          setLoading(false);
          return;
        }

        const ticketNumber = generateTicket();
        
        // Save base64 image data directly as text inside your firestore collection doc
        await addDoc(collection(db, "complaints"), {
          ticketNumber,
          userId: user.uid,
          orderId: orderId.trim(),
          issue: text.trim(),
          attachmentUrl: base64Image, // Pure base64 data string
          status: "Open",
          createdAt: Date.now()
        });

        toast.success(`Complaint filed! Ticket ID: ${ticketNumber}`, { duration: 5000 });
        setOrderId("");
      } else {
        await addDoc(collection(db, "reviews"), {
          userId: user.uid,
          userName: user.email ? user.email.split("@")[0] : "Anonymous Customer",
          comment: text.trim(),
          rating,
          approved: false,
          createdAt: Date.now()
        });

        toast.success("Review posted! It will appear live once approved.");
      }

      // Reset
      setText("");
      setBase64Image("");
      setFileName("");
    } catch (error) {
      console.error("Submission crash fault:", error);
      toast.error("Failed to post entry. Verification policies denied access.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-2xl mx-auto px-4 py-12 font-body">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-orange-100">
        
        {/* Toggle Controls Tab Header */}
        <div className="flex border-b border-gray-100 bg-gray-50">
          <button
            type="button"
            onClick={() => { setActiveTab("review"); setBase64Image(""); setFileName(""); }}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-heading font-semibold text-base transition-all ${
              activeTab === "review" ? "bg-white text-mango border-b-2 border-mango" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Star size={18} className={activeTab === "review" ? "fill-mango" : ""} /> Write Store Review
          </button>
          
          <button
            type="button"
            onClick={() => { setActiveTab("complaint"); setBase64Image(""); setFileName(""); }}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-heading font-semibold text-base transition-all ${
              activeTab === "complaint" ? "bg-white text-red-500 border-b-2 border-red-500" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <AlertTriangle size={18} /> Helpdesk Complaint
          </button>
        </div>

        {/* Dynamic Entry Form */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          
          {activeTab === "complaint" && (
            <div>
              <label className="block text-sm font-semibold text-brown mb-2">Order Tracking ID *</label>
              <input
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Ex: order_rzp_93H8F2"
                className="w-full bg-[#FFFDF5]/50 border border-orange-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-mango transition"
              />
            </div>
          )}

          {activeTab === "review" && (
            <div>
              <label className="block text-sm font-semibold text-brown mb-2">Product Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    type="button"
                    key={num}
                    onClick={() => setRating(num)}
                    className="transform active:scale-90 transition-transform"
                  >
                    <Star
                      size={32}
                      className={num <= rating ? "text-mango fill-mango" : "text-gray-200"}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-brown mb-2">
              {activeTab === "review" ? "Your Feedback Review Description *" : "Explain the issue in detail *"}
            </label>
            <textarea
              rows="4"
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={activeTab === "review" ? "How was the packaging freshness and taste profile?" : "Please list any shipping delays, packaging quality updates, or damaged items..."}
              className="w-full bg-[#FFFDF5]/50 border border-orange-100 rounded-xl p-4 text-sm outline-none focus:border-mango transition resize-none"
            />
          </div>

          {/* Optional Media Capture Section */}
          <div>
            <label className="block text-sm font-semibold text-brown mb-2">
              Attach Supporting Snapshot <span className="text-xs font-normal text-gray-400">(Optional)</span>
            </label>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <label className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-50 border-2 border-dashed border-gray-200 hover:border-mango text-gray-600 px-5 py-3 rounded-xl cursor-pointer text-sm font-medium transition-colors">
                <Upload size={16} />
                <span>Gallery / Device Storage</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <label className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-50 border-2 border-dashed border-gray-200 hover:border-mango text-gray-600 px-5 py-3 rounded-xl cursor-pointer text-sm font-medium transition-colors">
                <Camera size={16} />
                <span>Take Live Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {fileName && (
              <p className="mt-2 text-xs text-green font-semibold">
                ✓ Image processed: <span className="text-gray-500 font-normal">{fileName}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 bg-mango hover:bg-emerald-800 text-white font-semibold rounded-xl shadow-lg transition-all transform active:scale-98 flex items-center justify-center gap-2 ${
              activeTab === "complaint" ? "bg-red-500 hover:bg-red-600" : "bg-green hover:bg-emerald-800"
            } disabled:opacity-50`}
          >
            {loading ? "Processing Document Packets..." : "Submit Secure Entry"}
          </button>

        </form>
      </div>
    </div>
  );
}