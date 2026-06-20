import { create } from "zustand";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { fetchProducts } from "../services/firestoreService";

export const useAppStore = create((set, get) => ({
  // =====================
  // AUTH / USER STATE
  // =====================
  user: null,
  loading: true,

  setUser: (user) => set({ user }),

  clearUser: () => set({ user: null }),

  initAuthListener: () => {
    set({ loading: true });

    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          isAdmin: firebaseUser.email === "w@gmail.com",
        };

        try {
          const userDoc = await getDoc(
            doc(db, "users", firebaseUser.uid)
          );

          if (userDoc.exists()) {
            userData = {
              ...userData,
              ...userDoc.data(),
            };

            if (firebaseUser.email === "w@gmail.com") {
              userData.isAdmin = true;
            }
          }
        } catch (err) {
          console.error(
            "Error loading user profile:",
            err
          );
        }

        set({
          user: userData,
          loading: false,
        });
      } else {
        set({
          user: null,
          loading: false,
        });
      }
    });
  },

  // =====================
  // PRODUCTS STATE
  // =====================
  products: [],

  setProducts: (products) =>
    set({ products }),

  loadProducts: async () => {
    set({ loading: true });

    try {
      const products = await fetchProducts();
      set({ products });
    } catch (error) {
      console.error(
        "Failed to load products:",
        error
      );
    } finally {
      set({ loading: false });
    }
  },

  getProductById: (id) => {
    return get().products.find(
      (p) => p.id === id
    );
  },

  getRecommendedProducts: (
    currentProductId,
    category
  ) => {
    return get()
      .products.filter(
        (p) =>
          p.id !== currentProductId &&
          p.category === category
      )
      .slice(0, 4);
  },

  // =====================
  // CART STATE
  // =====================
  cart: [],

  addToCart: (product) => {
    const cart = get().cart;

    const existing = cart.find(
      (item) => item.id === product.id
    );

    if (existing) {
      set({
        cart: cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                qty: item.qty + 1,
              }
            : item
        ),
      });
    } else {
      set({
        cart: [
          ...cart,
          {
            ...product,
            qty: 1,
          },
        ],
      });
    }
  },

  removeFromCart: (id) => {
    set({
      cart: get().cart.filter(
        (item) => item.id !== id
      ),
    });
  },

  updateQty: (id, qty) => {
    if (qty <= 0) {
      set({
        cart: get().cart.filter(
          (item) => item.id !== id
        ),
      });
    } else {
      set({
        cart: get().cart.map((item) =>
          item.id === id
            ? { ...item, qty }
            : item
        ),
      });
    }
  },

  clearCart: () => set({ cart: [] }),

  // =====================
  // CART HELPERS
  // =====================
  cartCount: () => {
    return get().cart.reduce(
      (sum, item) => sum + item.qty,
      0
    );
  },

  cartTotal: () => {
    return get().cart.reduce(
      (sum, item) =>
        sum + item.price * item.qty,
      0
    );
  },
}));