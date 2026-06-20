import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useAppStore } from "../store/useAppStore";
import { toast } from "react-hot-toast";
import { UserPlus, User, Mail, Lock } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const user = useAppStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.email === "w@gmail.com" ? "/admin" : "/");
    }
  }, [user, navigate]);

  const handleRegistrationForm = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please configure all input parameters.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password string keys must contain at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const activeUser = userCredential.user;

      // Update structural display profile fields inside the active auth record
      await updateProfile(activeUser, { displayName: name.trim() });

      // Save secondary metadata schemas cleanly into Firestore 'users' collections
      await setDoc(doc(db, "users", activeUser.uid), {
        uid: activeUser.uid,
        displayName: name.trim(),
        email: email.trim(),
        isAdmin: email.trim() === "w@gmail.com",
        createdAt: new Date().toISOString()
      });

      toast.success("Account registered! Welcome aboard.");
    } catch (err) {
      console.error(err);
      toast.error(err.message?.includes("email-already-in-use")
        ? "This email address matching node is already registered."
        : "Failed to write user account records."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#FFFDF5] font-body animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl border border-orange-100 p-6 sm:p-8 shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-green/10 rounded-2xl flex items-center justify-center mx-auto text-xl">🌱</div>
          <h2 className="font-heading text-3xl font-bold text-brown">Create Account</h2>
          <p className="text-xs text-gray-400 font-medium">Join the premium fresh farm delivery network today</p>
        </div>

        <form onSubmit={handleRegistrationForm} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-gray-400" size={16} />
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 border rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-mango transition" 
                placeholder="Sarthak Tambde"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-gray-400" size={16} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-mango transition" 
                placeholder="sarthak@example.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider">Create Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-gray-400" size={16} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-mango transition" 
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-mango hover:bg-emerald-800 disabled:bg-emerald-200 text-white font-semibold py-3.5 rounded-xl shadow-md transition transform active:scale-98 flex items-center justify-center gap-2 text-sm mt-2 cursor-pointer"
          >
            <UserPlus size={16} /> {loading ? "Registering Node..." : "Complete Enrollment"}
          </button>
        </form>

        <p className="text-center text-xs font-semibold text-gray-500">
          Already registered?{" "}
          <Link to="/login" className="text-mango hover:underline font-bold">Sign In Instead</Link>
        </p>

      </div>
    </div>
  );
}