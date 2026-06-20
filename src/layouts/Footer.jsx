import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-12 pb-8 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* <div>
          <h3 className="text-xl font-bold mb-4">🥭 Mango Point</h3>
          <p className="text-gray-400 text-sm">
            Bringing the authentic taste of Ratnagiri Alphonso mangoes 
            directly to your home.
          </p>
        </div> */}
        
        <div>
          <h4 className="font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link to="/shop" className="hover:text-mango">Shop</Link></li>
            <li><Link to="/about" className="hover:text-mango">Our Story</Link></li>
            <li><Link to="/contact" className="hover:text-mango">Contact Us</Link></li>
            <li><Link to="/feedback" className="hover:text-mango">Feedback</Link></li>
            {/* <li><Link to="/faq" className="hover:text-mango">FAQ</Link></li> */}
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4">Contact</h4>
          <p className="text-gray-400 text-sm">Thane, Maharashtra</p>
          <p className="text-gray-400 text-sm">support@mangopoint.in</p>
          <p className="text-gray-400 text-sm">+91 98765 43210</p>
        </div>

        <div>
          <h4 className="font-bold mb-4">Follow Us</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link to="/facebook" className="hover:text-mango">Facebook</Link></li>
            <li><Link to="/instagram" className="hover:text-mango">Instagram</Link></li>
            {/* <li><Link to="/linkedin" className="hover:text-mango">LinkedIn</Link></li>
            <li><Link to="/twitter" className="hover:text-mango">Twitter</Link></li> */}
          </ul>
        </div>
      </div>
      
      <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-500 text-xs">
        © {new Date().getFullYear()} Mango Point. All rights reserved.
      </div>
    </footer>
  );
}