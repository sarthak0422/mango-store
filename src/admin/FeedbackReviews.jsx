import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { Star, Trash2, MessageSquare } from "lucide-react";

export default function FeedbackReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const snap = await getDocs(collection(db, "reviews"));
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setReviews(list);
    } catch {
      toast.error("Failed to sync customer reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to drop this public review record?")) return;
    try {
      await deleteDoc(doc(db, "reviews", id));
      toast.success("Review post moderated successfully.");
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch {
      toast.error("Moderation request rejected by database validation gates.");
    }
  };

  return (
    <div className="space-y-6 font-body">
      <div>
        <h1 className="text-3xl font-heading font-bold text-brown">Public Feedback Moderation Desk</h1>
        <p className="text-sm text-gray-500 mt-1">Review live store feedback posts and clear spam pipelines.</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-16 text-center text-gray-400 font-medium animate-pulse border border-orange-50">Syncing reviews tree...</div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-orange-200 p-12 text-center text-gray-400 text-sm">No community feedback documents submitted yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map(rev => (
            <div key={rev.id} className="bg-white border border-orange-100 p-5 rounded-2xl shadow-xs flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-bold max-w-[200px] truncate">{rev.userEmail}</span>
                  <div className="flex items-center gap-0.5 text-mango">
                    {Array.from({ length: Number(rev.rating || 5) }).map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-700 italic">"{rev.comment}"</p>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-gray-50 text-xs">
                <span className="text-gray-400 font-medium">
                  {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString("en-IN") : "Recent"}
                </span>
                <button 
                  onClick={() => handleDelete(rev.id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition cursor-pointer flex items-center gap-1 font-bold"
                >
                  <Trash2 size={14} /> Remove Post
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}