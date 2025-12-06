import React from "react";
import type { Product } from "../types"; // <-- FIXED

type Props = {
  product: Product;
  onEdit?: () => void;
};

const ProductCard: React.FC<Props> = ({ product, onEdit }) => {
  const getStatus = () => {
    if (product.quantity === 0) return "Out of Stock";
    if (product.quantity <= 10) return "Low Stock";
    return "In Stock";
  };

  const getColor = () => {
    if (product.quantity === 0) return "bg-red-100 text-red-700";
    if (product.quantity <= 10) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  return (
    <div
      className="border rounded-lg p-4 shadow-sm bg-white cursor-pointer hover:shadow-lg transition"
      onClick={onEdit}
      title="Edit Product"
    >
      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p className="text-sm text-gray-500">{product.sku}</p>

      <p className="mt-2 font-medium">₹{product.price}</p>
      <p>Qty: {product.quantity}</p>
      <p className="capitalize">Category: {product.category}</p>

      <span
        className={`inline-block mt-3 px-2 py-1 text-xs rounded ${getColor()}`}
      >
        {getStatus()}
      </span>
    </div>
  );
};

export default ProductCard;
