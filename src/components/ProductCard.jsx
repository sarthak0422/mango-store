import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import Button from "./ui/Button";

// Destructure properties to match your Firestore schema keys perfectly
export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const addToCart = useAppStore((state) => state.addToCart);

  // Safeguard against missing properties natively
  const { id, title, price, image } = product || {};

  return (
    <div 
      className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-gray-100 cursor-pointer flex flex-col justify-between h-full"
      onClick={() => navigate(`/product/${id}`)}
    >
      <div>
        {/* Dynamic Image Container */}
        <div className="bg-[#FFFDF5] h-44 rounded-xl mb-4 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-500 border border-orange-50">
          {image ? (
            <img src={image} alt={title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-5xl">🥭</span>
          )}
        </div>
        
        {/* Product Title */}
        <h3 className="font-bold text-brown text-lg line-clamp-2 mb-2 font-heading">{title || "Premium Mango"}</h3>
      </div>

      {/* Pricing & Cart Action Row */}
      <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-50">
        <p className="text-green font-bold text-xl">₹{price || 0}</p>
        <Button 
          variant="primary" 
          className="py-1.5 px-4 text-sm bg-mango hover:bg-mango-dark text-white rounded-xl font-semibold transition" 
          onClick={(e) => {
            e.stopPropagation(); // Stops card item click from triggering page navigation
            addToCart(product);
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
}