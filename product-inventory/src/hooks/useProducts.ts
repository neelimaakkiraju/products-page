import { useState, useEffect } from 'react';
import type { Product } from '../types';

const STORAGE_KEY = 'products';


function getInitialProducts(): Product[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [];
}

export function useProducts() {

  const [products, setProducts] = useState<Product[]>(getInitialProducts());

  useEffect(() => {
    // If localStorage is empty, load products from products.json
    if (products.length === 0) {
      import('../data/products.json').then((module) => {
        const fixedProducts = module.default.map((p: any) => ({
          ...p,
          quantity: typeof p.quantity === 'string' ? Number(p.quantity) : p.quantity,
        }));
        setProducts(fixedProducts);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fixedProducts));
      });
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    }
  }, [products]);

  function addProduct(product: Product) {
    setProducts(prev => [...prev, product]);
  }

  function updateProduct(updated: Product) {
    setProducts(prev => prev.map(p => p.sku === updated.sku ? updated : p));
  }

  function deleteProduct(sku: string) {
    setProducts(prev => prev.filter(p => p.sku !== sku));
  }

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    setProducts,
  };
}
