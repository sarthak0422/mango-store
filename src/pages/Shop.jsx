import React, { useEffect, useState, useMemo } from "react";
import { useAppStore } from "../store/useAppStore";
import { toast } from "react-hot-toast";
import Skeleton from "../components/Skeleton";
import {
  Search,
  SlidersHorizontal,
  ShoppingBag,
  Heart,
  ArrowUpDown,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Shop() {
  const navigate = useNavigate();
  const location = useLocation(); // Tracks where the user currently is
  const user = useAppStore((state) => state.user); // Get the user state from Zustand

  // 1. Core Data Pipelines from Code 1
  const { products = [], loading, loadProducts } = useAppStore();
  const addToCart = useAppStore((state) => state.addToCart);

  // 2. Filter & Sorting Component States from Code 1 & 2
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("default");
  const [maxPrice, setMaxPrice] = useState(3000);

  // CRITICAL FETCH: Fetch items from Firestore on page mount
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Extract all unique categories present in live inventory data dynamically (Code 2)
  const staticCategories = useMemo(() => {
    const list = products.map((p) => p.category).filter(Boolean);
    return ["All", ...new Set(list)];
  }, [products]);

  // Compute live filter arrays efficiently using useMemo hooks (Code 2)
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Evaluate Text Search Filter Match against 'title' and 'description'
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query),
      );
    }

    // Evaluate Category Select Pill Match
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Evaluate Price Threshold Ceiling
    result = result.filter((p) => Number(p.price || 0) <= maxPrice);

    // Apply Selected Array Sorting Logic
    if (sortOption === "price-low") {
      result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortOption === "price-high") {
      result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (sortOption === "title") {
      result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    return result;
  }, [products, searchQuery, selectedCategory, sortOption, maxPrice]);

  const handleAddToCartClick = (e, product) => {
    e.stopPropagation(); // Stop click from navigating to single page view

    if (!user) {
    toast.error("Please sign in to build your basket!");
    // Redirect to login, storing our current shop location path in router history state
    navigate("/login", { state: { from: location } });
    return;
  }

    addToCart(product);
    toast.success(`${product.title || "Mango"} tucked into your basket!`);
    setTimeout(() => {
    navigate("/cart");
  }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] font-body pb-16 animate-fadeIn">
      {/* Visual Splash Banner Section (Code 2 Design) */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 py-12 px-4 text-center">
        <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-brown mb-3">
          Our Premium Harvest 🥭
        </h1>
        <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto font-medium">
          Explore chemically-unripened, direct-from-farm choices handpicked for
          your kitchen.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Side: Desktop Filter Control Sidebar Component (Code 2 Design) */}
        <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-md h-fit space-y-6 lg:sticky lg:top-24">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <SlidersHorizontal size={18} className="text-mango" />
            <h2 className="font-heading font-bold text-lg text-brown">
              Refine Harvest
            </h2>
          </div>

          {/* Search Box Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">
              Search Catalog
            </label>
            <div className="relative">
              <Search
                className="absolute left-3.5 top-3.5 text-gray-400"
                size={16}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mangos, varieties..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:border-mango transition"
              />
            </div>
          </div>

          {/* Price Range Slider Filter */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold uppercase text-gray-400 tracking-wider">
              <span>Max Price Cap</span>
              <span className="text-mango font-extrabold font-body text-sm">
                ₹{maxPrice}
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="3000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-mango cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>₹200</span>
              <span>₹3,000</span>
            </div>
          </div>

          {/* Sort Menu Controller Selection Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">
              Sort Layout
            </label>
            <div className="relative">
              <ArrowUpDown
                className="absolute left-3.5 top-3.5 text-gray-400"
                size={14}
              />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none focus:border-mango transition appearance-none cursor-pointer text-brown font-medium"
              >
                <option value="default">Default Ordering Sequence</option>
                <option value="price-low">Price: Low to High Economy</option>
                <option value="price-high">Price: High to Low Premium</option>
                <option value="title">Alphabetical Label Match</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Side: Product Catalog Panels Layout */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Row: Category Filtering Horizontal Pills Slider */}
          <div className="flex flex-wrap gap-2 items-center overflow-x-auto pb-1">
            {staticCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition whitespace-nowrap cursor-pointer ${
                  selectedCategory === category
                    ? "bg-mango text-white shadow-sm"
                    : "bg-white border border-orange-100 text-brown hover:bg-orange-50/50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Catalog Array Counter Node */}
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
            Showing {filteredProducts.length} unique items matching parameters
          </div>

          {/* Main Product Display Responsive Flex Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <Skeleton key={idx} className="h-80 w-full rounded-2xl" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-orange-200 p-12 text-center space-y-3">
              <div className="text-4xl">🍂</div>
              <h3 className="font-heading text-xl font-semibold text-brown">
                No Harvest Matches Found
              </h3>
              <p className="text-sm text-gray-400 max-w-xs mx-auto">
                We couldn't locate any products matching your specific
                combinations. Reset filters or raise the max price slider.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="bg-white rounded-3xl border border-orange-100 p-4 shadow-sm hover:shadow-xl transition duration-300 flex flex-col justify-between group cursor-pointer"
                >
                  <div className="space-y-3">
                    {/* Media Display Asset Area (Code 2 Design) */}
                    <div className="w-full h-44 bg-gradient-to-br from-orange-50/60 to-amber-50/30 rounded-2xl relative overflow-hidden flex items-center justify-center text-5xl group-hover:scale-102 transition duration-300">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        "🥭"
                      )}
                      <button
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/80 hover:bg-white text-gray-400 hover:text-red-500 rounded-xl flex items-center justify-center transition shadow-xs backdrop-blur-xs cursor-pointer"
                      >
                        <Heart size={14} />
                      </button>
                      <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg text-green border border-emerald-50">
                        {product.category || "Orchard"}
                      </span>
                    </div>

                    {/* Metadata Header Fields (Code 2 Design) */}
                    <div className="px-1 space-y-1">
                      <h4 className="font-heading font-bold text-base text-brown group-hover:text-mango transition line-clamp-1">
                        {product.title || "Unnamed Product"}
                      </h4>
                      <p className="text-xs text-gray-400 line-clamp-2 min-h-[2rem] leading-relaxed">
                        {product.description ||
                          "No farm descriptive context notes compiled yet."}
                      </p>
                    </div>
                  </div>

                  {/* Actions Row Section Frame Footer */}
                  <div className="pt-4 mt-2 border-t border-gray-50 flex items-center justify-between px-1">
                    <span className="font-heading font-extrabold text-lg text-brown">
                      ₹{product.price || 0}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleAddToCartClick(e, product)}
                      className="bg-mango hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs transform active:scale-95 cursor-pointer"
                    >
                      <ShoppingBag size={14} /> Add Basket
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
