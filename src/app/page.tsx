"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { authFetch } from "@/lib/authFetch";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  store: {
    id: number;
    name: string;
    clusterId: string;
  };
};

const productImages = [
  "https://images.unsplash.com/photo-1582655299221-2b6bff351df0?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517701550927-30cf4ba1f5f5?auto=format&fit=crop&w=900&q=80",
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingProductIds, setPendingProductIds] = useState<Set<number>>(new Set());
  const [feedbackByProductId, setFeedbackByProductId] = useState<Record<number, string>>({});

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Unable to load products right now.");
        }

        const data = (await response.json()) as Product[];
        if (!active) {
          return;
        }

        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!active) {
          return;
        }

        const message =
          err instanceof Error ? err.message : "Something went wrong while loading products.";
        setError(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const displayProducts = useMemo(() => products.slice(0, 8), [products]);

  async function handleAddToCart(productId: number) {
    setPendingProductIds((prev) => {
      const next = new Set(prev);
      next.add(productId);
      return next;
    });
    setFeedbackByProductId((prev) => ({ ...prev, [productId]: "" }));

    try {
      const response = await authFetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(data.message ?? "Failed to add to cart.");
      }

      setFeedbackByProductId((prev) => ({ ...prev, [productId]: "Added to cart." }));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to add this product right now.";
      setFeedbackByProductId((prev) => ({ ...prev, [productId]: message }));
    } finally {
      setPendingProductIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-7xl px-6 py-16">
        <section className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold leading-tight">Discover What&apos;s Near You</h1>
          <p className="mt-4 text-lg text-zinc-400">
            Support local businesses and get fresh products delivered to your door
          </p>

          <div className="mx-auto mt-10 flex max-w-4xl flex-col gap-4 sm:flex-row">
            <div className="flex flex-1 items-center rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3">
              <svg
                aria-hidden="true"
                className="mr-3 h-5 w-5 text-zinc-500"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M20 20L17 17" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
              </svg>
              <input
                className="w-full bg-transparent text-zinc-100 outline-none placeholder:text-zinc-500"
                placeholder="Search products, stores..."
                type="text"
              />
            </div>

            <button
              className="rounded-lg bg-zinc-800 px-6 py-3 text-sm font-medium text-zinc-100 transition hover:bg-zinc-700"
              type="button"
            >
              Location
            </button>
          </div>
        </section>

        <section className="mt-20">
          <h2 className="text-2xl font-semibold">Available Products</h2>
          {loading ? (
            <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-300">
              Loading products...
            </div>
          ) : error ? (
            <div className="mt-6 rounded-xl border border-red-900/40 bg-red-950/20 p-6 text-red-300">
              {error}
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-400">
              No products available at the moment.
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {displayProducts.map((product, index) => {
                const pending = pendingProductIds.has(product.id);
                const outOfStock = product.stock <= 0;
                const feedback = feedbackByProductId[product.id];

                return (
                  <article
                    className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/95"
                    key={product.id}
                  >
                    <Link className="block" href={`/products/${product.id}`}>
                      <div className="relative aspect-[4/3] w-full">
                        <Image
                          alt={product.name}
                          className="h-full w-full object-cover"
                          fill
                          sizes="(max-width: 768px) 100vw, 25vw"
                          src={productImages[index % productImages.length]}
                        />
                      </div>
                    </Link>
                    <div className="p-5">
                      <Link
                        className="line-clamp-1 text-[1.75rem]/7 font-semibold tracking-tight text-zinc-100 transition hover:text-white"
                        href={`/products/${product.id}`}
                      >
                        {product.name}
                      </Link>
                      <p className="mt-1 text-xl font-medium text-zinc-400">{product.store.name}</p>

                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-[2rem] font-bold text-white">
                          ${product.price.toFixed(2)}
                        </p>
                        <span
                          className={`rounded-full px-3 py-1 text-sm ${
                            outOfStock
                              ? "bg-red-950/70 text-red-300"
                              : "bg-emerald-950/70 text-emerald-300"
                          }`}
                        >
                          {outOfStock ? "Out of stock" : `${product.stock} in stock`}
                        </span>
                      </div>

                      <button
                        className="mt-4 w-full rounded-xl bg-[#4F7CFF] px-3 py-3 text-xl font-semibold text-white transition hover:bg-[#3f6ef2] disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
                        disabled={outOfStock || pending}
                        onClick={() => void handleAddToCart(product.id)}
                        type="button"
                      >
                        {pending ? "Adding..." : "Add to cart"}
                      </button>

                      {feedback ? (
                        <p
                          className={`mt-2 text-sm ${
                            feedback === "Added to cart." ? "text-[#30D158]" : "text-red-400"
                          }`}
                        >
                          {feedback}
                        </p>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
