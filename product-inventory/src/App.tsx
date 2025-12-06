import React, { useState } from "react";
import type { Product } from "./types";
import { useProducts } from "./hooks/useProducts";
import ProductCard from "./components/ProductCard";
import ProductFormModal from "./components/ProductFormModal";

export default function App() {
  const { products, addProduct, updateProduct } = useProducts();
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  // Get unique categories from products
  const categories = Array.from(
    new Set(products.map((p: Product) => p.category))
  );

  // Filtering logic
  const filtered = products.filter((p: Product) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category ? p.category === category : true;
    let stockStatus = "";
    if (p.quantity === 0) stockStatus = "out";
    else if (p.quantity <= 10) stockStatus = "low";
    else stockStatus = "in";
    const matchesStatus = status ? stockStatus === status : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Modal handlers
  const handleAdd = () => {
    setEditProduct(null);
    setModalOpen(true);
  };
  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setModalOpen(true);
  };
  const handleModalSubmit = (product: Product) => {
    if (editProduct) updateProduct(product);
    else addProduct(product);
    setModalOpen(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Inventory</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={handleAdd}
        >
          Add Product
        </button>
      </div>
      {/* Search & Filter controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or SKU"
          className="border px-3 py-2 rounded w-48"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border px-3 py-2 rounded w-40"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          className="border px-3 py-2 rounded w-40"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Stock Status</option>
          <option value="in">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map((item: Product) => (
          <ProductCard
            key={item.id}
            product={item}
            onEdit={() => handleEdit(item)}
          />
        ))}
      </div>
      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        product={editProduct}
        existingSkus={products.map((p: Product) => p.sku)}
        categories={categories}
      />
    </div>
  );
}
