import React, { useEffect, useState } from "react";
import { db, storage } from "../firebase/config"; // Ensure storage is exported from your config
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
// Import Cloud Storage storage hooks
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; 
import { toast } from "react-hot-toast";
import { Plus, Trash2, Edit2, X, Camera, RefreshCw } from "lucide-react";
import { formatPrice } from "../utils/formatPrice";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form Fields State Object
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: "", price: "", category: "Alphonso", description: "", image: "", stock: "" });

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "products"));
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch {
      toast.error("Failed to retrieve product records from Firestore.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInventory(); }, []);

  // FIXED: Replaced Base64 1MB limit crash logic with Cloud Storage file streams
  const handleImageUploadStream = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const storageLocationRef = ref(storage, `catalog_products/${Date.now()}_${file.name}`);

    try {
      toast.loading("Uploading asset to Cloud Storage...", { id: "storageLoader" });
      
      // Upload raw binary file to Firebase Cloud Storage bucket
      const uploadTaskSnapshot = await uploadBytes(storageLocationRef, file);
      
      // Extract immutable fast download path string token 
      const remoteDownloadUrl = await getDownloadURL(uploadTaskSnapshot.ref);
      
      setForm((prev) => ({ ...prev, image: remoteDownloadUrl }));
      toast.success("Asset saved securely to storage node!", { id: "storageLoader" });
    } catch (err) {
      console.error(err);
      toast.error("Cloud Storage asset rejection block encountered.", { id: "storageLoader" });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleOpenCreateMode = () => {
    setEditingId(null);
    setForm({ title: "", price: "", category: "Alphonso", description: "", image: "", stock: "" });
    setShowModal(true);
  };

  const handleOpenEditMode = (product) => {
    setEditingId(product.id);
    setForm({
      title: product.title || "",
      price: product.price || "",
      category: product.category || "Alphonso",
      description: product.description || "",
      image: product.image || "",
      stock: product.stock || ""
    });
    setShowModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.stock) {
      toast.error("Please complete all necessary field requirements.");
      return;
    }

    if (uploadingImage) {
      toast.error("Please wait until the asset finish streaming to production storage nodes.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      price: Number(form.price),
      category: form.category,
      description: form.description.trim(),
      image: form.image,
      stock: Number(form.stock)
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "products", editingId), payload);
        toast.success("Product properties altered cleanly.");
      } else {
        await addDoc(collection(db, "products"), payload);
        toast.success("New variety integrated into database catalog.");
      }
      setShowModal(false);
      fetchInventory();
    } catch {
      toast.error("Transaction failed during catalog write execution.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you absolutely sure you want to drop this item from your public inventory catalog?")) return;
    try {
      await deleteDoc(doc(db, "products", productId));
      toast.success("Variety deleted from catalog records.");
      fetchInventory();
    } catch {
      toast.error("Failed to drop record.");
    }
  };

  return (
    <div className="space-y-6 font-body">
      {/* Title section layout */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-brown">Product Catalog Inventory</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Update stock metrics, price lists, varieties, and images.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchInventory} className="p-3 bg-white border rounded-xl hover:bg-gray-50 transition"><RefreshCw size={16} /></button>
          <button onClick={handleOpenCreateMode} className="bg-mango hover:bg-brown text-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-sm transition">
            <Plus size={16} /> Add New Variety
          </button>
        </div>
      </div>

      {/* Primary Inventory Catalog Dashboard Table View */}
      {loading ? (
        <div className="bg-white rounded-3xl p-16 text-center text-gray-400 font-medium animate-pulse">Syncing Inventory Logs...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white border-2 border-dashed rounded-3xl text-gray-400">No catalog records found inside the database.</div>
      ) : (
        <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-xs font-bold uppercase text-gray-500 tracking-wider">
                <th className="p-4 pl-6">Fruit Reference Image</th>
                <th className="p-4">Variety Name</th>
                <th className="p-4">Price / Dozen</th>
                <th className="p-4">Inventory Level</th>
                <th className="p-4 pr-6 text-right">Administrative Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-700">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
                      {product.image ? <img src={product.image} alt="" className="w-full h-full object-cover" /> : "🥭"}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-brown text-base">{product.title}</p>
                    <span className="text-xs font-bold px-2 py-0.5 bg-orange-50 text-mango-dark rounded-full mt-1 inline-block">{product.category}</span>
                  </td>
                  <td className="p-4 text-base font-bold text-gray-900">{formatPrice(product.price)}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${product.stock > 15 ? 'bg-emerald-50 text-green' : 'bg-rose-50 text-rose-600'}`}>
                      {product.stock} boxes left
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <button onClick={() => handleOpenEditMode(product)} className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-orange-50 hover:text-mango transition"><Edit2 size={14} /></button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-rose-50 hover:text-red-500 transition"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Multi-Purpose Management Modal Overlay Window Frame */}
      {showModal && (
        <div className="fixed inset-0 bg-brown/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveProduct} className="bg-white rounded-3xl w-full max-w-lg p-6 md:p-8 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button type="button" onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-brown"><X size={20} /></button>
            <h3 className="text-xl font-heading font-bold text-brown">{editingId ? "Modify Variety Record Properties" : "Register New Variety Box Setup"}</h3>
            
            <div className="space-y-3 pt-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Product Title Box Label *</label>
                <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-mango" placeholder="Ex: Alphonso Devgad Grade-A" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Price Per Dozen (INR) *</label>
                  <input type="number" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-mango" placeholder="1500" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Available Stock (Boxes) *</label>
                  <input type="number" required value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-mango" placeholder="45" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Variety Crop Line Classification</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-mango font-semibold text-gray-600">
                  <option value="Alphonso">Alphonso (Hapus)</option>
                  <option value="Kesar">Kesar</option>
                  <option value="Payari">Payari</option>
                  <option value="Premium Boxes">Premium Assorted Boxes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Product Context Summary Description</label>
                <textarea rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-gray-50 border rounded-xl p-4 text-sm outline-none focus:border-mango resize-none" placeholder="Provide crop patch specifications or taste properties details..." />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Upload Photo Asset Preview</label>
                <div className="flex items-center gap-4 mt-1">
                  <label className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 text-mango-dark px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border border-orange-100">
                    <Camera size={14} /> Choose File
                    {/* FIXED: Swapped out base64 file hooks with Cloud Storage stream handler */}
                    <input type="file" accept="image/*" onChange={handleImageUploadStream} className="hidden" />
                  </label>
                  {form.image && <span className="text-xs text-green font-semibold">✓ Storage Node Configured</span>}
                </div>
              </div>
            </div>

            <button type="button" disabled={uploadingImage} onClick={handleSaveProduct} className="w-full mt-4 bg-mango hover:bg-emerald-800 text-white font-semibold py-3 rounded-xl shadow-lg transition transform active:scale-98 text-sm disabled:bg-gray-300 disabled:cursor-not-allowed">
              {uploadingImage ? "Processing File Streams..." : editingId ? "Save Variable Adjustments" : "Publish to Active Catalog Storefront"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}