import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchProductById } from "../services/firestoreService";
import { useAppStore } from "../store/useAppStore";
import Skeleton from "../components/Skeleton";
import { toast } from "react-hot-toast";

import {
  ArrowLeft,
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Leaf,
  Calendar,
  MapPin
} from "lucide-react";

import { formatPrice } from "../utils/formatPrice";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const addToCart = useAppStore((state) => state.addToCart);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);

      try {
        const data = await fetchProductById(id);

        if (!data) {
          navigate("/shop");
          return;
        }

        setProduct(data);
      } catch (error) {
        console.error("Failed loading product:", error);
        navigate("/shop");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    toast.success(`${quantity} box added to your mango basket 🥭`);
    setTimeout(() => {
    navigate("/cart");
  }, 1500);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <Skeleton className="h-[500px] rounded-3xl" />

        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    );
  }

  const image =
    product.image ||
    "https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=600";

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Back Button */}
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-orange-500 transition mb-8"
        >
          <ArrowLeft size={18} />
          Back to Orchard Catalog
        </Link>

        <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 lg:p-10">

          <div className="grid lg:grid-cols-2 gap-12">

            {/* LEFT SIDE */}
            <div className="space-y-4">

              <div className="relative aspect-square overflow-hidden rounded-3xl bg-stone-100 border border-stone-200">

                <img
                  src={image}
                  alt={product.title}
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />

                <span className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold uppercase px-4 py-2 rounded-full">
                  Fresh Harvest
                </span>
              </div>

              {/* Trust Badges */}
              <div className="grid sm:grid-cols-2 gap-4">

                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <Leaf className="w-5 h-5 text-emerald-600" />

                  <div>
                    <h4 className="font-bold text-xs uppercase">
                      Natural Farming
                    </h4>

                    <p className="text-xs text-emerald-700">
                      Premium Orchard Selection
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <ShieldCheck className="w-5 h-5 text-amber-600" />

                  <div>
                    <h4 className="font-bold text-xs uppercase">
                      Chemical Free
                    </h4>

                    <p className="text-xs text-amber-700">
                      Naturally Ripened
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex flex-col">

              <div>

                <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 text-orange-700 font-semibold text-xs uppercase tracking-wider mb-4">
                  {product.category}
                </div>

                <h1 className="text-4xl font-black text-stone-900 mb-3">
                  {product.title}
                </h1>

                <div className="flex items-center gap-2 mb-5">

                  <div className="flex text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className="fill-current"
                      />
                    ))}
                  </div>

                  <span className="text-sm text-stone-500">
                    4.9 / 5 Verified Deliveries
                  </span>

                </div>

                <div className="flex items-center gap-2 text-amber-700 mb-5">
                  <MapPin size={18} />
                  Gujarat Premium Mango Region
                </div>

                <p className="text-stone-600 leading-relaxed">
                  {product.description}
                </p>

                <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                  <Calendar className="text-amber-600 shrink-0" />

                  <p className="text-sm text-amber-900">
                    Freshly sourced and packed directly from orchard
                    partners for seasonal delivery.
                  </p>
                </div>

              </div>

              {/* PRICE */}
              <div className="mt-8 border-t border-stone-100 pt-8">

                <div className="mb-6">

                  <span className="block text-xs uppercase tracking-wider text-stone-400 font-semibold">
                    Price
                  </span>

                  <h2 className="text-4xl font-black text-stone-900">
                    {formatPrice(product.price)}
                  </h2>

                </div>

                {/* Quantity */}
                <div className="mb-6">

                  <span className="block text-sm font-semibold mb-3">
                    Quantity
                  </span>

                  <div className="flex items-center border border-stone-200 rounded-xl w-fit overflow-hidden">

                    <button
                      onClick={() =>
                        setQuantity((prev) => Math.max(1, prev - 1))
                      }
                      className="px-4 py-3 hover:bg-stone-100"
                    >
                      -
                    </button>

                    <span className="px-6 font-bold">
                      {quantity}
                    </span>

                    <button
                      onClick={() =>
                        setQuantity((prev) => prev + 1)
                      }
                      className="px-4 py-3 hover:bg-stone-100"
                    >
                      +
                    </button>

                  </div>

                </div>

                {/* Add To Cart */}
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 rounded-xl text-white font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition flex items-center justify-center gap-3 shadow-lg"
                >
                  <ShoppingBag size={20} />
                  Add To Mango Basket
                </button>

              </div>

              {/* Trust Features */}
              <div className="grid sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-stone-100">

                <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl">
                  <ShieldCheck className="text-green-600" size={20} />
                  <span className="text-xs">
                    Chemical Free
                  </span>
                </div>

                <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl">
                  <Truck className="text-orange-500" size={20} />
                  <span className="text-xs">
                    Fast Delivery
                  </span>
                </div>

                <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl">
                  <RotateCcw className="text-blue-500" size={20} />
                  <span className="text-xs">
                    Freshness Protected
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}