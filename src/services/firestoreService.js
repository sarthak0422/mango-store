import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  setDoc,
  query,
  where,
} from "firebase/firestore";


// ======================
// PRODUCTS
// ======================

export const fetchProducts = async () => {
  const snap = await getDocs(collection(db, "products"));

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
};

export const fetchProductById = async (id) => {
  const ref = doc(db, "products", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return { id: snap.id, ...snap.data() };
};


// ======================
// USERS
// ======================

export const createUserProfile = async (uid, data) => {
  await setDoc(doc(db, "users", uid), data);
};

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));

  if (!snap.exists()) return null;

  return { id: snap.id, ...snap.data() };
};


// ======================
// ORDERS
// ======================

export const createOrder = async (order) => {
  const ref = await addDoc(collection(db, "orders"), {
    ...order,
    status: "pending",
    createdAt: Date.now(),
  });

  return ref.id;
};


// ======================
// OPTIONAL: USER ORDERS
// ======================

export const getUserOrders = async (uid) => {
  const q = query(
    collection(db, "orders"),
    where("userId", "==", uid)
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
};