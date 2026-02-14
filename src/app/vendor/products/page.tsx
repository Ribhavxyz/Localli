"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { authFetch } from "@/lib/authFetch";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  storeId: number;
};

type ProductsResponse = {
  products?: Product[];
  message?: string;
};

type ProductResponse = {
  product?: Product;
  message?: string;
};

export default function VendorProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);

  const hasProducts = products.length > 0;

  const formError = useMemo(() => {
    const trimmedName = name.trim();
    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    if (!trimmedName) {
      return "Product name is required.";
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      return "Price must be greater than 0.";
    }
    if (!Number.isFinite(parsedStock) || parsedStock < 0 || !Number.isInteger(parsedStock)) {
      return "Stock must be a whole number 0 or greater.";
    }

    return null;
  }, [name, price, stock]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await authFetch("/api/vendor/products");
      const data = (await response.json()) as ProductsResponse;

      if (!response.ok) {
        throw new Error(data.message ?? "Failed to load products.");
      }

      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to load products right now.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  async function handleCreateProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (formError) {
      setError(formError);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await authFetch("/api/vendor/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          price: Number(price),
          stock: Number(stock),
        }),
      });

      const data = (await response.json()) as ProductResponse;

      if (!response.ok) {
        throw new Error(data.message ?? "Failed to create product.");
      }

      setName("");
      setPrice("");
      setStock("");
      await fetchProducts();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to create product right now.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteProduct(productId: number) {
    try {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.add(productId);
        return next;
      });

      setError(null);

      const response = await authFetch(`/api/vendor/products/${productId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Failed to delete product.");
      }

      await fetchProducts();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to delete product right now.";
      setError(message);
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-5xl font-bold tracking-tight md:text-6xl">Products</h1>
        <button
          className="rounded-2xl bg-[#4F7CFF] px-6 py-3 text-2xl font-semibold text-white transition hover:bg-[#3f6ef2]"
          onClick={() => setShowAddForm((prev) => !prev)}
          type="button"
        >
          + Add Product
        </button>
      </div>

      {showAddForm ? (
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6">
          <h2 className="text-3xl font-semibold">Add Product</h2>
          <form className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4" onSubmit={handleCreateProduct}>
            <div className="md:col-span-2">
              <label className="mb-1 block text-lg text-zinc-300" htmlFor="product-name">
                Name
              </label>
              <input
                className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-xl text-white outline-none ring-[#4F7CFF] focus:ring-2"
                id="product-name"
                onChange={(event) => setName(event.target.value)}
                placeholder="Fresh Organic Avocados"
                required
                type="text"
                value={name}
              />
            </div>
            <div>
              <label className="mb-1 block text-lg text-zinc-300" htmlFor="product-price">
                Price
              </label>
              <input
                className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-xl text-white outline-none ring-[#4F7CFF] focus:ring-2"
                id="product-price"
                min="0.01"
                onChange={(event) => setPrice(event.target.value)}
                required
                step="0.01"
                type="number"
                value={price}
              />
            </div>
            <div>
              <label className="mb-1 block text-lg text-zinc-300" htmlFor="product-stock">
                Stock
              </label>
              <input
                className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-xl text-white outline-none ring-[#4F7CFF] focus:ring-2"
                id="product-stock"
                min="0"
                onChange={(event) => setStock(event.target.value)}
                required
                step="1"
                type="number"
                value={stock}
              />
            </div>
            <div className="md:col-span-4">
              <button
                className="rounded-xl bg-[#4F7CFF] px-5 py-3 text-xl font-semibold text-white transition hover:bg-[#3f6ef2] disabled:opacity-60"
                disabled={submitting}
                type="submit"
              >
                {submitting ? "Adding Product..." : "Save Product"}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/90">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xl">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400">
                <th className="px-7 py-5 text-left font-medium">Product</th>
                <th className="px-7 py-5 text-left font-medium">Category</th>
                <th className="px-7 py-5 text-left font-medium">Price</th>
                <th className="px-7 py-5 text-left font-medium">Stock</th>
                <th className="px-7 py-5 text-left font-medium">Status</th>
                <th className="px-7 py-5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-7 py-6 text-zinc-300" colSpan={6}>
                    Loading products...
                  </td>
                </tr>
              ) : !hasProducts ? (
                <tr>
                  <td className="px-7 py-6 text-zinc-400" colSpan={6}>
                    No products yet.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const isDeleting = deletingIds.has(product.id);
                  const lowStock = product.stock < 20;
                  const category = deriveCategory(product.name);

                  return (
                    <tr className="border-b border-zinc-800/70" key={product.id}>
                      <td className="px-7 py-6">
                        <div className="flex items-center gap-4">
                          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-blue-400">
                            <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
                              <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
                              <path d="M12 12L20 7.5" stroke="currentColor" strokeWidth="1.5" />
                              <path d="M12 12L4 7.5" stroke="currentColor" strokeWidth="1.5" />
                              <path d="M12 12V21" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                          </span>
                          <span className="font-semibold text-zinc-100">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-7 py-6 text-zinc-400">{category}</td>
                      <td className="px-7 py-6 font-semibold text-zinc-100">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-7 py-6 text-zinc-100">{product.stock}</td>
                      <td className="px-7 py-6">
                        <span
                          className={`rounded-xl px-3 py-1 text-lg ${
                            lowStock ? "bg-amber-950/60 text-amber-300" : "bg-emerald-950/60 text-emerald-300"
                          }`}
                        >
                          {lowStock ? "Low Stock" : "In Stock"}
                        </span>
                      </td>
                      <td className="px-7 py-6 text-right">
                        <button
                          className="rounded-lg px-3 py-1.5 text-lg text-blue-400 transition hover:bg-zinc-800"
                          type="button"
                        >
                          ✎
                        </button>
                        <button
                          className="rounded-lg px-3 py-1.5 text-lg text-red-400 transition hover:bg-zinc-800 disabled:opacity-50"
                          disabled={isDeleting}
                          onClick={() => void handleDeleteProduct(product.id)}
                          type="button"
                        >
                          {isDeleting ? "..." : "🗑"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {error ? (
        <div className="rounded-xl border border-red-900/40 bg-red-950/20 p-4 text-red-300">{error}</div>
      ) : null}
    </div>
  );
}

function deriveCategory(name: string): string {
  const value = name.toLowerCase();
  if (value.includes("bread")) return "Bakery";
  if (value.includes("egg") || value.includes("milk")) return "Dairy";
  if (value.includes("coffee") || value.includes("drink")) return "Beverages";
  return "Produce";
}
