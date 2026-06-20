import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../firebase/config";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useAppStore } from "../store/useAppStore";
import { toast } from "react-hot-toast";
import { LogIn, Mail, Lock, ShieldCheck } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const user = useAppStore((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  // Route back automatically if the user object updates into memory
  useEffect(() => {
    if (user) {
      const targetDestination = location.state?.from?.pathname || 
        (user.isAdmin || user.email === "w@gmail.com" ? "/admin" : "/");
      navigate(targetDestination, { replace: true });
    }
  }, [user, navigate, location]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please supply account credentials.");
      return;
    }

    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      toast.success("Welcome back to Mango Bliss!");
    } catch (err) {
      console.error(err);
      toast.error(err.message?.includes("auth/invalid-credential") 
        ? "Invalid authentication password or user address matching parameters." 
        : "Failed to sign in. Verify network connectivity nodes."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("Google provider session authorized.");
    } catch (err) {
      toast.error("Google authentication action dismissed.");
    }
  };

  const handleLoginSuccess = () => {
  toast.success("Welcome back to the Orchard!");
  
  // If the user came from the shop, send them right back there; otherwise, default to home
  const originPath = location.state?.from?.pathname || "/";
  navigate(originPath, { replace: true });
};


  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#FFFDF5] font-body animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl border border-orange-100 p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Identity Context Heading */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto text-2xl">🥭</div>
          <h2 className="font-heading text-3xl font-bold text-brown">Sign In to Bliss</h2>
          <p className="text-xs text-gray-400 font-medium">Access your personal harvest basket and account desk controls</p>
        </div>

        {/* Credentials Form Structure Input Grid */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
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
                placeholder="admin@gmail.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase text-gray-400 tracking-wider">Account Password</label>
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
            disabled={submitting}
            className="w-full bg-mango hover:bg-emerald-800 disabled:bg-orange-200 text-white font-semibold py-3.5 rounded-xl shadow-md transition transform active:scale-98 flex items-center justify-center gap-2 text-sm mt-2 cursor-pointer"
          >
            <LogIn size={16} /> {submitting ? "Verifying Keys..." : "Authenticate Session"}
          </button>
        </form>

        {/* Third-Party Authentication Divider */}
        <div className="relative flex items-center justify-center my-2">
          <div className="absolute inset-x-0 h-px bg-gray-100" />
          <span className="relative bg-white px-3 text-[10px] uppercase font-bold text-gray-400 tracking-widest">Or Continue Via</span>
        </div>

        <button 
          onClick={handleGoogleLogin}
          type="button"
          className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-brown text-sm font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2.5 shadow-xs cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.53-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-8.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.08 1.16-3.14 0-5.8-2.11-6.75-4.96H1.31v3.15C3.29 22.33 7.37 24 12 24z"/>
            <path fill="#FBBC05" d="M5.25 14.24A7.14 7.14 0 0 1 4.9 12c0-.79.13-1.57.35-2.31V6.54H1.31A11.93 11.93 0 0 0 0 12c0 1.92.45 3.74 1.25 5.37l3.25-2.43A7.14 7.14 0 0 1 5.25 14.24z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.96 1.19 15.24 0 12 0 7.37 0 3.29 1.67 1.31 4.54l3.94 3.15c.95-2.85 3.61-4.94 6.75-4.94z"/>
          </svg>
          <span>Google Identity Node</span>
        </button>

        {/* Dynamic Navigation Toggle Footnote */}
        <p className="text-center text-xs font-semibold text-gray-500">
          New to the Orchard?{" "}
          <Link to="/register" className="text-green hover:underline font-bold">Register Account</Link>
        </p>

      </div>
    </div>
  );
}