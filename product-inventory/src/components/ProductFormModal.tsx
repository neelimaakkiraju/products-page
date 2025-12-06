import React, { useState } from "react";
import type { Product } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (product: Product) => void;
  product?: Product | null;
  existingSkus: string[];
  categories: string[];
}

const initialState = {
  name: "",
  sku: "",
  price: 0,
  quantity: 0,
  category: "",
};

export default function ProductFormModal({
  open,
  onClose,
  onSubmit,
  product,
  existingSkus,
  categories,
}: Props) {
  const [form, setForm] = useState<Product>(product || initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    setForm(product || initialState);
    setErrors({});
  }, [product, open]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.sku.trim()) errs.sku = "SKU is required";
    if (form.price <= 0) errs.price = "Price must be greater than 0";
    if (form.quantity < 0) errs.quantity = "Quantity cannot be negative";
    if (!form.category) errs.category = "Category is required";
    if (!product && existingSkus.includes(form.sku))
      errs.sku = "SKU must be unique";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "price" || name === "quantity" ? Number(value) : value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      onSubmit({ ...form, id: product?.id || crypto.randomUUID() });
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">
          {product ? "Edit Product" : "Add Product"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block font-medium">SKU</label>
            <input
              name="sku"
              value={form.sku}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
              disabled={!!product}
            />
            {errors.sku && (
              <p className="text-red-500 text-xs mt-1">{errors.sku}</p>
            )}
          </div>
          <div>
            <label className="block font-medium">Price</label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
              min={0}
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price}</p>
            )}
          </div>
          <div>
            <label className="block font-medium">Quantity</label>
            <input
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
              min={0}
            />
            {errors.quantity && (
              <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
            )}
          </div>
          <div>
            <label className="block font-medium">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
          >
            {product ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
